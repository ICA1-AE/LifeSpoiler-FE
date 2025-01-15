import React from 'react';
import { BookOpen } from 'lucide-react';

interface StartButtonProps {
  onClick: () => void;
  activeTab: "pixstory" | "dreamlens";
}

export function StartButton({ onClick, activeTab }: StartButtonProps) {
  return (
    <button
      onClick={onClick}
      className="group
        bg-gradient-to-r from-violet-500 to-indigo-500
        text-white
        px-6 py-3
        rounded-full
        shadow-lg
        hover:shadow-indigo-500/25
        transition-all duration-200
        transform hover:scale-105
        active:scale-95
        flex items-center gap-3
        font-medium"
    >
      <BookOpen size={20} className="group-hover:animate-pulse"/>
      {activeTab === "pixstory" ? "Start PixStory" : "Start DreamLens"}
    </button>
  );
}