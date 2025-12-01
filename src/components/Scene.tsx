'use client';

import { Canvas } from '@react-three/fiber';
import { Environment, Stars } from '@react-three/drei';
import SphereGallery from './SphereGallery';
import { ImageItem } from '@/data/images';
import { Suspense } from 'react';

interface SceneProps {
  images: ImageItem[];
  onSelect: (item: ImageItem | null) => void;
  activeItem: ImageItem | null;
}

export default function Scene({ images, onSelect, activeItem }: SceneProps) {
  return (
    <div className="w-full h-screen bg-black">
      <Canvas camera={{ position: [0, 0, 18], fov: 50 }}>
        <Suspense fallback={null}>
            <color attach="background" args={['#050505']} />
            <fog attach="fog" args={['#050505', 15, 25]} />
            
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            
            <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            <Environment preset="city" />

            <SphereGallery images={images} onSelect={onSelect} activeItem={activeItem} />
        </Suspense>
      </Canvas>
    </div>
  );
}
