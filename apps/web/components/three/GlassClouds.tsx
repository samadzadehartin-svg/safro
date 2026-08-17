"use client";

import { Float, MeshTransmissionMaterial } from "@react-three/drei";

type GlassCloudProps = {
  position: [number, number, number];
  scale: [number, number, number];
  speed: number;
  rotation: [number, number, number];
  resolution: number;
  samples: number;
};

function GlassCloud({ position, scale, speed, rotation, resolution, samples }: GlassCloudProps) {
  return (
    <Float speed={speed} rotationIntensity={0.16} floatIntensity={0.45} floatingRange={[-0.18, 0.22]}>
      <mesh position={position} rotation={rotation} scale={scale}>
        <icosahedronGeometry args={[1, 3]} />
        <MeshTransmissionMaterial
          color="#c9dcff"
          transmission={1}
          transmissionSampler
          thickness={0.85}
          roughness={0.19}
          ior={1.18}
          chromaticAberration={0.025}
          anisotropicBlur={0.06}
          distortion={0.08}
          distortionScale={0.18}
          temporalDistortion={0.05}
          clearcoat={1}
          clearcoatRoughness={0.17}
          samples={samples}
          resolution={resolution}
          backside={false}
        />
      </mesh>
    </Float>
  );
}

export function GlassClouds({ balanced = false }: { balanced?: boolean }) {
  const resolution = balanced ? 64 : 128;
  const samples = balanced ? 2 : 4;

  return (
    <group>
      <GlassCloud
        position={[-1.0, -3.2, 1.4]}
        scale={[2.8, 0.62, 1.15]}
        rotation={[0.08, 0.05, -0.04]}
        speed={0.72}
        resolution={resolution}
        samples={samples}
      />
      <GlassCloud
        position={[3.45, -2.55, 0.45]}
        scale={[2.15, 0.55, 0.92]}
        rotation={[-0.08, -0.22, 0.1]}
        speed={0.58}
        resolution={resolution}
        samples={samples}
      />
      {!balanced && (
        <GlassCloud
          position={[-4.25, -2.15, -0.6]}
          scale={[1.65, 0.48, 0.86]}
          rotation={[0.12, 0.28, -0.08]}
          speed={0.5}
          resolution={resolution}
          samples={samples}
        />
      )}
    </group>
  );
}
