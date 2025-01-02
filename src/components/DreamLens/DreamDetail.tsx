import React from 'react';
import { X } from 'lucide-react';

interface DreamDetailProps {
  dream: string;
  future: string;
  action: string;
  onClose: () => void;
  onEdit: () => void;
}

function DreamDetail({ dream, future, action, onClose, onEdit }: DreamDetailProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg">
        <div className="flex justify-between items-center p-4 border-b">
          <h3 className="text-lg font-semibold">꿈의 상세 정보</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나의 꿈</label>
            <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{dream}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">나뿐 달인</label>
            <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{future}</p>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">실천 계획</label>
            <p className="text-gray-900 bg-gray-50 rounded-lg p-3">{action}</p>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 p-4 border-t">
          <button
            onClick={onEdit}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
          >
            수정하기
          </button>
        </div>
      </div>
    </div>
  );
}

export default DreamDetail;