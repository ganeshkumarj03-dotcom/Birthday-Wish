import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Wand2, RefreshCw, Copy, Check } from 'lucide-react';
import { generateUniqueWish } from '../../services/geminiService';

const AiWishSlide: React.FC<SlideProps> = ({ name }) => {
  const [wish, setWish] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [style, setStyle] = useState<'funny' | 'heartfelt' | 'poetic'>('heartfelt');

  const handleGenerate = async () => {
    setLoading(true);
    const newWish = await generateUniqueWish(name, style);
    setWish(newWish);
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
        <div className="mb-8">
            <div className="inline-block p-3 rounded-full bg-indigo-500/20 mb-4">
                <Wand2 className="text-indigo-400" size={40} />
            </div>
            <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                Cosmic Message
            </h2>
            <p className="text-gray-400 mt-2">Let the AI stars align a unique wish just for {name}.</p>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-3 mb-8">
            {(['funny', 'heartfelt', 'poetic'] as const).map((s) => (
                <button
                    key={s}
                    onClick={() => setStyle(s)}
                    className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                        style === s 
                        ? 'bg-white text-black scale-105 shadow-[0_0_15px_rgba(255,255,255,0.3)]' 
                        : 'bg-white/10 text-gray-300 hover:bg-white/20'
                    }`}
                >
                    {s.charAt(0).toUpperCase() + s.slice(1)}
                </button>
            ))}
        </div>

        {/* Wish Display Area */}
        <div className="min-h-[160px] flex items-center justify-center">
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
                    className="relative bg-white/5 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-2xl shadow-2xl mx-4"
                >
                    <p className="text-lg md:text-2xl font-handwriting leading-relaxed text-indigo-100">
                        "{wish}"
                    </p>
                    <button 
                        onClick={handleCopy}
                        className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white transition-colors"
                        title="Copy to clipboard"
                    >
                        {copied ? <Check size={18} className="text-green-400"/> : <Copy size={18} />}
                    </button>
                </motion.div>
            ) : (
                <div className="text-gray-500 italic">Tap generate to reveal your cosmic wish...</div>
            )}
        </div>

        {/* Main Action Button */}
        <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleGenerate}
            disabled={loading}
            className="mt-8 px-8 py-3 bg-gradient-to-r from-indigo-600 to-pink-600 rounded-full font-bold text-lg shadow-lg hover:shadow-indigo-500/30 transition-shadow disabled:opacity-50"
        >
            {wish ? 'Regenerate Wish' : 'Generate Wish'}
        </motion.button>

      </motion.div>
    </div>
  );
};

export default AiWishSlide;