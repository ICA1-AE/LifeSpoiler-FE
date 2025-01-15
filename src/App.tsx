import React, { useState } from "react";
import { Clapperboard, BookOpen, Wand } from "lucide-react";
import { RecoilRoot } from 'recoil';
import PixStory from "./components/PixStory";
import DreamLens from "./components/DreamLens";
import { Intro } from "./components/Intro";
import ImageInterpolation from "./components/FlipBook/ImageInterplation";
import { APIKeyManager } from "./components/Sidebar/APIKeyManager";

type Service = "intro" | "pixstory" | "dreamlens" | "flipbook";
type Tab = "pixstory" | "dreamlens";

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<Service>("intro");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pixstory");

  const handleImageUpload = (newImage: string) => {
    setImages((prev) => [...prev, newImage]);
  };

  const handleReorder = (newOrder: string[]) => {
    setImages(newOrder);
  };

  const handleImageDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleStartStory = () => {
    setIsEditing(true);
    setCurrentView(activeTab);
  };

  const renderContent = () => {
    switch (currentView) {
      case "dreamlens":
        return <DreamLens onFlipBook={() => setCurrentView("flipbook")} />;
      case "intro":
        return <Intro onStartStory={handleStartStory} activeTab={activeTab} />;
      case "pixstory":
        return (
          <PixStory
            images={images}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            onReorder={handleReorder}
            isEditing={isEditing}
            onEditingChange={setIsEditing}
            onDreamLens={() => setCurrentView("dreamlens")}
          />
        );
      case "flipbook":
        return <ImageInterpolation />;
      default:
        return <div>Error: Unknown view</div>;
    }
  };

  return (
    <RecoilRoot>
      <div className="min-h-screen bg-gray-50">
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10">
          <div className="h-16 flex items-center justify-center">
            <button
              onClick={() => {
                setCurrentView("intro");
                setImages([]);
                setIsEditing(false);
              }}
              className="
                group
                flex items-center gap-2
                text-2xl font-bold text-gray-900
                hover:text-indigo-600
                transition-colors
              "
            >
              <Clapperboard className="text-indigo-600 group-hover:scale-110 transition-transform" />
              Life Spoiler
            </button>
          </div>
        </header>

        <nav className="fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg w-[240px] flex flex-col">
          <div className="flex-1 py-8 px-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("pixstory");
                  setCurrentView("intro");
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    activeTab === "pixstory"
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <BookOpen size={20} className="shrink-0" />
                <div className="text-left">
                  <span className="block font-medium">PixStory</span>
                  <span className="text-xs opacity-75">과거의 이야기</span>
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab("dreamlens");
                  setCurrentView("intro");
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3 rounded-lg
                  transition-all duration-200
                  ${
                    activeTab === "dreamlens"
                      ? "bg-indigo-50 text-indigo-600 shadow-sm"
                      : "text-gray-600 hover:bg-gray-50"
                  }
                `}
              >
                <Wand size={20} className="shrink-0" />
                <div className="text-left">
                  <span className="block font-medium">DreamLens</span>
                  <span className="text-xs opacity-75">미래의 이야기</span>
                </div>
              </button>
            </div>
          </div>
          <APIKeyManager />
        </nav>

        <main className="ml-[240px] pt-24 px-8 py-8">
          <div className="max-w-[1200px] mx-auto">
            {renderContent()}
          </div>
        </main>
      </div>
    </RecoilRoot>
  );
}

export default App;