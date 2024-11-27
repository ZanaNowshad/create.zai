import React, { useState } from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import Footer from './components/Footer';
import AIAssistant from './components/AIAssistant';
import FileExplorer from './components/FileExplorer';

export default function App() {
  const [activePanel, setActivePanel] = useState<'files' | 'ai' | null>('files');
  const [isTerminalExpanded, setIsTerminalExpanded] = useState(false);

  const handleClearTerminal = () => {
    // Terminal clear logic will be handled internally by xterm
  };

  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex">
            <Sidebar activePanel={activePanel} onPanelChange={setActivePanel} />
            {activePanel && (
              <div className="w-64 flex-shrink-0">
                {activePanel === 'files' && <FileExplorer />}
                {activePanel === 'ai' && <AIAssistant />}
              </div>
            )}
          </div>
          <div className="flex-1 flex flex-col overflow-hidden">
            <Editor />
            <Terminal
              isExpanded={isTerminalExpanded}
              onToggleExpand={() => setIsTerminalExpanded(!isTerminalExpanded)}
              onClear={handleClearTerminal}
            />
          </div>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}
