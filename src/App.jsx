import { KeyboardControls } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Experience } from "./components/Experience";

function App() {
  const keyBoardMap = [
    { name: "forward", keys: ["ArrowUp", "KeyW"] },
    { name: "backward", keys: ["ArrowDown", "KeyS"] },
    { name: "leftward", keys: ["ArrowLeft", "KeyA"] },
    { name: "rightward", keys: ["ArrowRight", "KeyD"] },
    { name: "run", keys: ["Shift"] },
    { name: "jump", keys: ["Space"] },
  ];

  return (
    <KeyboardControls map={keyBoardMap}>
      <Canvas
        shadows
        style={{ width: "100vw", height: "100vh" }}
        camera={{ position: [3, 3, 3], near: 0.1, fov: 40 }}
      >
        <color attach="background" args={["#ececec"]} />
        <Experience />
      </Canvas>
    </KeyboardControls>
  );
}

export default App;
