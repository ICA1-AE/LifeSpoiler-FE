import React, { useState } from "react";
import { Check, Book, Loader2, Search } from "lucide-react";
import { FormData, SelectedOptions, EditorState, JobActionsResponse } from "./types";

interface DreamLensEditorProps {
  onSubmit: (data: FormData, currentState: EditorState) => void;
  initialState: EditorState;
}

export function DreamLensEditor({ onSubmit, initialState }: DreamLensEditorProps) {
  const [customText, setCustomText] = useState(initialState.customText);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialState.selectedOptions);
  const [jobTitle, setJobTitle] = useState(initialState.jobTitle || '');
  const [jobActions, setJobActions] = useState<string[]>(initialState.jobActions || []);
  const [isLoadingActions, setIsLoadingActions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleJobTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 10) {
      setJobTitle(value);
      // Reset everything when job title changes
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

    setIsLoadingActions(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:8600/generate-job-actions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ job_title: jobTitle }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch job actions');
      }

      const data: JobActionsResponse = await response.json();
      setJobActions(data.actions);
      // Reset selections when new actions are fetched
      setSelectedOptions({});
      setCustomText('');
    } catch (err) {
      setError('직업 관련 행동을 가져오는데 실패했습니다.');
      console.error(err);
    } finally {
      setIsLoadingActions(false);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const selectedActions = Object.entries(selectedOptions)
      .filter(([key, value]) => value)
      .map(([key]) => {
        if (key === 'custom') {
          return customText;
        }
        const index = parseInt(key.replace('action', ''));
        return jobActions[index];
      })
      .filter(action => action);

    if (selectedActions.length === 0) {
      alert("최소한 하나의 행동을 선택해주세요.");
      return;
    }

    const formData: FormData = {
      dream: jobTitle,
      customText: "",
      selectedSuggestions: selectedActions,
    };
    
    const currentState: EditorState = {
      input: jobTitle,
      suggestions: selectedActions,
      customText,
      selectedOptions,
      jobTitle,
      jobActions,
    };
    
    onSubmit(formData, currentState);
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
            maxLength={10}
            className="w-32 border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1 text-center"
            placeholder="직업 입력"
          />
          <button
            type="button"
            onClick={fetchJobActions}
            disabled={isLoadingActions || !jobTitle.trim()}
            className="bg-blue-500 text-white px-4 py-1.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2 disabled:bg-blue-300"
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
                checked={selectedOptions[`action${index}`]}
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
                    ? "bg-blue-500 border-blue-500"
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
                checked={selectedOptions.custom}
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
                    ? "bg-blue-500 border-blue-500"
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
                className="ml-9 w-full border-2 border-gray-300 rounded p-2 text-sm focus:border-blue-500 outline-none"
              />
            )}
          </div>
        </div>
      )}

      {jobActions.length > 0 && (
        <button
          type="submit"
          className="w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Book size={20} />
          <span>Create DreamLens</span>
        </button>
      )}
    </form>
  );
}