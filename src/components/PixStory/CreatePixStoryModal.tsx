import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePixStoryModalProps {
  onClose: () => void;
  onSubmit: (data: { characterName: string; gender: string; genre: string }) => void;
}

const GENRES = [
  '판타지',
  'SF',
  '로맨스',
  '미스터리',
  '모험'
];

const GENDERS = ['남성', '여성'];

function CreatePixStoryModal({ onClose, onSubmit }: CreatePixStoryModalProps) {
  const [characterName, setCharacterName] = useState('');
  const [gender, setGender] = useState(GENDERS[0]);
  const [genre, setGenre] = useState(GENRES[0]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!characterName.trim()) {
      alert('주인공의 이름을 입력해주세요.');
      return;
    }
    onSubmit({ characterName, gender, genre });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="text-xl font-semibold mb-6">새로운 PixStory 만들기</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="characterName" className="block text-sm font-medium text-gray-700 mb-1">
              주인공 이름
            </label>
            <input
              type="text"
              id="characterName"
              value={characterName}
              onChange={(e) => setCharacterName(e.target.value)}
              placeholder="주인공의 이름을 입력하세요"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              성별
            </label>
            <div className="flex gap-4">
              {GENDERS.map((g) => (
                <label key={g} className="flex items-center">
                  <input
                    type="radio"
                    name="gender"
                    value={g}
                    checked={gender === g}
                    onChange={(e) => setGender(e.target.value)}
                    className="w-4 h-4 text-indigo-600 border-gray-300 focus:ring-indigo-500"
                  />
                  <span className="ml-2">{g}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
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

          <div className="flex gap-3 mt-6">
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
  );
}

export default CreatePixStoryModal;