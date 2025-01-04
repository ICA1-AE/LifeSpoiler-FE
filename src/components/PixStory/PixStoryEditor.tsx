import React from 'react';
import { BookOpen } from 'lucide-react';
import ImageUploadList from '../Image/ImageUploadList';

interface PixStoryEditorProps {
  images: string[];
  selectedImageIndex: number | null;
  onImageUpload: (image: string) => void;
  onImageDelete: (index: number) => void;
  onReorder: (newOrder: string[]) => void;
  onImageSelect: (index: number) => void;
  onSave: () => void;
}

function PixStoryEditor({
  images,
  selectedImageIndex,
  onImageUpload,
  onImageDelete,
  onReorder,
  onImageSelect,
  onSave,
}: PixStoryEditorProps) {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Images</h2>
        {images.length > 0 && (
          <button 
            onClick={onSave}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            Create PixStory
            <BookOpen size={20} />
          </button>
        )}
      </div>

      <div className="mb-8">
        <ImageUploadList 
          images={images} 
          onImageUpload={onImageUpload}
          onReorder={onReorder}
          onImageClick={onImageSelect}
          onImageDelete={onImageDelete}
        />
      </div>

      {selectedImageIndex !== null && (
        <div className="mb-8">
          <img
            src={images[selectedImageIndex]}
            alt={`Preview ${selectedImageIndex + 1}`}
            className="w-full aspect-[16/9] object-contain bg-gray-50 rounded-lg"
          />
        </div>
      )}
    </div>
  );
}

export default PixStoryEditor;