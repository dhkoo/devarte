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
        <Scene images={images} onSelect={setActiveItem} />
      </div>
      
      <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
        {/* Pass pointer-events-auto to interactive children */}
        <div className="pointer-events-auto w-full h-full">
            <Overlay activeItem={activeItem} onClose={() => setActiveItem(null)} />
        </div>
      </div>

      {/* Header / Logo */}
      <div className="absolute top-8 left-8 z-20 pointer-events-none">
        <h1 className="text-2xl font-bold tracking-widest text-white uppercase">
          Radika<span className="text-blue-500">.</span>
        </h1>
      </div>
    </main>
  );
}
