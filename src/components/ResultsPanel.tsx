import React, { useState } from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Download, Filter, Grid, List, GitCompare } from 'lucide-react';

export const ResultsPanel: React.FC = () => {
  const { state, compareResponses } = usePlayground();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('list'); // Default to list view

  const exportResults = () => {
    const dataStr = JSON.stringify(state.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt-playground-results.json';
    link.click();
  };

  // Find the current batch session if in batched mode
  const currentBatchSession = state.isBatched && state.currentBatchId
    ? state.batchSessions.find(session => session.id === state.currentBatchId)
    : undefined;

  return (
    <div className="h-full flex flex-col bg-gray-50">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Results</h2>
          <div className="flex items-center space-x-2">
            {/* Batch specific buttons */}
            {state.isBatched && currentBatchSession && currentBatchSession.results.length > 0 && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => compareResponses(currentBatchSession.results)}
                disabled={state.isComparing}
                title="Compare Batch Results"
              >
                <GitCompare className="w-4 h-4 mr-1" />
                {state.isComparing ? 'Comparing...' : 'Compare'}
              </Button>
            )}
            {/* Single mode specific button */}
            {!state.isBatched && state.results.length > 0 && (
               <Button
                  variant="outline"
                  size="sm"
                  onClick={() => compareResponses(state.results)}
                  disabled={state.results.length === 0 || state.isComparing}
                  title="Compare Responses"
               >
                  <GitCompare className="w-4 h-4 mr-1" />
                  {state.isComparing ? 'Comparing...' : 'Compare'}
               </Button>
            )}
            <Button variant="outline" size="sm" onClick={exportResults} title="Export Results">
              <Download className="w-4 h-4" />
              <span className="ml-1 hidden sm:inline">Export</span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        {state.results.length > 0 && (
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <span className="font-medium">Total: <span className="font-normal">{state.results.length}</span></span>
            <span className="font-medium">Completed: <span className="font-normal">{state.results.filter(r => r.output).length}</span></span>
            <span className="font-medium">Loading: <span className="font-normal">{state.results.filter(r => r.isLoading).length}</span></span>
            <span className="font-medium">Errors: <span className="font-normal">{state.results.filter(r => r.error).length}</span></span>
          </div>
        )}
         {/* Comparison Result Display - Conditional based on mode */}
         {state.isBatched && currentBatchSession?.comparisonResult && (
            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 whitespace-pre-wrap">
               <h4 className="font-semibold mb-2">Batch Comparison Summary:</h4>
               {currentBatchSession.comparisonResult}
            </div>
         )}
          {!state.isBatched && state.singleComparisonResult && (
             <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-800 whitespace-pre-wrap">
                <h4 className="font-semibold mb-2">Comparison Summary:</h4>
                {state.singleComparisonResult}
             </div>
          )}
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-y-auto py-6 px-6">
        {state.results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {/* Using List icon since we default to list view */}
                <List className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-sm">Click 'Generate Response' to see results here</p>
            </div>
          </div>
        ) : (
          <ResultsGrid results={state.results} viewMode="list" />
        )}
      </div>
    </div>
  );
};
