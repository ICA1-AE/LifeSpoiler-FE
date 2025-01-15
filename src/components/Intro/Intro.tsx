import React from 'react';
import { StartButton } from './Button';
import { Content } from './Content';

interface IntroProps {
  onStartStory: () => void;
  activeTab: "pixstory" | "dreamlens";
}

export function Intro({ onStartStory, activeTab }: IntroProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <Content activeTab={activeTab} />
      <div className="flex justify-center mt-10">
        <StartButton onClick={onStartStory} activeTab={activeTab} />
      </div>
    </div>
  );
}