import React, { useState, useEffect } from "react";
import { BookOpen } from "lucide-react";
import PixStory from "./components/PixStory";
import DreamLens from "./components/DreamLens";
import { Intro } from "./components/Intro";
import ImageInterpolation from "./components/FlipBook/ImageInterplation";

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<
    "intro" | "pixstory" | "dreamlens" | "flipbook"
  >("intro");
  const [isEditing, setIsEditing] = useState(false);

  

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
    setCurrentView("pixstory");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
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
            <BookOpen className="text-indigo-600 group-hover:scale-110 transition-transform" />
            Life Spoiler
          </button>
          <button
            onClick={() => setCurrentView("flipbook")}
            className="mb-6 bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg transition-colors"
          >
            Flip Book
          </button>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {(() => {
          if (currentView === "dreamlens") {
            console.log("DreamLens");
            return <DreamLens />;
          } else if (currentView === "intro") {
            console.log("Intro");
            return <Intro onStartStory={handleStartStory} />;
          } else if (currentView === "pixstory") {
            console.log("PixStory");
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
          } else if (currentView === "flipbook") { 
            console.log("FlipBook");
            return <ImageInterpolation />;
          } else {
            return <div>Error: Unknown view</div>;
          }
        })()}
      </main>
    </div>
  );
}

export default App;
