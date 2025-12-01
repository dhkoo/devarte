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
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="absolute top-1/2 left-8 -translate-y-1/2 w-80 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 pointer-events-none"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-2xl md:text-3xl font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-600"
          >
            {activeItem.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-gray-300 leading-relaxed"
          >
            {activeItem.description}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
