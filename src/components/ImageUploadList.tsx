import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from '@dnd-kit/sortable';
import ImageUploader from './Image/ImageUploader';
import { DraggableImage } from './DraggableImage';

interface ImageUploadListProps {
  images: string[];
  onImageUpload: (image: string) => void;
  onReorder?: (newOrder: string[]) => void;
  onImageClick?: (index: number) => void;
  onImageDelete?: (index: number) => void;
}

function ImageUploadList({ 
  images, 
  onImageUpload, 
  onReorder, 
  onImageClick,
  onImageDelete 
}: ImageUploadListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    if (over && active.id !== over.id) {
      const oldIndex = images.indexOf(active.id as string);
      const newIndex = images.indexOf(over.id as string);
      
      const newImages = [...images];
      newImages.splice(oldIndex, 1);
      newImages.splice(newIndex, 0, active.id as string);
      
      onReorder?.(newImages);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div className="grid grid-cols-5 gap-3">
        <SortableContext items={images} strategy={rectSortingStrategy}>
          {images.map((image, index) => (
            <div key={image} className="aspect-square">
              <DraggableImage
                id={image}
                src={image}
                index={index}
                onClick={() => onImageClick?.(index)}
                onDelete={() => onImageDelete?.(index)}
              />
            </div>
          ))}
        </SortableContext>
        <div className="aspect-square">
          <ImageUploader onImageUpload={onImageUpload} />
        </div>
      </div>
    </DndContext>
  );
}

export default ImageUploadList;