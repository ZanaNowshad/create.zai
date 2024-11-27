import React from 'react';
import {
  FileText,
  Search,
  Bot,
  Play,
  TestTube,
  Cloud,
  Settings,
  Package,
  HelpCircle,
  FolderTree
} from 'lucide-react';

type IconButtonProps = {
  icon: React.ReactNode;
  label: string;
  isActive?: boolean;
  onClick: () => void;
};

const IconButton: React.FC<IconButtonProps> = ({ icon, label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`relative group p-3 w-full flex justify-center ${
      isActive
        ? 'text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-900/20'
        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50'
    } transition-colors`}
    title={label}
  >
    {icon}
    <span className="absolute left-14 bg-gray-900 text-white px-2 py-1 rounded text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-50">
      {label}
    </span>
  </button>
);

interface SidebarProps {
  activePanel: string | null;
  onPanelChange: (panel: 'files' | 'ai' | null) => void;
}

export default function Sidebar({ activePanel, onPanelChange }: SidebarProps) {
  const icons = [
    { id: 'files', icon: <FolderTree size={20} />, label: 'File Explorer' },
    { id: 'search', icon: <Search size={20} />, label: 'Search' },
    { id: 'ai', icon: <Bot size={20} />, label: 'AI Assistant' },
    { id: 'run', icon: <Play size={20} />, label: 'Run & Debug' },
    { id: 'test', icon: <TestTube size={20} />, label: 'Testing' },
    { id: 'deploy', icon: <Cloud size={20} />, label: 'Deploy' },
    { id: 'extensions', icon: <Package size={20} />, label: 'Extensions' },
  ];

  const bottomIcons = [
    { id: 'settings', icon: <Settings size={20} />, label: 'Settings' },
    { id: 'help', icon: <HelpCircle size={20} />, label: 'Help' },
  ];

  const handleIconClick = (id: string) => {
    if (id === 'files' || id === 'ai') {
      onPanelChange(activePanel === id ? null : id as 'files' | 'ai');
    }
  };

  return (
    <div className="w-12 bg-gray-50 dark:bg-gray-800/30 border-r border-gray-200 dark:border-gray-700 flex flex-col justify-between">
      <div className="flex flex-col">
        {icons.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activePanel === item.id}
            onClick={() => handleIconClick(item.id)}
          />
        ))}
      </div>
      <div className="flex flex-col">
        {bottomIcons.map((item) => (
          <IconButton
            key={item.id}
            icon={item.icon}
            label={item.label}
            isActive={activePanel === item.id}
            onClick={() => handleIconClick(item.id)}
          />
        ))}
      </div>
    </div>
  );
}
