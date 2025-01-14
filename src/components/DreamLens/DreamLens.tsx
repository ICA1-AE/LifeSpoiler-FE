import React, { useState } from "react";
import { DreamLensEditor } from "./DreamLensEditor";
import { DreamLensViewer } from "./DreamLensViewer";
import CreateStoryModal from "./CreateStoryModal";
import type { FormData, EditorState, CreateStoryModalData, DreamLensData } from "./types";

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
  });
  const [showModal, setShowModal] = useState(false);
  const [dreamLensData, setDreamLensData] = useState<DreamLensData | null>(null);
  const [tempFormData, setTempFormData] = useState<FormData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleEditorSubmit = (data: FormData, currentState: EditorState) => {
    setTempFormData(data);
    setEditorState(currentState);
    setShowModal(true);
  };

  const handleModalSubmit = async (modalData: CreateStoryModalData) => {
    if (!tempFormData) return;

    setShowModal(false); // Close modal immediately
    setIsLoading(true); // Start loading state

    try {
      const response = await fetch('http://localhost:8600/generate-story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          job_actions: tempFormData.selectedSuggestions,
          user_name: modalData.userName,
          genre: modalData.genre,
          job_title: tempFormData.dream,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate story');
      }

      const result = await response.json();
      
      setDreamLensData({
        userName: modalData.userName,
        genre: modalData.genre,
        jobTitle: tempFormData.dream,
        story: result.story,
      });
      
      setIsEditing(false);
    } catch (error) {
      console.error('Failed to generate story:', error);
      alert('스토리 생성에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {isEditing ? (
        <DreamLensEditor 
          onSubmit={handleEditorSubmit} 
          initialState={editorState}
          isLoading={isLoading}
        />
      ) : dreamLensData && (
        <DreamLensViewer 
          data={dreamLensData}
          onEdit={() => setIsEditing(true)}
          onDreamLens={onFlipBook}
        />
      )}

      {showModal && (
        <CreateStoryModal
          onClose={() => setShowModal(false)}
          onSubmit={handleModalSubmit}
        />
      )}
    </>
  );
}

export default DreamLens;