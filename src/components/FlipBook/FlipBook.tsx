import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, RefreshCcw } from 'lucide-react';
import './FlipBook.css'; // CSS 파일 추가

interface FlipBookProps {
  images: string[];
}

const FlipBook = ({ images }: FlipBookProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;

    if (isPlaying && images.length > 0 && !isFinished) {
      interval = setInterval(() => {
        setCurrentIndex((prev) => {
          if (prev + 1 >= images.length) {
            setIsPlaying(false);
            setIsFinished(true);
            return prev;
          }
          return prev + 1;
        });
      }, 100); // Adjust speed as needed
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, images.length, isFinished]);

  const handleRefresh = () => {
    setCurrentIndex(0);
    setIsFinished(false);
    setIsPlaying(false);
  };

  return (
    <div className="flipbook-container">
      <div className="flipbook">
        {images.map((image, index) => (
          <div
            key={index}
            className={`page ${index < currentIndex ? 'stacked' : ''} ${
              index === currentIndex ? 'visible' : ''
            }`}
            style={{ backgroundImage: `url(${image})` }}
          ></div>
        ))}
      </div>

      <div className="controls">
        <button onClick={() => setCurrentIndex(0)} disabled={isFinished}>
          <SkipBack size={24} />
        </button>

        {!isFinished ? (
          <button onClick={() => setIsPlaying(!isPlaying)}>
            {isPlaying ? <Pause size={24} /> : <Play size={24} />}
          </button>
        ) : (
          <button onClick={handleRefresh}>
            <RefreshCcw size={24} />
          </button>
        )}

        <button
          onClick={() => setCurrentIndex(images.length - 1)}
          disabled={isFinished}
        >
          <SkipForward size={24} />
        </button>
      </div>

      <div className="progress">
        <input
          type="range"
          min={0}
          max={images.length - 1}
          value={currentIndex}
          onChange={(e) => setCurrentIndex(parseInt(e.target.value))}
          disabled={isFinished}
        />
      </div>
    </div>
  );
};

export default FlipBook;
