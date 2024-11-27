import React, { useEffect, useRef } from 'react';
import { Terminal as TerminalIcon, Maximize2, Minimize2, X } from 'lucide-react';
import { useTerminal } from './hooks/useTerminal';
import 'xterm/css/xterm.css';

interface TerminalProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClear: () => void;
}

export default function Terminal({ isExpanded, onToggleExpand, onClear }: TerminalProps) {
  const terminalContainerRef = useRef<HTMLDivElement>(null);
  const { initializeTerminal, clearTerminal } = useTerminal();

  useEffect(() => {
    let cleanup: (() => void) | undefined;

    if (terminalContainerRef.current) {
      cleanup = initializeTerminal(terminalContainerRef.current);
    }

    return () => {
      if (cleanup) {
        cleanup();
      }
    };
  }, [initializeTerminal]);

  useEffect(() => {
    const handleResize = () => {
      if (terminalContainerRef.current) {
        const event = new Event('resize');
        terminalContainerRef.current.dispatchEvent(event);
      }
    };

    // Handle terminal resize when expanded/collapsed
    const timeoutId = setTimeout(handleResize, 250);

    return () => clearTimeout(timeoutId);
  }, [isExpanded]);

  return (
    <div 
      className={`bg-[#1a1b26] transition-all duration-200 ease-in-out ${
        isExpanded ? 'flex-1' : 'h-48'
      } flex flex-col`}
    >
      <div className="flex items-center justify-between bg-gray-800 px-4 py-2 border-t border-gray-700">
        <div className="flex items-center space-x-2">
          <TerminalIcon size={16} className="text-gray-400" />
          <span className="text-sm font-medium text-gray-300">Terminal</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleExpand}
            className="text-gray-400 hover:text-white transition-colors"
          >
            {isExpanded ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>
          <button
            onClick={() => {
              clearTerminal();
              onClear();
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div ref={terminalContainerRef} className="flex-1 overflow-hidden" />
    </div>
  );
}
