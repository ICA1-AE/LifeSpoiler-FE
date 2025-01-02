import React from 'react';
import { Pencil, Sparkles, BookOpen } from 'lucide-react';
import PixStorySection from './PixStorySection';

interface PixStoryViewerProps {
  images: string[];
  onEdit: () => void;
}

function PixStoryViewer({ images, onEdit }: PixStoryViewerProps) {
  const navigateToDreamLens = () => {
    window.location.hash = 'dreamlens';
  };

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex gap-2">
        {images.length === 0? (
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <BookOpen size={16} />
          Start My Story
        </button>) : (
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Pencil size={16} />
          Edit PixStory
        </button>)}
        {images.length > 0 && (
          <button
            onClick={navigateToDreamLens}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <Sparkles size={16} />
            DreamLens
          </button>
        )}
      </div>
      <PixStorySection images={images} />
    </div>
  );
}

export default PixStoryViewer;