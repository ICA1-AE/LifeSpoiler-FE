import React, { useState } from "react";
import { Check, Loader2, Search, Wand } from "lucide-react";
import { FormData, SelectedOptions, EditorState } from "./types";
import { generateJobActions } from "../../utils/openai";

interface DreamLensEditorProps {
  onSubmit: (data: FormData) => void;
  initialState: EditorState;
  openAIKey: string;
  isLoading: boolean;
  onJobActionsUpdate: (actions: string[]) => void;
}

export function DreamLensEditor({ 
  onSubmit, 
  initialState,
  openAIKey,
  isLoading,
  onJobActionsUpdate
}: DreamLensEditorProps) {
  const [customText, setCustomText] = useState(initialState.customText);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialState.selectedOptions);
  const [jobTitle, setJobTitle] = useState(initialState.jobTitle || '');
  const [jobActions, setJobActions] = useState<string[]>(initialState.jobActions || []);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 20) {
      setJobTitle(value);
      setJobActions([]);
      setSelectedOptions({});
      setCustomText('');
      setError(null);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
    }
  };

  const fetchJobActions = async () => {
    if (!jobTitle.trim()) {
      setError('직업을 입력해주세요.');
      return;
    }

    if (!openAIKey) {
      setError('OpenAI API 키를 먼저 설정해주세요.');
      return;
    }

    setIsLoadingActions(true);
    setError(null);

    try {
      const result = await generateJobActions(jobTitle, openAIKey);
      setJobActions(result.actions);
      onJobActionsUpdate(result.actions);
      setSelectedOptions({});
      setCustomText('');
    } catch (err) {
      console.error("Error fetching job actions:", err);
      setError(err instanceof Error ? err.message : '직업 행동을 가져오는데 실패했습니다.');
    } finally {
      setIsLoadingActions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const selectedActions = Object.entries(selectedOptions)
      .filter(([_, value]) => value)
      .map(([key]) => {
        if (key === 'custom') {
          return customText;
        }
        const index = parseInt(key.replace('action', ''));
        return jobActions[index];
      })
      .filter(action => action);

    if (selectedActions.length === 0) {
      setError("최소한 하나의 행동을 선택해주세요.");
      return;
    }

    const formData: FormData = {
      dream: jobTitle,
      customText: customText || "",
      selectedSuggestions: selectedActions,
      selectedOptions,
    };
    
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-2">
        <span className="text-lg">미래 나의 직업은</span>
        <div className="relative flex items-center gap-2">
          <input
            type="text"
            value={jobTitle}
            onChange={handleJobTitleChange}
            onKeyDown={handleKeyDown}
            maxLength={20}
            className="w-48 border-b-2 border-gray-300 focus:border-indigo-500 outline-none px-2 py-1 text-center"
            placeholder="직업 입력"
          />
          <button
            type="button"
            onClick={fetchJobActions}
            disabled={isLoadingActions || !jobTitle.trim()}
            className="bg-indigo-500 text-white px-4 py-1.5 rounded-lg hover:bg-indigo-600 transition-colors flex items-center gap-2 disabled:bg-indigo-300"
          >
            {isLoadingActions ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <Search size={16} />
            )}
            Actions
          </button>
        </div>
        <span className="text-lg">입니다.</span>
      </div>

      {error && (
        <div className="text-red-500 text-sm">{error}</div>
      )}

      {jobActions.length > 0 && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <h3 className="font-medium text-gray-700">직업 관련 행동</h3>
          
          {jobActions.map((action, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={selectedOptions[`action${index}`] || false}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [`action${index}`]: e.target.checked,
                  }))
                }
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center
                ${
                  selectedOptions[`action${index}`]
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOptions[`action${index}`] && (
                  <Check size={16} className="text-white" />
                )}
              </div>
              <span>{action}</span>
            </label>
          ))}

          <div className="space-y-2 border-t border-gray-200 pt-4 mt-4">
            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={selectedOptions.custom || false}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    custom: e.target.checked,
                  }))
                }
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center
                ${
                  selectedOptions.custom
                    ? "bg-indigo-500 border-indigo-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOptions.custom && (
                  <Check size={16} className="text-white" />
                )}
              </div>
              <span>직접 입력하기</span>
            </label>
            {selectedOptions.custom && (
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="직업과 관련된 행동을 입력해주세요"
                className="ml-9 w-full border-2 border-gray-300 rounded p-2 text-sm focus:border-indigo-500 outline-none"
              />
            )}
          </div>
        </div>
      )}

      {jobActions.length > 0 && (
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-indigo-500 text-white rounded-lg py-3 px-4 hover:bg-indigo-600 transition-colors flex items-center justify-center space-x-2 disabled:bg-indigo-300"
        >
          {isLoading ? (
            <>
              <Loader2 size={20} className="animate-spin" />
              <span>Creating DreamLens...</span>
            </>
          ) : (
            <>
              <Wand size={20} />
              <span>Create DreamLens</span>
            </>
          )}
        </button>
      )}
    </form>
  );
}