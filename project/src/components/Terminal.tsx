import React, { useEffect, useRef, useState } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { Terminal as TerminalIcon, Maximize2, Minimize2, X } from 'lucide-react';
import 'xterm/css/xterm.css';

interface TerminalProps {
  isExpanded: boolean;
  onToggleExpand: () => void;
  onClear: () => void;
}

export default function Terminal({ isExpanded, onToggleExpand, onClear }: TerminalProps) {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const [isTerminalReady, setIsTerminalReady] = useState(false);

  useEffect(() => {
    const initTerminal = async () => {
      if (!terminalRef.current || xtermRef.current) return;

      // Initialize xterm.js
      const term = new XTerm({
        theme: {
          background: '#1a1b26',
          foreground: '#a9b1d6',
          cursor: '#c0caf5',
          cursorAccent: '#1a1b26',
          selection: '#33467C',
          black: '#32344a',
          red: '#f7768e',
          green: '#9ece6a',
          yellow: '#e0af68',
          blue: '#7aa2f7',
          magenta: '#ad8ee6',
          cyan: '#449dab',
          white: '#787c99',
          brightBlack: '#444b6a',
          brightRed: '#ff7a93',
          brightGreen: '#b9f27c',
          brightYellow: '#ff9e64',
          brightBlue: '#7da6ff',
          brightMagenta: '#bb9af7',
          brightCyan: '#0db9d7',
          brightWhite: '#acb0d0',
        },
        fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
        fontSize: 14,
        lineHeight: 1.2,
        cursorBlink: true,
        cursorStyle: 'block',
        allowTransparency: true,
        rows: 10,
        cols: 80,
      });

      // Add addons
      const fitAddon = new FitAddon();
      term.loadAddon(fitAddon);
      term.loadAddon(new WebLinksAddon());

      // Store references
      xtermRef.current = term;
      fitAddonRef.current = fitAddon;

      // Open terminal
      await new Promise<void>((resolve) => {
        term.open(terminalRef.current!);
        // Wait a frame to ensure the terminal is properly mounted
        requestAnimationFrame(() => {
          fitAddon.fit();
          resolve();
        });
      });

      setIsTerminalReady(true);

      // Write welcome message
      term.writeln('\x1b[1;34m Welcome to Create.zai Terminal \x1b[0m');
      term.writeln('\x1b[90m Type "help" for available commands\x1b[0m');
      term.write('\r\n$ ');

      // Handle input
      let currentLine = '';
      let currentPosition = 0;

      term.onKey(({ key, domEvent }) => {
        const ev = domEvent as KeyboardEvent;
        const printable = !ev.altKey && !ev.ctrlKey && !ev.metaKey;

        if (ev.keyCode === 13) { // Enter
          if (currentLine.trim()) {
            handleCommand(currentLine.trim(), term);
          }
          currentLine = '';
          currentPosition = 0;
          term.write('\r\n$ ');
        } else if (ev.keyCode === 8) { // Backspace
          if (currentPosition > 0) {
            currentLine = currentLine.slice(0, -1);
            currentPosition--;
            term.write('\b \b');
          }
        } else if (printable) {
          currentLine += key;
          currentPosition++;
          term.write(key);
        }
      });
    };

    initTerminal();

    return () => {
      if (xtermRef.current) {
        xtermRef.current.dispose();
        xtermRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!isTerminalReady) return;

    const handleResize = () => {
      if (fitAddonRef.current && xtermRef.current) {
        requestAnimationFrame(() => {
          try {
            fitAddonRef.current?.fit();
          } catch (error) {
            console.error('Failed to fit terminal:', error);
          }
        });
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isTerminalReady]);

  useEffect(() => {
    if (!isTerminalReady) return;

    // Delay the fit operation to ensure the transition is complete
    const timeoutId = setTimeout(() => {
      if (fitAddonRef.current && xtermRef.current) {
        try {
          fitAddonRef.current.fit();
        } catch (error) {
          console.error('Failed to fit terminal after expand:', error);
        }
      }
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [isExpanded, isTerminalReady]);

  const handleCommand = async (command: string, term: XTerm) => {
    try {
      // Built-in commands
      if (command === 'clear') {
        term.clear();
        return;
      }

      if (command === 'help') {
        term.writeln('\r\nAvailable commands:');
        term.writeln('  help     - Show this help message');
        term.writeln('  clear    - Clear terminal');
        term.writeln('  ls       - List files');
        term.writeln('  pwd      - Print working directory');
        term.writeln('  echo     - Echo a message');
        return;
      }

      // Send command to server
      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Command execution failed');
      }

      term.writeln('\r\n' + result.output);
    } catch (error) {
      term.writeln('\r\n\x1b[31mError: ' + (error as Error).message + '\x1b[0m');
    }
  };

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
              if (xtermRef.current) {
                xtermRef.current.clear();
                xtermRef.current.write('$ ');
              }
            }}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={16} />
          </button>
        </div>
      </div>
      <div ref={terminalRef} className="flex-1" />
    </div>
  );
}
