import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Key, Edit2, Check, X, User } from 'lucide-react';
import { openAIKeyState, userNameState } from '../../store/atoms';

interface ValidationPopupProps {
  message: string;
  onClose: () => void;
}

function ValidationPopup({ message, onClose }: ValidationPopupProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-sm p-6 relative">
        <div className="flex items-start gap-3">
          <AlertCircle className="text-red-500 shrink-0 mt-0.5" size={20} />
          <div className="flex-1">
            <h3 className="font-medium text-gray-900 mb-2">입력이 필요합니다</h3>
            <p className="text-gray-600">{message}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
        >
          확인
        </button>
      </div>
    </div>
  );
}

export function APIKeyManager() {
  const [openAIKey, setOpenAIKey] = useRecoilState(openAIKeyState);
  const [userName, setUserName] = useRecoilState(userNameState);
  
  const [isEditingKey, setIsEditingKey] = useState(!openAIKey);
  const [isEditingName, setIsEditingName] = useState(!userName);
  
  const [tempKey, setTempKey] = useState(openAIKey);
  const [tempName, setTempName] = useState(userName);
  
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handleSaveKey = () => {
    if (!tempKey.trim()) {
      setValidationMessage("OpenAI API 키를 입력해 주세요.");
      return;
    }
    setOpenAIKey(tempKey.trim());
    setIsEditingKey(false);
  };

  const handleSaveName = () => {
    if (!tempName.trim()) {
      setValidationMessage("사용자 이름을 입력하셔야 합니다.");
      return;
    }
    setUserName(tempName.trim());
    setIsEditingName(false);
  };

  const handleCancelKey = () => {
    setTempKey(openAIKey);
    setIsEditingKey(false);
  };

  const handleCancelName = () => {
    setTempName(userName);
    setIsEditingName(false);
  };

  return (
    <div className="border-t border-gray-200 mt-auto pt-4">
      <div className="px-4 space-y-4">
        {/* User Name Input */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>User Name</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={isEditingName ? tempName : userName}
              onChange={(e) => setTempName(e.target.value)}
              placeholder="Enter your name"
              disabled={!isEditingName}
              className={`flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent ${
                isEditingName ? 'border-gray-300' : 'border-transparent bg-gray-50'
              }`}
            />
            {userName && !isEditingName ? (
              <button
                onClick={() => setIsEditingName(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            ) : isEditingName && (
              <div className="flex gap-1">
                {userName && (
                  <button
                    onClick={handleCancelName}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={handleSaveName}
                  className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* OpenAI API Key Input */}
        <div>
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <div className="flex items-center gap-2">
              <Key size={16} />
              <span>OpenAI API Key</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="password"
              value={isEditingKey ? tempKey : openAIKey}
              onChange={(e) => setTempKey(e.target.value)}
              placeholder="Enter your OpenAI API key"
              disabled={!isEditingKey}
              className={`flex-1 px-2 py-1 text-sm border rounded-md focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-transparent ${
                isEditingKey ? 'border-gray-300' : 'border-transparent bg-gray-50'
              }`}
            />
            {openAIKey && !isEditingKey ? (
              <button
                onClick={() => setIsEditingKey(true)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            ) : isEditingKey && (
              <div className="flex gap-1">
                {openAIKey && (
                  <button
                    onClick={handleCancelKey}
                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <X size={14} />
                  </button>
                )}
                <button
                  onClick={handleSaveKey}
                  className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {validationMessage && (
        <ValidationPopup 
          message={validationMessage} 
          onClose={() => setValidationMessage(null)} 
        />
      )}
    </div>
  );
}