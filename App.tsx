import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import IntroSlide from './components/slides/IntroSlide';
import GallerySlide from './components/slides/GallerySlide';
import WishesSlide from './components/slides/WishesSlide';
import AiWishSlide from './components/slides/AiWishSlide';
import Controls from './components/Controls';
import { SlideType, SlideTextData, GalleryImage } from './types';
import { saveBirthdayData, getBirthdayData } from './services/api';
import { Check, Loader2 } from 'lucide-react';

function App() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [direction, setDirection] = useState(0);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  
  // App Modes
  const [isLoading, setIsLoading] = useState(true);
  const [isReadOnly, setIsReadOnly] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Data State
  const [name, setName] = useState('My Friend');
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

  // Initial Load - Check for ID in URL
  useEffect(() => {
    const init = async () => {
      const params = new URLSearchParams(window.location.search);
      const id = params.get('id');

      if (id) {
        setIsLoading(true);
        const data = await getBirthdayData(id);
        if (data) {
          setName(data.name);
          setTextData(data.textData);
          setGalleryImages(data.galleryImages);
          setIsReadOnly(true); // Enable View-Only mode
        } else {
          setToastMessage("Could not find birthday wishes. Creating a new one.");
        }
        setIsLoading(false);
      } else {
        // New creation mode
        setIsLoading(false);
      }
    };
    init();
  }, []);

  // Generic Edit Modal State
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
    if (isReadOnly) return;
    setEditingState({ type: 'name', value: name });
  };

  const handleEditText = (section: keyof SlideTextData, field: string | number, currentValue: string) => {
    if (isReadOnly) return;
    setEditingState({ type: 'text', section, field, value: currentValue });
  };

  // SHARE = SAVE TO DB -> GET LINK
  const handleShare = async () => {
    if (isSaving) return;
    
    // If already read-only, just copy current link
    if (isReadOnly) {
        navigator.clipboard.writeText(window.location.href);
        setToastMessage("Link copied!");
        setTimeout(() => setToastMessage(null), 3000);
        return;
    }

    setIsSaving(true);
    setToastMessage("Saving your wishes...");
    
    // Save to backend
    const id = await saveBirthdayData({
      name,
      textData,
      galleryImages,
      createdAt: Date.now()
    });

    setIsSaving(false);

    // Update URL without reload
    const newUrl = `${window.location.origin}${window.location.pathname}?id=${id}`;
    window.history.pushState({ path: newUrl }, '', newUrl);
    
    // Enter read-only mode implicitly or just copy link? 
    // Usually user wants to keep editing, but link is for friend.
    
    navigator.clipboard.writeText(newUrl).then(() => {
        setToastMessage("Link created & copied! Send it to your friend.");
        setTimeout(() => setToastMessage(null), 3000);
    }).catch(() => {
        setToastMessage("Saved! Please copy the URL from address bar.");
    });
  };

  const handleSaveEdit = () => {
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
    if (isReadOnly) return;
    const newImages = [...galleryImages];
    newImages[index] = { ...newImages[index], ...updates };
    setGalleryImages(newImages);
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (editingState) return;
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlideIndex, editingState]);

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
      isReadOnly, // Pass read-only state to slides
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

  if (isLoading) {
      return (
          <div className="fixed inset-0 bg-black text-white flex flex-col items-center justify-center gap-4">
              <Loader2 className="animate-spin text-pink-500" size={48} />
              <p className="text-xl font-light">Loading wishes...</p>
          </div>
      );
  }

  return (
    <div className="fixed inset-0 w-full h-[100dvh] bg-black text-white overflow-hidden font-sans selection:bg-pink-500 selection:text-white">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                className="fixed top-8 left-1/2 -translate-x-1/2 z-[100] bg-white/90 backdrop-blur-md text-black px-6 py-3 rounded-full shadow-xl font-semibold flex items-center gap-2 w-max max-w-[90vw] text-center"
            >
                <Check size={18} className="text-green-600 shrink-0" />
                {toastMessage}
            </motion.div>
        )}
      </AnimatePresence>

      {/* Generic Edit Modal */}
      <AnimatePresence>
        {editingState && !isReadOnly && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 p-6 md:p-8 rounded-2xl w-full max-w-md border border-gray-700 shadow-2xl"
            >
              <h3 className="text-xl font-bold mb-4">
                  {editingState.type === 'name' ? 'Who is the birthday star?' : 'Customize Message'}
              </h3>
              
              {editingState.type === 'text' && editingState.section === 'gallery' && editingState.field === 'body' ? (
                  <textarea
                    value={editingState.value}
                    onChange={(e) => setEditingState({...editingState, value: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), handleSaveEdit())}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-4 py-3 text-lg focus:ring-2 focus:ring-pink-500 outline-none mb-6 text-white min-h-[120px]"
                    placeholder="Enter message..."
                    autoFocus
                  />
              ) : (
                  <input 
                    type="text" 
                    value={editingState.value}
                    onChange={(e) => setEditingState({...editingState, value: e.target.value})}
                    onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit()}
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
                  onClick={handleSaveEdit}
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
        isReadOnly={isReadOnly}
      />
    </div>
  );
}

export default App;