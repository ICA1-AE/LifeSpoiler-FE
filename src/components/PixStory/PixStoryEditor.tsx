import React, { useState } from 'react';
import { BookOpen, Loader2 } from 'lucide-react';
import ImageUploadList from '../Image/ImageUploadList';
import CreatePixStoryModal from './CreatePixStoryModal';

interface PixStoryEditorProps {
  images: string[];
  selectedImageIndex: number | null;
  onImageUpload: (image: string) => void;
  onImageDelete: (index: number) => void;
  onReorder: (newOrder: string[]) => void;
  onImageSelect: (index: number) => void;
  onSave: (data: { gender: string; genre: string }) => void;
  isLoading: boolean;
  error: string | null;
}

function PixStoryEditor({
  images,
  selectedImageIndex,
  onImageUpload,
  onImageDelete,
  onReorder,
  onImageSelect,
  onSave,
  isLoading,
  error,
}: PixStoryEditorProps) {
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">My Images</h2>
        {images.length > 0 && (
          <button 
            onClick={() => setShowCreateModal(true)}
            disabled={isLoading}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-400"
          >
            {isLoading ? (
              <>
                <Loader2 size={20} className="animate-spin" />
                Generating Story...
              </>
            ) : (
              <>
                Create PixStory
                <BookOpen size={20} />
              </>
            )}
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

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

      {showCreateModal && (
        <CreatePixStoryModal
          onClose={() => setShowCreateModal(false)}
          onSubmit={onSave}
        />
      )}
    </div>
  );
}

export default PixStoryEditor;