import React, { useRef } from "react";
import { useFrame } from "@react-three/fiber";
function VibratingSphere({ amplitude }) {
  const meshRef = useRef();

  useFrame(() => {
    if (!meshRef.current) return;

    meshRef.current.rotation.y += 0.01;
    meshRef.current.rotation.x += 0.005;

    const scale = 1 + Math.min(amplitude * 2, 0.3);
    meshRef.current.scale.set(scale, scale, scale);

    const material = meshRef.current.material;
    material.emissiveIntensity = amplitude * 2;
    material.color.setHSL(0.6 - amplitude * 0.5, 1, 0.6 + amplitude * 0.3);
  });

  return (
    <group>
      <mesh ref={meshRef}>
        <sphereGeometry args={[1, 64, 64]} />
        <meshStandardMaterial
          color="#66ccff"
          metalness={0.5}
          roughness={0.1}
          emissive={"#00aaff"}
          emissiveIntensity={0.2}
        />
      </mesh>
      
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial 
          color="#66ccff" 
          transparent 
          opacity={0.1 + amplitude * 0.2} 
        />
      </mesh>
    </group>
  );
}

export default VibratingSphere;