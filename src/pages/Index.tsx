
import React from 'react';
import { Header } from '@/components/Header';
import { ConfigurationPanel } from '@/components/ConfigurationPanel';
import { ResultsPanel } from '@/components/ResultsPanel';
import { AnalysisPanel } from '@/components/AnalysisPanel';
import { PlaygroundProvider } from '@/contexts/PlaygroundContext';

const Index = () => {
  return (
    <PlaygroundProvider>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="flex flex-col lg:flex-row h-[calc(100vh-4rem)]">
          {/* Configuration Panel - Left */}
          <div className="w-full lg:w-[30%] border-r border-gray-200 bg-white">
            <ConfigurationPanel />
          </div>
          
          {/* Results Panel - Center */}
          <div className="w-full lg:w-[45%] border-r border-gray-200 bg-white">
            <ResultsPanel />
          </div>
          
          {/* Analysis Panel - Right */}
          <div className="w-full lg:w-[25%] bg-white">
            <AnalysisPanel />
          </div>
        </div>
      </div>
    </PlaygroundProvider>
  );
};

export default Index;
