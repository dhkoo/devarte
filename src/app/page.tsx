'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from '@/components/Scene';
import Overlay from '@/components/Overlay';
import { images, ImageItem } from '@/data/images';

export default function Home() {
  const [activeItem, setActiveItem] = useState<ImageItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const showLogo = !(isMobile && activeItem);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene images={images} onSelect={setActiveItem} activeItem={activeItem} />
      </div>

      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <Overlay activeItem={activeItem} />
      </div>

      {/* Header / Logo */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="absolute top-4 left-4 md:top-8 md:left-8 z-20 pointer-events-none"
          >
            <h1 className="font-[family-name:var(--font-noto-sans-kr)] text-base md:text-xl font-black text-white">
              <span className="text-gray-400 font-normal">{'<'}</span>
              개발자의
              <span className="text-cyan-400"> 디자인</span>
              <span className="text-gray-400 font-normal">{' />'}</span>
            </h1>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
