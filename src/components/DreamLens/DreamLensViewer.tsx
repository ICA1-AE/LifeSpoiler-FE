import React from 'react';
import { Pencil, Sparkles } from 'lucide-react';
import type { DreamLensData } from './types';

interface DreamLensViewerProps {
  data: DreamLensData;
  onEdit: () => void;
  onDreamLens: () => void;
}

export function DreamLensViewer({ data, onEdit, onDreamLens }: DreamLensViewerProps) {
  const { userName, genre, jobTitle, story } = data;

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2"
        >
          <Pencil size={16} />
          Edit DreamLens
        </button>
        <button
          onClick={onDreamLens}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-indigo-700 transition-colors flex items-center gap-2"
        >
          <Sparkles size={16} />
          DreamLens
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm p-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-2xl font-bold">
              {userName}님의 {genre} 이야기
            </h2>
            <p className="text-lg text-gray-600">
              미래의 {jobTitle}을 향한 여정
            </p>
          </div>

          <div className="prose prose-lg max-w-none">
            {story.split('\n').map((paragraph, index) => (
              <p key={index} className="text-gray-700 leading-relaxed">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}