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

      const response = await fetch('http://localhost:8000/interpolate/', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Upload failed');

      const data: InterpolationResponse = await response.json();
      setImages(data.interpolated_images);
      setShowFlipBook(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
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

      {showFlipBook ? (
        <FlipBook images={images} />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {images.map((image, index) => (
            <div key={index} className="aspect-square">
              <img
                src={`http://localhost:8000${image}`}
                alt={`Interpolated ${index + 1}`}
                className="w-full h-full object-cover rounded shadow-md hover:shadow-lg transition-shadow"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageInterpolation;