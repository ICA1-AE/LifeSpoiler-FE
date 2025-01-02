import React from 'react';
import { X } from 'lucide-react';

interface DreamTagProps {
  text: string;
  onEdit: () => void;
  onDelete: () => void;
}

function DreamTag({ text, onEdit, onDelete }: DreamTagProps) {
  return (
    <div 
      onClick={onEdit}
      className="inline-flex items-center gap-2 px-3 py-1 bg-white rounded-lg border border-gray-200 cursor-pointer hover:bg-gray-50"
    >
      <span className="text-sm text-gray-700">{text}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        className="text-gray-400 hover:text-gray-600"
      >
        <X size={14} />
      </button>
    </div>
  );
}

export default DreamTag;