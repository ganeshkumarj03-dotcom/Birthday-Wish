import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Edit2, Share2 } from 'lucide-react';

interface ControlsProps {
  currentSlide: number;
  totalSlides: number;
  onNext: () => void;
  onPrev: () => void;
  onEditName: () => void;
  onShare: () => void;
}

const Controls: React.FC<ControlsProps> = ({ currentSlide, totalSlides, onNext, onPrev, onEditName, onShare }) => {
  const [showActions, setShowActions] = useState(true);
  const timerRef = useRef<number | null>(null);

  const resetTimer = () => {
    setShowActions(true);
    if (timerRef.current) {
        window.clearTimeout(timerRef.current);
    }
    timerRef.current = window.setTimeout(() => {
      setShowActions(false);
    }, 3000);
  };

  useEffect(() => {
    if (currentSlide === 0) {
        resetTimer();
    }
    return () => {
        if (timerRef.current) window.clearTimeout(timerRef.current);
    };
  }, [currentSlide]);

  return (
    <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-center items-center gap-6 px-4">
      <button 
        onClick={onPrev}
        disabled={currentSlide === 0}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg"
      >
        <ChevronLeft size={24} />
      </button>

      <div className="flex gap-2">
        {Array.from({ length: totalSlides }).map((_, idx) => (
          <div 
            key={idx}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === currentSlide ? 'w-8 bg-pink-500' : 'w-2 bg-white/30'
            }`}
          />
        ))}
      </div>

      <button 
        onClick={onNext}
        disabled={currentSlide === totalSlides - 1}
        className="p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 transition-all disabled:opacity-30 disabled:cursor-not-allowed text-white shadow-lg"
      >
        <ChevronRight size={24} />
      </button>
      
      {/* Share and Edit Buttons - Only visible on Slide 0 (Intro) */}
      {currentSlide === 0 && (
          <div 
            className={`absolute right-8 md:relative md:right-auto flex flex-col md:flex-row gap-3 top-[-80vh] md:top-auto transition-opacity duration-500 ${showActions ? 'opacity-100' : 'opacity-0'}`}
            onMouseEnter={resetTimer}
            onTouchStart={resetTimer}
            onClick={resetTimer}
          >
            <button
                onClick={onShare}
                disabled={!showActions}
                className={`p-3 rounded-full bg-indigo-500/80 backdrop-blur-md hover:bg-indigo-600 transition-all text-white shadow-lg ${!showActions ? 'cursor-default pointer-events-none' : 'cursor-pointer pointer-events-auto'}`}
                title="Share Link"
            >
                <Share2 size={20} />
            </button>
            <button
                onClick={onEditName}
                disabled={!showActions}
                className={`p-3 rounded-full bg-pink-500/80 backdrop-blur-md hover:bg-pink-600 transition-all text-white shadow-lg ${!showActions ? 'cursor-default pointer-events-none' : 'cursor-pointer pointer-events-auto'}`}
                title="Edit Name"
            >
                <Edit2 size={20} />
            </button>
          </div>
      )}
    </div>
  );
};

export default Controls;