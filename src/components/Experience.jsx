import {
  Environment,
  OrbitControls,
  OrthographicCamera
} from "@react-three/drei"
import { useFrame } from '@react-three/fiber'
import { Physics } from '@react-three/rapier'
import { useRef } from "react"
import CharacterController from './CharacterController'
import Map from './Map'

export const Experience = () => {
  const shadowCameraRef = useRef();


	const light = useRef();

    useFrame((state) => {
        light.current.position.z = state.camera.position.z + 1 - 4;
        light.current.target.position.z = state.camera.position.z - 4;
        light.current.target.updateMatrixWorld();
    })

  return (
    <>
      <OrbitControls />
      <Environment preset="sunset" />
      <directionalLight
				ref={light}
        intensity={0.65}
        castShadow
        position={[-15, 10, 15]}
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-bias={-0.00005}
      >
        <OrthographicCamera
          left={-22}
          right={15}
          top={10}
          bottom={-20}
          ref={shadowCameraRef}
          attach={"shadow-camera"}
        />
      </directionalLight>
      <Physics debug>
          <Map/>
          <CharacterController/>
      </Physics>
    </>
  );
};
