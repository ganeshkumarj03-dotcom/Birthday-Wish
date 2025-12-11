import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Sparkles, Edit2 } from 'lucide-react';

const WishesSlide: React.FC<SlideProps> = ({ name, textData, onEdit }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-6">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black"></div>

       <motion.div 
         className="z-10 w-full max-w-4xl"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 1 }}
       >
         <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
           {textData.wishes.items.map((wish, index) => (
             <motion.div
               key={index}
               className="bg-white/10 backdrop-blur-sm border border-white/10 p-6 rounded-2xl relative group overflow-hidden flex flex-col justify-center min-h-[200px]"
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ delay: index * 0.2 }}
               whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.15)' }}
             >
               <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-pink-500/20 transition-colors duration-500">
                  <Sparkles size={100} />
               </div>
               
               <div className="absolute top-4 right-4 z-20">
                 <button 
                    onClick={() => onEdit('wishes', index, wish)}
                    className="p-1.5 bg-white/10 rounded-full hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Edit Wish"
                 >
                    <Edit2 size={14} />
                 </button>
               </div>
               
               <p className="text-lg md:text-xl font-light leading-relaxed relative z-10 text-center">
                 "{wish}"
               </p>
             </motion.div>
           ))}
         </div>
         
         <motion.div 
            className="mt-12 text-center relative group inline-block w-full"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
         >
            <div className="inline-block relative group">
                <p className="text-pink-300 font-semibold tracking-wider uppercase text-sm cursor-pointer hover:text-pink-200 transition-colors">
                    {textData.wishes.signature}
                </p>
                <button 
                    onClick={() => onEdit('wishes', 'signature', textData.wishes.signature)}
                    className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/10 rounded-full hover:bg-white/20"
                    title="Edit Signature"
                >
                    <Edit2 size={12} className="text-white" />
                </button>
            </div>
            <h3 className="text-3xl font-handwriting mt-2">For {name}</h3>
         </motion.div>
       </motion.div>
    </div>
  );
};

export default WishesSlide;