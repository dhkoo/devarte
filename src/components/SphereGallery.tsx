'use client';

import { useRef, useMemo, useEffect, useCallback, useState } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { ImageItem } from '@/data/images';
import ImageCard from './ImageCard';

interface SphereGalleryProps {
  images: ImageItem[];
  onSelect: (item: ImageItem | null) => void;
  activeItem: ImageItem | null;
}

export default function SphereGallery({ images, onSelect, activeItem }: SphereGalleryProps) {
  const groupRef = useRef<THREE.Group>(null);

  const rotationVelocity = useRef({ x: 0, y: 0 });
  const pointerStart = useRef({ x: 0, y: 0 });
  const lastPointer = useRef({ x: 0, y: 0 });
  const isPointerDown = useRef(false);
  const hasDragged = useRef(false);
  const targetRotation = useRef<THREE.Quaternion | null>(null);
  const hasEverFocused = useRef(false);

  const radius = 6;
  const dragThreshold = 8;
  const autoRotateSpeed = 0.08; // 자동 자전 속도

  const itemsWithPosition = useMemo(() => {
    const n = images.length;
    const goldenAngle = Math.PI * (3 - Math.sqrt(5));

    return images.map((item, i) => {
      const y = 1 - (i / (n - 1)) * 2;
      const radiusAtY = Math.sqrt(1 - y * y);
      const theta = goldenAngle * i;

      const x = Math.cos(theta) * radiusAtY;
      const z = Math.sin(theta) * radiusAtY;

      const position = new THREE.Vector3(x, y, z).multiplyScalar(radius);

      return {
        ...item,
        position: [position.x, position.y, position.z] as [number, number, number],
        vector: position.clone().normalize()
      };
    });
  }, [images]);

  // 포커스 해제 함수
  const clearFocus = useCallback(() => {
    if (activeItem) {
      onSelect(null);
      hasEverFocused.current = false;
      targetRotation.current = null;
    }
  }, [activeItem, onSelect]);

  useEffect(() => {
    const onPointerDown = (e: PointerEvent) => {
      isPointerDown.current = true;
      hasDragged.current = false;
      pointerStart.current = { x: e.clientX, y: e.clientY };
      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isPointerDown.current) return;

      const dx = e.clientX - pointerStart.current.x;
      const dy = e.clientY - pointerStart.current.y;

      // 드래그 판정
      if (Math.abs(dx) > dragThreshold || Math.abs(dy) > dragThreshold) {
        hasDragged.current = true;
        targetRotation.current = null;
      }

      if (hasDragged.current) {
        const moveX = e.clientX - lastPointer.current.x;
        const moveY = e.clientY - lastPointer.current.y;

        rotationVelocity.current = {
          x: moveY * 0.003,
          y: moveX * 0.003
        };
      }

      lastPointer.current = { x: e.clientX, y: e.clientY };
    };

    const onPointerUp = () => {
      isPointerDown.current = false;
    };

    // ESC 키로 포커스 해제
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        clearFocus();
      }
    };

    window.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [clearFocus]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (targetRotation.current) {
      groupRef.current.quaternion.slerp(targetRotation.current, delta * 3);
    } else {
      // 포커싱 전에만 자동 자전
      if (!hasEverFocused.current && !isPointerDown.current) {
        const autoRotY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          autoRotateSpeed * delta
        );
        groupRef.current.quaternion.premultiply(autoRotY);
      }

      // 드래그 회전 적용
      if (Math.abs(rotationVelocity.current.x) > 0.0001 || Math.abs(rotationVelocity.current.y) > 0.0001) {
        const rotY = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(0, 1, 0),
          rotationVelocity.current.y
        );
        const rotX = new THREE.Quaternion().setFromAxisAngle(
          new THREE.Vector3(1, 0, 0),
          rotationVelocity.current.x
        );

        groupRef.current.quaternion.premultiply(rotY);
        groupRef.current.quaternion.premultiply(rotX);
      }

      // 관성 감속
      if (!isPointerDown.current) {
        rotationVelocity.current.x *= 0.92;
        rotationVelocity.current.y *= 0.92;
      }
    }
  });

  const handleImageClick = useCallback((id: number) => {
    const item = itemsWithPosition.find(i => i.id === id);
    if (!item || !groupRef.current) return;

    // 한번 포커싱되면 자동 자전 중지
    hasEverFocused.current = true;

    // 속도 초기화
    rotationVelocity.current = { x: 0, y: 0 };

    onSelect(item);

    // 현재 그룹의 회전을 고려하여 아이템의 월드 좌표 계산
    const worldVector = item.vector.clone();
    worldVector.applyQuaternion(groupRef.current.quaternion);

    // 해당 아이템이 정면(0, 0, 1)을 향하도록 회전 계산
    const targetQ = new THREE.Quaternion().setFromUnitVectors(
      worldVector,
      new THREE.Vector3(0, 0, 1)
    );
    targetQ.multiply(groupRef.current.quaternion);

    targetRotation.current = targetQ;
  }, [itemsWithPosition, onSelect]);

  // 빈 영역 클릭 시 포커스 해제
  const handlePointerMissed = useCallback(() => {
    if (activeItem && !hasDragged.current) {
      clearFocus();
    }
  }, [activeItem, clearFocus]);

  return (
    <group ref={groupRef} onPointerMissed={handlePointerMissed}>
      {itemsWithPosition.map((item) => (
        <ImageCard
          key={item.id}
          item={item}
          position={item.position}
          onClick={handleImageClick}
          isSelected={activeItem?.id === item.id}
          hasActiveItem={activeItem !== null}
        />
      ))}
    </group>
  );
}
