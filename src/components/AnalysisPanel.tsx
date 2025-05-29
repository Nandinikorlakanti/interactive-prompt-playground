
import React from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Save, Download, ChevronDown, BarChart3, TrendingUp, Clock } from 'lucide-react';

export const AnalysisPanel: React.FC = () => {
  const { state, updateReflection } = usePlayground();

  const completedResults = state.results.filter(r => r.output && !r.error);
  const avgWordCount = completedResults.length > 0 
    ? Math.round(completedResults.reduce((sum, r) => sum + (r.wordCount || 0), 0) / completedResults.length)
    : 0;
  const avgResponseTime = completedResults.length > 0
    ? Math.round(completedResults.reduce((sum, r) => sum + (r.responseTime || 0), 0) / completedResults.length)
    : 0;

  const guidedQuestions = [
    "What patterns do you notice in output length across different temperature settings?",
    "How does temperature affect the creativity and tone of the responses?",
    "Which parameter combination produced the most engaging result?",
    "Are there any unexpected variations in response quality?",
    "How do the presence and frequency penalties affect repetition?",
    "What insights can you draw about optimal parameter settings for this type of prompt?"
  ];

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Analysis</h2>

        {/* Real-time Insights */}
        {completedResults.length > 0 && (
          <Card className="mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium flex items-center">
                <BarChart3 className="w-4 h-4 mr-2" />
                Real-time Insights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{completedResults.length}</div>
                  <div className="text-xs text-gray-500">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{avgWordCount}</div>
                  <div className="text-xs text-gray-500">Avg Words</div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Response Time</span>
                  <Badge variant="outline" className="text-xs">
                    <Clock className="w-3 h-3 mr-1" />
                    {avgResponseTime}ms avg
                  </Badge>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Variations</span>
                  <Badge variant="outline" className="text-xs">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    {Math.max(...completedResults.map(r => r.wordCount || 0)) - Math.min(...completedResults.map(r => r.wordCount || 0))} word range
                  </Badge>
                </div>
              </div>

              {/* Quick Pattern Detection */}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded">
                <strong>Pattern Detected:</strong> Higher temperature values (1.2) tend to produce {
                  completedResults.filter(r => r.temperature > 1.0).length > 0 ? 'more creative' : 'varied'
                } outputs compared to lower values (0.0).
              </div>
            </CardContent>
          </Card>
        )}

        {/* Reflection Editor */}
        <div className="space-y-3 mb-6">
          <div className="flex items-center justify-between">
            <Label htmlFor="reflection">Your Analysis</Label>
            <span className="text-xs text-gray-500">
              {state.reflection.length} characters
            </span>
          </div>
          
          <Textarea
            id="reflection"
            value={state.reflection}
            onChange={(e) => updateReflection(e.target.value)}
            placeholder="Write your analysis of the parameter combinations and their outputs. What patterns do you observe? Which combinations work best for your use case?"
            className="min-h-[200px] text-sm"
          />

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" className="flex-1">
              <Save className="w-3 h-3 mr-1" />
              Save
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              <Download className="w-3 h-3 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Guided Questions */}
        <Collapsible>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between text-sm">
              Guided Reflection Questions
              <ChevronDown className="w-4 h-4" />
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-3">
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  {guidedQuestions.map((question, index) => (
                    <div key={index} className="text-sm text-gray-700 p-3 bg-gray-50 rounded border-l-4 border-blue-200">
                      <strong className="text-blue-700">Q{index + 1}:</strong> {question}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </CollapsibleContent>
        </Collapsible>

        {/* Progress Indicator */}
        {state.isRunning && (
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>Running Combinations</span>
                  <span>{completedResults.length}/{state.results.length}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ 
                      width: `${(completedResults.length / Math.max(state.results.length, 1)) * 100}%` 
                    }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 text-center">
                  Estimated time remaining: {Math.max(0, (state.results.length - completedResults.length) * 2)} seconds
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
