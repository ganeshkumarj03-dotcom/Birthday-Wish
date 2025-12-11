import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroSlide from './components/slides/IntroSlide';
import GallerySlide from './components/slides/GallerySlide';
import WishesSlide from './components/slides/WishesSlide';
import AiWishSlide from './components/slides/AiWishSlide';
import Controls from './components/Controls';
import { SlideType, SlideTextData, GalleryImage } from './types';
import { decodeStateFromUrl, encodeStateToUrl } from './utils';
import { Check, Copy, Link as LinkIcon, X } from 'lucide-react';

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [name, setName] = useState('My Friend');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  // State for all editable text in the app
  const [textData, setTextData] = useState<SlideTextData>({
    intro: {
      subtitle: "It's a special day...",
      title: "Happy Birthday"
    },
    gallery: {
      title: "Memories to Cherish",
      body: "Another year around the sun means another year of amazing moments, laughter, and growth. Here's to celebrating you!"
    },
    wishes: {
        items: [
            "May your joy be as bright as the candles on your cake.",
            "Wishing you a year fully loaded with happiness and success.",
            "Cheers to your personal new year! Let's make it the best one yet."
        ],
        signature: "With Love"
    }
  });

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([
    { src: `https://picsum.photos/seed/memories1/400/500`, scale: 1, offsetX: 0, offsetY: 0 },
    { src: `https://picsum.photos/seed/memories2/400/500`, scale: 1, offsetX: 0, offsetY: 0 },
    { src: `https://picsum.photos/seed/memories3/400/500`, scale: 1, offsetX: 0, offsetY: 0 },
  ]);

  // Load state from URL on startup
  useEffect(() => {
    const loadedState = decodeStateFromUrl();
    if (loadedState) {
        setName(loadedState.name);
        setTextData(loadedState.textData);
        setGalleryImages(loadedState.galleryImages);
    }
  }, []);

  // State for the generic edit modal
  const [editingState, setEditingState] = useState<{
    type: 'name' | 'text';
    section?: keyof SlideTextData;
    field?: string | number;
    value: string;
  } | null>(null);

  const slides = [SlideType.INTRO, SlideType.GALLERY, SlideType.WISHES, SlideType.AI_GEN];

  const handleNext = () => {
    if (currentSlideIndex < slides.length - 1) {
      setDirection(1);
      setCurrentSlideIndex(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      setDirection(-1);
      setCurrentSlideIndex(prev => prev - 1);
    }
  };

  const handleEditName = () => {
    setEditingState({ type: 'name', value: name });
  };

  const handleEditText = (section: keyof SlideTextData, field: string | number, currentValue: string) => {
    setEditingState({ type: 'text', section, field, value: currentValue });
  };

  const handleShare = () => {
      const encoded = encodeStateToUrl({ name, textData, galleryImages });
      if (encoded) {
          const url = `${window.location.origin}${window.location.pathname}#data=${encoded}`;
          setShareUrl(url);
          setCopied(false);
      } else {
          alert("Could not generate link. The images might be too large.");
      }
  };

  const copyToClipboard = () => {
      if (shareUrl) {
          navigator.clipboard.writeText(shareUrl);
          setCopied(true);
      }
  };

  const handleSave = () => {
    if (!editingState) return;

    if (editingState.type === 'name') {
        if (editingState.value.trim()) setName(editingState.value);
    } else if (editingState.type === 'text' && editingState.section && editingState.field !== undefined) {
        const newTextData = { ...textData };
        if (editingState.section === 'wishes') {
             if (typeof editingState.field === 'number') {
                 // Update specific wish item
                 const newItems = [...newTextData.wishes.items];
                 newItems[editingState.field] = editingState.value;
                 newTextData.wishes = { ...newTextData.wishes, items: newItems };
             } else if (editingState.field === 'signature') {
                 // Update signature
                 newTextData.wishes = { ...newTextData.wishes, signature: editingState.value };
             }
        } else {
             // Handle object update for intro/gallery
             // @ts-ignore
             newTextData[editingState.section] = {
                 // @ts-ignore
                 ...newTextData[editingState.section],
                 [editingState.field]: editingState.value
             };
        }
        setTextData(newTextData);
    }
    setEditingState(null);
  };

  const handleUpdateImage = (index: number, updates: Partial<GalleryImage>) => {
    const newImages = [...galleryImages];
    newImages[index] = { ...newImages[index], ...updates };
    setGalleryImages(newImages);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingState || shareUrl) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, editingState, shareUrl]);

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
      opacity: 0
    })
  };

  const renderSlide = (type: SlideType) => {
    const props = {
      name,
      isActive: true, 
      direction,
      onNext: handleNext,
      onPrev: handlePrev,
      galleryImages,
      onUpdateImage: handleUpdateImage,
      textData,
      onEdit: handleEditText
    };

    switch (type) {
      case SlideType.INTRO: return <IntroSlide {...props} />;
      case SlideType.GALLERY: return <GallerySlide {...props} />;
      case SlideType.WISHES: return <WishesSlide {...props} />;
      case SlideType.AI_GEN: return <AiWishSlide {...props} />;
      default: return null;
    }
  };

  return (
    <div className="relative w-full h-screen bg-black text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Share Modal */}
      <AnimatePresence>
        {shareUrl && (
             <motion.div 
             initial={{ opacity: 0 }} 
             animate={{ opacity: 1 }} 
             exit={{ opacity: 0 }}
             className="fixed inset-0 z-[80] flex items-center justify-center bg-black/90 backdrop-blur-md px-4"
           >
             <motion.div 
               initial={{ scale: 0.9, y: 20 }}
               animate={{ scale: 1, y: 0 }}
               className="bg-gray-800 p-6 rounded-2xl w-full max-w-lg border border-gray-700 shadow-2xl"
             >
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold flex items-center gap-2">
                        <LinkIcon size={20} className="text-pink-500" /> Share Your Wish
                    </h3>
                    <button onClick={() => setShareUrl(null)} className="text-gray-400 hover:text-white">
                        <X size={24} />
                    </button>
                </div>
                
                <p className="text-gray-300 text-sm mb-4">
                    Send this unique link to your friend. It contains all your customizations.
                </p>

                <div className="bg-gray-950 p-3 rounded-lg flex items-center gap-2 border border-gray-700 mb-6">
                    <input 
                        type="text" 
                        readOnly 
                        value={shareUrl} 
                        className="bg-transparent text-gray-400 text-sm flex-1 outline-none truncate"
                    />
                </div>

                <div className="flex gap-3">
                    <button 
                        onClick={() => setShareUrl(null)}
                        className="flex-1 py-3 text-gray-300 hover:text-white font-semibold"
                    >
                        Close
                    </button>
                    <button 
                        onClick={copyToClipboard}
                        className={`flex-1 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2 ${
                            copied ? 'bg-green-600 hover:bg-green-700' : 'bg-pink-600 hover:bg-pink-700'
                        }`}
                    >
                        {copied ? <><Check size={18} /> Copied!</> : <><Copy size={18} /> Copy Link</>}
                    </button>
                </div>
             </motion.div>
           </motion.div>
        )}
      </AnimatePresence>

      {/* Generic Edit Modal */}
      <AnimatePresence>
        {editingState && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">
                  {editingState.type === 'name' ? 'Who is the birthday star?' : 'Customize Message'}
              </h3>
              
              {editingState.type === 'text' && editingState.section === 'gallery' && editingState.field === 'body' ? (
                  <textarea
                    value={editingState.value}
                    onChange={(e) => setEditingState({...editingState, value: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSave())}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-pink-500 outline-none mb-6 text-white min-h-[120px]"
                    placeholder="Enter message..."
                    autoFocus
                  />
              ) : (
                  <input 
                    type="text" 
                    value={editingState.value}
                    onChange={(e) => setEditingState({...editingState, value: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-pink-500 outline-none mb-6 text-white"
                    placeholder="Enter text..."
                    autoFocus
                  />
              )}

              <div className="flex justify-end gap-3">
                <button 
                  onClick={() => setEditingState(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleSave}
                  className="px-6 py-2 bg-pink-500 rounded-lg font-bold hover:bg-pink-600 transition-colors"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Slide Area */}
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentSlideIndex}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
          }}
          className="absolute inset-0 w-full h-full"
        >
          {renderSlide(slides[currentSlideIndex])}
        </motion.div>
      </AnimatePresence>

      <Controls 
        currentSlide={currentSlideIndex} 
        totalSlides={slides.length} 
        onNext={handleNext} 
        onPrev={handlePrev}
        onEditName={handleEditName}
        onShare={handleShare}
      />
    </div>
  );
}

export default App;