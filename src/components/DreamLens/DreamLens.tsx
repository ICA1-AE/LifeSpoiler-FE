import React, { useState } from "react";
import { Check } from "lucide-react";

export function DreamLens() {
  const [input, setInput] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [customText, setCustomText] = useState("");
  const [showInput, setShowInput] = useState(false);

  interface SelectedOptions {
    custom: boolean;
    [key: string]: boolean;
  }

  const [selectedOptions, setSelectedOptions] = useState<SelectedOptions>({
    custom: false,
    suggested1: false,
    suggested2: false,
  });

  interface FormData {
    dream: string;
    customText: string;
    selectedSuggestions: string[];
  }

  const getParticle = (word: string) => {
    const lastChar = word.charAt(word.length - 1);
    const lastCharCode = lastChar.charCodeAt(0);
    const isConsonantEnding = (lastCharCode - 0xac00) % 28 !== 0;
    return isConsonantEnding ? "이" : "가";
  };

  const handleKeyDown = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && input.trim() !== "") {
      e.preventDefault();

      setShowInput(true);

      // 실제 구현시에는 여기서 백엔드 API를 호출합니다
      try {
        setSuggestions([
          `${input}을(를) 위한 첫 번째 제안사항입니다.`,
          `${input}을(를) 위한 두 번째 제안사항입니다.`,
        ]);
      } catch (error) {
        console.error("Failed to fetch suggestions:", error);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
    setSuggestions([]); // 입력이 변경될 때 suggestions 초기화
    setShowInput(false); // 입력이 변경될 때 showInput 초기화
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData: FormData = {
      dream: input,
      customText: selectedOptions.custom ? customText : "",
      selectedSuggestions: Object.entries(selectedOptions)
        .filter(([key, value]) => value && key !== "custom")
        .map(([key]) => suggestions[parseInt(key.slice(-1)) - 1]),
    };
    console.log("Form submitted:", formData);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
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
          <span> 입니다.</span>
        </div>

        {showInput && (
          <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
            <span className="text-lg flex justify-center min-w-[150px]">
              {input}
              {getParticle(input)} 되어서
            </span>
            <div className="space-y-3 w-full ml-10">
              {suggestions.length > 0 && (
                <>
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
                        className="flex-1 border-2 border-gray-300 rounded p-2 h-8 focus:border-blue-500 outline-none"
                        placeholder="직접 입력해주세요"
                      />
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {suggestions.length > 0 && !showInput && (
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
                  className="flex-1 border-2 border-gray-300 rounded p-2 h-8 focus:border-blue-500 outline-none"
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
