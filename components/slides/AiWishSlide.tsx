import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { generateUniqueWish } from '../../services/geminiService';

const AiWishSlide: React.FC<SlideProps> = ({ name, textData, onEdit, isReadOnly }) => {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<'funny' | 'heartfelt' | 'poetic'>('heartfelt');

  const wish = textData.ai.wish;

  const handleGenerate = async () => {
    setLoading(true);
    const newWish = await generateUniqueWish(name, style);
    onEdit('ai', 'wish', newWish);
    setLoading(false);
  };

  const handleCopy = () => {
    if (wish) {
      navigator.clipboard.writeText(wish);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-black overflow-hidden px-4">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-purple-900/40 to-black z-0"></div>
      <div className="absolute inset-0 z-0 opacity-20 bg-[url('https://grainy-gradients.vercel.app/noise.svg')]"></div>

      <motion.div 
        className="z-10 w-full max-w-2xl text-center"
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6 md:mb-8">
            <div className="inline-block p-2 md:p-3 rounded-full bg-indigo-500/20 mb-4">
                <Wand2 className="text-indigo-400" size={32} />
            </div>
            <h2 className="text-2xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Cosmic Message
            </h2>
            <p className="text-sm md:text-base text-gray-400 mt-2">Let the AI stars align a unique wish just for {name}.</p>
        </div>

        {/* Controls - Only show if not read-only */}
        {!isReadOnly && (
            <div className="flex justify-center gap-2 md:gap-3 mb-6 md:mb-8 flex-wrap">
                {(['funny', 'heartfelt', 'poetic'] as const).map((s) => (
                    <button
                        key={s}
                        onClick={() => setStyle(s)}
                        className={`px-3 py-1.5 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-semibold transition-all ${
                            style === s 
                            ? 'bg-white text-black scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                            : 'bg-white/10 text-gray-300 hover:bg-white/20'
                        }`}
                    >
                        {s.charAt(0).toUpperCase() + s.slice(1)}
                    </button>
                ))}
            </div>
        )}

        {/* Wish Display Area */}
        <div className="min-h-[140px] md:min-h-[160px] flex items-center justify-center mb-6">
            {loading ? (
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                >
                    <RefreshCw className="text-purple-400" size={32} />
                </motion.div>
            ) : wish ? (
                <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-4 md:p-8 rounded-2xl shadow-2xl mx-0 md:mx-4 w-full"
                >
                    <p className="text-base md:text-2xl font-handwriting leading-relaxed text-indigo-100">
                        "{wish}"
                    </p>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-2 right-2 p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={16} className="text-green-400"/> : <Copy size={16} />}
                    </button>
                </motion.div>
            ) : (
                <div className="text-sm md:text-base text-gray-500 italic">
                    {isReadOnly ? "No cosmic wish generated yet." : "Tap generate to reveal your cosmic wish..."}
                </div>
            )}
        </div>

        {/* Main Action Button - Hide if read only and a wish exists, or maybe just hide always for read only? */}
        {!isReadOnly && (
            <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleGenerate}
                disabled={loading}
                className="px-6 py-2 md:px-8 md:py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full font-bold text-sm md:text-lg shadow-lg hover:shadow-indigo-500/30 transition-shadow disabled:opacity-50"
            >
                {wish ? 'Regenerate Wish' : 'Generate Wish'}
            </motion.button>
        )}

      </motion.div>
    </div>
  );
};

export default AiWishSlide;