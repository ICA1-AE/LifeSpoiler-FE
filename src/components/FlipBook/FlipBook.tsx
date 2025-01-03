import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward } from 'lucide-react';

interface FlipBookProps {
  images: string[];
}

const FlipBook = ({ images }: FlipBookProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (isPlaying && images.length > 0) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }, 100);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, images.length]);

  return (
    <div className="flex flex-col items-center gap-4 mx-auto" style={{ width: '400px' }}>
      <div className="relative" style={{ width: '400px', height: '400px' }}>
        <img
          src={`http://localhost:8000${images[currentIndex]}`}
          alt={`Frame ${currentIndex + 1}`}
          className="w-full h-full object-contain"
        />
      </div>
      
      <div className="flex items-center gap-4">
        <button
          onClick={() => setCurrentIndex(0)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <SkipBack size={24} />
        </button>
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-2 rounded hover:bg-gray-100"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <button
          onClick={() => setCurrentIndex(images.length - 1)}
          className="p-2 rounded hover:bg-gray-100"
        >
          <SkipForward size={24} />
        </button>
      </div>
      
      <div className="w-full">
        <input
          type="range"
          min={0}
          max={images.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
          className="w-full"
        />
      </div>
      
      <div className="text-sm text-gray-500">
        Frame {currentIndex + 1} of {images.length}
      </div>
    </div>
  );
};

export default FlipBook;