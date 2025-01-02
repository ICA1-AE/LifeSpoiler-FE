import React from 'react';
import { StartButton } from './Button';
import { Content } from './Content';

interface IntroProps {
  onStartStory: () => void;
}

export function Intro({ onStartStory }: IntroProps) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-8">
      <Content />
      <div className="flex justify-center mt-10">
        <StartButton onClick={onStartStory} />
      </div>
    </div>
  );
}