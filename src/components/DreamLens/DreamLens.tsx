import React, { useState } from "react";
import { Check } from "lucide-react";

export function DreamLens() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [customText, setCustomText] = useState("");
  const [selectedOptions, setSelectedOptions] = useState({
    custom: false,
    suggested1: false,
    suggested2: false,
  });

  const handleKeyDown = async (e) => {
    if (e.key === "Enter") {
      e.preventDefault();

      // 실제 구현시에는 여기서 백엔드 API를 호출합니다
      try {
        // const response = await fetch('/api/generate-suggestions', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({ dream: input })
        // });
        // const data = await response.json();
        // setSuggestions(data.suggestions);

        // 백엔드 연동 전 테스트용 더미 데이터
        setSuggestions([
          `${input}을(를) 위한 첫 번째 제안사항입니다.`,
          `${input}을(를) 위한 두 번째 제안사항입니다.`,
        ]);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = {
      dream: input,
      customText: selectedOptions.custom ? customText : "",
      selectedSuggestions: Object.entries(selectedOptions)
        .filter(([key, value]) => value && key !== "custom")
        .map(([key]) => suggestions[parseInt(key.slice(-1)) - 1]),
    };
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="text-lg flex items-center">
          <span>내 꿈은</span>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="border-b-2 border-gray-300 focus:border-blue-500 outline-none px-2 py-1 mx-2 flex-1"
            placeholder="꿈을 입력하고 Enter를 누르세요"
          />
          <span>입니다.</span>
        </div>

        {suggestions.length > 0 && (
          <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center space-x-2">
              <label className="flex items-center space-x-2">
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
                <span>직접 적기</span>
              </label>
              {selectedOptions.custom && (
                <input
                  type="text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  className="flex-1 border-2 border-gray-300 rounded p-2 focus:border-blue-500 outline-none"
                  placeholder="직접 입력해주세요"
                />
              )}
            </div>

            {suggestions.map((suggestion, index) => (
              <label key={index} className="flex items-center space-x-2">
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
          </div>
        )}

        {suggestions.length > 0 && (
          <button
            type="submit"
            className="w-full bg-blue-500 text-white rounded-lg py-3 px-4 hover:bg-blue-600 transition-colors"
          >
            Create DreamLens
          </button>
        )}
      </form>
    </div>
  );
}
