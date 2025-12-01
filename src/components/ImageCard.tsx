'use client';

import { useRef, useState } from 'react';
import { useFrame, ThreeEvent } from '@react-three/fiber';
import { useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ImageItem } from '@/data/images';

interface ImageCardProps {
  item: ImageItem;
  position: [number, number, number];
  onClick: (id: number) => void;
  isSelected?: boolean;
}

export default function ImageCard({ item, position, onClick, isSelected = false }: ImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  const texture = useTexture(item.url);

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const clickThreshold = 10;

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 선택된 이미지는 1.3배, 호버는 1.15배, 기본은 1배
      const targetScale = isSelected ? 1.3 : hovered ? 1.15 : 1;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }
  });

  const handlePointerDown = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    pointerDownPos.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: ThreeEvent<PointerEvent>) => {
    e.stopPropagation();
    if (!pointerDownPos.current) return;

    const dx = e.clientX - pointerDownPos.current.x;
    const dy = e.clientY - pointerDownPos.current.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    // 클릭 판정: 이동 거리가 threshold 이하면 클릭
    if (distance < clickThreshold) {
      onClick(item.id);
    }

    pointerDownPos.current = null;
  };

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <mesh
        ref={meshRef}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <planeGeometry args={[2.5, 3.3]} />
        <meshBasicMaterial map={texture} side={THREE.DoubleSide} toneMapped={false} />
      </mesh>
    </Billboard>
  );
}
