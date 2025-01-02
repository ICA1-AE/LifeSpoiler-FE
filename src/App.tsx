import React, { useState, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import PixStory from './components/PixStory';
import DreamLens from './components/DreamLens';
import { Dream } from './components/DreamLens/types';
import { Intro } from './components/Intro';

function App() {
  const [images, setImages] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'pixstory' | 'dreamlens'>('pixstory');
  const [isEditing, setIsEditing] = useState(false);
  const [dreams, setDreams] = useState<Dream[]>(() => {
    const savedDreams = localStorage.getItem('dreams');
    return savedDreams ? JSON.parse(savedDreams) : [];
  });

  useEffect(() => {
    const handleHashChange = () => {
      const isDreamLens = window.location.hash === '#dreamlens';
      setCurrentView(isDreamLens ? 'dreamlens' : 'pixstory');
      if (!isDreamLens) {
        setIsEditing(false);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange();

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  useEffect(() => {
    localStorage.setItem('dreams', JSON.stringify(dreams));
  }, [dreams]);

  const handleImageUpload = (newImage: string) => {
    setImages(prev => [...prev, newImage]);
  };

  const handleReorder = (newOrder: string[]) => {
    setImages(newOrder);
  };

  const handleImageDelete = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleStartStory = () => {
    setIsEditing(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 h-16 flex items-center justify-center">
          <button
            onClick={() => {
              setCurrentView('intro');
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
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dreamlens' ? (
          <DreamLens
            dreams={dreams}
            setDreams={setDreams}
          />
        ) : images.length === 0 && !isEditing ? (
          <Intro onStartStory={handleStartStory} />
        ) : (
          <PixStory
            images={images}
            onImageUpload={handleImageUpload}
            onImageDelete={handleImageDelete}
            onReorder={handleReorder}
            isEditing={isEditing}
            onEditingChange={setIsEditing}
          />
        )}
      </main>
    </div>
  );
}

export default App;