import React, { createContext, useContext, useState, ReactNode } from 'react';
import { model, genAI } from '@/lib/gemini';

export interface ParameterSet {
  id: string;
  temperature: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  output?: string;
  isLoading?: boolean;
  error?: string;
  responseTime?: number;
  wordCount?: number;
  seed?: number;
  batchId?: string;
}

export interface BatchSession {
  id: string;
  timestamp: number;
  model: string;
  systemPrompt: string;
  userPrompt: string;
  productInput: string;
  results: ParameterSet[];
  isComparing: boolean;
  comparisonResult?: string;
}

export interface PlaygroundState {
  model: 'gemini-1.5-flash-latest' | 'gemini-1.5-pro-latest';
  systemPrompt: string;
  userPrompt: string;
  productInput: string;
  stopSequence: string;
  results: ParameterSet[];
  isRunning: boolean;
  temperature: number;
  maxTokens: number;
  presencePenalty: number;
  frequencyPenalty: number;
  isBatched: boolean;
  batchSessions: BatchSession[];
  currentBatchId?: string;
  isComparing: boolean;
  variationCount?: number;
}

interface PlaygroundContextType {
  state: PlaygroundState;
  updateModel: (model: 'gemini-1.5-flash-latest' | 'gemini-1.5-pro-latest') => void;
  updateSystemPrompt: (prompt: string) => void;
  updateUserPrompt: (prompt: string) => void;
  updateProductInput: (input: string) => void;
  updateStopSequence: (sequence: string) => void;
  updateTemperature: (temperature: number) => void;
  updateMaxTokens: (maxTokens: number) => void;
  updatePresencePenalty: (presencePenalty: number) => void;
  updateFrequencyPenalty: (frequencyPenalty: number) => void;
  updateIsBatched: (isBatched: boolean) => void;
  updateVariationCount: (count: number) => void;
  generateResponse: () => void;
  clearResults: () => void;
  compareBatchResults: (batchId: string) => void;
}

const PlaygroundContext = createContext<PlaygroundContextType | undefined>(undefined);

export const usePlayground = () => {
  const context = useContext(PlaygroundContext);
  if (!context) {
    throw new Error('usePlayground must be used within a PlaygroundProvider');
  }
  return context;
};

