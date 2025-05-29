import React from 'react';
import { usePlayground } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, Clock, FileText, AlertCircle, CircleSlash } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResultsGridProps {
  results: ParameterSet[];
  viewMode: 'grid' | 'list';
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results, viewMode }) => {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Output text has been copied to your clipboard.",
    });
  };

  // Always render in list view
  return (
    <div className="space-y-4">
      {results.map((result) => (
        <div key={result.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm flex flex-col">
          <div className="flex flex-col space-y-2 mb-4 md:flex-row md:justify-between md:items-center md:space-y-0">
            <div className="flex flex-wrap gap-2 text-xs font-mono">
              <Badge variant="secondary">Temp: {result.temperature.toFixed(1)}</Badge>
              <Badge variant="secondary">Tokens: {result.maxTokens}</Badge>
              <Badge variant="secondary">Presence: {result.presencePenalty.toFixed(1)}</Badge>
              <Badge variant="secondary">Frequency: {result.frequencyPenalty.toFixed(1)}</Badge>
            </div>
            <div className="flex items-center gap-4">
              {result.isLoading && (
                <div className="flex items-center text-blue-600 text-sm">
                  <Clock className="w-4 h-4 mr-1 animate-spin" />
                  Loading...
                </div>
              )}

              {result.error && (
                <div className="flex items-center text-red-600 text-sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Error
                </div>
              )}

              {result.output && (
                <div className="flex items-center text-green-600 text-sm">
                  <FileText className="w-4 h-4 mr-1" />
                  {result.wordCount} words
                  {result.responseTime && <span className="ml-4"><Clock className="w-4 h-4 mr-1 inline-block" />{result.responseTime}ms</span>}
                </div>
              )}
              {result.output && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => copyToClipboard(result.output!)}
                  title="Copy to Clipboard"
                  className="hidden md:inline-flex"
                >
                  <Copy className="w-3 h-3" />
                </Button>
              )}
            </div>
          </div>

          {result.output && (
            <div className="space-y-2">
              <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border overflow-auto w-full">
                {result.output}
              </div>
              {result.output && (
                <div className="flex justify-end md:hidden">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(result.output!)}
                    title="Copy to Clipboard"
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                </div>
              )}
            </div>
          )}

          {!result.output && !result.isLoading && !result.error && (
            <div className="flex items-center justify-center text-gray-500 text-sm mt-4">
              <CircleSlash className="w-5 h-5 mr-1" />
              No output generated.
            </div>
          )}
        </div>
      ))}
    </div>
  );
};
