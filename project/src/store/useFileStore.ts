import { create } from 'zustand';

export type FileType = {
  id: string;
  name: string;
  content: string;
  path: string;
  language: string;
  isModified: boolean;
};

type FileStore = {
  files: FileType[];
  activeFileId: string | null;
  addFile: (file: Omit<FileType, 'id'>) => void;
  updateFileContent: (id: string, content: string) => void;
  setActiveFile: (id: string) => void;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
};

export const useFileStore = create<FileStore>((set) => ({
  files: [
    {
      id: '1',
      name: 'App.tsx',
      path: '/src/App.tsx',
      content: `import React from 'react';
import { ThemeProvider } from './components/ThemeContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Editor from './components/Editor';
import Terminal from './components/Terminal';
import Footer from './components/Footer';

export default function App() {
  return (
    <ThemeProvider>
      <div className="flex flex-col h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />
          <main className="flex-1 flex flex-col overflow-hidden">
            <Editor />
            <Terminal />
          </main>
        </div>
        <Footer />
      </div>
    </ThemeProvider>
  );
}`,
      language: 'typescript',
      isModified: false,
    },
  ],
  activeFileId: '1',
  addFile: (file) =>
    set((state) => ({
      files: [...state.files, { ...file, id: Math.random().toString() }],
    })),
  updateFileContent: (id, content) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, content, isModified: true } : file
      ),
    })),
  setActiveFile: (id) => set({ activeFileId: id }),
  deleteFile: (id) =>
    set((state) => ({
      files: state.files.filter((file) => file.id !== id),
      activeFileId: state.activeFileId === id ? null : state.activeFileId,
    })),
  renameFile: (id, newName) =>
    set((state) => ({
      files: state.files.map((file) =>
        file.id === id ? { ...file, name: newName } : file
      ),
    })),
}));
