import React, { useState, useRef } from 'react';
import { Pencil, Download, Loader2, Palette, RefreshCw, Columns } from 'lucide-react';
import html2canvas from 'html2canvas';
import type { DreamLensData, DreamLensImage } from './types';
import { generateDalle3Image } from '../../utils/openai';
import { useRecoilValue } from 'recoil';
import { openAIKeyState } from '../../store/atoms';

interface DreamLensViewerProps {
  data: DreamLensData;
  onEdit: () => void;
}

const BACKGROUND_COLORS = [
  { name: 'Pink', value: 'bg-pink-100' },
  { name: 'Blue', value: 'bg-blue-100' },
  { name: 'Green', value: 'bg-green-100' },
  { name: 'Purple', value: 'bg-purple-100' },
  { name: 'Yellow', value: 'bg-yellow-100' },
  { name: 'Orange', value: 'bg-orange-100' },
  { name: 'Teal', value: 'bg-teal-100' },
  { name: 'Indigo', value: 'bg-indigo-100' },
];

const BUTTON_COLORS = {
  'bg-pink-100': 'bg-pink-500 hover:bg-pink-600 disabled:bg-pink-400',
  'bg-blue-100': 'bg-blue-500 hover:bg-blue-600 disabled:bg-blue-400',
  'bg-green-100': 'bg-green-500 hover:bg-green-600 disabled:bg-green-400',
  'bg-purple-100': 'bg-purple-500 hover:bg-purple-600 disabled:bg-purple-400',
  'bg-yellow-100': 'bg-yellow-500 hover:bg-yellow-600 disabled:bg-yellow-400',
  'bg-orange-100': 'bg-orange-500 hover:bg-orange-600 disabled:bg-orange-400',
  'bg-teal-100': 'bg-teal-500 hover:bg-teal-600 disabled:bg-teal-400',
  'bg-indigo-100': 'bg-indigo-500 hover:bg-indigo-600 disabled:bg-indigo-400',
};

const BG_COLOR_TO_HEX = {
  'bg-pink-100': '#fce7f3',
  'bg-blue-100': '#dbeafe',
  'bg-green-100': '#dcfce7',
  'bg-purple-100': '#f3e8ff',
  'bg-yellow-100': '#fef9c3',
  'bg-orange-100': '#ffedd5',
  'bg-teal-100': '#ccfbf1',
  'bg-indigo-100': '#e0e7ff',
};

