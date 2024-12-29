import { useKeyboardControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { RigidBody, useRapier } from "@react-three/rapier";
import { useControls } from "leva";
import { useEffect, useRef, useState } from "react";
import { Vector3 } from "three";
import { degToRad } from "three/src/math/MathUtils.js";
import Character from "./Character";

const normalizeAngle = (angle) => {
  while (angle > Math.PI) angle -= 2 * Math.PI;
  while (angle < -Math.PI) angle += 2 * Math.PI;
  return angle;
};

const lerpAngle = (start, end, t) => {
  start = normalizeAngle(start);
  end = normalizeAngle(end);

  if (Math.abs(end - start) > Math.PI) {
    if (end > start) {
      start += 2 * Math.PI;
    } else {
      end += 2 * Math.PI;
    }
  }

  return normalizeAngle(start + (end - start) * t);
};

export const CharacterController = () => {
  const { WALK_SPEED, RUN_SPEED, ROTATION_SPEED } = useControls(
    "Character Control",
    {
      WALK_SPEED: { value: 0.8, min: 0.1, max: 4, step: 0.1 },
      RUN_SPEED: { value: 1.6, min: 0.2, max: 12, step: 0.1 },
      ROTATION_SPEED: {
        value: degToRad(0.5),
        min: degToRad(0.1),
        max: degToRad(5),
        step: degToRad(0.1),
      },
    },
  );

  const rb = useRef();
  const container = useRef();
  const character = useRef();
  const { rapier, world } = useRapier();
  const [subscribeKeys, getKeys] = useKeyboardControls();

  const [animation, setAnimation] = useState("idle");

  const characterRotationTarget = useRef(0);
  const rotationTarget = useRef(0);
  const cameraTarget = useRef();
  const cameraPosition = useRef();
  const cameraWorldPosition = useRef(new Vector3());
  const cameraLookAtWorldPosition = useRef(new Vector3());
  const cameraLookAt = useRef(new Vector3());
  const [, get] = useKeyboardControls();

  const jump = () => {
    const origin = rb.current.translation();
    origin.y += 0.1;
    const direction = { x: 0, y: -1, z: 0 };
    const ray = new rapier.Ray(origin, direction);
    const hit = world.castRay(ray, 10, true);

    console.log(origin);
    if (hit.timeOfImpact < 0.15) {
      rb.current.applyImpulse({ x: 0, y: 10.5, z: 0 });
    }
  };

  useEffect(() => {
    const unsubscribeJump = subscribeKeys(
      (state) => state.jump,
      (value) => {
        if (value) {
          jump();
        }
      },
    );

    return () => {
      unsubscribeJump();
    };
  });

  useFrame(({ camera, mouse }, delta) => {
    const impulse = { x: 0, y: 0, z: 0 };
    const impulseStrength = 0.6 * delta;
    if (rb.current) {
      const vel = rb.current.linvel();

      const movement = {
        x: 0,
        z: 0,
      };

      if (get().forward) {
        movement.z = 1 * impulseStrength;
      }
      if (get().backward) {
        movement.z = -1 * impulseStrength;
      }

      let speed = get().run ? RUN_SPEED : WALK_SPEED;

      // if (isClicking.current) {
      //   console.log("clicking", mouse.x, mouse.y);
      //   if (Math.abs(mouse.x) > 0.1) {
      //     movement.x = -mouse.x;
      //   }
      //   movement.z = mouse.y + 0.4;
      //   if (Math.abs(movement.x) > 0.5 || Math.abs(movement.z) > 0.5) {
      //     speed = RUN_SPEED;
      //   }
      // }

      if (get().leftward) {
        movement.x = 1;
      }
      if (get().rightward) {
        movement.x = -1;
      }

      if (movement.x !== 0) {
        rotationTarget.current += ROTATION_SPEED * movement.x;
      }

      if (movement.x !== 0 || movement.z !== 0) {
        characterRotationTarget.current = Math.atan2(movement.x, movement.z);
        vel.x =
          Math.sin(rotationTarget.current + characterRotationTarget.current) *
          speed;
        vel.z =
          Math.cos(rotationTarget.current + characterRotationTarget.current) *
          speed;
        // if (speed === RUN_SPEED) {
        //   setAnimation("run");
        // } else {
        //   setAnimation("walk");
        // }
      }
      character.current.rotation.y = lerpAngle(
        character.current.rotation.y,
        characterRotationTarget.current,
        0.1,
      );

      rb.current.setLinvel(vel, true);
    }

    // CAMERA
    // container.current.rotation.y = MathUtils.lerp(
    //   container.current.rotation.y,
    //   rotationTarget.current,
    //   0.1
    // );

    // cameraPosition.current.getWorldPosition(cameraWorldPosition.current);
    // camera.position.lerp(cameraWorldPosition.current, 0.1);

    // if (cameraTarget.current) {
    //   cameraTarget.current.getWorldPosition(cameraLookAtWorldPosition.current);
    //   cameraLookAt.current.lerp(cameraLookAtWorldPosition.current, 0.1);

    //   camera.lookAt(cameraLookAt.current);
    // }
  });

  return (
    <RigidBody
      lockRotations
      ref={rb}
      colliders="hull"
      friction={0.2}
      restitution={0}
      position={[0, 0.25, 0]}
    >
      <group ref={container}>
        <group ref={cameraTarget} position-z={1.5} />
        <group ref={cameraPosition} position-y={2} position-z={-6} />
        <group ref={character}>
          <Character />
        </group>
      </group>
    </RigidBody>
  );
};
export default CharacterController;
