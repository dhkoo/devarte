'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ImageItem } from '@/data/images';

interface OverlayProps {
  activeItem: ImageItem | null;
}

export default function Overlay({ activeItem }: OverlayProps) {
  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute bottom-4 left-4 right-4 md:bottom-auto md:top-1/2 md:left-8 md:right-auto md:-translate-y-1/2 md:w-80 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-4 md:p-6 pointer-events-none"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl lg:text-3xl font-bold mb-2 md:mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            {activeItem.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs md:text-sm lg:text-base text-gray-300 leading-relaxed"
          >
            {activeItem.description}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
