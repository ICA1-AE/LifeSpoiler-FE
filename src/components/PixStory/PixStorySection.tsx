import React from 'react';
import { generatePlaceholderText } from '../../utils/textGenerator';

interface PixStorySectionProps {
  images: string[];
}

function PixStorySection({ images }: PixStorySectionProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      
      {images.length === 0?(
          <div className="bg-white">
            <div className="max-w-2xl mx-auto space-y-8">
              <div className="space-y-8">
                <h1 className="text-4xl font-light tracking-tight">
                  당신의 인생 이야기를
                  <br />
                  들려드립니다
                </h1>
                
                <p className="text-xl text-gray-600">
                  한 장의 사진에는 수천 가지의 이야기가 담겨있습니다.
                  <br />
                  <span className="text-black">Life Spoiler</span>와 함께
                  잊혀진 과거의 기억을 되살리고
                  <br />
                  당신이 꿈꾸는 미래로 한 걸음 나아가보세요.
                </p>
              </div>
      
              <div className="h-px w-24 bg-black" />
      
              <p className="text-sm tracking-widest uppercase">
                과거와 미래가 만나는 순간
              </p>
            </div>
          </div>
        ): (<div className="space-y-12">
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
      )}
      </div>
  );
}

export default PixStorySection;