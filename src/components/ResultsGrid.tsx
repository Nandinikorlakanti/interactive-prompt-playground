
import React, { useState } from 'react';
import { ParameterSet } from '@/contexts/PlaygroundContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Copy, ChevronDown, ChevronRight, Clock, FileText, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface ResultsGridProps {
  results: ParameterSet[];
  viewMode: 'grid' | 'list';
}

export const ResultsGrid: React.FC<ResultsGridProps> = ({ results, viewMode }) => {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());

  const toggleRow = (id: string) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(id)) {
      newExpanded.delete(id);
    } else {
      newExpanded.add(id);
    }
    setExpandedRows(newExpanded);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied to clipboard",
      description: "Output text has been copied to your clipboard.",
    });
  };

  const getPreview = (text: string, maxLength: number = 100) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (viewMode === 'grid') {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 p-6">
        {results.map((result) => (
          <div key={result.id} className="border border-gray-200 rounded-lg p-4 bg-white hover:shadow-md transition-shadow">
            <div className="space-y-3">
              {/* Parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Temp:</span>
                  <Badge variant="outline">{result.temperature}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Tokens:</span>
                  <Badge variant="outline">{result.maxTokens}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Presence:</span>
                  <Badge variant="outline">{result.presencePenalty}</Badge>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Frequency:</span>
                  <Badge variant="outline">{result.frequencyPenalty}</Badge>
                </div>
              </div>

              {/* Status */}
              <div className="flex items-center justify-between">
                {result.isLoading ? (
                  <div className="flex items-center text-blue-600">
                    <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                    <span className="text-sm">Generating...</span>
                  </div>
                ) : result.error ? (
                  <div className="flex items-center text-red-600">
                    <AlertCircle className="w-4 h-4 mr-2" />
                    <span className="text-sm">Error</span>
                  </div>
                ) : result.output ? (
                  <div className="flex items-center text-green-600">
                    <FileText className="w-4 h-4 mr-2" />
                    <span className="text-sm">{result.wordCount} words</span>
                  </div>
                ) : null}

                {result.responseTime && (
                  <div className="flex items-center text-gray-500">
                    <Clock className="w-3 h-3 mr-1" />
                    <span className="text-xs">{result.responseTime}ms</span>
                  </div>
                )}
              </div>

              {/* Output Preview */}
              {result.output && (
                <div className="space-y-2">
                  <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border">
                    {getPreview(result.output)}
                  </div>
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleRow(result.id)}
                      className="flex-1"
                    >
                      {expandedRows.has(result.id) ? (
                        <>
                          <ChevronDown className="w-3 h-3 mr-1" />
                          Collapse
                        </>
                      ) : (
                        <>
                          <ChevronRight className="w-3 h-3 mr-1" />
                          Expand
                        </>
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => copyToClipboard(result.output!)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Expanded Output */}
              {expandedRows.has(result.id) && result.output && (
                <div className="text-sm text-gray-700 bg-gray-50 p-3 rounded border max-h-40 overflow-y-auto">
                  {result.output}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="overflow-x-auto">
        <table className="w-full border-collapse border border-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Temp</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Tokens</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Presence</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Frequency</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Output Preview</th>
              <th className="border border-gray-200 px-4 py-2 text-left text-sm font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {results.map((result, index) => (
              <React.Fragment key={result.id}>
                <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-4 py-2">{result.temperature}</td>
                  <td className="border border-gray-200 px-4 py-2">{result.maxTokens}</td>
                  <td className="border border-gray-200 px-4 py-2">{result.presencePenalty}</td>
                  <td className="border border-gray-200 px-4 py-2">{result.frequencyPenalty}</td>
                  <td className="border border-gray-200 px-4 py-2 max-w-xs">
                    {result.isLoading ? (
                      <div className="flex items-center text-blue-600">
                        <div className="animate-spin w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full mr-2"></div>
                        <span className="text-sm">Loading...</span>
                      </div>
                    ) : result.error ? (
                      <span className="text-red-600 text-sm">{result.error}</span>
                    ) : result.output ? (
                      <span className="text-sm">{getPreview(result.output, 60)}</span>
                    ) : (
                      <span className="text-gray-400 text-sm">Pending</span>
                    )}
                  </td>
                  <td className="border border-gray-200 px-4 py-2">
                    <div className="flex space-x-2">
                      {result.output && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleRow(result.id)}
                          >
                            {expandedRows.has(result.id) ? (
                              <ChevronDown className="w-3 h-3" />
                            ) : (
                              <ChevronRight className="w-3 h-3" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => copyToClipboard(result.output!)}
                          >
                            <Copy className="w-3 h-3" />
                          </Button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
                {expandedRows.has(result.id) && result.output && (
                  <tr>
                    <td colSpan={6} className="border border-gray-200 px-4 py-4 bg-gray-50">
                      <div className="space-y-2">
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <span>Words: {result.wordCount}</span>
                          {result.responseTime && <span>Time: {result.responseTime}ms</span>}
                        </div>
                        <div className="text-sm text-gray-700 bg-white p-3 rounded border max-h-60 overflow-y-auto">
                          {result.output}
                        </div>
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
