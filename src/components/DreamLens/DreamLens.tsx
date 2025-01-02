import React, { useState } from 'react';
import { ArrowLeft, Plus } from 'lucide-react';
import { Dream } from './types';
import DreamTag from './DreamTag';
import DreamInput from './DreamInput';
import DreamDetail from './DreamDetail';

interface DreamLensProps {
  dreams: Dream[];
  setDreams: React.Dispatch<React.SetStateAction<Dream[]>>;
}

export function DreamLens({ dreams, setDreams }: DreamLensProps) {
  const [showInput, setShowInput] = useState(false);
  const [editingDream, setEditingDream] = useState<Dream | null>(null);
  const [selectedDream, setSelectedDream] = useState<Dream | null>(null);

  const navigateBack = () => {
    window.location.hash = '';
  };

  const handleAddDream = (dream: string, future: string, action: string) => {
    if (editingDream) {
      setDreams(prev => prev.map(d => 
        d.id === editingDream.id 
          ? { ...d, dream, future, action }
          : d
      ));
      setEditingDream(null);
    } else {
      setDreams(prev => [...prev, {
        id: Date.now().toString(),
        dream,
        future,
        action
      }]);
    }
    setShowInput(false);
  };

  const handleEditDream = (dream: Dream) => {
    setEditingDream(dream);
    setSelectedDream(null);
    setShowInput(true);
  };

  const handleDeleteDream = (id: string) => {
    setDreams(prev => prev.filter(d => d.id !== id));
    setSelectedDream(null);
  };

  const handleViewDream = (dream: Dream) => {
    setSelectedDream(dream);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={navigateBack}
        className="mb-8 flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
      >
        <ArrowLeft size={20} />
        Back to PixStory
      </button>
      <div className="bg-white rounded-xl shadow-sm p-8">
        <h2 className="text-2xl font-bold mb-8">DreamLens</h2>

        <div className="flex items-start gap-2">
          <div className="flex flex-wrap gap-2">
            {dreams.map(dream => (
              <DreamTag
                key={dream.id}
                text={dream.dream}
                onEdit={() => handleViewDream(dream)}
                onDelete={() => handleDeleteDream(dream.id)}
              />
            ))}
          </div>
          <button
            onClick={() => {
              setEditingDream(null);
              setShowInput(true);
            }}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <Plus size={20} />
          </button>
        </div>

        {showInput && (
          <DreamInput
            initialDream={editingDream?.dream}
            initialFuture={editingDream?.future}
            initialAction={editingDream?.action}
            onConfirm={handleAddDream}
            onClose={() => {
              setShowInput(false);
              setEditingDream(null);
            }}
          />
        )}

        {selectedDream && (
          <DreamDetail
            dream={selectedDream.dream}
            future={selectedDream.future}
            action={selectedDream.action}
            onClose={() => setSelectedDream(null)}
            onEdit={() => handleEditDream(selectedDream)}
          />
        )}
      </div>
    </div>
  );
}