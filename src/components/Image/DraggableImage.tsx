import React, { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Trash2, Maximize2 } from 'lucide-react';
import ImagePreviewModal from './ImagePreviewModal';

interface DraggableImageProps {
  id: string;
  src: string;
  index: number;
  onClick?: () => void;
  onDelete?: () => void;
}

export function DraggableImage({ id, src, index, onClick, onDelete }: DraggableImageProps) {
  const [showPreview, setShowPreview] = useState(false);
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <>
      <div
        ref={setNodeRef}
        style={style}
        className={`relative group h-40 border border-gray-200 rounded-lg ${isDragging ? 'opacity-50' : ''}`}
      >
        <img
          src={src}
          alt={`Uploaded ${index + 1}`}
          className="h-40 w-full object-scale-down rounded-lg cursor-pointer"
          onClick={onClick}
        />
        <div
          {...attributes}
          {...listeners}
          className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 transition-all rounded-lg cursor-grab flex items-center justify-center"
          onClick={e => e.stopPropagation()}
        >
          <GripVertical className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowPreview(true);
          }}
          className="absolute top-2 left-2 p-1 bg-white/90 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
        >
          <Maximize2 className="text-gray-700" size={16} />
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDelete?.();
          }}
          className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
        >
          <Trash2 className="text-white" size={16} />
        </button>
      </div>
      {showPreview && (
        <ImagePreviewModal
          image={src}
          onClose={() => setShowPreview(false)}
        />
      )}
    </>
  );
}