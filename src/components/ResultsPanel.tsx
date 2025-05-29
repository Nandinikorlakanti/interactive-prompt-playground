
import React, { useState } from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { ResultsGrid } from '@/components/ResultsGrid';
import { Download, Filter, Grid, List } from 'lucide-react';

export const ResultsPanel: React.FC = () => {
  const { state } = usePlayground();
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  const exportResults = () => {
    const dataStr = JSON.stringify(state.results, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt-playground-results.json';
    link.click();
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Results</h2>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('grid')}
            >
              <Grid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-1" />
              Filter
            </Button>
            <Button variant="outline" size="sm" onClick={exportResults}>
              <Download className="w-4 h-4 mr-1" />
              Export
            </Button>
          </div>
        </div>

        {/* Stats */}
        {state.results.length > 0 && (
          <div className="flex space-x-6 text-sm text-gray-600">
            <span>Total Combinations: {state.results.length}</span>
            <span>Completed: {state.results.filter(r => r.output).length}</span>
            <span>Loading: {state.results.filter(r => r.isLoading).length}</span>
            <span>Errors: {state.results.filter(r => r.error).length}</span>
          </div>
        )}
      </div>

      {/* Results Content */}
      <div className="flex-1 overflow-auto">
        {state.results.length === 0 ? (
          <div className="flex items-center justify-center h-full text-gray-500">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Grid className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium mb-2">No Results Yet</h3>
              <p className="text-sm">Run parameter combinations to see results here</p>
            </div>
          </div>
        ) : (
          <ResultsGrid results={state.results} viewMode={viewMode} />
        )}
      </div>
    </div>
  );
};
