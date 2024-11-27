import { useCallback, useRef } from 'react';
import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { TerminalTheme } from '../themes/terminalTheme';
import { CommandExecutor } from '../services/CommandExecutor';

export function useTerminal() {
  const terminalRef = useRef<XTerm | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const commandExecutorRef = useRef<CommandExecutor | null>(null);

  const initializeTerminal = useCallback((container: HTMLElement) => {
    if (terminalRef.current) {
      return () => {};
    }

    const terminal = new XTerm({
      theme: TerminalTheme,
      fontFamily: 'JetBrains Mono, Menlo, Monaco, Consolas, monospace',
      fontSize: 14,
      lineHeight: 1.2,
      cursorBlink: true,
      cursorStyle: 'block',
      allowTransparency: true,
      rows: 10,
      cols: 80,
      scrollback: 1000,
      tabStopWidth: 4,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.loadAddon(new WebLinksAddon());

    terminal.open(container);
    fitAddon.fit();

    const commandExecutor = new CommandExecutor(terminal);
    
    const resizeObserver = new ResizeObserver(() => {
      fitAddon.fit();
    });

    resizeObserver.observe(container);
    
    container.addEventListener('resize', () => {
      fitAddon.fit();
    });

    terminalRef.current = terminal;
    fitAddonRef.current = fitAddon;
    commandExecutorRef.current = commandExecutor;

    // Write welcome message
    terminal.writeln('\x1b[1;34m╭──────────────────────────────────────╮\x1b[0m');
    terminal.writeln('\x1b[1;34m│    Welcome to Create.zai Terminal     │\x1b[0m');
    terminal.writeln('\x1b[1;34m│    Natural Language Commands Ready    │\x1b[0m');
    terminal.writeln('\x1b[1;34m╰──────────────────────────────────────╯\x1b[0m');
    terminal.writeln('\x1b[90mType "help" for available commands and examples\x1b[0m');
    terminal.write('\r\n\x1b[32m❯\x1b[0m ');

    // Setup command handling
    commandExecutor.initialize();

    return () => {
      resizeObserver.disconnect();
      terminal.dispose();
      terminalRef.current = null;
      fitAddonRef.current = null;
      commandExecutorRef.current = null;
    };
  }, []);

  const clearTerminal = useCallback(() => {
    if (terminalRef.current) {
      terminalRef.current.clear();
      terminalRef.current.write('\x1b[32m❯\x1b[0m ');
    }
  }, []);

  return {
    initializeTerminal,
    clearTerminal,
  };
}
