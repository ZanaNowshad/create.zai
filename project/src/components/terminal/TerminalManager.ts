import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';

export class TerminalManager {
  private term: XTerm | null = null;
  private fitAddon: FitAddon | null = null;
  private element: HTMLElement | null = null;
  private currentLine = '';
  private currentPosition = 0;

  constructor() {
    this.handleCommand = this.handleCommand.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  async initialize(element: HTMLElement): Promise<void> {
    if (this.term) return;

    this.element = element;
    this.term = new XTerm({
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

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(new WebLinksAddon());

    await new Promise<void>((resolve) => {
      this.term!.open(element);
      requestAnimationFrame(() => {
        this.fitAddon!.fit();
        resolve();
      });
    });

    this.term.writeln('\x1b[1;34m Welcome to Create.zai Terminal \x1b[0m');
    this.term.writeln('\x1b[90m Type "help" for available commands\x1b[0m');
    this.term.write('\r\n$ ');

    this.term.onKey(this.handleKey);
  }

  private async handleCommand(command: string): Promise<void> {
    if (!this.term) return;

    try {
      if (command === 'clear') {
        this.term.clear();
        return;
      }

      if (command === 'help') {
        this.term.writeln('\r\nAvailable commands:');
        this.term.writeln('  help     - Show this help message');
        this.term.writeln('  clear    - Clear terminal');
        this.term.writeln('  ls       - List files');
        this.term.writeln('  pwd      - Print working directory');
        this.term.writeln('  echo     - Echo a message');
        return;
      }

      const response = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Command execution failed');
      }

      this.term.writeln('\r\n' + result.output);
    } catch (error) {
      this.term.writeln('\r\n\x1b[31mError: ' + (error as Error).message + '\x1b[0m');
    }
  }

  private handleKey({ key, domEvent }: { key: string; domEvent: KeyboardEvent }): void {
    if (!this.term) return;

    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter
      if (this.currentLine.trim()) {
        this.handleCommand(this.currentLine.trim());
      }
      this.currentLine = '';
      this.currentPosition = 0;
      this.term.write('\r\n$ ');
    } else if (domEvent.keyCode === 8) { // Backspace
      if (this.currentPosition > 0) {
        this.currentLine = this.currentLine.slice(0, -1);
        this.currentPosition--;
        this.term.write('\b \b');
      }
    } else if (printable) {
      this.currentLine += key;
      this.currentPosition++;
      this.term.write(key);
    }
  }

  fit(): void {
    if (this.fitAddon) {
      requestAnimationFrame(() => {
        try {
          this.fitAddon?.fit();
        } catch (error) {
          console.error('Failed to fit terminal:', error);
        }
      });
    }
  }

  clear(): void {
    if (this.term) {
      this.term.clear();
      this.term.write('$ ');
    }
  }

  dispose(): void {
    if (this.term) {
      this.term.dispose();
      this.term = null;
      this.fitAddon = null;
      this.element = null;
    }
  }
}
