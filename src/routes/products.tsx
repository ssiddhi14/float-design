import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Float,
  MeshDistortMaterial,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";

export const Route = createFileRoute("/products")({
  head: () => ({
    meta: [
      { title: "Products - 3D HUB" },
      { name: "description", content: "Award-winning 3D products and immersive experiences." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700;800&display=swap",
      },
    ],
  }),
  component: Products,
});

// 3D Scene Objects

function MetallicSpring({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.18 + scrollY.current * 0.0004;
    ref.current.rotation.y = s.clock.elapsedTime * 0.24;
    ref.current.position.y = Math.sin(s.clock.elapsedTime * 0.5) * 0.2;
  });
  return (
    <mesh ref={ref} position={[-2.4, 0.3, 0.2]}>
      <torusKnotGeometry args={[0.65, 0.2, 180, 28]} />
      <meshStandardMaterial color="#b8cce0" metalness={0.96} roughness={0.06} envMapIntensity={2} />
    </mesh>
  );
}

function GlassBall({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.y = s.clock.elapsedTime * 0.15;
    ref.current.position.y = Math.cos(s.clock.elapsedTime * 0.45) * 0.22 - 0.1;
    ref.current.position.x = 2.5 + Math.sin(s.clock.elapsedTime * 0.28) * 0.07;
  });
  return (
    <mesh ref={ref} position={[2.5, -0.1, 0.6]}>
      <sphereGeometry args={[0.68, 64, 64]} />
      <MeshTransmissionMaterial
        backside
        samples={6}
        thickness={0.6}
        roughness={0.04}
        chromaticAberration={0.07}
        color="#dde8f8"
        distortion={0.18}
        distortionScale={0.25}
        temporalDistortion={0.08}
        transmissionSampler
      />
    </mesh>
  );
}

function GlassCube() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.19;
    ref.current.rotation.y = s.clock.elapsedTime * 0.14;
    ref.current.position.y = -0.4 + Math.sin(s.clock.elapsedTime * 0.6 + 1) * 0.14;
  });
  return (
    <mesh ref={ref} position={[0.4, -0.4, -1.4]}>
      <boxGeometry args={[0.75, 0.75, 0.75]} />
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.05}
        roughness={0.0}
        transmission={0.94}
        thickness={1.1}
        clearcoat={1}
        transparent
        opacity={0.88}
      />
    </mesh>
  );
}

function OrangeOrb() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.12;
    ref.current.position.y = 1.3 + Math.sin(s.clock.elapsedTime * 0.55 + 2) * 0.18;
    ref.current.position.x = -0.6 + Math.cos(s.clock.elapsedTime * 0.3) * 0.09;
  });
  return (
    <mesh ref={ref} position={[-0.6, 1.3, 1.1]}>
      <sphereGeometry args={[0.5, 64, 64]} />
      <MeshDistortMaterial
        color="#FF6B00"
        metalness={0.35}
        roughness={0.18}
        emissive="#FF3D00"
        emissiveIntensity={0.28}
        distort={0.32}
        speed={2.2}
      />
    </mesh>
  );
}

function ChromeRing({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.x = s.clock.elapsedTime * 0.32 + scrollY.current * 0.0006;
    ref.current.rotation.y = s.clock.elapsedTime * 0.25;
    ref.current.position.y = 0.9 + Math.sin(s.clock.elapsedTime * 0.7 + 3) * 0.13;
  });
  return (
    <mesh ref={ref} position={[3.0, 0.9, -0.6]}>
      <torusGeometry args={[0.36, 0.09, 32, 80]} />
      <meshStandardMaterial color="#99b0cc" metalness={0.99} roughness={0.04} envMapIntensity={2.2} />
    </mesh>
  );
}

function SmallCapsule() {
  const ref = useRef<THREE.Mesh>(null);
  useFrame((s) => {
    if (!ref.current) return;
    ref.current.rotation.z = s.clock.elapsedTime * 0.2;
    ref.current.rotation.x = s.clock.elapsedTime * 0.15;
    ref.current.position.y = -1.1 + Math.sin(s.clock.elapsedTime * 0.4 + 4) * 0.12;
  });
  return (
    <mesh ref={ref} position={[-3.0, -1.1, 0.4]}>
      <capsuleGeometry args={[0.18, 0.5, 16, 32]} />
      <meshStandardMaterial color="#c0d4e8" metalness={0.9} roughness={0.1} envMapIntensity={1.8} />
    </mesh>
  );
}

