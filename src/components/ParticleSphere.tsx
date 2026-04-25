import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';
import { motion } from 'motion/react';

const ParticleSphere = () => {
  const pointsRef = useRef<THREE.Points>(null!);
  const { mouse } = useThree();

  const [positions, colors] = useMemo(() => {
    const count = 3000;
    const positions = new Float32Array(count * 3);
    const colors = new Float32Array(count * 3);
    const color1 = new THREE.Color('#ff8c00'); // Orange
    const color2 = new THREE.Color('#6a0dad'); // Purple

    for (let i = 0; i < count; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(Math.random() * 2 - 1);
      const r = 1.5;

      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);

      positions[i * 3] = x;
      positions[i * 3 + 1] = y;
      positions[i * 3 + 2] = z;

      // Gradient color based on position
      const mixedColor = color1.clone().lerp(color2, (y + r) / (r * 2));
      colors[i * 3] = mixedColor.r;
      colors[i * 3 + 1] = mixedColor.g;
      colors[i * 3 + 2] = mixedColor.b;
    }
    return [positions, colors];
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    if (pointsRef.current) {
      // Base rotation
      pointsRef.current.rotation.y = time * 0.05 + (mouse.x * 0.2);
      pointsRef.current.rotation.x = time * 0.02 - (mouse.y * 0.2);

      const positions = pointsRef.current.geometry.attributes.position.array as Float32Array;
      for (let i = 0; i < positions.length; i += 3) {
        const ix = i;
        const iy = i + 1;
        const iz = i + 2;

        const x = positions[ix];
        const y = positions[iy];
        const z = positions[iz];

        // Organic "breathing" or "wobble" effect
        const distance = Math.sqrt(x*x + y*y + z*z);
        const force = Math.sin(distance * 2 - time * 2) * 0.002;
        
        positions[ix] += (x / distance) * force;
        positions[iy] += (y / distance) * force;
        positions[iz] += (z / distance) * force;
      }
      pointsRef.current.geometry.attributes.position.needsUpdate = true;
    }
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors}>
      <PointMaterial
        transparent
        vertexColors
        size={0.03}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
};

export default function SphereCanvas() {
  return (
    <div className="w-full h-full min-h-[400px] relative flex items-center justify-center">
      <div className="absolute inset-0 pointer-events-none">
        <Canvas camera={{ position: [0, 0, 4], fov: 45 }}>
          <ambientLight intensity={0.5} />
          <ParticleSphere />
        </Canvas>
      </div>
      
      {/* Cinematic Text Overlay - Now part of the animation ecosystem */}
      <div className="relative z-10 text-center pointer-events-none">
        <motion.div
           initial={{ opacity: 0, scale: 0.8, filter: 'blur(10px)' }}
           whileInView={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
           transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-8xl font-black tracking-tighter text-white drop-shadow-[0_0_30px_rgba(255,140,0,0.3)]">
            DIRECT EXECUTION
          </div>
          <div className="text-sm uppercase tracking-[0.8em] mt-4 text-white/60 font-light">
            One Team. Full Ownership.
          </div>
        </motion.div>
      </div>

      {/* Atmospheric Glows */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div className="w-[500px] h-[500px] rounded-full bg-orange-500/5 blur-[120px] animate-pulse"></div>
        <div className="w-[700px] h-[700px] rounded-full bg-purple-500/5 blur-[160px]"></div>
      </div>
    </div>
  );
}
