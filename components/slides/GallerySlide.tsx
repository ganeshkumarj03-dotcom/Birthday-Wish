import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Camera, Edit2, Move, ZoomIn, ZoomOut, ChevronUp, ChevronDown, ChevronLeft, ChevronRight, Check, X, RotateCcw, Maximize2 } from 'lucide-react';
import { resizeImage } from '../../utils';

const GallerySlide: React.FC<SlideProps> = ({ name, galleryImages, onUpdateImage, textData, onEdit, isReadOnly }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [adjustingIndex, setAdjustingIndex] = useState<number | null>(null);
  const [viewingIndex, setViewingIndex] = useState<number | null>(null); // For lightbox
  const [tempAdjust, setTempAdjust] = useState({ scale: 1, offsetX: 0, offsetY: 0 });

  const handleEditClick = (index: number) => {
    if (isReadOnly) return;
    setEditingIndex(index);
    fileInputRef.current?.click();
  };

  const handleAdjustClick = (e: React.MouseEvent, index: number) => {
    e.stopPropagation();
    if (isReadOnly) return;
    setAdjustingIndex(index);
    const img = galleryImages[index];
    setTempAdjust({ scale: img.scale, offsetX: img.offsetX, offsetY: img.offsetY });
  };

  const saveAdjustments = () => {
    if (adjustingIndex !== null) {
      onUpdateImage(adjustingIndex, tempAdjust);
      setAdjustingIndex(null);
    }
  };

  const updateTemp = (key: keyof typeof tempAdjust, value: number) => {
    setTempAdjust(prev => ({ ...prev, [key]: value }));
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && editingIndex !== null) {
        try {
            const resizedImage = await resizeImage(file);
            onUpdateImage(editingIndex, { src: resizedImage, scale: 1, offsetX: 0, offsetY: 0 });
        } catch (error) {
            console.error("Error processing image", error);
        }
        setEditingIndex(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col md:flex-row items-center justify-center bg-gray-900 overflow-hidden px-4 md:px-20 py-16 md:py-0">
      <div className="absolute inset-0 bg-gradient-to-tr from-pink-900 to-indigo-900 opacity-80"></div>
      
      <div className="absolute top-10 left-10 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-10 right-10 w-64 h-64 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>

      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Lightbox Modal (Full View) */}
      <AnimatePresence>
        {viewingIndex !== null && (
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
                onClick={() => setViewingIndex(null)}
            >
                <button className="absolute top-6 right-6 text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-colors z-[101]">
                    <X size={32} />
                </button>
                <motion.img 
                    src={galleryImages[viewingIndex].src}
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
                    onClick={(e) => e.stopPropagation()} 
                />
            </motion.div>
        )}
      </AnimatePresence>

      {/* Adjustment Modal */}
      <AnimatePresence>
        {adjustingIndex !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div 
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-gray-800 w-full max-w-lg rounded-2xl shadow-2xl border border-gray-700 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-4 border-b border-gray-700 flex justify-between items-center shrink-0">
                <h3 className="font-bold text-white flex items-center gap-2">
                  <Move size={18} /> Adjust Photo
                </h3>
                <button onClick={() => setAdjustingIndex(null)} className="text-gray-400 hover:text-white">
                  <X size={24} />
                </button>
              </div>

              <div className="p-4 flex flex-col items-center overflow-y-auto">
                <div className="relative w-full aspect-[4/5] max-h-[40vh] bg-gray-900 rounded-lg overflow-hidden shadow-inner border border-gray-600 mb-6">
                  <img 
                    src={galleryImages[adjustingIndex].src} 
                    alt="Preview"
                    className="w-full h-full object-cover origin-center transition-transform duration-100"
                    style={{
                      transform: `translate(${tempAdjust.offsetX}%, ${tempAdjust.offsetY}%) scale(${tempAdjust.scale})`
                    }}
                  />
                  <div className="absolute inset-0 pointer-events-none opacity-20">
                    <div className="w-full h-full grid grid-cols-3 grid-rows-3">
                        {[...Array(9)].map((_, i) => <div key={i} className="border border-white/50"></div>)}
                    </div>
                  </div>
                </div>

                <div className="w-full space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs text-gray-400 font-bold uppercase tracking-wider">
                      <span>Zoom out</span>
                      <span>Zoom In</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <ZoomOut size={20} className="text-gray-400" />
                      <input 
                        type="range" 
                        min="1" 
                        max="3" 
                        step="0.1" 
                        value={tempAdjust.scale}
                        onChange={(e) => updateTemp('scale', parseFloat(e.target.value))}
                        className="flex-1 h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer accent-pink-500"
                      />
                      <ZoomIn size={20} className="text-gray-400" />
                    </div>
                  </div>

                  <div className="flex justify-center items-center gap-6">
                      <div className="grid grid-cols-3 gap-2">
                        <div></div>
                        <button 
                            className="p-3 bg-gray-700 hover:bg-pink-500 rounded-lg transition-colors text-white"
                            onClick={() => updateTemp('offsetY', tempAdjust.offsetY - 5)}
                        >
                            <ChevronUp size={24} />
                        </button>
                        <div></div>
                        <button 
                            className="p-3 bg-gray-700 hover:bg-pink-500 rounded-lg transition-colors text-white"
                            onClick={() => updateTemp('offsetX', tempAdjust.offsetX - 5)}
                        >
                            <ChevronLeft size={24} />
                        </button>
                        <button 
                            className="p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors text-white"
                            onClick={() => setTempAdjust({ scale: 1, offsetX: 0, offsetY: 0 })}
                            title="Reset"
                        >
                            <RotateCcw size={20} />
                        </button>
                        <button 
                            className="p-3 bg-gray-700 hover:bg-pink-500 rounded-lg transition-colors text-white"
                            onClick={() => updateTemp('offsetX', tempAdjust.offsetX + 5)}
                        >
                            <ChevronRight size={24} />
                        </button>
                        <div></div>
                        <button 
                            className="p-3 bg-gray-700 hover:bg-pink-500 rounded-lg transition-colors text-white"
                            onClick={() => updateTemp('offsetY', tempAdjust.offsetY + 5)}
                        >
                            <ChevronDown size={24} />
                        </button>
                        <div></div>
                      </div>
                  </div>
                </div>
              </div>

              <div className="p-4 bg-gray-900 border-t border-gray-700 flex justify-end gap-3 shrink-0">
                <button 
                  onClick={() => setAdjustingIndex(null)}
                  className="px-4 py-2 text-gray-400 hover:text-white transition-colors"
                >
                  Cancel
                </button>
                <button 
                  onClick={saveAdjustments}
                  className="px-6 py-2 bg-pink-500 text-white rounded-lg font-bold hover:bg-pink-600 transition-colors flex items-center gap-2"
                >
                  <Check size={18} /> Apply
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="z-10 flex flex-col md:flex-row items-center gap-4 md:gap-8 w-full max-w-6xl h-full justify-center md:h-auto">
        <div className="flex-1 text-center md:text-left order-1 md:order-0 mt-4 md:mt-0">
          <div className="relative group inline-block">
            <motion.h2 
                className="text-3xl md:text-6xl font-bold text-white mb-2 md:mb-6 leading-tight whitespace-pre-line"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
            >
                {textData.gallery.title} <span className="text-pink-400 font-handwriting">Cherish</span>
            </motion.h2>
            {!isReadOnly && (
                <button 
                    onClick={() => onEdit('gallery', 'title', textData.gallery.title)}
                    className="absolute -right-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-full hover:bg-white/20"
                    title="Edit title"
                >
                    <Edit2 size={16} className="text-white" />
                </button>
            )}
          </div>

          <div className="relative group mt-2 md:mt-4">
            <motion.p 
                className="text-sm md:text-lg text-gray-300 max-w-md whitespace-pre-line px-2 md:px-0"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
            >
                {textData.gallery.body.replace('{name}', name)}
            </motion.p>
            {!isReadOnly && (
                <button 
                    onClick={() => onEdit('gallery', 'body', textData.gallery.body)}
                    className="absolute -right-4 top-0 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-full hover:bg-white/20"
                    title="Edit message"
                >
                    <Edit2 size={14} className="text-white" />
                </button>
            )}
          </div>
        </div>

        {/* Image Stack Container */}
        <div className="flex-1 relative h-[40vh] min-h-[300px] w-full max-w-[500px] perspective-1000 order-0 md:order-1 mt-8 md:mt-0">
          {galleryImages.map((imgData, idx) => (
            <motion.div
              key={idx}
              className={`absolute w-40 h-56 md:w-60 md:h-80 bg-white p-2 shadow-2xl rounded-lg group ${isReadOnly ? 'cursor-pointer' : ''}`}
              initial={{ 
                opacity: 0, 
                rotate: idx === 0 ? -10 : idx === 1 ? 5 : 15,
                x: idx * 30,
                y: idx * 20
              }}
              whileInView={{ 
                opacity: 1,
                rotate: idx === 0 ? -12 : idx === 1 ? 8 : -5,
                scale: 1
              }}
              whileHover={{ 
                scale: 1.1, 
                rotate: 0, 
                zIndex: 50,
                transition: { duration: 0.3 }
              }}
              style={{
                top: idx === 0 ? '10%' : idx === 1 ? '5%' : '20%',
                left: idx === 0 ? '15%' : idx === 1 ? '45%' : '30%',
                zIndex: idx
              }}
              onClick={() => {
                  if (isReadOnly) setViewingIndex(idx);
              }}
            >
              <div className="relative w-full h-full overflow-hidden rounded">
                <img 
                    src={imgData.src} 
                    alt="Memory" 
                    className="w-full h-full object-cover transition-transform duration-300" 
                    style={{ 
                        transform: `translate(${imgData.offsetX}%, ${imgData.offsetY}%) scale(${imgData.scale})`
                    }}
                />
                
                {/* Only show edit overlays if NOT read-only */}
                {!isReadOnly && (
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3">
                        <button 
                            onClick={(e) => { e.stopPropagation(); handleEditClick(idx); }}
                            className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full text-white hover:bg-pink-500 hover:scale-110 transition-all"
                            title="Upload Photo"
                        >
                            <Camera size={20} />
                        </button>
                        <button 
                            onClick={(e) => handleAdjustClick(e, idx)}
                            className="bg-white/20 backdrop-blur-md p-2 md:p-3 rounded-full text-white hover:bg-indigo-500 hover:scale-110 transition-all"
                            title="Adjust Position & Zoom"
                        >
                            <Move size={20} />
                        </button>
                    </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default GallerySlide;