function DreamLensViewer({ data, onEdit }: DreamLensViewerProps) {
  const { userName, jobTitle, selectedActions, images } = data;
  const [isDownloading, setIsDownloading] = useState(false);
  const [backgroundColor, setBackgroundColor] = useState('bg-pink-100');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [refreshingIndices, setRefreshingIndices] = useState<Set<number>>(new Set());
  const [localImages, setLocalImages] = useState<DreamLensImage[]>(images);
  const [columns, setColumns] = useState(3); // Default to 3 columns
  const contentRef = useRef<HTMLDivElement>(null);
  const openAIKey = useRecoilValue(openAIKeyState);

  const cards = selectedActions.map((action, index) => ({
    action,
    image: localImages[index]
  }));

  const handleRefreshImage = async (index: number, action: string) => {
    if (refreshingIndices.has(index)) return;
    
    setRefreshingIndices(prev => new Set([...prev, index]));
    
    try {
      const result = await generateDalle3Image(
        `A professional photo of a person as ${jobTitle} who is ${action}. The scene should be realistic and detailed.`,
        openAIKey
      );
      
      setLocalImages(prev => {
        const newImages = [...prev];
        newImages[index] = {
          url: result.url,
          revisedPrompt: result.revisedPrompt
        };
        return newImages;
      });
    } catch (error) {
      console.error('Error refreshing image:', error);
    } finally {
      setRefreshingIndices(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    }
  };

  const handleDownload = async () => {
    if (!contentRef.current) return;
    setIsDownloading(true);

    try {
      const imageElements = contentRef.current.getElementsByTagName('img');
      await Promise.all(
        Array.from(imageElements).map(
          img => 
            new Promise((resolve, reject) => {
              if (img.complete) {
                resolve(null);
              } else {
                img.onload = () => resolve(null);
                img.onerror = reject;
              }
            })
        )
      );

      const canvas = await html2canvas(contentRef.current, {
        backgroundColor: BG_COLOR_TO_HEX[backgroundColor as keyof typeof BG_COLOR_TO_HEX],
        scale: 2,
        logging: false,
        useCORS: true,
        allowTaint: true,
        onclone: (clonedDoc) => {
          const element = clonedDoc.getElementById('content-for-download');
          if (element) {
            element.style.transform = 'none';
            element.style.position = 'relative';
            element.style.top = '0';
            element.style.left = '0';
          }
        }
      });
      
      const link = document.createElement('a');
      link.download = `${userName}_${jobTitle}_dreamlens.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    } catch (error) {
      console.error('Error generating image:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="relative min-h-screen px-4 sm:px-0">
      {/* Controls */}
      <div className="fixed top-20 right-4 flex items-center gap-2 z-50">
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="bg-white p-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
            title="배경색 선택"
          >
            <Palette size={20} className="text-gray-600" />
          </button>

          {showColorPicker && (
            <div className="absolute right-0 mt-2 p-2 bg-white rounded-lg shadow-lg grid grid-cols-4 gap-2 min-w-[200px]">
              {BACKGROUND_COLORS.map((color) => (
                <button
                  key={color.value}
                  onClick={() => {
                    setBackgroundColor(color.value);
                    setShowColorPicker(false);
                  }}
                  className={`
                    w-10 h-10 rounded-lg transition-transform hover:scale-110
                    ${color.value}
                    ${backgroundColor === color.value ? 'ring-2 ring-gray-900 ring-offset-2' : ''}
                  `}
                  title={color.name}
                />
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 bg-white rounded-lg shadow-sm p-1">
          <Columns size={16} className="text-gray-500" />
          {[1, 2, 3, 4].map((col) => (
            <button
              key={col}
              type="button"
              onClick={() => setColumns(col)}
              className={`
                w-7 h-7 rounded flex items-center justify-center text-sm font-medium
                transition-colors cursor-pointer
                ${columns === col 
                  ? `${BUTTON_COLORS[backgroundColor as keyof typeof BUTTON_COLORS]} text-white`
                  : 'text-gray-600 hover:bg-gray-100'
                }
              `}
            >
              {col}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={handleDownload}
          disabled={isDownloading}
          className={`
            text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm
            transition-colors flex items-center gap-2 text-sm sm:text-base cursor-pointer
            ${BUTTON_COLORS[backgroundColor as keyof typeof BUTTON_COLORS]}
          `}
        >
          {isDownloading ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              <span className="hidden sm:inline">Downloading...</span>
            </>
          ) : (
            <>
              <Download size={16} />
              <span className="hidden sm:inline">Download</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={onEdit}
          className="bg-white text-gray-700 px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg shadow-sm hover:bg-gray-50 transition-colors flex items-center gap-2 text-sm sm:text-base cursor-pointer"
        >
          <Pencil size={16} />
          <span className="hidden sm:inline">Edit</span>
        </button>
      </div>

      {/* Content */}
      <div 
        ref={contentRef}
        id="content-for-download"
        className="relative max-w-5xl mx-auto pt-20 pb-12"
      >
        <div className="bg-white p-8 sm:p-12 rounded-3xl shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
              {userName}님의 {jobTitle} 이야기
            </h2>
          </div>

          <div className={`${backgroundColor} p-8 sm:p-10 rounded-2xl mb-12`}>
            <div className={`
              grid gap-8
              ${columns === 1 ? 'grid-cols-1 max-w-md mx-auto' : ''}
              ${columns === 2 ? 'grid-cols-1 sm:grid-cols-2' : ''}
              ${columns === 3 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3' : ''}
              ${columns === 4 ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4' : ''}
            `}>
              {cards.map((card, index) => (
                <div 
                  key={index}
                  className="relative bg-white rounded-2xl shadow-lg overflow-hidden group transform transition-transform duration-300 hover:scale-[1.02]"
                >
                  <div className="aspect-square relative overflow-hidden">
                    <img 
                      src={card.image.url} 
                      alt={card.image.revisedPrompt}
                      className="absolute inset-0 w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                    <button
                      onClick={() => handleRefreshImage(index, card.action)}
                      disabled={refreshingIndices.has(index)}
                      className={`
                        absolute top-3 right-3 p-2.5 bg-white/90 rounded-full 
                        ${refreshingIndices.has(index) ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'} 
                        transition-all duration-300 hover:bg-white disabled:bg-gray-200
                        shadow-lg hover:shadow-xl
                      `}
                    >
                      <RefreshCw 
                        size={18} 
                        className={`text-gray-700 ${refreshingIndices.has(index) ? 'animate-spin' : ''}`}
                      />
                    </button>
                  </div>
                  <div className="p-5">
                    <p className="text-gray-800 text-base leading-relaxed">
                      {card.action}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Life Spoiler Logo */}
          <div className="text-center">
            <p className="text-gray-600 italic text-3xl tracking-wider font-light">
              Life Spoiler
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DreamLensViewer;