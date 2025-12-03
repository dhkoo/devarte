'use client';

import { useRef, useState, useMemo, useEffect } from 'react';
import { useFrame, useThree, ThreeEvent } from '@react-three/fiber';
import { useTexture, Billboard } from '@react-three/drei';
import * as THREE from 'three';
import { ImageItem } from '@/data/images';

interface ImageCardProps {
  item: ImageItem;
  position: [number, number, number];
  onClick: (id: number) => void;
  isSelected?: boolean;
  hasActiveItem?: boolean;
}

// 카드 최대 크기
const MAX_WIDTH = 2.5;
const MAX_HEIGHT = 3.3;

// 선택 시 목표 크기
const SELECTED_WIDTH = 4.0;
const SELECTED_HEIGHT = 5.0;

export default function ImageCard({ item, position, onClick, isSelected = false, hasActiveItem = false }: ImageCardProps) {
  const meshRef = useRef<THREE.Mesh>(null);
  const glowRef = useRef<THREE.Mesh>(null);
  const billboardRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const [cardSize, setCardSize] = useState<[number, number]>([MAX_WIDTH, MAX_HEIGHT]);
  const texture = useTexture(item.url);
  const { size } = useThree();

  // 모바일 환경에서 카드 크기 스케일 조정 (768px 미만)
  const mobileScale = useMemo(() => {
    if (size.width < 768) {
      return 0.7; // 모바일에서 70% 크기
    }
    return 1;
  }, [size.width]);

  // 각 카드마다 다른 애니메이션 오프셋 (아이템 id 기반)
  const floatOffset = useMemo(() => item.id * 1.5, [item.id]);

  // 이미지 비율에 맞춰 카드 크기 계산
  useEffect(() => {
    if (texture.image) {
      const img = texture.image as HTMLImageElement;
      const imgWidth = img.width;
      const imgHeight = img.height;
      const imgRatio = imgWidth / imgHeight;
      const cardRatio = MAX_WIDTH / MAX_HEIGHT;

      let width = MAX_WIDTH;
      let height = MAX_HEIGHT;

      if (imgRatio > cardRatio) {
        // 이미지가 더 가로로 긴 경우
        height = MAX_WIDTH / imgRatio;
      } else {
        // 이미지가 더 세로로 긴 경우
        width = MAX_HEIGHT * imgRatio;
      }

      setCardSize([width, height]);
    }
  }, [texture]);

  const pointerDownPos = useRef<{ x: number; y: number } | null>(null);
  const clickThreshold = 10;

  // 둥근 모서리 이미지 셰이더 머티리얼
  const roundedMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        map: { value: texture },
        radius: { value: 0.05 },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform sampler2D map;
        uniform float radius;
        varying vec2 vUv;

        float roundedBoxSDF(vec2 p, vec2 b, float r) {
          vec2 q = abs(p) - b + r;
          return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
        }

        void main() {
          vec2 uv = vUv;
          vec2 p = uv - 0.5;
          vec2 b = vec2(0.5, 0.5);

          float d = roundedBoxSDF(p, b, radius);

          if (d > 0.0) {
            discard;
          }

          vec4 texColor = texture2D(map, uv);
          gl_FragColor = texColor;
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
    });
  }, [texture]);

  // 후광 셰이더 머티리얼 (중앙에서 퍼지는 원형)
  const glowMaterial = useMemo(() => {
    return new THREE.ShaderMaterial({
      uniforms: {
        time: { value: 0 },
        intensity: { value: 0.3 },
        color: { value: new THREE.Color(0x4488ff) },
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform float time;
        uniform float intensity;
        uniform vec3 color;
        varying vec2 vUv;

        void main() {
          vec2 p = vUv - 0.5;
          float dist = length(p) * 2.0; // 0 ~ 1 범위로 정규화

          // 펄스 애니메이션
          float pulse = sin(time * 2.0) * 0.08 + 0.92;

          // 중앙에서 바깥으로 부드럽게 페이드아웃
          float glow = (1.0 - smoothstep(0.0, 1.0, dist)) * intensity * pulse;

          gl_FragColor = vec4(color, glow);
        }
      `,
      transparent: true,
      side: THREE.DoubleSide,
      depthWrite: false,
    });
  }, []);

  // 선택 시 목표 크기에 맞는 스케일 계산
  const selectedScale = useMemo(() => {
    const scaleX = SELECTED_WIDTH / cardSize[0];
    const scaleY = SELECTED_HEIGHT / cardSize[1];
    // 비율 유지하면서 목표 크기 안에 맞추기
    return Math.min(scaleX, scaleY);
  }, [cardSize]);

  useFrame((state, delta) => {
    if (meshRef.current) {
      // 선택된 이미지는 목표 크기, 호버는 1.15배, 기본은 1배 (모바일 스케일 적용)
      const baseScale = isSelected ? selectedScale : hovered ? 1.15 : 1;
      const targetScale = baseScale * mobileScale;
      meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);
    }

    // 선택되지 않은 카드들의 둥둥 떠다니는 애니메이션
    if (billboardRef.current && hasActiveItem && !isSelected) {
      const time = state.clock.elapsedTime + floatOffset;
      // 부드러운 위아래 움직임
      const floatY = Math.sin(time * 0.8) * 0.15;
      // 약간의 좌우 흔들림
      const floatX = Math.sin(time * 0.5) * 0.08;
      // 살짝 기울어지는 느낌
      const tiltZ = Math.sin(time * 0.6) * 0.03;

      billboardRef.current.position.y = floatY;
      billboardRef.current.position.x = floatX;
      billboardRef.current.rotation.z = tiltZ;
    } else if (billboardRef.current) {
      // 포커싱 해제 시 원래 위치로 부드럽게 복귀
      billboardRef.current.position.y = THREE.MathUtils.lerp(billboardRef.current.position.y, 0, delta * 3);
      billboardRef.current.position.x = THREE.MathUtils.lerp(billboardRef.current.position.x, 0, delta * 3);
      billboardRef.current.rotation.z = THREE.MathUtils.lerp(billboardRef.current.rotation.z, 0, delta * 3);
    }

    // 후광 애니메이션
    if (glowRef.current && glowMaterial.uniforms) {
      glowMaterial.uniforms.time.value = state.clock.elapsedTime;

      // 선택된 카드는 강한 후광, 호버는 중간, 기본은 없음
      const targetIntensity = isSelected ? 1.0 : hovered ? 0.6 : 0;
      glowMaterial.uniforms.intensity.value = THREE.MathUtils.lerp(
        glowMaterial.uniforms.intensity.value,
        targetIntensity,
        delta * 5
      );

      // 선택된 카드는 cyan, 호버는 파란색, 기본은 은은한 파란색
      const targetColor = isSelected
        ? new THREE.Color(0x00ffff)
        : hovered
          ? new THREE.Color(0x66aaff)
          : new THREE.Color(0x4466aa);
      glowMaterial.uniforms.color.value.lerp(targetColor, delta * 5);

      // 후광 스케일도 조정 (카드와 동일하게, 모바일 스케일 적용)
      const baseGlowScale = isSelected ? selectedScale : hovered ? 1.15 : 1.0;
      const glowScale = baseGlowScale * mobileScale;
      glowRef.current.scale.lerp(new THREE.Vector3(glowScale, glowScale, 1), delta * 5);
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

  // 후광 크기는 카드보다 약간 크게 (원형이므로 정사각형)
  const maxCardSize = Math.max(cardSize[0], cardSize[1]);
  const glowSize: [number, number] = [maxCardSize + 1.5, maxCardSize + 1.5];

  return (
    <Billboard position={position} follow={true} lockX={false} lockY={false} lockZ={false}>
      <group ref={billboardRef}>
        {/* 후광 효과 */}
        <mesh ref={glowRef} position={[0, 0, -0.01]}>
          <planeGeometry args={glowSize} />
          <primitive object={glowMaterial} attach="material" />
        </mesh>

        {/* 카드 이미지 */}
        <mesh
          ref={meshRef}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerOver={() => setHovered(true)}
          onPointerOut={() => setHovered(false)}
        >
          <planeGeometry args={cardSize} />
          <primitive object={roundedMaterial} attach="material" />
        </mesh>
      </group>
    </Billboard>
  );
}
