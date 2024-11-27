import React from 'react';
import { useTheme } from './ThemeContext';
import {
  Moon,
  Sun,
  Settings,
  HelpCircle,
  Zap,
  GitBranch,
  Users,
  Search,
  Command,
} from 'lucide-react';

export default function Header() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
      <div className="px-4 py-3 flex justify-between items-center">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <Zap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 dark:from-purple-400 dark:to-indigo-400 bg-clip-text text-transparent">
              Create.zai
            </h1>
          </div>
          <div className="hidden md:flex items-center space-x-2 bg-gray-100 dark:bg-gray-700/50 rounded-lg px-3 py-1.5">
            <Search className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search or use ⌘K"
              className="bg-transparent border-none outline-none text-sm text-gray-600 dark:text-gray-300 w-64"
            />
            <kbd className="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-white px-1.5 font-mono text-[10px] font-medium text-gray-500 dark:border-gray-600 dark:bg-gray-800">
              ⌘K
            </kbd>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <GitBranch className="h-4 w-4" />
            <span>main</span>
          </button>
          <button className="flex items-center space-x-1 px-3 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors">
            <Users className="h-4 w-4" />
            <span>Share</span>
          </button>
          <button
            onClick={toggleTheme}
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Toggle theme"
          >
            {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Settings"
          >
            <Settings size={18} />
          </button>
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Help"
          >
            <HelpCircle size={18} />
          </button>
          <button
            className="p-2 rounded-md text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            aria-label="Command Menu"
          >
            <Command size={18} />
          </button>
        </div>
      </div>
    </header>
  );
}
