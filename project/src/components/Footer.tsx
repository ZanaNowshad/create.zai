import React from 'react';
import { GitBranch, GitCommit, GitPullRequest, Zap } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 py-2 px-4 text-sm">
      <div className="flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-1">
            <GitBranch size={14} className="text-purple-500 dark:text-purple-400" />
            <span className="text-gray-600 dark:text-gray-300">main</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitCommit size={14} className="text-purple-500 dark:text-purple-400" />
            <span className="text-gray-600 dark:text-gray-300">Last commit: 2h ago</span>
          </div>
          <div className="flex items-center space-x-1">
            <GitPullRequest size={14} className="text-purple-500 dark:text-purple-400" />
            <span className="text-gray-600 dark:text-gray-300">0 issues</span>
          </div>
          <div className="flex items-center space-x-1">
            <Zap size={14} className="text-purple-500 dark:text-purple-400" />
            <span className="text-gray-600 dark:text-gray-300">AI Assistant Active</span>
          </div>
        </div>
        <div className="text-gray-600 dark:text-gray-400 flex items-center space-x-4">
          <span>Ln 1, Col 1</span>
          <span>UTF-8</span>
          <span>TypeScript React</span>
        </div>
      </div>
    </footer>
  );
}
