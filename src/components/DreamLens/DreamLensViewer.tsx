import React from "react";
import { BookOpen } from "lucide-react";
import { FormData } from "./types";

interface DreamLensViewerProps {
  data: FormData;
  onEdit: () => void;
}

export function DreamLensViewer({ data, onEdit }: DreamLensViewerProps) {
  const getParticle = (word: string) => {
    const lastChar = word.charAt(word.length - 1);
    const lastCharCode = lastChar.charCodeAt(0);
    const isConsonantEnding = (lastCharCode - 0xac00) % 28 !== 0;
    return isConsonantEnding ? "이" : "가";
  };

  return (
    <div className="relative">
      <button
        onClick={onEdit}
        className="absolute top-0 right-0 bg-blue-500 text-white rounded-lg px-4 py-2 hover:bg-blue-600 transition-colors flex items-center space-x-2"
      >
        <span>편집하기</span>
      </button>

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="bg-blue-500 p-6 text-white">
          <h1 className="text-2xl font-bold">
            {data.dream}{getParticle(data.dream)} 된 미래의 모습입니다.
          </h1>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {data.selectedSuggestions.map((suggestion, index) => (
            <div key={index} className="flex gap-6 items-center bg-gray-50 p-4 rounded-lg">
              <div className="w-1/3 aspect-video bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={48} className="text-gray-400" />
              </div>
              <div className="w-2/3">
                <p className="text-gray-600 leading-relaxed">
                  {suggestion} 이를 위해서는 지속적인 노력과 실천이 필요합니다. 
                  매일 조금씩 진전을 이루다 보면 어느새 목표에 한걸음 더 가까워져 있을 것입니다. 
                  중간에 어려움이 있더라도 초심을 잃지 않고 꾸준히 노력한다면 반드시 이루어질 것입니다.
                </p>
              </div>
            </div>
          ))}

          {data.customText && (
            <div className="flex gap-6 items-center bg-gray-50 p-4 rounded-lg">
              <div className="w-1/3 aspect-video bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen size={48} className="text-gray-400" />
              </div>
              <div className="w-2/3">
                <p className="text-gray-600 leading-relaxed">
                  {data.customText} 이러한 개인적인 목표를 달성하기 위해서는 
                  구체적인 계획과 실천 전략이 필요합니다. 한 걸음 한 걸음 
                  차근차근 나아간다면, 분명 원하는 미래에 도달할 수 있을 것입니다. 
                  작은 성공들이 모여 큰 변화를 만들어낼 것입니다.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}