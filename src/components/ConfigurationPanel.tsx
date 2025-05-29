
import React from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { ParameterSlider } from '@/components/ParameterSlider';
import { Play, RotateCcw, Save, Download } from 'lucide-react';

export const ConfigurationPanel: React.FC = () => {
  const {
    state,
    updateModel,
    updateSystemPrompt,
    updateUserPrompt,
    updateProductInput,
    updateStopSequence,
    runAllCombinations,
    clearResults,
    loadPreset,
  } = usePlayground();

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Configuration</h2>
        
        {/* Model Selection */}
        <div className="space-y-2 mb-6">
          <Label htmlFor="model">Model</Label>
          <Select value={state.model} onValueChange={(value: 'gpt-3.5-turbo' | 'gpt-4') => updateModel(value)}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="gpt-3.5-turbo">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>GPT-3.5-Turbo</span>
                </div>
              </SelectItem>
              <SelectItem value="gpt-4">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span>GPT-4</span>
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Inputs */}
        <div className="space-y-4 mb-6">
          <div>
            <Label htmlFor="system-prompt">System Prompt</Label>
            <Textarea
              id="system-prompt"
              value={state.systemPrompt}
              onChange={(e) => updateSystemPrompt(e.target.value)}
              placeholder="Enter your system prompt here (e.g., 'You are a product marketing expert...')"
              className="mt-1 min-h-[100px] font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="user-prompt">User Prompt Template</Label>
            <Textarea
              id="user-prompt"
              value={state.userPrompt}
              onChange={(e) => updateUserPrompt(e.target.value)}
              placeholder="Enter user prompt template (e.g., 'Create a product description for {product}')"
              className="mt-1 min-h-[80px] font-mono text-sm"
            />
          </div>

          <div>
            <Label htmlFor="product-input">Product Name</Label>
            <Input
              id="product-input"
              value={state.productInput}
              onChange={(e) => updateProductInput(e.target.value)}
              placeholder="e.g., iPhone, Tesla, Running Shoes"
              className="mt-1"
            />
          </div>
        </div>

        {/* Parameter Controls */}
        <div className="space-y-6 mb-6">
          <h3 className="text-md font-medium text-gray-900">Parameters</h3>
          
          <ParameterSlider
            label="Temperature"
            value={0.7}
            min={0.0}
            max={2.0}
            step={0.1}
            presets={[0.0, 0.7, 1.2]}
            description="Controls randomness in output"
          />

          <ParameterSlider
            label="Max Tokens"
            value={150}
            min={10}
            max={500}
            step={10}
            presets={[50, 150, 300]}
            description="Maximum length of response"
          />

          <ParameterSlider
            label="Presence Penalty"
            value={0.0}
            min={-2.0}
            max={2.0}
            step={0.1}
            presets={[0.0, 1.5]}
            description="Encourages new topics"
          />

          <ParameterSlider
            label="Frequency Penalty"
            value={0.0}
            min={-2.0}
            max={2.0}
            step={0.1}
            presets={[0.0, 1.5]}
            description="Reduces repetition"
          />

          <div>
            <Label htmlFor="stop-sequence">Stop Sequences</Label>
            <Input
              id="stop-sequence"
              value={state.stopSequence}
              onChange={(e) => updateStopSequence(e.target.value)}
              placeholder="Comma-separated stop sequences"
              className="mt-1"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={runAllCombinations} 
            disabled={state.isRunning}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
          >
            <Play className="w-4 h-4 mr-2" />
            {state.isRunning ? 'Running...' : 'Run All Combinations'}
          </Button>

          <div className="flex space-x-2">
            <Button variant="outline" onClick={clearResults} className="flex-1">
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear
            </Button>
            <Button variant="outline" className="flex-1">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>

          <div>
            <Label htmlFor="preset">Load Preset</Label>
            <Select onValueChange={(value) => loadPreset(value)}>
              <SelectTrigger className="mt-1">
                <SelectValue placeholder="Choose a preset..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Creative Writing">Creative Writing</SelectItem>
                <SelectItem value="Technical Documentation">Technical Documentation</SelectItem>
                <SelectItem value="Sales Copy">Sales Copy</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </div>
  );
};
