import React, { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, Plus, MoreVertical, Trash2, Edit2 } from 'lucide-react';
import { useFileStore } from '../store/useFileStore';

type FileTreeItem = {
  id: string;
  name: string;
  type: 'file' | 'folder';
  children?: FileTreeItem[];
};

export default function FileExplorer() {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set(['root']));
  const { files, addFile, deleteFile, renameFile } = useFileStore();

  const toggleFolder = (folderId: string) => {
    setExpandedFolders((prev) => {
      const next = new Set(prev);
      if (next.has(folderId)) {
        next.delete(folderId);
      } else {
        next.add(folderId);
      }
      return next;
    });
  };

  const FileTreeNode: React.FC<{ item: FileTreeItem; level: number }> = ({ item, level }) => {
    const [isRenaming, setIsRenaming] = useState(false);
    const [newName, setNewName] = useState(item.name);
    const [showActions, setShowActions] = useState(false);

    const handleRename = (e: React.FormEvent) => {
      e.preventDefault();
      if (newName.trim() && newName !== item.name) {
        renameFile(item.id, newName);
      }
      setIsRenaming(false);
    };

    return (
      <div className="relative">
        <div
          className="flex items-center py-1 px-2 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded group"
          style={{ paddingLeft: `${level * 12}px` }}
          onMouseEnter={() => setShowActions(true)}
          onMouseLeave={() => setShowActions(false)}
        >
          {item.type === 'folder' ? (
            <button
              onClick={() => toggleFolder(item.id)}
              className="p-0.5 hover:bg-gray-200 dark:hover:bg-gray-600 rounded"
            >
              {expandedFolders.has(item.id) ? (
                <ChevronDown size={14} />
              ) : (
                <ChevronRight size={14} />
              )}
            </button>
          ) : (
            <span className="w-5" />
          )}
          {item.type === 'folder' ? (
            <Folder size={16} className="mr-1.5 text-yellow-500" />
          ) : (
            <File size={16} className="mr-1.5 text-blue-500" />
          )}
          {isRenaming ? (
            <form onSubmit={handleRename} className="flex-1">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="w-full bg-white dark:bg-gray-800 px-1 py-0.5 text-sm rounded border border-purple-500 focus:outline-none"
                autoFocus
                onBlur={handleRename}
              />
            </form>
          ) : (
            <span className="text-sm">{item.name}</span>
          )}
          {showActions && !isRenaming && (
            <div className="absolute right-2 flex items-center space-x-1 bg-white dark:bg-gray-800 rounded shadow-sm">
              <button
                onClick={() => setIsRenaming(true)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              >
                <Edit2 size={12} />
              </button>
              <button
                onClick={() => deleteFile(item.id)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-red-500"
              >
                <Trash2 size={12} />
              </button>
            </div>
          )}
        </div>
        {item.type === 'folder' && expandedFolders.has(item.id) && item.children && (
          <div className="ml-4">
            {item.children.map((child) => (
              <FileTreeNode key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  };

  const createNewFile = () => {
    const name = prompt('Enter file name:');
    if (name) {
      addFile({
        name,
        content: '',
        path: `/${name}`,
        language: name.endsWith('.ts') || name.endsWith('.tsx') ? 'typescript' : 'javascript',
        isModified: false,
      });
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700">
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-sm font-medium">Explorer</h2>
        <button
          onClick={createNewFile}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
        >
          <Plus size={16} />
        </button>
      </div>
      <div className="p-2">
        <FileTreeNode
          item={{
            id: 'root',
            name: 'Project',
            type: 'folder',
            children: files.map((file) => ({
              id: file.id,
              name: file.name,
              type: 'file',
            })),
          }}
          level={0}
        />
      </div>
    </div>
  );
}
