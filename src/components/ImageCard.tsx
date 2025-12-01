'use client';

import { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ImageItem } from '@/data/images';

interface ImageCardProps {
  item: ImageItem;
  position: [number, number, number];
  onClick: (id: number) => void;
}

export default function ImageCard({ item, position, onClick }: ImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(item.url);

  useFrame((state, delta) => {
    if (meshRef.current) {
      const targetScale = hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 10);
    }
  });

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh
        ref={meshRef}
        onClick={(e) => {
          e.stopPropagation();
          onClick(item.id);
        }}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.5, 3.3]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}
