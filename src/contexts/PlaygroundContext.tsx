
import React, { createContext, useContext, useState, ReactNode } from 'react';

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
}

export interface PlaygroundState {
  model: 'gpt-3.5-turbo' | 'gpt-4';
  systemPrompt: string;
  userPrompt: string;
  productInput: string;
  stopSequence: string;
  results: ParameterSet[];
  reflection: string;
  isRunning: boolean;
}

interface PlaygroundContextType {
  state: PlaygroundState;
  updateModel: (model: 'gpt-3.5-turbo' | 'gpt-4') => void;
  updateSystemPrompt: (prompt: string) => void;
  updateUserPrompt: (prompt: string) => void;
  updateProductInput: (input: string) => void;
  updateStopSequence: (sequence: string) => void;
  updateReflection: (reflection: string) => void;
  runAllCombinations: () => void;
  clearResults: () => void;
  loadPreset: (presetName: string) => void;
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
    model: 'gpt-4',
    systemPrompt: 'You are a product marketing expert with deep knowledge of consumer behavior and persuasive copywriting.',
    userPrompt: 'Create a compelling product description for {product}. Focus on benefits, unique features, and emotional appeal.',
    productInput: 'iPhone 15 Pro',
    stopSequence: '',
    results: [],
    reflection: '',
    isRunning: false,
  });

  const updateModel = (model: 'gpt-3.5-turbo' | 'gpt-4') => {
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

  const updateReflection = (reflection: string) => {
    setState(prev => ({ ...prev, reflection }));
  };

  const generateParameterCombinations = (): ParameterSet[] => {
    const temperatures = [0.0, 0.7, 1.2];
    const maxTokens = [50, 150, 300];
    const presencePenalties = [0.0, 1.5];
    const frequencyPenalties = [0.0, 1.5];

    const combinations: ParameterSet[] = [];
    let id = 1;

    temperatures.forEach(temp => {
      maxTokens.forEach(tokens => {
        presencePenalties.forEach(presence => {
          frequencyPenalties.forEach(frequency => {
            combinations.push({
              id: `combo-${id++}`,
              temperature: temp,
              maxTokens: tokens,
              presencePenalty: presence,
              frequencyPenalty: frequency,
              isLoading: true,
            });
          });
        });
      });
    });

    return combinations;
  };

  const mockApiCall = async (params: ParameterSet): Promise<string> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));
    
    const prompt = state.userPrompt.replace('{product}', state.productInput);
    
    // Mock different outputs based on temperature and other parameters
    const baseOutputs = [
      `Discover the revolutionary ${state.productInput} - where cutting-edge technology meets elegant design. Experience unparalleled performance with features that adapt to your lifestyle.`,
      `Transform your daily routine with ${state.productInput}. Engineered for excellence, designed for you. Every detail crafted to exceed expectations.`,
      `Introducing ${state.productInput} - the perfect fusion of innovation and reliability. Elevate your experience with premium quality that speaks for itself.`,
      `Experience the future with ${state.productInput}. Advanced features, intuitive design, and exceptional performance come together in perfect harmony.`,
    ];

    let output = baseOutputs[Math.floor(Math.random() * baseOutputs.length)];
    
    // Vary output based on temperature
    if (params.temperature > 1.0) {
      output += " Unleash your creativity and explore new possibilities with this game-changing innovation!";
    } else if (params.temperature < 0.5) {
      output = output.replace(/revolutionary|transform|perfect fusion/, "reliable");
    }

    // Vary length based on max tokens
    if (params.maxTokens <= 50) {
      output = output.substring(0, Math.min(output.length, 150));
    } else if (params.maxTokens >= 300) {
      output += " Built with premium materials and backed by industry-leading warranty, this product represents the pinnacle of modern engineering.";
    }

    return output;
  };

  const runAllCombinations = async () => {
    setState(prev => ({ ...prev, isRunning: true }));
    const combinations = generateParameterCombinations();
    setState(prev => ({ ...prev, results: combinations }));

    // Process each combination
    for (let i = 0; i < combinations.length; i++) {
      const startTime = Date.now();
      
      try {
        const output = await mockApiCall(combinations[i]);
        const responseTime = Date.now() - startTime;
        const wordCount = output.split(' ').length;

        setState(prev => ({
          ...prev,
          results: prev.results.map(result => 
            result.id === combinations[i].id 
              ? { 
                  ...result, 
                  output, 
                  isLoading: false, 
                  responseTime,
                  wordCount,
                  error: undefined 
                }
              : result
          )
        }));
      } catch (error) {
        setState(prev => ({
          ...prev,
          results: prev.results.map(result => 
            result.id === combinations[i].id 
              ? { 
                  ...result, 
                  isLoading: false, 
                  error: 'Failed to generate output' 
                }
              : result
          )
        }));
      }
    }

    setState(prev => ({ ...prev, isRunning: false }));
  };

  const clearResults = () => {
    setState(prev => ({ ...prev, results: [], reflection: '' }));
  };

  const loadPreset = (presetName: string) => {
    const presets: Record<string, Partial<PlaygroundState>> = {
      'Creative Writing': {
        systemPrompt: 'You are a creative writing assistant specializing in engaging, imaginative content.',
        userPrompt: 'Write a creative description for {product} that tells a story.',
        productInput: 'Vintage Camera',
      },
      'Technical Documentation': {
        systemPrompt: 'You are a technical writer focused on clear, accurate, and detailed documentation.',
        userPrompt: 'Create technical specifications and features for {product}.',
        productInput: 'Laptop Computer',
      },
      'Sales Copy': {
        systemPrompt: 'You are a sales copywriter expert at creating compelling, conversion-focused content.',
        userPrompt: 'Write persuasive sales copy for {product} that drives action.',
        productInput: 'Fitness Tracker',
      },
    };

    const preset = presets[presetName];
    if (preset) {
      setState(prev => ({ ...prev, ...preset }));
    }
  };

  return (
    <PlaygroundContext.Provider value={{
      state,
      updateModel,
      updateSystemPrompt,
      updateUserPrompt,
      updateProductInput,
      updateStopSequence,
      updateReflection,
      runAllCombinations,
      clearResults,
      loadPreset,
    }}>
      {children}
    </PlaygroundContext.Provider>
  );
};
