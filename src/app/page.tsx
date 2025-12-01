'use client';

import { useState } from 'react';
import Scene from '@/components/Scene';
import Overlay from '@/components/Overlay';
import { images, ImageItem } from '@/data/images';

export default function Home() {
  const [activeItem, setActiveItem] = useState<ImageItem | null>(null);

  return (
    <main className="relative w-full h-screen overflow-hidden bg-black">
      <div className="absolute top-0 left-0 w-full h-full z-0">
        <Scene images={images} onSelect={setActiveItem} activeItem={activeItem} />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        <Overlay activeItem={activeItem} />
      </div>

      {/* Header / Logo */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="font-[family-name:var(--font-noto-sans-kr)] text-xl font-black text-white">
          <span className="text-gray-400 font-normal">{'<'}</span>
          개발자의
          <span className="text-cyan-400"> 디자인</span>
          <span className="text-gray-400 font-normal">{' />'}</span>
        </h1>
      </div>
    </main>
  );
}
