import React, { useState } from "react";
import { useRecoilValue } from 'recoil';
import DreamLensEditor from "./DreamLensEditor";
import DreamLensViewer from "./DreamLensViewer";
import { openAIKeyState, userNameState } from '../../store/atoms';
import { generateJobActions, generateDalle3Image } from '../../utils/openai';
import { processInParallelWithRateLimit } from '../../utils/async';
import type { FormData, DreamLensData, DreamLensImage } from "./types";

interface DreamLensProps {
  onFlipBook: () => void;
}

function DreamLens({ onFlipBook }: DreamLensProps) {
  const [editorState, setEditorState] = useState<EditorState>({
    input: "",
    suggestions: [],
    customText: "",
    selectedOptions: {
      custom: false,
    },
    jobTitle: "",
    jobActions: [],
  });
  const [dreamLensData, setDreamLensData] = useState<DreamLensData | null>(null);
  const [isEditing, setIsEditing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const openAIKey = useRecoilValue(openAIKeyState);
  const userName = useRecoilValue(userNameState);

  const handleEditorSubmit = async (data: FormData) => {
    if (!userName) {
      setError("사용자 이름을 먼저 설정해주세요.");
      return;
    }

    if (!openAIKey) {
      setError("OpenAI API 키를 먼저 설정해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const generatedImages: DreamLensImage[] = [];

      // Generate images for each selected action
      const imagePrompts = data.selectedSuggestions.map(action => ({
        action,
        prompt: `A professional photo of a person as ${data.dream} who is ${action}. The scene should be realistic and detailed.`
      }));

      setProgress({ current: 0, total: imagePrompts.length });

      const imageResults = await processInParallelWithRateLimit(
        imagePrompts,
        async ({ prompt, action }) => {
          try {
            const result = await generateDalle3Image(prompt, openAIKey);
            console.log(`Image generated for action: ${action}`);
            setProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null);
            return result;
          } catch (err) {
            console.error(`Error generating image for action: ${action}`, err);
            throw new Error(`이미지 생성 실패: ${err instanceof Error ? err.message : '알 수 없는 오류'}`);
          }
        },
        300 // 300ms minimum delay between API calls
      );

      generatedImages.push(...imageResults);

      // Save the current state for editing later
      setEditorState(prev => ({
        ...prev,
        jobTitle: data.dream,
        jobActions: editorState.jobActions,
        selectedOptions: data.selectedOptions,
        customText: data.customText,
      }));

      setDreamLensData({
        userName,
        jobTitle: data.dream,
        selectedActions: data.selectedSuggestions,
        images: generatedImages,
        story: "" // Empty string since we're not generating stories
      });

      setIsEditing(false);
    } catch (error) {
      console.error("Error in DreamLens creation:", error);
      setError(error instanceof Error ? error.message : "DreamLens 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
      setProgress(null);
    }
  };

  const handleEdit = () => {
    if (dreamLensData) {
      setEditorState(prev => ({
        ...prev,
        jobTitle: dreamLensData.jobTitle,
        jobActions: prev.jobActions,
        selectedOptions: prev.selectedOptions,
        customText: prev.customText,
      }));
    }
    setIsEditing(true);
  };

  const handleJobActionsUpdate = (actions: string[]) => {
    setEditorState(prevState => ({
      ...prevState,
      jobActions: actions,
    }));
  };

  return (
    <>
      {isEditing ? (
        <DreamLensEditor 
          onSubmit={handleEditorSubmit} 
          initialState={editorState}
          openAIKey={openAIKey}
          isLoading={isLoading}
          onJobActionsUpdate={handleJobActionsUpdate}
          userName={userName}
          progress={progress}
        />
      ) : dreamLensData && (
        <DreamLensViewer 
          data={dreamLensData}
          onEdit={handleEdit}
          onDreamLens={onFlipBook}
        />
      )}
      {error && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}
    </>
  );
}

export default DreamLens;