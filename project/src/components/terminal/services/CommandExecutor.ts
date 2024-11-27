import { Terminal as XTerm } from 'xterm';

export class CommandExecutor {
  private currentLine = '';
  private currentPosition = 0;
  private history: string[] = [];
  private historyPosition = 0;
  private readonly apiEndpoint = 'https://api.deepinfra.com/v1/openai/chat/completions';

  constructor(private terminal: XTerm) {}

  initialize(): void {
    this.terminal.onKey(this.handleKey.bind(this));
  }

  private async executeCommand(input: string): Promise<void> {
    try {
      this.terminal.writeln('\r\n\x1b[90mProcessing input...\x1b[0m');

      const response = await fetch(this.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: [
            {
              role: 'system',
              content: 'You are an AI coding assistant. Convert natural language to shell commands. Only respond with the command prefixed with $, no explanations.',
            },
            { role: 'user', content: input },
          ],
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.choices || result.choices.length === 0) {
        throw new Error(result.error || 'Failed to process input');
      }

      const command = result.choices[0].message.content.trim();
      this.terminal.writeln(`\x1b[36mTranslated command: ${command}\x1b[0m`);

      if (!command.startsWith('$')) {
        throw new Error('Invalid command format from AI');
      }

      const shellCommand = command.slice(1).trim();

      const shellResponse = await fetch('/api/terminal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: shellCommand }),
      });

      const shellResult = await shellResponse.json();

      if (!shellResponse.ok) {
        throw new Error(shellResult.error || 'Command execution failed');
      }

      this.terminal.writeln('\r\n' + shellResult.output);
    } catch (error) {
      this.terminal.writeln('\r\n\x1b[31mError: ' + (error as Error).message + '\x1b[0m');
    }
  }

  private handleKey({ key, domEvent }: { key: string; domEvent: KeyboardEvent }): void {
    const printable = !domEvent.altKey && !domEvent.ctrlKey && !domEvent.metaKey;

    if (domEvent.keyCode === 13) { // Enter
      if (this.currentLine.trim()) {
        this.history.push(this.currentLine);
        this.historyPosition = this.history.length;
        this.executeCommand(this.currentLine.trim());
      }
      this.currentLine = '';
      this.currentPosition = 0;
      this.terminal.write('\r\n\x1b[32m❯\x1b[0m ');
    } else if (domEvent.keyCode === 8) { // Backspace
      if (this.currentPosition > 0) {
        this.currentLine = this.currentLine.slice(0, -1);
        this.currentPosition--;
        this.terminal.write('\b \b');
      }
    } else if (domEvent.keyCode === 38) { // Up arrow
      if (this.historyPosition > 0) {
        this.historyPosition--;
        this.clearCurrentLine();
        this.currentLine = this.history[this.historyPosition];
        this.currentPosition = this.currentLine.length;
        this.terminal.write(this.currentLine);
      }
    } else if (domEvent.keyCode === 40) { // Down arrow
      if (this.historyPosition < this.history.length) {
        this.historyPosition++;
        this.clearCurrentLine();
        this.currentLine = this.historyPosition === this.history.length 
          ? '' 
          : this.history[this.historyPosition];
        this.currentPosition = this.currentLine.length;
        this.terminal.write(this.currentLine);
      }
    } else if (printable) {
      this.currentLine += key;
      this.currentPosition++;
      this.terminal.write(key);
    }
  }

  private clearCurrentLine(): void {
    this.terminal.write('\r\x1b[32m❯\x1b[0m ' + ' '.repeat(this.currentPosition));
    this.terminal.write('\r\x1b[32m❯\x1b[0m ');
  }
}
