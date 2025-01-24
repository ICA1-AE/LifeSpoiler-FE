import React from "react";
import { Pencil, Download } from "lucide-react";
import html2pdf from 'html2pdf.js';
import PixStorySection from "./PixStorySection";
import type { PixStoryData } from "./types";

const genreBackgrounds: { [key: string]: string } = {
  '판타지': './images/ps-fantasy.png',
  'SF': './images/ps-sf.png',
  '로맨스': './images/ps-romance.png',
  '미스터리': './images/ps-mystery.png',
  '모험': './images/ps-adventure.png',
};

interface PixStoryViewerProps {
  images: string[];
  storyData: PixStoryData;
  onEdit: () => void;
  onDreamLens: () => void;
}

function PixStoryViewer({ images, storyData, onEdit }: PixStoryViewerProps) {
  const handleDownloadPDF = () => {
    const element = document.getElementById('pixstory-content');
    const opt = {
      margin: 1,
      filename: `${storyData.metadata?.characterName || 'pixstory'}_story.pdf`,
      image: { 
        type: 'jpeg', 
        quality: 0.98 
      },
      html2canvas: { 
        scale: 2,
        letterRendering: true,
        useCORS: true,
        logging: false,
        onclone: function(clonedDoc) {
          const images = clonedDoc.getElementsByTagName('img');
          for (let img of images) {
            if (img.classList.contains('object-cover')) {
              img.style.position = 'static';
              img.style.width = 'auto';
              img.style.height = 'auto';
              img.style.maxWidth = '100%';
              img.style.maxHeight = '300px';
              img.style.margin = '0 auto';
              img.style.display = 'block';
            }
          }
        }
      },
      jsPDF: { 
        unit: 'in', 
        format: 'a4', 
        orientation: 'portrait'
      }
    };

    html2pdf().set(opt).from(element).save();
  };

  const backgroundImage = storyData.metadata?.genre ? genreBackgrounds[storyData.metadata.genre] : '';

  return (
    <div className="relative">
      <div className="absolute top-4 right-4 flex flex-col sm:flex-row gap-2 z-50">
        <button
          onClick={handleDownloadPDF}
          className="bg-indigo-600 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2 text-sm sm:text-base justify-center"
        >
          <Download size={16} />
          <span className="hidden sm:inline">Download PDF</span>
          <span className="sm:hidden">PDF</span>
        </button>
        <button
          onClick={onEdit}
          className="bg-white text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base justify-center"
        >
          <Pencil size={16} />
          <span className="hidden sm:inline">Edit PixStory</span>
          <span className="sm:hidden">Edit</span>
        </button>
      </div>

      <div 
        id="pixstory-content" 
        className="pt-20 sm:pt-0 min-h-screen"
      >
        <PixStorySection 
          images={images} 
          storyData={storyData}
          backgroundImage={backgroundImage}
        />
      </div>
    </div>
  );
}

export default PixStoryViewer;