import React from 'react';
import { motion } from 'framer-motion';
import { SlideProps } from '../../types';
import { Sparkles, Edit2 } from 'lucide-react';

const WishesSlide: React.FC<SlideProps> = ({ name, textData, isReadOnly, onEdit }) => {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center bg-slate-900 text-white p-4 md:p-6 overflow-y-auto">
       <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-indigo-900 via-slate-900 to-black z-0 fixed"></div>

       <motion.div 
         className="z-10 w-full max-w-4xl w-full my-auto"
         initial={{ opacity: 0 }}
         whileInView={{ opacity: 1 }}
         transition={{ duration: 1 }}
       >
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mt-16 md:mt-0">
           {textData.wishes.items.map((wish, index) => (
             <motion.div
               key={index}
               className="bg-white/10 backdrop-blur-sm border border-white/10 p-4 md:p-6 rounded-2xl relative group overflow-hidden flex flex-col justify-center min-h-[140px] md:min-h-[200px]"
               initial={{ y: 50, opacity: 0 }}
               whileInView={{ y: 0, opacity: 1 }}
               transition={{ delay: index * 0.2 }}
               whileHover={{ y: -10, backgroundColor: 'rgba(255,255,255,0.15)' }}
             >
               <div className="absolute -right-4 -top-4 text-white/5 group-hover:text-pink-500/20 transition-colors duration-500">
                  <Sparkles size={80} />
               </div>
               
               {!isReadOnly && (
                   <div className="absolute top-2 right-2 md:top-4 md:right-4 z-20">
                     <button 
                        onClick={() => onEdit('wishes', index, wish)}
                        className="p-1.5 bg-white/10 rounded-full hover:bg-white/30 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Edit Wish"
                     >
                        <Edit2 size={14} />
                     </button>
                   </div>
               )}
               
               <p className="text-base md:text-xl font-light leading-relaxed relative z-10 text-center">
                 "{wish}"
               </p>
             </motion.div>
           ))}
         </div>
         
         <motion.div 
            className="mt-8 md:mt-12 text-center relative group inline-block w-full pb-20 md:pb-0"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 1 }}
         >
            <div className="inline-block relative group">
                <p className="text-pink-300 font-semibold tracking-wider uppercase text-sm cursor-pointer hover:text-pink-200 transition-colors">
                    {textData.wishes.signature}
                </p>
                {!isReadOnly && (
                    <button 
                        onClick={() => onEdit('wishes', 'signature', textData.wishes.signature)}
                        className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-white/10 rounded-full hover:bg-white/20"
                        title="Edit Signature"
                    >
                        <Edit2 size={12} className="text-white" />
                    </button>
                )}
            </div>
            <h3 className="text-2xl md:text-3xl font-handwriting mt-2">For {name}</h3>
         </motion.div>
       </motion.div>
    </div>
  );
};

export default WishesSlide;