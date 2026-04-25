import { useRef, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { PerspectiveCamera, Environment, Points, PointMaterial } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import * as THREE from "three";

function ParticleRing() {
  const pointsRef = useRef<THREE.Points>(null!);
  
  const particleCount = 4000;
  const positions = useMemo(() => {
    const pos = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const theta = THREE.MathUtils.randFloatSpread(360);
      const phi = THREE.MathUtils.randFloatSpread(360);
      
      const radius = 2 + Math.random() * 0.1; // Concentrated shell
      
      pos[i * 3] = radius * Math.sin(theta) * Math.cos(phi);
      pos[i * 3 + 1] = radius * Math.sin(theta) * Math.sin(phi);
      pos[i * 3 + 2] = radius * Math.cos(theta);
    }
    return pos;
  }, []);

  const colors = useMemo(() => {
    const cols = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      const y = positions[i * 3 + 1];
      // Normalize y to 0-1 for gradient
      const t = (y + 2) / 4;
      
      // Top: Orange (#ff9d00), Bottom: Purple (#a855f7)
      const color1 = new THREE.Color("#ff9d00");
      const color2 = new THREE.Color("#a855f7");
      
      const mixedColor = color1.clone().lerp(color2, 1 - t);
      
      cols[i * 3] = mixedColor.r;
      cols[i * 3 + 1] = mixedColor.g;
      cols[i * 3 + 2] = mixedColor.b;
    }
    return cols;
  }, [positions]);

  useFrame((state) => {
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.1;
    pointsRef.current.rotation.z = state.clock.getElapsedTime() * 0.05;
    
    // Subtle pulse
    const scale = 1 + Math.sin(state.clock.getElapsedTime() * 0.5) * 0.02;
    pointsRef.current.scale.set(scale, scale, scale);
  });

  return (
    <Points ref={pointsRef} positions={positions} colors={colors} stride={3}>
      <PointMaterial
        transparent
        vertexColors
        size={0.015}
        sizeAttenuation={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </Points>
  );
}

function Grid() {
  return (
    <gridHelper 
      args={[20, 20, 0x111111, 0x050505]} 
      rotation={[Math.PI / 2, 0, 0]} 
      position={[0, 0, -5]}
    />
  );
}

export default function UpseraScene() {
  return (
    <div className="absolute inset-0 z-0 bg-[#050505]" id="3d-scene-container">
      <Canvas dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} />
        <ambientLight intensity={0.2} />
        <pointLight position={[10, 10, 10]} intensity={0.5} />
        
        <ParticleRing />
        <Grid />
        
        <EffectComposer>
          <Bloom 
            intensity={1.5} 
            luminanceThreshold={0.1} 
            luminanceSmoothing={0.9} 
            radius={0.8}
          />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
