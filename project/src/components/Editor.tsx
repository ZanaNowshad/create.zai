import React from 'react';
import { X, FileCode, MessageSquare, Bot } from 'lucide-react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { vscodeDark } from '@uiw/codemirror-theme-vscode';
import { useTheme } from './ThemeContext';
import { useFileStore } from '../store/useFileStore';

export default function Editor() {
  const { isDarkMode } = useTheme();
  const { files, activeFileId, updateFileContent, setActiveFile, deleteFile } = useFileStore();

  const activeFile = files.find((file) => file.id === activeFileId);

  const handleChange = (value: string) => {
    if (activeFileId) {
      updateFileContent(activeFileId, value);
    }
  };

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="text-center text-gray-500 dark:text-gray-400">
          <FileCode size={48} className="mx-auto mb-4 opacity-50" />
          <p>No file selected</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-white dark:bg-gray-900">
      <div className="flex items-center bg-gray-50 dark:bg-gray-800/50 border-b border-gray-200 dark:border-gray-700">
        <div className="flex-1 flex items-center">
          {files.map((file) => (
            <div
              key={file.id}
              className={`group relative px-4 py-2 text-sm font-medium border-r border-gray-200 dark:border-gray-700 ${
                activeFileId === file.id
                  ? 'text-purple-600 dark:text-purple-400 bg-white dark:bg-gray-800'
                  : 'text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              <button
                className="flex items-center space-x-2"
                onClick={() => setActiveFile(file.id)}
              >
                <span>{file.name}</span>
                {file.isModified && (
                  <span className="text-xs text-purple-500 dark:text-purple-400">●</span>
                )}
                <X
                  size={14}
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(file.id);
                  }}
                />
              </button>
            </div>
          ))}
        </div>
        <div className="flex items-center px-4 space-x-2">
          <button className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <MessageSquare size={16} />
          </button>
          <button className="p-1.5 rounded-md text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <Bot size={16} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto">
        <CodeMirror
          value={activeFile.content}
          height="100%"
          theme={isDarkMode ? vscodeDark : undefined}
          extensions={[javascript({ jsx: true, typescript: true })]}
          onChange={handleChange}
          basicSetup={{
            lineNumbers: true,
            highlightActiveLineGutter: true,
            highlightSpecialChars: true,
            foldGutter: true,
            dropCursor: true,
            allowMultipleSelections: true,
            indentOnInput: true,
            bracketMatching: true,
            closeBrackets: true,
            autocompletion: true,
            rectangularSelection: true,
            crosshairCursor: true,
            highlightActiveLine: true,
            highlightSelectionMatches: true,
            closeBracketsKeymap: true,
            defaultKeymap: true,
            searchKeymap: true,
            historyKeymap: true,
            foldKeymap: true,
            completionKeymap: true,
            lintKeymap: true,
          }}
        />
      </div>
    </div>
  );
}
