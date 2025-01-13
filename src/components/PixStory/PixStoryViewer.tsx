import React from "react";
import { Pencil, Sparkles } from "lucide-react";
import PixStorySection from "./PixStorySection";
import type { PixStoryData } from "./types";

interface PixStoryViewerProps {
  images: string[];
  storyData: PixStoryData;
  onEdit: () => void;
  onDreamLens: () => void;
}

function PixStoryViewer({ images, storyData, onEdit, onDreamLens }: PixStoryViewerProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Pencil size={16} />
          Edit PixStory
        </button>
        <button
          onClick={onDreamLens}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} />
          DreamLens
        </button>
      </div>
      <PixStorySection 
        images={images} 
        storyData={storyData}
      />
    </div>
  );
}

export default PixStoryViewer;