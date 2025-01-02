import React, { useState } from 'react';
import PixStoryEditor from './PixStoryEditor';
import PixStoryViewer from './PixStoryViewer';

interface PixStoryProps {
  images: string[];
  onImageUpload: (image: string) => void;
  onImageDelete: (index: number) => void;
  onReorder: (newOrder: string[]) => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
}

function PixStory({ 
  images, 
  onImageUpload, 
  onImageDelete, 
  onReorder,
  isEditing,
  onEditingChange
}: PixStoryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleCreatePixstory = () => {
    onEditingChange(false);
  };

  const handleEditPixstory = () => {
    onEditingChange(true);
  };

  return isEditing ? (
    <PixStoryEditor
      images={images}
      selectedImageIndex={selectedImageIndex}
      onImageUpload={onImageUpload}
      onImageDelete={onImageDelete}
      onReorder={onReorder}
      onImageSelect={setSelectedImageIndex}
      onSave={handleCreatePixstory}
    />
  ) : (
    <PixStoryViewer
      images={images}
      onEdit={handleEditPixstory}
    />
  );
}

export default PixStory;