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
    interpolated_images: Array.from({ length: 2 }, (_, i) => `/mock/mock${i + 1}.jpg`),
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
    <div className="bg-white rounded-xl shadow-sm p-8 max-w-[1024px] mx-auto">
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4 items-center">
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1 border rounded-lg p-2 text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
          <button
            type="submit"
            disabled={loading || files.length === 0}
            className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 disabled:bg-indigo-300"
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
}

export default ImageInterpolation;