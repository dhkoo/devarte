'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageItem } from '@/data/images';

interface OverlayProps {
  activeItem: ImageItem | null;
}

export default function Overlay({ activeItem }: OverlayProps) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <AnimatePresence>
      {activeItem && (
        <motion.div
          initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
          animate={{ opacity: 1, x: 0, y: 0 }}
          exit={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          style={{
            padding: isMobile ? '20px' : '32px',
            backgroundColor: 'rgba(0, 0, 0, 0.45)',
            left: isMobile ? '16px' : '64px',
            right: isMobile ? '16px' : 'auto',
            width: isMobile ? 'auto' : '320px',
            ...(isMobile
              ? { top: '16px' }
              : { top: '50%', marginTop: '-120px' }
            )
          }}
          className="absolute backdrop-blur-sm border border-white/10 rounded-2xl pointer-events-none"
        >
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            style={{ marginBottom: isMobile ? '12px' : '20px' }}
            className="text-xl md:text-2xl font-bold text-white tracking-tight"
          >
            {activeItem.title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-white/50 leading-relaxed"
          >
            {activeItem.description}
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
