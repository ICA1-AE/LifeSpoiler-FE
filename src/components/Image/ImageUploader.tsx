import React from 'react';
import { ImagePlus } from 'lucide-react';

interface ImageUploaderProps {
  onImageUpload: (image: string) => void;
}

function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onImageUpload(reader.result as string);
      };
      reader.readAsDataURL(file);
    });

    // Reset input value to allow uploading the same files again
    e.target.value = '';
  };

  return (
    <div className="relative h-40 w-40">
      <input
        type="file"
        accept="image/*"
        multiple
        onChange={handleImageChange}
        className="absolute inset-0 opacity-0 cursor-pointer z-10"
      />
      <div className="h-40 w-full rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
        <ImagePlus className="text-gray-400 mb-2" size={32} />
        <span className="text-sm text-gray-500">Upload Images</span>
      </div>
    </div>
  );
}

export default ImageUploader;