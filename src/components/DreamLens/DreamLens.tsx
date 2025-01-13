import React, { useState } from "react";
import { DreamLensEditor } from "./DreamLensEditor";
import { DreamLensViewer } from "./DreamLensViewer";
import { FormData, EditorState } from "./types";

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
      suggested1: false,
      suggested2: false,
    },
  });
  const [formData, setFormData] = useState<FormData | null>(null);

  const handleFormSubmit = (data: FormData, currentState: EditorState) => {
    setFormData(data);
    setEditorState(currentState);
    setIsEditing(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      {isEditing ? (
        <DreamLensEditor 
          onSubmit={handleFormSubmit} 
          initialState={editorState}
        />
      ) : (
        <DreamLensViewer 
          data={formData!} 
          onEdit={() => setIsEditing(true)}
          onFlipBook={onFlipBook}
        />
      )}
    </div>
  );
}

export default DreamLens;