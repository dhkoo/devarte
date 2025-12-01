'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ImageItem } from '@/data/images';
import { X } from 'lucide-react';

interface OverlayProps {
  activeItem: ImageItem | null;
  onClose: () => void;
}

export default function Overlay({ activeItem, onClose }: OverlayProps) {
  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="absolute top-0 right-0 h-full w-full md:w-1/3 bg-black/80 backdrop-blur-md border-l border-white/10 p-8 flex flex-col justify-center z-10"
        >
          <button
            onClick={onClose}
            className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors"
          >
            <X size={32} />
          </button>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            {activeItem.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-lg md:text-xl text-gray-300 leading-relaxed"
          >
            {activeItem.description}
          </motion.p>
          
           <motion.div
            initial={{ opacity: 0, scaleX: 0 }}
            animate={{ opacity: 1, scaleX: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-8 h-px w-full bg-gradient-to-r from-transparent via-white/50 to-transparent"
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
