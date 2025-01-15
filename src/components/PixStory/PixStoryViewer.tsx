import React from "react";
import { Pencil } from "lucide-react";
import PixStorySection from "./PixStorySection";
import type { PixStoryData } from "./types";

interface PixStoryViewerProps {
  images: string[];
  storyData: PixStoryData;
  onEdit: () => void;
  onDreamLens: () => void;
}

function PixStoryViewer({ images, storyData, onEdit }: PixStoryViewerProps) {
  return (
    <div className="relative">
      <div className="absolute top-4 right-4">
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Pencil size={16} />
          Edit PixStory
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