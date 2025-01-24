import React, { useState } from "react";
import { Clapperboard, BookOpen, Wand, Menu, X } from "lucide-react";
import { RecoilRoot } from 'recoil';
import PixStory from "./components/PixStory";
import DreamLens from "./components/DreamLens";
import { Intro } from "./components/Intro";
import { APIKeyManager } from "./components/Sidebar/APIKeyManager";

type Service = "intro" | "pixstory" | "dreamlens";
type Tab = "pixstory" | "dreamlens";

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<Service>("intro");
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>("pixstory");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
        <header className="fixed top-0 left-0 right-0 bg-white shadow-sm z-10"> {/* z-index 수정 */}
          <div className="h-16 flex items-center px-4">
            <button
              onClick={toggleSidebar}
              className="mr-4 text-gray-600 hover:text-gray-900 transition-colors"
            >
              {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
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

        <nav 
          className={`
            fixed left-0 top-16 h-[calc(100vh-4rem)] bg-white shadow-lg z-20
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
            w-full sm:w-[320px]
          `}
        >
          <div className="flex-1 py-8 px-4">
            <div className="space-y-2">
              <button
                onClick={() => {
                  setActiveTab("pixstory");
                  setCurrentView("intro");
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
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
                  if (window.innerWidth < 640) setIsSidebarOpen(false);
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

        <main 
          className={`
            transition-all duration-300 ease-in-out
            ${isSidebarOpen ? 'sm:ml-[320px]' : 'ml-0'}
            pt-24 px-4 sm:px-8 py-8
          `}
        >
          <div className="max-w-[1200px] mx-auto">
            {renderContent()}
          </div>
        </main>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/20 z-[5] sm:hidden"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </RecoilRoot>
  );
}

export default App;