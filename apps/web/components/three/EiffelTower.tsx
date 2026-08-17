"use client";

import { useEffect, useLayoutEffect, useMemo, useRef } from "react";
import * as THREE from "three";

type Point = [number, number, number];

type Beam = {
  start: Point;
  end: Point;
  thickness?: number;
};

type Level = {
  y: number;
  x: number;
  z: number;
};

const levels: Level[] = [
  { y: -4.6, x: 1.75, z: 1.05 },
  { y: -1.15, x: 0.92, z: 0.62 },
  { y: 2.25, x: 0.43, z: 0.32 },
  { y: 4.65, x: 0.16, z: 0.14 },
];

function corners(level: Level): Point[] {
  return [
    [-level.x, level.y, -level.z],
    [level.x, level.y, -level.z],
    [level.x, level.y, level.z],
    [-level.x, level.y, level.z],
  ];
}

function beamMatrix({ start, end, thickness = 0.075 }: Beam) {
  const startVector = new THREE.Vector3(...start);
  const endVector = new THREE.Vector3(...end);
  const direction = endVector.clone().sub(startVector);
  const length = direction.length();
  const midpoint = startVector.clone().add(endVector).multiplyScalar(0.5);
  const quaternion = new THREE.Quaternion().setFromUnitVectors(
    new THREE.Vector3(0, 1, 0),
    direction.normalize(),
  );

  return new THREE.Matrix4().compose(
    midpoint,
    quaternion,
    new THREE.Vector3(thickness, length, thickness),
  );
}

function boxMatrix(position: Point, scale: Point) {
  return new THREE.Matrix4().compose(
    new THREE.Vector3(...position),
    new THREE.Quaternion(),
    new THREE.Vector3(...scale),
  );
}

export function EiffelTower() {
  const instanceRef = useRef<THREE.InstancedMesh>(null);
  const geometry = useMemo(() => new THREE.BoxGeometry(1, 1, 1), []);
  const material = useMemo(
    () =>
      new THREE.MeshStandardMaterial({
        color: "#bf8a45",
        metalness: 0.72,
        roughness: 0.35,
        emissive: new THREE.Color("#3a210b"),
        emissiveIntensity: 0.38,
      }),
    [],
  );

  const matrices = useMemo(() => {
    const beams: Beam[] = [];

    for (let levelIndex = 0; levelIndex < levels.length - 1; levelIndex += 1) {
      const lower = corners(levels[levelIndex]);
      const upper = corners(levels[levelIndex + 1]);

      for (let cornerIndex = 0; cornerIndex < 4; cornerIndex += 1) {
        beams.push({ start: lower[cornerIndex], end: upper[cornerIndex], thickness: 0.11 });
      }

      for (let face = 0; face < 4; face += 1) {
        const next = (face + 1) % 4;
        beams.push({ start: lower[face], end: upper[next], thickness: 0.052 });
        beams.push({ start: lower[next], end: upper[face], thickness: 0.052 });
      }
    }

    for (const level of levels.slice(1)) {
      const ring = corners(level);
      for (let index = 0; index < 4; index += 1) {
        beams.push({ start: ring[index], end: ring[(index + 1) % 4], thickness: 0.095 });
      }
    }

    const crown = corners(levels[levels.length - 1]);
    const mastBase: Point = [0, 5.75, 0];
    const tip: Point = [0, 6.8, 0];

    crown.forEach((corner) => beams.push({ start: corner, end: mastBase, thickness: 0.07 }));
    beams.push({ start: mastBase, end: tip, thickness: 0.08 });

    return [
      ...beams.map(beamMatrix),
      boxMatrix([0, -1.12, 0], [2.1, 0.16, 1.5]),
      boxMatrix([0, 2.28, 0], [1.05, 0.13, 0.75]),
      boxMatrix([0, 4.68, 0], [0.48, 0.11, 0.42]),
    ];
  }, []);

  useLayoutEffect(() => {
    const mesh = instanceRef.current;
    if (!mesh) return;

    matrices.forEach((matrix, index) => mesh.setMatrixAt(index, matrix));
    mesh.instanceMatrix.needsUpdate = true;
    mesh.computeBoundingSphere();
  }, [matrices]);

  useEffect(
    () => () => {
      geometry.dispose();
      material.dispose();
    },
    [geometry, material],
  );

  return (
    <group rotation={[0, -0.16, 0]}>
      <instancedMesh
        ref={instanceRef}
        args={[geometry, material, matrices.length]}
        castShadow={false}
        receiveShadow={false}
        frustumCulled
      />
    </group>
  );
}
