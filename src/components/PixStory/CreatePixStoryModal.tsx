import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePixStoryModalProps {
  onClose: () => void;
  onSubmit: (data: { genre: string }) => void;
}

const GENRES = [
  '판타지',
  'SF',
  '로맨스',
  '미스터리',
  '모험'
];

function CreatePixStoryModal({ onClose, onSubmit }: CreatePixStoryModalProps) {
  const [genre, setGenre] = useState(GENRES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ genre });
    onClose();
  };

  return (
    <div className="fixed inset-0 isolate z-50"> {/* z-index 추가 */}
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="relative bg-white rounded-lg w-full max-w-md p-6">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
          >
            <X size={20} />
          </button>

          <h2 className="text-xl font-semibold mb-6">새로운 PixStory 만들기</h2>

          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="genre" className="block text-sm font-medium text-gray-700 mb-1">
                장르
              </label>
              <select
                id="genre"
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                {GENRES.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                취소
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
              >
                만들기
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreatePixStoryModal;