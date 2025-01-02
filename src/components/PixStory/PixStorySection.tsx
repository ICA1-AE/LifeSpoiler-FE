import React from 'react';
import { generatePlaceholderText } from '../../utils/textGenerator';

interface PixStorySectionProps {
  images: string[];
}

function PixStorySection({ images }: PixStorySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="space-y-12">
        <h2 className="text-2xl font-bold text-center mb-8">PixStory</h2>
        {images.map((image, index) => (
          <div 
            key={index} 
            className={`flex gap-8 items-start ${
              index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
            }`}
          >
            <div className="w-1/3 shrink-0">
              <img
                src={image}
                alt={`PixStory 이미지 ${index + 1}`}
                className="w-full aspect-[4/3] object-cover rounded-lg shadow-md"
              />
            </div>
            <div className="flex-1 py-4">
              <div className="prose prose-lg">
                <p className="text-gray-700 leading-relaxed">
                  {generatePlaceholderText(index)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default PixStorySection;