function SceneObjects({ scrollY }: { scrollY: React.MutableRefObject<number> }) {
  return (
    <>
      <ambientLight intensity={0.55} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow />
      <directionalLight position={[-5, 2, -3]} intensity={0.7} color="#a8c0ff" />
      <pointLight position={[0, 4, 2]} intensity={0.9} color="#FF6B00" />
      <pointLight position={[3, -2, 3]} intensity={0.4} color="#e0eaff" />
      <Float speed={1.1} rotationIntensity={0.08} floatIntensity={0.25}>
        <MetallicSpring scrollY={scrollY} />
      </Float>
      <GlassBall scrollY={scrollY} />
      <GlassCube />
      <OrangeOrb />
      <ChromeRing scrollY={scrollY} />
      <SmallCapsule />
      <Environment preset="studio" />
    </>
  );
}

// Words for cinematic transitions
const WORDS = ["WEBBY", "AWWWARDS", "DESIGN", "CREATIVE", "DIGITAL"];

// Products Page

function Products() {
  const wrapperRef    = useRef<HTMLDivElement>(null);
  const bgGlowRef     = useRef<HTMLDivElement>(null);
  const canvasWrapRef = useRef<HTMLDivElement>(null);
  const bgWordRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const fgWordRefs    = useRef<(HTMLSpanElement | null)[]>([]);
  const dotRefs       = useRef<(HTMLDivElement | null)[]>([]);
  const scrollYRef    = useRef(0);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const N        = WORDS.length;
    const segSize  = 1 / N;
    const overlap  = segSize * 0.38;

    // Set initial states - first word visible, rest hidden
    bgWordRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, i === 0
        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, y: 130, scale: 1.1, filter: "blur(12px)" }
      );
    });
    fgWordRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, i === 0
        ? { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
        : { opacity: 0, y: 130, scale: 1.1, filter: "blur(12px)" }
      );
    });
    dotRefs.current.forEach((dot, i) => {
      if (!dot) return;
      dot.style.background  = i === 0 ? "#FF6B00" : "rgba(0,0,0,0.18)";
      dot.style.transform   = i === 0 ? "scale(1.5)" : "scale(1)";
    });

    const ctx = gsap.context(() => {

      // Track scroll for 3D objects
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        onUpdate: (self) => {
          scrollYRef.current = self.progress * window.innerHeight * N;
        },
      });

      // Background glow - slowest parallax 0.1x
      gsap.to(bgGlowRef.current, {
        y: "-20%",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // 3D canvas - mid parallax 0.5x
      gsap.to(canvasWrapRef.current, {
        y: "-15%",
        ease: "none",
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: true,
        },
      });

      // Word transitions - scroll scrubbed
      WORDS.forEach((_, i) => {
        const bg      = bgWordRefs.current[i];
        const fg      = fgWordRefs.current[i];
        const targets = [bg, fg].filter(Boolean);

        const segStart = i * segSize;
        const segEnd   = (i + 1) * segSize;

        // ENTER: from below, blur clears, scale settles
        if (i > 0) {
          const enterStart = segStart - overlap * 0.5;
          const enterEnd   = segStart + overlap * 0.5;
          gsap.fromTo(
            targets,
            { opacity: 0, y: 130, scale: 1.1, filter: "blur(12px)" },
            {
              opacity: 1, y: 0, scale: 1, filter: "blur(0px)",
              ease: "power2.out",
              scrollTrigger: {
                trigger: wrapper,
                start: `${enterStart * 100}% top`,
                end:   `${enterEnd * 100}% top`,
                scrub: 1,
              },
            }
          );
        }

        // EXIT: upward, blur increases, scale shrinks, dims to ghost
        if (i < N - 1) {
          const exitStart = segEnd - overlap * 0.5;
          const exitEnd   = segEnd + overlap * 0.5;
          gsap.fromTo(
            targets,
            { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" },
            {
              opacity: 0.08,
              y: -120,
              scale: 0.88,
              filter: "blur(10px)",
              ease: "power2.in",
              scrollTrigger: {
                trigger: wrapper,
                start: `${exitStart * 100}% top`,
                end:   `${exitEnd * 100}% top`,
                scrub: 1,
              },
            }
          );
        }

        // Update progress dots
        ScrollTrigger.create({
          trigger: wrapper,
          start: `${segStart * 100}% top`,
          end:   `${segEnd * 100}% top`,
          onEnter:      () => updateDots(i),
          onEnterBack:  () => updateDots(i),
        });
      });

    }, wrapper);

    function updateDots(activeIdx: number) {
      dotRefs.current.forEach((dot, j) => {
        if (!dot) return;
        dot.style.background = j === activeIdx ? "#FF6B00" : "rgba(0,0,0,0.18)";
        dot.style.transform  = j === activeIdx ? "scale(1.5)" : "scale(1)";
      });
    }

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        height: `${(WORDS.length + 1.5) * 100}vh`,
        position: "relative",
        background: "#F0F3FA",
        fontFamily: "'Plus Jakarta Sans', sans-serif",
      }}
    >
      {/* Sticky viewport */}
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
        }}
      >
        {/* LAYER 0 - BG gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: "linear-gradient(155deg, #F5F6FA 0%, #E8EDF7 45%, #DCE4F2 100%)",
            zIndex: 0,
          }}
        />

        {/* Subtle noise grain */}
        <svg
          aria-hidden
          style={{
            position: "absolute", inset: 0,
            width: "100%", height: "100%",
            zIndex: 1, opacity: 0.35, pointerEvents: "none",
          }}
        >
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.85" numOctaves="4" stitchTiles="stitch" />
            <feColorMatrix type="saturate" values="0" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" opacity="0.04" />
        </svg>

        {/* LAYER 1 - Ambient glow (slowest parallax) */}
        <div
          ref={bgGlowRef}
          aria-hidden
          style={{
            position: "absolute",
            left: "50%",
            top: "35%",
            transform: "translate(-50%, -50%)",
            width: "85vw",
            height: "85vw",
            maxWidth: 960,
            maxHeight: 960,
            borderRadius: "9999px",
            background:
              "radial-gradient(circle at 50% 50%, rgba(170,195,240,0.5) 0%, rgba(195,215,248,0.22) 38%, rgba(240,243,250,0) 68%)",
            filter: "blur(70px)",
            zIndex: 2,
            willChange: "transform",
          }}
        />

        {/* LAYER 2 - BG typography (behind 3D objects, z=3) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 3,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {WORDS.map((word, i) => (
            <span
              key={`bg-${word}`}
              ref={(el) => { bgWordRefs.current[i] = el; }}
              style={{
                position: "absolute",
                fontSize: "clamp(5.5rem, 15vw, 17rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "rgba(8,18,50,0.065)",
                mixBlendMode: "multiply",
                whiteSpace: "nowrap",
                willChange: "transform, opacity, filter",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* LAYER 3 - 3D Canvas (mid parallax, z=4) */}
        <div
          ref={canvasWrapRef}
          style={{
            position: "absolute",
            inset: "-12% 0",
            zIndex: 4,
            willChange: "transform",
          }}
        >
          <Suspense fallback={null}>
            <Canvas
              dpr={[1, 2]}
              camera={{ position: [0, 0, 5.8], fov: 44 }}
              gl={{ antialias: true, alpha: true }}
              style={{ width: "100%", height: "100%" }}
            >
              <SceneObjects scrollY={scrollYRef} />
            </Canvas>
          </Suspense>
        </div>

        {/* LAYER 4 - FG typography (in front of some objects, z=6) */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 6,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            pointerEvents: "none",
            userSelect: "none",
          }}
        >
          {WORDS.map((word, i) => (
            <span
              key={`fg-${word}`}
              ref={(el) => { fgWordRefs.current[i] = el; }}
              style={{
                position: "absolute",
                fontSize: "clamp(5.5rem, 15vw, 17rem)",
                fontWeight: 800,
                letterSpacing: "-0.04em",
                lineHeight: 1,
                color: "transparent",
                WebkitTextStroke: "1px rgba(8,18,50,0.10)",
                whiteSpace: "nowrap",
                willChange: "transform, opacity, filter",
              }}
            >
              {word}
            </span>
          ))}
        </div>

        {/* Navbar */}
        <nav
          style={{
            position: "absolute",
            inset: "0 0 auto 0",
            zIndex: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "28px 56px",
          }}
        >
          <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "#000" }}>3D</span>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
            <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "#000" }}>HUB</span>
          </Link>

          <ul style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
            {[
              { label: "WORK",     href: null, route: null },
              { label: "PRODUCTS", href: null, route: "/products" as const },
              { label: "ABOUT",    href: null, route: "/about" as const },
              { label: "LABS",     href: "#labs", route: null },
              { label: "CONTACT",  href: "#contact", route: null },
            ].map(({ label, href, route }) => (
              <li key={label} style={{ position: "relative" }}>
                {route ? (
                  <Link
                    to={route}
                    style={{
                      fontSize: 12, fontWeight: 500, letterSpacing: "0.22em",
                      color: "#000", textDecoration: "none", position: "relative",
                    }}
                  >
                    {label}
                    {label === "PRODUCTS" && (
                      <span style={{
                        position: "absolute", bottom: -4, left: 0,
                        width: "100%", height: 1, background: "#FF6B00",
                      }} />
                    )}
                  </Link>
                ) : (
                  <a
                    href={href ?? `/#${label.toLowerCase()}`}
                    style={{
                      fontSize: 12, fontWeight: 500, letterSpacing: "0.22em",
                      color: "rgba(0,0,0,0.55)", textDecoration: "none",
                    }}
                  >
                    {label}
                  </a>
                )}
              </li>
            ))}
          </ul>

          <button
            style={{
              display: "flex", alignItems: "center", gap: 8,
              borderRadius: 9999, border: "1px solid rgba(0,0,0,0.2)",
              background: "transparent", padding: "8px 16px",
              fontSize: 11, fontWeight: 500, letterSpacing: "0.2em",
              cursor: "pointer", color: "#000",
            }}
          >
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
            LET'S TALK
          </button>
        </nav>

        {/* Bottom meta */}
        <div style={{ position: "absolute", bottom: 36, left: 56, zIndex: 40, pointerEvents: "none" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(0,0,0,0.38)", textTransform: "uppercase", margin: "0 0 6px" }}>
            [03] - PRODUCTS
          </p>
          <p style={{ fontSize: 10.5, lineHeight: 1.7, color: "rgba(0,0,0,0.52)", maxWidth: 260, margin: 0 }}>
            Award-winning 3D experiences crafted<br />for the next generation of makers.
          </p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 36, right: 56, zIndex: 40, display: "flex", alignItems: "center", gap: 12, pointerEvents: "none" }}>
          <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(0,0,0,0.38)", textTransform: "uppercase" }}>
            SCROLL
          </span>
          <span style={{ display: "block", height: 1, width: 40, background: "#FF6B00", transformOrigin: "left", animation: "scrollLine 2s ease-in-out infinite" }} />
        </div>

        {/* Progress dots */}
        <div style={{
          position: "absolute", right: 56, top: "50%",
          transform: "translateY(-50%)", zIndex: 40,
          display: "flex", flexDirection: "column", gap: 10,
        }}>
          {WORDS.map((_, i) => (
            <div
              key={i}
              ref={(el) => { dotRefs.current[i] = el; }}
              style={{
                width: 5, height: 5, borderRadius: "50%",
                background: i === 0 ? "#FF6B00" : "rgba(0,0,0,0.18)",
                transition: "all 0.4s ease",
              }}
            />
          ))}
        </div>

      </div>

      <style>{`
        @keyframes scrollLine {
          0%, 100% { transform: scaleX(0.2); }
          50% { transform: scaleX(1); }
        }
      `}</style>
    </div>
  );
}
