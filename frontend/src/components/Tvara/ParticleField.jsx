import React, {useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";

function ParticleField({ amplitude }) {
  const particlesRef = useRef();
  const count = 100;
  
  const positions = useMemo(() => {
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const radius = 2 + Math.random() * 1.5;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      
      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.sin(phi) * Math.sin(theta);
      positions[i * 3 + 2] = radius * Math.cos(phi);
    }
    return positions;
  }, []);
  
  useFrame(() => {
    if (!particlesRef.current) return;
    
    particlesRef.current.rotation.y += 0.001;
    
    const positionAttribute = particlesRef.current.geometry.attributes.position;
    const sizes = particlesRef.current.geometry.attributes.size;
    
    for (let i = 0; i < count; i++) {
      sizes.array[i] = 0.05 + amplitude * 0.1;
    }
    
    sizes.needsUpdate = true;
  });
}

export default ParticleField;