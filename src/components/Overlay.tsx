'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ImageItem } from '@/data/images';

interface OverlayProps {
  activeItem: ImageItem | null;
}

export default function Overlay({ activeItem }: OverlayProps) {
  const [isMobile, setIsMobile] = useState(false);
  const [needsScroll, setNeedsScroll] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (scrollRef.current && isMobile) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      setNeedsScroll(scrollHeight > clientHeight);
    } else {
      setNeedsScroll(false);
    }
  }, [activeItem, isMobile]);

  return (
    <AnimatePresence>
      {activeItem && (
        <div
          className="absolute"
          style={{
            left: isMobile ? '16px' : '64px',
            right: isMobile ? '16px' : 'auto',
            ...(isMobile
              ? { top: '16px' }
              : { top: '50%', transform: 'translateY(-50%)' }
            )
          }}
        >
          <motion.div
            initial={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: isMobile ? 0 : -50, y: isMobile ? 50 : 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            style={{
              backgroundColor: 'rgba(0, 0, 0, 0.65)',
              width: isMobile ? 'auto' : '400px',
              pointerEvents: isMobile ? 'auto' : 'none',
              overflow: 'hidden',
              ...(isMobile
                ? { maxHeight: 'calc(100dvh - 32px)' }
                : { padding: '32px' }
              )
            }}
            className="backdrop-blur-sm border border-white/10 rounded-2xl"
          >
          <div
            ref={scrollRef}
            style={{
              padding: isMobile ? '20px' : '0',
              ...(isMobile
                ? { maxHeight: 'calc(100dvh - 32px - 2px)', overflowY: 'auto' }
                : {}
              )
            }}
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
          <div style={{ height: (isMobile && needsScroll) ? '40px' : '10px', flexShrink: 0 }} />
          </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
