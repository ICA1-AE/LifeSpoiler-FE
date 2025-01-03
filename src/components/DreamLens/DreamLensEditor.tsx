import React, { useState, useEffect } from "react";
import { Check, Book } from "lucide-react";
import { FormData, SelectedOptions, EditorState } from "./types";
import { getSubjectParticle, getObjectParticle } from "../../utils/attatchParticle";

interface DreamLensEditorProps {
  onSubmit: (data: FormData, currentState: EditorState) => void;
  initialState: EditorState;
}

export function DreamLensEditor({ onSubmit, initialState }: DreamLensEditorProps) {
  const [input, setInput] = useState(initialState.input);
  const [suggestions, setSuggestions] = useState<string[]>(initialState.suggestions);
  const [customText, setCustomText] = useState(initialState.customText);
  const [showInput, setShowInput] = useState(initialState.suggestions.length > 0);
  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>(initialState.selectedOptions);

  useEffect(() => {
    // 초기 상태에 제안사항이 있으면 바로 보여주기
    if (initialState.suggestions.length > 0) {
      setSuggestions(initialState.suggestions);
      setShowInput(true);
    }
  }, [initialState]);

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();
      setShowInput(true);
      // 실제 구현시에는 여기서 백엔드 API를 호출합니다
      const newSuggestions = [
        `${input}을(를) 위한 첫 번째 제안사항입니다.`,
        `${input}을(를) 위한 두 번째 제안사항입니다.`,
      ];
      setSuggestions(newSuggestions);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setInput(newInput);
    if (newInput !== initialState.input) {
      setSuggestions([]);
      setShowInput(false);
      setSelectedOptions({
        custom: false,
        suggested1: false,
        suggested2: false,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const hasSelectedSuggestions = Object.entries(selectedOptions).some(
      ([key, value]) => value && key !== "custom"
    );
    const hasCustomText = selectedOptions.custom && customText.trim() !== "";
    
    if (!hasSelectedSuggestions && !hasCustomText) {
      alert("최소한 하나의 항목을 선택하거나 직접 입력해주세요.");
      return;
    }

    const formData: FormData = {
      dream: input,
      customText: selectedOptions.custom ? customText : "",
      selectedSuggestions: Object.entries(selectedOptions)
        .filter(([key, value]) => value && key !== "custom")
        .map(([key]) => suggestions[parseInt(key.slice(-1)) - 1]),
    };
    
    const currentState: EditorState = {
      input,
      suggestions,
      customText,
      selectedOptions,
    };
    
    onSubmit(formData, currentState);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-lg flex items-center">
        <span>내 꿈은</span>
        <input
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1 mx-4 min-w-[300px]"
          placeholder="꿈을 입력하고 Enter를 누르세요"
        />
        <span>입니다.</span>
      </div>

      {showInput && suggestions.length > 0 && (
        <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center space-x-2 mb-4">
            <span className="text-lg">
              {input}
              {getSubjectParticle(input)} 되어서
            </span>
          </div>

          {suggestions.map((suggestion, index) => (
            <label key={index} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <input
                type="checkbox"
                checked={selectedOptions[`suggested${index + 1}`]}
                onChange={(e) =>
                  setSelectedOptions((prev) => ({
                    ...prev,
                    [`suggested${index + 1}`]: e.target.checked,
                  }))
                }
                className="hidden"
              />
              <div
                className={`w-5 h-5 border-2 rounded flex items-center justify-center
                ${
                  selectedOptions[`suggested${index + 1}`]
                    ? "bg-blue-500 border-blue-500"
                    : "border-gray-300"
                }`}
              >
                {selectedOptions[`suggested${index + 1}`] && (
                  <Check size={16} className="text-white" />
                )}
              </div>
              <span>{suggestion}</span>
            </label>
          ))}

          <div className="flex items-center space-x-2">
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
                {selectedOptions.custom && <Check size={16} className="text-white" />}
              </div>
              <span>직접 적기</span>
            </label>
            {selectedOptions.custom && (
              <input
                type="text"
                value={customText}
                onChange={(e) => setCustomText(e.target.value)}
                className="flex-1 border-2 border-gray-300 rounded p-2 h-8 focus:border-blue-500 outline-none"
                placeholder="직접 입력해주세요"
              />
            )}
          </div>
        </div>
      )}

      {suggestions.length > 0 && (
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