import { useGLTF } from "@react-three/drei";
import { RigidBody } from "@react-three/rapier";
import * as THREE from "three";

export const Map = () => {
  const room = useGLTF("./room.glb");

  return (
    <>
      <RigidBody type="fixed">
        <mesh
          geometry={new THREE.BoxGeometry(10, 0.2, 10)}
          material={new THREE.MeshStandardMaterial({ color: "red" })}
          scale={[4, 0.2, 4]}
          receiveShadow
        />
      </RigidBody>

      <RigidBody type="fixed" colliders="trimesh">
        <mesh
          geometry={room.nodes.Cube003.geometry}
          receiveShadow
          position={[1, 1, 1]}
        >
          <meshStandardMaterial
            color="#6F6F6F"
            metalness={0.8} // Increase metalness (1 is maximum)
            roughness={0.3} // Decrease roughness (0 is the smoothest)
          />
        </mesh>
      </RigidBody>
    </>
  );
};

export default Map;
