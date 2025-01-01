import { Header } from "@/components/header/header";
import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import FBOParticles from "@/components/particles";

export default function Home() {
  return (
    <div className="flex flex-col w-full h-screen overflow-hidden pb-[env(safe-area-inset-bottom)]">
      <div className="relative z-50">
        <Header />
      </div>
      <div className="flex-1 flex items-center justify-center">
        <h1 className="text-xl md:text-3xl font-bold text-center fade-in relative z-40 px-4 md:px-0">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-secondary drop-shadow-[0_0_25px_rgba(255,255,255,0.5)]">
            BUILD YOUR OWN AI AGENT WITH{" "}
          </span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#00D2BE] via-secondary to-[#00D2BE] drop-shadow-[0_0_30px_rgba(0,210,190,0.6)]">
            SYNP
          </span>
          <br />
          <span className="text-white text-xs md:text-sm mt-2">
            HYPERLIQUID x ELIZA
          </span>
        </h1>
      </div>
      <div className="absolute inset-0 z-0">
        <Suspense fallback={<LoadingScene />}>
          <div className="w-full h-full max-w-[500px] max-h-[500px] md:max-w-none md:max-h-none mx-auto pt-20 md:pt-6">
            <Canvas
              camera={{ position: [1.5, 1.5, 2.5] }}
              className="cursor-grab active:cursor-grabbing"
              style={{
                background: "black",
                width: "100%",
                height: "100%",
              }}
            >
              <Scene />
            </Canvas>
          </div>
        </Suspense>
      </div>
    </div>
  );
}

function LoadingScene() {
  return (
    <Canvas
      camera={{ position: [1.5, 1.5, 2.5] }}
      style={{
        background: "black",
        width: "100%",
        height: "100%",
      }}
    >
      <mesh position={[0, 0, 0]} scale={0.1}>
        <sphereGeometry />
        <meshBasicMaterial color="#00D2BE" transparent opacity={0.2} />
      </mesh>
    </Canvas>
  );
}

function Scene() {
  const particlesRef = useRef();
  const startPos = 12;

  useFrame(() => {
    if (particlesRef.current) {
      particlesRef.current.position.z = lerp(
        particlesRef.current.position.z,
        0,
        0.025
      );
      particlesRef.current.scale.setScalar(
        lerp(particlesRef.current.scale.x, 1, 0.025)
      );
    }
  });

  return (
    <>
      <ambientLight intensity={0.5} />
      <group ref={particlesRef} position={[0, 0, startPos]} scale={0.3}>
        <FBOParticles />
      </group>
      <OrbitControls makeDefault enableZoom={false} />
    </>
  );
}

function lerp(start: number, end: number, amt: number) {
  return (1 - amt) * start + amt * end;
}
