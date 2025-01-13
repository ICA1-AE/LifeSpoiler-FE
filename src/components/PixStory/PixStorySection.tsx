import React from 'react';
import type { PixStoryData } from './types';

interface PixStorySectionProps {
  images: string[];
  storyData: PixStoryData;
}

function PixStorySection({ images, storyData }: PixStorySectionProps) {
  const { metadata, captions, novel } = storyData;

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="space-y-12">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold">
            {metadata ? `${metadata.characterName}의 ${metadata.genre} 이야기` : 'PixStory'}
          </h2>
          {novel && (
            <p className="text-gray-600 max-w-2xl mx-auto leading-relaxed">
              {novel}
            </p>
          )}
        </div>
        
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
                  {captions[index] || '이미지에 대한 설명을 생성하고 있습니다...'}
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