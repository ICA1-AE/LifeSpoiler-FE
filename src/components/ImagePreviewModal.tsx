import React, { useEffect } from 'react';
import { X } from 'lucide-react';

interface ImagePreviewModalProps {
  image: string;
  onClose: () => void;
}

function ImagePreviewModal({ image, onClose }: ImagePreviewModalProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
      onClick={onClose}
    >
      <button 
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
      >
        <X size={32} />
      </button>
      <img
        src={image}
        alt="Full screen preview"
        className="max-h-[90vh] max-w-[90vw] object-contain"
        onClick={e => e.stopPropagation()}
      />
    </div>
  );
}

export default ImagePreviewModal;