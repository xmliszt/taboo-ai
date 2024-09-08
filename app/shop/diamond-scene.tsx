import { Suspense, useEffect, useRef } from 'react';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { BloomPass } from 'three/examples/jsm/postprocessing/BloomPass';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { OutputPass } from 'three/examples/jsm/postprocessing/OutputPass';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass';

// Load the GLTF model
const DiamondModel = () => {
  const { scene } = useGLTF('/models/diamond.glb'); // Path to your model in the public directory

  // Apply reflective purple material to the entire model
  scene.traverse((child) => {
    if (child instanceof THREE.Mesh) {
      child.material = new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(0x800090), // Purple color
        metalness: 0.9,
        roughness: 0.4,
        envMapIntensity: 1,
        clearcoat: 0.5,
        clearcoatRoughness: 0.1,
      });
    }
  });

  return <primitive object={scene} scale={[0.3, 0.38, 0.3]} position={[0, -1, 0]} />;
};

const Effects = () => {
  const { gl, scene, camera } = useThree();
  const composer = useRef<EffectComposer | null>(null);

  useEffect(() => {
    composer.current = new EffectComposer(gl);
    composer.current.addPass(new RenderPass(scene, camera));
    composer.current.addPass(new BloomPass(2, 5, 0.9));
    composer.current.addPass(new OutputPass());
  }, []);

  useFrame(() => {
    composer.current?.render();
  }, 1);

  return null;
};

export const DiamondScene = () => {
  return (
    <Canvas style={{ width: '100%', height: '100%' }} camera={{ position: [1, 3.5, 1], fov: 75 }}>
      <ambientLight intensity={0.5} />
      <directionalLight position={[1, 3, 0]} intensity={1} />
      <directionalLight position={[-1, -3, 0]} intensity={1} />
      <pointLight position={[1, 5, 1]} intensity={0.5} />
      <pointLight position={[-1, -5, -1]} intensity={0.5} />
      <spotLight position={[5, 0, 5]} intensity={0.5} angle={Math.PI / 6} penumbra={1} />
      <spotLight position={[-5, 0, -5]} intensity={0.5} angle={Math.PI / 6} penumbra={1} />

      {/* Model should be wrapped in Suspense for loading */}
      <Suspense fallback={null}>
        <DiamondModel />
      </Suspense>

      <OrbitControls
        autoRotate
        autoRotateSpeed={2.0}
        enableZoom={false}
        enablePan={false}
        minPolarAngle={Math.PI / 3}
        maxPolarAngle={Math.PI / 3}
      />

      <Effects />
    </Canvas>
  );
};
