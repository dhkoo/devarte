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
            width: isMobile ? 'auto' : '400px',
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
            style={{ marginBottom: activeItem.tags && activeItem.tags.length > 0 ? '12px' : (isMobile ? '12px' : '20px') }}
            className="text-xl md:text-2xl font-bold text-white tracking-tight"
          >
            {activeItem.title}
          </motion.h2>

          {activeItem.tags && activeItem.tags.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 }}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
                marginBottom: isMobile ? '12px' : '20px',
              }}
            >
              {activeItem.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  style={{
                    padding: '4px 12px',
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.15) 0%, rgba(255, 255, 255, 0.05) 100%)',
                    backdropFilter: 'blur(8px)',
                    WebkitBackdropFilter: 'blur(8px)',
                    borderRadius: '6px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12px',
                    fontWeight: '500',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                  }}
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          )}

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-white/50 leading-relaxed"
            style={{ wordBreak: 'keep-all', whiteSpace: 'pre-line' }}
          >
            {activeItem.description}
          </motion.p>

          {activeItem.links && activeItem.links.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '16px',
              }}
            >
              {activeItem.links.map((link, index) => (
                <a
                  key={index}
                  href={link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontSize: '14px',
                    color: 'rgba(255, 255, 255, 0.7)',
                    pointerEvents: 'auto',
                    textDecoration: 'none',
                  }}
                >
                  <svg style={{ width: '12px', height: '12px', flexShrink: 0 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  {link}
                </a>
              ))}
            </motion.div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
