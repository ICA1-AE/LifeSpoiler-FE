import React, { useState } from "react";
import { useRecoilValue } from 'recoil';
import { DreamLensEditor } from "./DreamLensEditor";
import { DreamLensViewer } from "./DreamLensViewer";
import { openAIKeyState, userNameState } from '../../store/atoms';
import { generateJobActions, generateDreamLensStory } from '../../utils/openai';
import type { FormData, EditorState, DreamLensData } from "./types";

interface DreamLensProps {
  onFlipBook: () => void;
}

function DreamLens({ onFlipBook }: DreamLensProps) {
  const [isEditing, setIsEditing] = useState(true);
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
  const [isLoading, setIsLoading] = useState(false);
  const openAIKey = useRecoilValue(openAIKeyState);
  const userName = useRecoilValue(userNameState);

  const handleEditorSubmit = async (data: FormData) => {
    if (!userName) {
      alert("사용자 이름을 먼저 설정해주세요.");
      return;
    }

    if (!openAIKey) {
      alert("OpenAI API 키를 먼저 설정해주세요.");
      return;
    }

    setIsLoading(true);
    try {
      const story = await generateDreamLensStory(
        data.selectedSuggestions,
        userName,
        data.dream,
        openAIKey
      );
      
      setDreamLensData({
        userName,
        jobTitle: data.dream,
        story,
      });

      // Save the current state including all job actions
      setEditorState(prevState => ({
        input: data.dream,
        suggestions: data.selectedSuggestions,
        customText: data.customText || "",
        selectedOptions: data.selectedOptions,
        jobTitle: data.dream,
        jobActions: prevState.jobActions, // Preserve all job actions, not just selected ones
      }));

      setIsEditing(false);
    } catch (error) {
      console.error("Error in story creation process:", error);
      alert(error instanceof Error ? error.message : "스토리 생성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = () => {
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
        />
      ) : dreamLensData && (
        <DreamLensViewer 
          data={dreamLensData}
          onEdit={handleEdit}
          onDreamLens={onFlipBook}
        />
      )}
    </>
  );
}

export default DreamLens;