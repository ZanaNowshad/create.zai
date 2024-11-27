import { Terminal as XTerm } from 'xterm';
import { FitAddon } from 'xterm-addon-fit';
import { WebLinksAddon } from 'xterm-addon-web-links';
import { TerminalTheme } from '../themes/terminalTheme';
import { CommandHandler } from './CommandHandler';

export class TerminalManager {
  private term: XTerm | null = null;
  private fitAddon: FitAddon | null = null;
  private commandHandler: CommandHandler;
  private currentLine = '';
  private currentPosition = 0;
  private history: string[] = [];
  private historyPosition = 0;

  constructor() {
    this.commandHandler = new CommandHandler();
    this.handleKey = this.handleKey.bind(this);
  }

  async initialize(element: HTMLElement): Promise<void> {
    if (this.term) return;

    this.term = new XTerm({
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

    this.fitAddon = new FitAddon();
    this.term.loadAddon(this.fitAddon);
    this.term.loadAddon(new WebLinksAddon());

    this.term.open(element);
    
    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        if (this.fitAddon) {
          this.fitAddon.fit();
          resolve();
        }
      });
    });

    this.writeWelcomeMessage();
    this.term.onKey(this.handleKey);
  }

  private writeWelcomeMessage(): void {
    if (!this.term) return;
    
    this.term.writeln('\x1b[1;34m╭──────────────────────────────────────╮\x1b[0m');
    this.term.writeln('\x1b[1;34m│    Welcome to Create.zai Terminal     │\x1b[0m');
    this.term.writeln('\x1b[1;34m│    Natural Language Commands Ready    │\x1b[0m');
    this.term.writeln('\x1b[1;34m╰──────────────────────────────────────╯\x1b[0m');
    this.term.writeln('\x1b[90mType "help" for available commands and examples\x1b[0m');
    this.term.write('\r\n\x1b[32m❯\x1b[0m ');
  }

  private handleKey({ key, domEvent }: { key: string; domEvent: KeyboardEvent }): void {
    if (!this.term) return;

    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter
      if (this.currentLine.trim()) {
        this.history.push(this.currentLine);
        this.historyPosition = this.history.length;
        this.commandHandler.execute(this.term, this.currentLine.trim());
      }
      this.currentLine = '';
      this.currentPosition = 0;
      this.term.write('\r\n\x1b[32m❯\x1b[0m ');
    } else if (domEvent.keyCode === 8) { // Backspace
      if (this.currentPosition > 0) {
        this.currentLine = this.currentLine.slice(0, -1);
        this.currentPosition--;
        this.term.write('\b \b');
      }
    } else if (domEvent.keyCode === 38) { // Up arrow
      if (this.historyPosition > 0) {
        this.historyPosition--;
        this.clearCurrentLine();
        this.currentLine = this.history[this.historyPosition];
        this.currentPosition = this.currentLine.length;
        this.term.write(this.currentLine);
      }
    } else if (domEvent.keyCode === 40) { // Down arrow
      if (this.historyPosition < this.history.length) {
        this.historyPosition++;
        this.clearCurrentLine();
        this.currentLine = this.historyPosition === this.history.length 
          ? '' 
          : this.history[this.historyPosition];
        this.currentPosition = this.currentLine.length;
        this.term.write(this.currentLine);
      }
    } else if (printable) {
      this.currentLine += key;
      this.currentPosition++;
      this.term.write(key);
    }
  }

  private clearCurrentLine(): void {
    if (!this.term) return;
    this.term.write('\r\x1b[32m❯\x1b[0m ' + ' '.repeat(this.currentPosition));
    this.term.write('\r\x1b[32m❯\x1b[0m ');
  }

  fit(): void {
    if (!this.fitAddon || !this.term) return;

    requestAnimationFrame(() => {
      try {
        this.fitAddon?.fit();
      } catch (error) {
        console.error('Failed to fit terminal:', error);
      }
    });
  }

  clear(): void {
    if (this.term) {
      this.term.clear();
      this.term.write('\x1b[32m❯\x1b[0m ');
    }
  }

  dispose(): void {
    if (this.term) {
      this.term.dispose();
      this.term = null;
      this.fitAddon = null;
    }
  }
}
