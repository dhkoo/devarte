'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Scene from '@/components/Scene';
import Overlay from '@/components/Overlay';
import { ImageItem } from '@/data/images';

export default function Home() {
  const [images, setImages] = useState<ImageItem[]>([]);
  const [activeItem, setActiveItem] = useState<ImageItem | null>(null);
  const [isMobile, setIsMobile] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    fetch('/api/images')
      .then(res => res.json())
      .then(setImages);
  }, []);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const showLogo = !(isMobile && activeItem);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      {/* 3D Scene with fade-in */}
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isReady ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1.5, ease: [0.25, 0.46, 0.45, 0.94] }}
        className="absolute top-0 left-0 w-full h-full z-0"
      >
        <Scene images={images} onSelect={setActiveItem} activeItem={activeItem} />
      </motion.div>

      {/* Overlay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={isReady ? { opacity: 1 } : {}}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none"
      >
        <Overlay activeItem={activeItem} />
      </motion.div>

      {/* Header / Logo */}
      <AnimatePresence>
        {showLogo && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={isReady ? { opacity: 1, y: 0 } : { opacity: 0, y: -10 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: 'easeOut' }}
            className="absolute z-20 pointer-events-none"
            style={{
              top: isMobile ? '16px' : '24px',
              left: isMobile ? '16px' : '64px'
            }}
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
