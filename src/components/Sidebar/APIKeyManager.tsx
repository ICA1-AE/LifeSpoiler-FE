import React, { useState } from 'react';
import { useRecoilState } from 'recoil';
import { Key, Edit2, Check, X, User } from 'lucide-react';
import { openAIKeyState, userNameState } from '../../store/atoms';

export function APIKeyManager() {
  const [openAIKey, setOpenAIKey] = useRecoilState(openAIKeyState);
  const [userName, setUserName] = useRecoilState(userNameState);
  const [isEditingKey, setIsEditingKey] = useState(!openAIKey);
  const [isEditingName, setIsEditingName] = useState(!userName);
  const [tempKey, setTempKey] = useState(openAIKey);
  const [tempName, setTempName] = useState(userName);

  const handleSaveKey = () => {
    if (tempKey.trim()) {
      setOpenAIKey(tempKey.trim());
      setIsEditingKey(false);
    }
  };

  const handleSaveName = () => {
    if (tempName.trim()) {
      setUserName(tempName.trim());
      setIsEditingName(false);
    }
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
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <User size={16} />
              <span>User Name</span>
            </div>
            {userName && !isEditingName && (
              <button
                onClick={() => setIsEditingName(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>

          {isEditingName ? (
            <div className="space-y-2">
              <input
                type="text"
                value={tempName}
                onChange={(e) => setTempName(e.target.value)}
                placeholder="Enter your name"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelName}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSaveName}
                  className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 px-3 py-1.5 rounded-md">
              <div className="text-sm text-gray-700">
                {userName || 'Not set'}
              </div>
            </div>
          )}
        </div>

        {/* OpenAI API Key Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <Key size={16} />
              <span>OpenAI API Key</span>
            </div>
            {openAIKey && !isEditingKey && (
              <button
                onClick={() => setIsEditingKey(true)}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Edit2 size={14} />
              </button>
            )}
          </div>

          {isEditingKey ? (
            <div className="space-y-2">
              <input
                type="password"
                value={tempKey}
                onChange={(e) => setTempKey(e.target.value)}
                placeholder="Enter your OpenAI API key"
                className="w-full px-3 py-1.5 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={handleCancelKey}
                  className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={14} />
                </button>
                <button
                  onClick={handleSaveKey}
                  className="p-1 text-indigo-500 hover:text-indigo-600 transition-colors"
                >
                  <Check size={14} />
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 px-3 py-1.5 rounded-md">
              <div className="text-sm font-mono text-gray-500">
                {openAIKey ? '••••••••' + openAIKey.slice(-4) : 'Not set'}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}