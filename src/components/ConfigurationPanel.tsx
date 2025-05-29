import React from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterSlider } from '@/components/ParameterSlider';
import { Play, RotateCcw, Save } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Slider } from '@/components/ui/slider';

export const ConfigurationPanel: React.FC = () => {
  const {
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
  } = usePlayground();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-gray-50">
      <div className="container max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Configuration</h2>
        
        {/* Model Selection */}
        <div className="space-y-2 mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <Label htmlFor="model" className="text-lg font-semibold">Model</Label>
          <Select value={state.model} onValueChange={(value: 'gemini-1.5-flash-latest' | 'gemini-1.5-pro-latest') => updateModel(value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select a model" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gemini-1.5-flash-latest">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>Gemini 1.5 Flash Latest</span>
                </div>
              </SelectItem>
              <SelectItem value="gemini-1.5-pro-latest">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>Gemini 1.5 Pro Latest</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Inputs */}
        <div className="space-y-4 mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Prompts</h3>
          <div>
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={state.systemPrompt}
              onChange={(e) => updateSystemPrompt(e.target.value)}
              placeholder="Enter your system prompt here (e.g., 'You are a product marketing expert...')"
              className="mt-1 min-h-[100px] font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="user-prompt">User Prompt Template</Label>
            <Textarea
              id="user-prompt"
              value={state.userPrompt}
              onChange={(e) => updateUserPrompt(e.target.value)}
              placeholder="Enter user prompt template (e.g., 'Create a product description for {product}')"
              className="mt-1 min-h-[80px] font-mono text-sm border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <Label htmlFor="product-input">Product Name</Label>
            <Input
              id="product-input"
              value={state.productInput}
              onChange={(e) => updateProductInput(e.target.value)}
              placeholder="e.g., iPhone, Tesla, Running Shoes"
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="space-y-6 mb-6 p-4 border rounded-lg bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900">Parameters</h3>
          
          <ParameterSlider
            label="Temperature"
            value={state.temperature}
            onChange={updateTemperature}
            min={0.0}
            max={2.0}
            step={0.1}
            presets={[0.0, 0.7, 1.2]}
            description="Controls randomness in output"
          />

          <ParameterSlider
            label="Max Tokens"
            value={state.maxTokens}
            onChange={updateMaxTokens}
            min={10}
            max={500}
            step={10}
            presets={[50, 150, 300]}
            description="Maximum length of response"
          />

          <ParameterSlider
            label="Presence Penalty"
            value={state.presencePenalty}
            onChange={updatePresencePenalty}
            min={0.0}
            max={1.5}
            step={0.1}
            presets={[0.0, 0.5, 1.0, 1.5]}
            description="Encourages new topics (0-1.5)"
          />

          <ParameterSlider
            label="Frequency Penalty"
            value={state.frequencyPenalty}
            onChange={updateFrequencyPenalty}
            min={0.0}
            max={1.5}
            step={0.1}
            presets={[0.0, 0.5, 1.0, 1.5]}
            description="Reduces repetition (0-1.5)"
          />

          <div>
            <Label htmlFor="stop-sequence">Stop Sequences</Label>
            <Input
              id="stop-sequence"
              value={state.stopSequence}
              onChange={(e) => updateStopSequence(e.target.value)}
              placeholder="Comma-separated stop sequences"
              className="mt-1 border-gray-300 focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="batched-mode"
              checked={state.isBatched}
              onCheckedChange={updateIsBatched}
            />
            <Label htmlFor="batched-mode">Batched Mode</Label>
          </div>

          {state.isBatched && (
            <div className="space-y-2">
              <Label htmlFor="variationCount">Number of Variations</Label>
              <Input
                id="variationCount"
                type="number"
                min={1}
                max={20}
                value={state.variationCount || ''}
                onChange={(e) => {
                  const value = parseInt(e.target.value);
                  if (!isNaN(value) && value > 0 && value <= 20) {
                    updateVariationCount(value);
                  }
                }}
                placeholder="Enter number of variations (1-20)..."
              />
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={generateResponse} 
            disabled={state.isRunning || (state.isBatched && !state.variationCount)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-lg py-2"
          >
            <Play className="w-5 h-5 mr-2" />
            {state.isRunning ? 'Generating...' : 'Generate Response'}
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearResults} className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear Results
            </Button>
            <Button variant="outline" className="flex-1 border-gray-300 text-gray-700 hover:bg-gray-100">
              <Save className="w-4 h-4 mr-2" />
              Save Configuration
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
