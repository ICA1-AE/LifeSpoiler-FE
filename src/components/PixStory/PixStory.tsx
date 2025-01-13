import React, { useState } from "react";
import PixStoryEditor from "./PixStoryEditor";
import PixStoryViewer from "./PixStoryViewer";
import type { FormData, PixStoryData } from "./types";

interface PixStoryProps {
  images: string[];
  onImageUpload: (image: string) => void;
  onImageDelete: (index: number) => void;
  onReorder: (newOrder: string[]) => void;
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  onDreamLens: () => void;
}

function PixStory({
  images,
  onImageUpload,
  onImageDelete,
  onReorder,
  isEditing,
  onEditingChange,
  onDreamLens,
}: PixStoryProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [storyData, setStoryData] = useState<PixStoryData>({
    metadata: null,
    captions: {},
    novel: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCreatePixstory = async (data: FormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();

      // Convert base64 images to files
      const imagePromises = images.map(async (base64String, index) => {
        const response = await fetch(base64String);
        const blob = await response.blob();
        return new File([blob], `image${index}.jpg`, { type: "image/jpeg" });
      });

      const imageFiles = await Promise.all(imagePromises);
      imageFiles.forEach((file) => {
        formData.append("images", file);
      });

      // Build URL with query parameters
      const url = new URL("http://localhost:8500/generate/");
      url.searchParams.append("name", data.characterName);
      url.searchParams.append("genre", data.genre);

      const response = await fetch(url.toString(), {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to generate story");
      }

      const result = await response.json();
      setStoryData({
        metadata: data,
        captions: result.captions,
        novel: result.novel,
      });
      onEditingChange(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate story");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditPixstory = () => {
    onEditingChange(true);
  };

  return isEditing ? (
    <PixStoryEditor
      images={images}
      selectedImageIndex={selectedImageIndex}
      onImageUpload={onImageUpload}
      onImageDelete={onImageDelete}
      onReorder={onReorder}
      onImageSelect={setSelectedImageIndex}
      onSave={handleCreatePixstory}
      isLoading={isLoading}
      error={error}
    />
  ) : (
    <PixStoryViewer
      images={images}
      storyData={storyData}
      onEdit={handleEditPixstory}
      onDreamLens={onDreamLens}
    />
  );
}

export default PixStory;