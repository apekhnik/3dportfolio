import { useGLTF } from "@react-three/drei";

export const Character = () => {
  const humberger = useGLTF("./hamburger.glb");

  humberger.scene.children.forEach((mesh) => {
    mesh.castShadow = true;
  });

  // return <primitive
  // 	scale={0.2}
  // 	object={humberger.scene}
  // />

  return (
    <mesh castShadow>
      <boxGeometry args={[0.5, 1, 0.5]} />
      <meshStandardMaterial flatShading color="mediumpurple" />
    </mesh>
  );
};

export default Character;
