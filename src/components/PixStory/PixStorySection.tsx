import React, { useState } from 'react';
import { HelpCircle, X } from 'lucide-react';
import type { PixStoryData } from './types';

interface PixStorySectionProps {
  images: string[];
  storyData: PixStoryData;
  backgroundImage: string;
}

function PixStorySection({ images, storyData, backgroundImage }: PixStorySectionProps) {
  const { metadata, captions, novel } = storyData;
  const [showCaptions, setShowCaptions] = useState(false);

  // Parse novel text and split by [image] tag
  const novelParts = novel.split('[image]');

  return (
    <div 
      className="relative min-h-screen"
      style={{
        backgroundImage: backgroundImage ? `url(${backgroundImage})` : 'none',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
      }}
    >
      {/* Semi-transparent overlay */}
      <div className="absolute inset-0 bg-white/60" />
      
      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto p-4 sm:p-8">
        <div className="text-center space-y-4 mb-8">
          <div className="flex items-center justify-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold">
              {metadata ? `${metadata.characterName}의 ${metadata.genre} 이야기` : 'PixStory'}
            </h2>
            <button
              onClick={() => setShowCaptions(!showCaptions)}
              className="w-6 h-6 rounded-full flex items-center justify-center text-indigo-500 hover:text-indigo-600 transition-colors"
              title="이미지 설명 보기"
            >
              <HelpCircle size={16} />
            </button>
          </div>
        </div>

        {/* Captions Modal */}
        {showCaptions && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-2xl p-4 sm:p-6 relative max-h-[80vh] overflow-y-auto">
              <button
                onClick={() => setShowCaptions(false)}
                className="absolute top-2 right-2 sm:top-4 sm:right-4 text-gray-400 hover:text-gray-600"
              >
                <X size={20} />
              </button>
              <h3 className="text-lg sm:text-xl font-semibold mb-4 sm:mb-6">이미지 설명</h3>
              <div className="space-y-4 sm:space-y-6">
                {images.map((image, index) => (
                  <div key={index} className="flex flex-col sm:flex-row gap-4">
                    <img
                      src={image}
                      alt={`이미지 ${index + 1}`}
                      className="w-full sm:w-32 h-48 sm:h-32 object-cover rounded-lg"
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
        <div className="space-y-8">
          {novelParts.map((part, index) => (
            <div 
              key={index} 
              className={`
                bg-white/90 backdrop-blur-sm rounded-xl shadow-sm p-6
                flex flex-col sm:flex-row gap-6
                ${index % 2 === 1 ? 'sm:flex-row-reverse' : ''}
              `}
            >
              {/* Image part (if there's a next part) */}
              {index < images.length && (
                <div className="w-full sm:w-1/3 lg:w-1/4 shrink-0">
                  <div className="aspect-[4/3] relative group">
                    <img
                      src={images[index]}
                      alt={`스토리 이미지 ${index + 1}`}
                      className="absolute inset-0 w-full h-full object-cover rounded-lg shadow-md group-hover:shadow-lg transition-shadow"
                    />
                  </div>
                </div>
              )}
              {/* Text part - Always left-aligned */}
              {part && (
                <div className="flex-1">
                  <p className="text-gray-700 leading-relaxed text-base sm:text-lg">
                    {part}
                  </p>
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