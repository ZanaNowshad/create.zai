import React, { useState } from 'react';
import { TestTube, Play, CheckCircle, XCircle } from 'lucide-react';

type TestResult = {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  duration?: number;
  error?: string;
};

export default function Testing() {
  const [tests, setTests] = useState<TestResult[]>([
    { id: '1', name: 'App Component Renders', status: 'passed', duration: 15 },
    { id: '2', name: 'Theme Toggle Works', status: 'passed', duration: 23 },
    { id: '3', name: 'File Operations', status: 'pending' },
    { id: '4', name: 'Terminal Commands', status: 'failed', duration: 45, error: 'Expected command output to match snapshot' },
  ]);

  const runTests = () => {
    setTests((prev) =>
      prev.map((test) => ({
        ...test,
        status: 'pending',
      }))
    );

    // Simulate test execution
    setTimeout(() => {
      setTests((prev) =>
        prev.map((test) => ({
          ...test,
          status: Math.random() > 0.2 ? 'passed' : 'failed',
          duration: Math.floor(Math.random() * 100),
        }))
      );
    }, 2000);
  };

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-2">
          <TestTube className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <h2 className="text-sm font-medium text-gray-900 dark:text-gray-100">Testing</h2>
        </div>
        <button
          onClick={runTests}
          className="flex items-center space-x-1 px-3 py-1 text-sm bg-purple-600 dark:bg-purple-500 text-white rounded-md hover:bg-purple-700 dark:hover:bg-purple-600 focus:outline-none focus:ring-2 focus:ring-purple-500 dark:focus:ring-purple-400"
        >
          <Play className="h-4 w-4" />
          <span>Run Tests</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {tests.map((test) => (
          <div
            key={test.id}
            className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {test.status === 'passed' && (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                )}
                {test.status === 'failed' && (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
                {test.status === 'pending' && (
                  <div className="h-5 w-5 rounded-full border-2 border-gray-300 border-t-purple-600 animate-spin" />
                )}
                <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                  {test.name}
                </span>
              </div>
              {test.duration && (
                <span className="text-xs text-gray-500">{test.duration}ms</span>
              )}
            </div>
            {test.error && (
              <div className="mt-2 p-2 rounded bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 text-xs font-mono">
                {test.error}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
