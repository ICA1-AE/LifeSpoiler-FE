import React, { useState, useEffect } from 'react';

interface DreamInputProps {
  initialDream?: string;
  initialFuture?: string;
  initialAction?: string;
  onConfirm: (dream: string, future: string, action: string) => void;
  onClose: () => void;
}

function DreamInput({ initialDream = '', initialFuture = '', initialAction = '', onConfirm, onClose }: DreamInputProps) {
  const [dream, setDream] = useState(initialDream);
  const [future, setFuture] = useState(initialFuture);
  const [action, setAction] = useState(initialAction);

  useEffect(() => {
    setDream(initialDream);
    setFuture(initialFuture);
    setAction(initialAction);
  }, [initialDream, initialFuture, initialAction]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (dream && future && action) {
      onConfirm(dream, future, action);
      setDream('');
      setFuture('');
      setAction('');
    }
  };

  return (
    <div className="fixed inset-x-0 bottom-0 bg-white border-t border-gray-200 shadow-lg transform transition-transform duration-300 ease-in-out">
      <form onSubmit={handleSubmit} className="container mx-auto px-4 py-6 space-y-4">
        <div className="space-y-4">
          <input
            type="text"
            value={dream}
            onChange={(e) => setDream(e.target.value)}
            placeholder="나의 꿈을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            value={future}
            onChange={(e) => setFuture(e.target.value)}
            placeholder="나뿐 달인을 입력하세요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
          <input
            type="text"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            placeholder="교육 절차를 위해 융주운전 단축을 할 거예요"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
          >
            취소
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            확인
          </button>
        </div>
      </form>
    </div>
  );
}

export default DreamInput;