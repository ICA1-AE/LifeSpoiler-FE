import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import type { PixStoryData } from './types';

interface PixStorySectionProps {
  images: string[];
  storyData: PixStoryData;
}

function PixStorySection({ images, storyData }: PixStorySectionProps) {
  const { metadata, captions, novel } = storyData;
  const [showCaptions, setShowCaptions] = useState(false);

  // Parse novel text and split by [image] tag
  const novelParts = novel.split('[image]');

  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-2xl font-bold">
              {metadata ? `${metadata.characterName}의 ${metadata.genre} 이야기` : 'PixStory'}
            </h2>
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className="text-gray-400 hover:text-gray-600 transition-colors"
              title="이미지 설명 보기"
            >
              <HelpCircle size={20} />
            </button>
          </div>
        </div>

        {/* Captions Modal */}
        {showCaptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6 relative max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setShowCaptions(false)}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-semibold mb-6">이미지 설명</h3>
              <div className="space-y-6">
                {images.map((image, index) => (
                  <div key={index} className="flex gap-4">
                    <img
                      src={image}
                      alt={`이미지 ${index + 1}`}
                      className="w-32 h-32 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <p className="text-sm text-gray-500 mb-1">이미지 {index + 1}</p>
                      <p className="text-gray-700">{captions[index]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Novel with Images */}
        <div className="prose prose-lg max-w-none">
          {novelParts.map((part, index) => (
            <div key={index} className="flex flex-col md:flex-row gap-8 items-center py-8">
              {/* Text part */}
              <div className={`flex-1 ${index % 2 === 0 ? 'md:order-1' : 'md:order-2'}`}>
                {part && (
                  <p className="text-gray-700 leading-relaxed">
                    {part}
                  </p>
                )}
              </div>
              {/* Image part (if there's a next part) */}
              {index < images.length && (
                <div className={`w-full md:w-1/3 ${index % 2 === 0 ? 'md:order-2' : 'md:order-1'}`}>
                  <div className="aspect-[4/3] relative group">
                    <img
                      src={images[index]}
                      alt={`스토리 이미지 ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PixStorySection;