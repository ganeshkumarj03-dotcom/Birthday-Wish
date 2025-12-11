import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import Confetti from '../Confetti';
import { Edit2 } from 'lucide-react';

const IntroSlide: React.FC<SlideProps> = ({ name, isActive, textData, isReadOnly, onEdit }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-900 px-4">
      {isActive && <Confetti />}
      
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 1.2 }}
        transition={{ duration: 0.8 }}
        className="z-20 text-center w-full max-w-4xl"
      >
        <div className="relative inline-block group mb-2 md:mb-4">
            <motion.p 
            className="text-pink-300 font-handwriting text-xl md:text-4xl"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            >
            {textData.intro.subtitle}
            </motion.p>
            {!isReadOnly && (
                <button 
                    onClick={() => onEdit('intro', 'subtitle', textData.intro.subtitle)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1.5 bg-white/10 rounded-full hover:bg-white/20"
                    title="Edit text"
                >
                    <Edit2 size={14} className="text-white" />
                </button>
            )}
        </div>
        
        <div className="relative inline-block group w-full mb-4">
            <motion.h1 
            className="text-5xl sm:text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-yellow-300 drop-shadow-lg leading-tight p-2"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring", stiffness: 100 }}
            >
            {textData.intro.title}
            </motion.h1>
            {!isReadOnly && (
                <button 
                    onClick={() => onEdit('intro', 'title', textData.intro.title)}
                    className="absolute right-0 md:-right-12 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/10 rounded-full hover:bg-white/20"
                    title="Edit text"
                >
                    <Edit2 size={20} className="text-white" />
                </button>
            )}
        </div>
        
        <motion.div
          className="text-4xl sm:text-5xl md:text-7xl font-handwriting text-white break-words"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          {name}!
        </motion.div>
      </motion.div>

      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-pulse"></div>
    </div>
  );
};

export default IntroSlide;