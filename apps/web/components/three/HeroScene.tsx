"use client";

import { Stars } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { useWebGLHero } from "@/hooks/useWebGLHero";
import { EiffelTower } from "./EiffelTower";
import { GlassClouds } from "./GlassClouds";

function CameraRig() {
  const pointer = useRef({ x: 0, y: 0 });
  const scrollProgress = useRef(0);
  const lookAt = useRef(new THREE.Vector3(-0.25, 0.2, 0));

  useEffect(() => {
    const handlePointer = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth - 0.5) * 2;
      pointer.current.y = (event.clientY / window.innerHeight - 0.5) * 2;
    };

    const handleScroll = () => {
      scrollProgress.current = THREE.MathUtils.clamp(window.scrollY / Math.max(window.innerHeight, 1), 0, 1);
    };

    handleScroll();
    window.addEventListener("pointermove", handlePointer, { passive: true });
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("pointermove", handlePointer);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useFrame((state, delta) => {
    const scroll = scrollProgress.current;
    const smooth = 1 - Math.exp(-delta * 3.4);
    const targetX = pointer.current.x * 0.58 + scroll * 0.32;
    const targetY = 0.35 - pointer.current.y * 0.26 - scroll * 0.45;
    const targetZ = 13.6 - scroll * 0.85;

    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, targetX, smooth);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, targetY, smooth);
    state.camera.position.z = THREE.MathUtils.lerp(state.camera.position.z, targetZ, smooth);

    lookAt.current.set(-0.35 + pointer.current.x * 0.08, 0.15 - scroll * 0.2, 0);
    state.camera.lookAt(lookAt.current);
  });

  return null;
}

function Scene({ balanced }: { balanced: boolean }) {
  return (
    <>
      <fog attach="fog" args={["#071326", 13, 31]} />
      <ambientLight intensity={0.7} color="#8aaeff" />
      <directionalLight position={[5, 8, 7]} intensity={2.2} color="#d9e8ff" />
      <pointLight position={[-4, 0.5, 2]} intensity={36} distance={12} color="#f0b45d" />
      <pointLight position={[3, -1, 3]} intensity={18} distance={10} color="#6ea4ff" />

      <Stars
        radius={34}
        depth={18}
        count={balanced ? 850 : 1450}
        factor={2.1}
        saturation={0.1}
        fade
        speed={0.16}
      />

      <group position={[-4.15, -0.55, -0.65]} scale={0.78}>
        <EiffelTower />
      </group>

      <GlassClouds balanced={balanced} />
      <CameraRig />
    </>
  );
}

export function HeroScene() {
  const capability = useWebGLHero();

  useEffect(() => {
    if (!capability.enabled) {
      document.documentElement.classList.remove("webgl-hero-ready");
    }

    return () => document.documentElement.classList.remove("webgl-hero-ready");
  }, [capability.enabled]);

  if (!capability.enabled) return null;

  return (
    <div className="site-scene" aria-hidden="true">
      <Canvas
        dpr={capability.dpr}
        camera={{ position: [0, 0.35, 13.6], fov: 42, near: 0.1, far: 60 }}
        gl={{
          alpha: true,
          antialias: capability.quality === "high",
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor("#000000", 0);
          document.documentElement.classList.add("webgl-hero-ready");
        }}
      >
        <Scene balanced={capability.quality === "balanced"} />
      </Canvas>
    </div>
  );
}
