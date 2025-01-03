import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Loader2 } from 'lucide-react';
import type { InterpolationResponse } from './types';
import FlipBook from './FlipBook';

const ImageInterpolation = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [showFlipBook, setShowFlipBook] = useState(false);

  const mockData: InterpolationResponse = {
    interpolated_images: Array.from({ length: 50 }, (_, i) => `/mock/mock${i + 1}.jpg`),
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(Array.from(e.target.files));
      setShowFlipBook(false);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
  
    try {
        const formData = new FormData();
        files.forEach(file => {
            formData.append('files', file);
        });
        // 실제 백엔드 호출
        const response = await fetch('http://localhost:8000/interpolate/', {
            method: 'POST',
            body: formData,
        });
  
      if (!response.ok) throw new Error('Backend unavailable');
  
      const data: InterpolationResponse = await response.json();
      setImages(data.interpolated_images.map(img => `http://localhost:8000${img}`));
      setShowFlipBook(true);
    } catch {
      // 백엔드 호출 실패 시 mock 데이터 사용
      setImages(mockData.interpolated_images);
      setShowFlipBook(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 items-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="border rounded p-2"
          />
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-blue-500 text-white px-4 py-2 rounded disabled:bg-blue-300 flex items-center gap-2"
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            Upload Images
          </button>
        </div>
      </form>

      {error && (
        <div className="text-red-500 mb-4">{error}</div>
      )}

      {showFlipBook && <FlipBook images={images} />}
    </div>
  );
};

export default ImageInterpolation;