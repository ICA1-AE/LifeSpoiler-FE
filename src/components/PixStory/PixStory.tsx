import React, { useState } from "react";
import { useRecoilValue } from 'recoil';
import PixStoryEditor from "./PixStoryEditor";
import PixStoryViewer from "./PixStoryViewer";
import { openAIKeyState, userNameState } from '../../store/atoms';
import { generateImageCaption, generatePixStoryNovel } from '../../utils/openai';
import { processInParallelWithRateLimit } from '../../utils/async';
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
  const [isGeneratingStory, setIsGeneratingStory] = useState(false);
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const openAIKey = useRecoilValue(openAIKeyState);
  const userName = useRecoilValue(userNameState);

  const handleCreatePixstory = async (data: FormData) => {
    if (!userName) {
      setError("사용자 이름을 먼저 설정해주세요.");
      return;
    }

    if (!openAIKey) {
      setError("OpenAI API 키를 먼저 설정해주세요.");
      return;
    }

    if (images.length === 0) {
      setError("이미지를 먼저 업로드해주세요.");
      return;
    }

    setIsLoading(true);
    setError(null);
    setProgress({ current: 0, total: images.length });

    try {
      // Generate captions for all images in parallel with rate limiting
      const captionResults = await processInParallelWithRateLimit(
        images,
        async (image, index) => {
          try {
            const caption = await generateImageCaption(image, openAIKey);
            console.log(`Caption generated for image ${index + 1}:`, caption);
            setProgress(prev => prev ? { ...prev, current: prev.current + 1 } : null);
            return { index, caption };
          } catch (err) {
            console.error(`Error generating caption for image ${index + 1}:`, err);
            throw new Error(`이미지 ${index + 1}의 캡션 생성에 실패했습니다. ${err instanceof Error ? err.message : ''}`);
          }
        },
        300 // 300ms minimum delay between API calls
      );

      // Convert results to captions object
      const captions = captionResults.reduce((acc, { index, caption }) => {
        acc[index] = caption;
        return acc;
      }, {} as { [key: number]: string });

      // Switch to story generation state
      setProgress(null);
      setIsGeneratingStory(true);

      // Generate novel using captions
      try {
        const novel = await generatePixStoryNovel(
          captions,
          {
            characterName: userName,
            genre: data.genre,
          },
          openAIKey
        );

        setStoryData({
          metadata: {
            characterName: userName,
            genre: data.genre,
          },
          captions,
          novel,
        });
        onEditingChange(false);
      } catch (err) {
        console.error("Error generating novel:", err);
        throw new Error(`스토리 생성에 실패했습니다. ${err instanceof Error ? err.message : ''}`);
      }
    } catch (err) {
      console.error("Error in story creation process:", err);
      setError(err instanceof Error ? err.message : "스토리 생성 중 오류가 발생했습니다. 다시 시도해주세요.");
    } finally {
      setIsLoading(false);
      setIsGeneratingStory(false);
      setProgress(null);
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
      isGeneratingStory={isGeneratingStory}
      progress={progress}
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