export const PlaygroundProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, setState] = useState<PlaygroundState>({
    model: 'gemini-1.5-flash-latest',
    systemPrompt: 'You are a product marketing expert with deep knowledge of consumer behavior and persuasive copywriting.',
    userPrompt: 'Create a compelling product description for {product}. Focus on benefits, unique features, and emotional appeal.',
    productInput: 'iPhone 15 Pro',
    stopSequence: '',
    results: [],
    isRunning: false,
    temperature: 0.7,
    maxTokens: 150,
    presencePenalty: 0.0,
    frequencyPenalty: 0.0,
    isBatched: false,
    batchSessions: [],
    isComparing: false,
    variationCount: 5,
  });

  const updateModel = (model: 'gemini-1.5-flash-latest' | 'gemini-1.5-pro-latest') => {
    setState(prev => ({ ...prev, model }));
  };

  const updateSystemPrompt = (systemPrompt: string) => {
    setState(prev => ({ ...prev, systemPrompt }));
  };

  const updateUserPrompt = (userPrompt: string) => {
    setState(prev => ({ ...prev, userPrompt }));
  };

  const updateProductInput = (productInput: string) => {
    setState(prev => ({ ...prev, productInput }));
  };

  const updateStopSequence = (stopSequence: string) => {
    setState(prev => ({ ...prev, stopSequence }));
  };

  const updateTemperature = (temperature: number) => {
    setState(prev => ({ ...prev, temperature }));
  };

  const updateMaxTokens = (maxTokens: number) => {
    setState(prev => ({ ...prev, maxTokens }));
  };

  const updatePresencePenalty = (presencePenalty: number) => {
    setState(prev => ({ ...prev, presencePenalty }));
  };

  const updateFrequencyPenalty = (frequencyPenalty: number) => {
    setState(prev => ({ ...prev, frequencyPenalty }));
  };

  const updateIsBatched = (isBatched: boolean) => {
    setState(prev => ({
      ...prev,
      isBatched,
      ...(isBatched ? {} : { results: [], batchSessions: [], currentBatchId: undefined }),
    }));
  };

  const updateVariationCount = (count: number) => {
    setState(prev => ({ ...prev, variationCount: count }));
  };

  const generateParameterVariations = (baseParams: {
    temperature: number;
    maxTokens: number;
    presencePenalty: number;
    frequencyPenalty: number;
  }): Array<{
    temperature: number;
    maxTokens: number;
    presencePenalty: number;
    frequencyPenalty: number;
  }> => {
    if (state.variationCount === undefined) {
      throw new Error('Variation count must be set before generating batch responses');
    }
    return Array(state.variationCount).fill(baseParams);
  };

  const generateResponse = async () => {
    if (state.isRunning) return;

    if (state.isBatched && (state.variationCount === undefined || state.variationCount <= 0)) {
      console.error('Variation count must be set to a positive number before generating batch responses');
      return;
    }

    setState(prev => ({ ...prev, isRunning: true }));

    const startTime = Date.now();
    const batchId = state.isBatched ? `batch-${Date.now()}` : undefined;

    if (state.isBatched) {
      setState(prev => ({
        ...prev,
        results: [],
        currentBatchId: batchId,
      }));

      const baseParams = {
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        presencePenalty: state.presencePenalty,
        frequencyPenalty: state.frequencyPenalty,
      };

      const parameterVariations = generateParameterVariations(baseParams);
      const batchResults: ParameterSet[] = [];

      const batchSession: BatchSession = {
        id: batchId!,
        timestamp: Date.now(),
        model: state.model,
        systemPrompt: state.systemPrompt,
        userPrompt: state.userPrompt,
        productInput: state.productInput,
        results: [],
        isComparing: false,
      };

      setState(prev => ({
        ...prev,
        batchSessions: [...prev.batchSessions, batchSession],
      }));

      for (const params of parameterVariations) {
        const resultId = `response-${Date.now()}-${Math.random()}`;
        const result: ParameterSet = {
          id: resultId,
          ...params,
          isLoading: true,
          batchId,
        };

        setState(prev => ({
          ...prev,
          results: [...prev.results, result],
        }));

        try {
          const systemPrompt = state.systemPrompt.trim();
          const userPrompt = state.userPrompt.replace('{product}', state.productInput).trim();
          const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

          const genAIModel = genAI.getGenerativeModel({ model: state.model });

          const output = await genAIModel.generateContent({
            contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
            generationConfig: {
              temperature: params.temperature,
              maxOutputTokens: params.maxTokens,
              presencePenalty: params.presencePenalty,
              frequencyPenalty: params.frequencyPenalty,
              stopSequences: state.stopSequence ? state.stopSequence.split(',').map(s => s.trim()) : undefined
            }
          });

          const response = await output.response;
          const responseTime = Date.now() - startTime;
          const wordCount = response.text().split(' ').length;

          const completedResult = {
            ...result,
            output: response.text(),
            isLoading: false,
            responseTime,
            wordCount,
            error: undefined
          };

          setState(prev => ({
            ...prev,
            results: prev.results.map(r =>
              r.id === resultId ? completedResult : r
            ),
            batchSessions: prev.batchSessions.map(session =>
              session.id === batchId ? {
                ...session,
                results: [...session.results, completedResult]
              } : session
            )
          }));

        } catch (error) {
          console.error('Error generating response for variation:', error);
          const errorResult = {
            ...result,
            isLoading: false,
            error: error instanceof Error ? error.message : 'Failed to generate output'
          };
          setState(prev => ({
            ...prev,
            results: prev.results.map(r =>
              r.id === resultId ? errorResult : r
            ),
            batchSessions: prev.batchSessions.map(session =>
              session.id === batchId ? {
                ...session,
                results: [...session.results, errorResult]
              } : session
            )
          }));
        }
      }
    } else {
      const result: ParameterSet = {
        id: `response-${Date.now()}`,
        temperature: state.temperature,
        maxTokens: state.maxTokens,
        presencePenalty: state.presencePenalty,
        frequencyPenalty: state.frequencyPenalty,
        isLoading: true,
      };

      setState(prev => ({ ...prev, results: [result] }));

      try {
        const systemPrompt = state.systemPrompt.trim();
        const userPrompt = state.userPrompt.replace('{product}', state.productInput).trim();
        const fullPrompt = `${systemPrompt}\n\n${userPrompt}`;

        const genAIModel = genAI.getGenerativeModel({ model: state.model });

        const output = await genAIModel.generateContent({
          contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
          generationConfig: {
            temperature: state.temperature,
            maxOutputTokens: state.maxTokens,
            presencePenalty: state.presencePenalty,
            frequencyPenalty: state.frequencyPenalty,
            stopSequences: state.stopSequence ? state.stopSequence.split(',').map(s => s.trim()) : undefined
          }
        });

        const response = await output.response;
        const responseTime = Date.now() - startTime;
        const wordCount = response.text().split(' ').length;

        setState(prev => ({
          ...prev,
          results: prev.results.map(r =>
            r.id === result.id ? {
              ...r,
              output: response.text(),
              isLoading: false,
              responseTime,
              wordCount,
              error: undefined
            } : r
          )
        }));

      } catch (error) {
        console.error('Error generating response:', error);
        setState(prev => ({
          ...prev,
          results: prev.results.map(r =>
            r.id === result.id ? {
              ...r,
              isLoading: false,
              error: error instanceof Error ? error.message : 'Failed to generate output'
            } : r
          )
        }));
      }
    }

    setState(prev => ({ ...prev, isRunning: false }));
  };

  const compareBatchResults = async (batchId: string) => {
    const batchSession = state.batchSessions.find(session => session.id === batchId);
    
    if (!batchSession || batchSession.results.length === 0) {
      console.log('No batch results available for comparison.');
      return;
    }
    
    if (batchSession.isComparing) {
       console.log('Comparison already in progress for this batch.');
       return;
    }

    setState(prev => ({
      ...prev,
      batchSessions: prev.batchSessions.map(session =>
        session.id === batchId ? { ...session, isComparing: true, comparisonResult: undefined } : session
      ),
    }));

    try {
      const systemPrompt = "You are an expert at analyzing and comparing multiple text outputs. Your task is to create a comprehensive comparison and synthesis of the following outputs.";
      const userPrompt = `Compare and synthesize these outputs, highlighting their unique strengths and creating a comprehensive final version that combines the best elements:\n\n${batchSession.results.map((result, index) => `Output ${index + 1}:\n${result.output}\n`).join('\n')}`;

      const genAIModel = genAI.getGenerativeModel({ model: state.model });

      const output = await genAIModel.generateContent({
        contents: [{ role: 'user', parts: [{ text: `${systemPrompt}\n\n${userPrompt}` }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2000,
          presencePenalty: 0.5,
          frequencyPenalty: 0.5,
        }
      });

      const response = await output.response;
      const comparisonResultText = response.text();

      setState(prev => ({
        ...prev,
        batchSessions: prev.batchSessions.map(session =>
          session.id === batchId ? {
            ...session,
            isComparing: false,
            comparisonResult: comparisonResultText
          } : session
        ),
      }));

    } catch (error) {
      console.error('Error comparing batch results:', error);
      setState(prev => ({
        ...prev,
        batchSessions: prev.batchSessions.map(session =>
          session.id === batchId ? { ...session, isComparing: false, comparisonResult: `Error during comparison: ${error instanceof Error ? error.message : String(error)}` } : session
        ),
      }));
    }
  };

  const clearResults = () => {
    setState(prev => ({ ...prev, results: [], batchSessions: [], currentBatchId: undefined }));
  };

  return (
    <PlaygroundContext.Provider value={{
      state,
      updateModel,
      updateSystemPrompt,
      updateUserPrompt,
      updateProductInput,
      updateStopSequence,
      updateTemperature,
      updateMaxTokens,
      updatePresencePenalty,
      updateFrequencyPenalty,
      updateIsBatched,
      updateVariationCount,
      generateResponse,
      clearResults,
      compareBatchResults,
    }}>
      {children}
    </PlaygroundContext.Provider>
  );
};
