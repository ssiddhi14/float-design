import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

const HeroScene = lazy(() => import("./HeroScene"));

const WORDS = ["THINK IT", "DESIGN IT", "PRINT IT"];

export default function Hero3DHub() {
  const [mounted, setMounted] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const mouse = useRef({ x: 0, y: 0 });

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const smx = useSpring(mx, { stiffness: 60, damping: 18 });
  const smy = useSpring(my, { stiffness: 60, damping: 18 });
  const textX = useTransform(smx, (v) => v * 18);
  const textY = useTransform(smy, (v) => v * 10);

  useEffect(() => {
    setMounted(true);
    const id = setInterval(() => setWordIndex((i) => (i + 1) % WORDS.length), 2800);
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = x;
      mouse.current.y = -y;
      mx.set(x);
      my.set(-y);
    };
    window.addEventListener("mousemove", onMove);
    return () => {
      clearInterval(id);
      window.removeEventListener("mousemove", onMove);
    };
  }, [mx, my]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#DEE7F1" }}
    >
      {/* Navbar */}
      <nav className="absolute inset-x-0 top-0 z-30 flex items-center justify-between px-6 py-6 md:px-12 md:py-7">
        <div className="flex items-center gap-2">
          <span className="text-[15px] font-semibold tracking-[0.28em] text-black">
            3D
          </span>
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "#FF6B00" }} />
          <span className="text-[15px] font-semibold tracking-[0.28em] text-black">
            HUB
          </span>
        </div>
        <ul className="hidden items-center gap-9 md:flex">
          {["WORK", "PRODUCTS", "ABOUT", "LABS", "CONTACT"].map((item) => (
            <li key={item}>
              <a
                href={`#${item.toLowerCase()}`}
                className="group relative text-[12px] font-medium tracking-[0.22em] text-black transition-opacity hover:opacity-70"
              >
                {item}
                <span
                  className="absolute -bottom-1 left-0 h-px w-0 transition-all duration-500 group-hover:w-full"
                  style={{ backgroundColor: "#FF6B00" }}
                />
              </a>
            </li>
          ))}
        </ul>
        <button
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[11px] font-medium tracking-[0.2em] text-black backdrop-blur transition-colors hover:border-black"
        >
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#FF6B00" }} />
          LET'S TALK
        </button>
      </nav>

      {/* Background giant typography */}
      {/* 3D Canvas (behind text) */}
      <div className="absolute inset-0 z-10">
        {mounted && (
          <Suspense fallback={null}>
            <HeroScene mouse={mouse} />
          </Suspense>
        )}
      </div>

      {/* Foreground giant typography (in front of 3D) */}
      <motion.h1
        style={{ x: textX, y: textY, mixBlendMode: "difference" }}
        className="pointer-events-none absolute inset-0 z-20 flex select-none items-center justify-center"
      >
        <span
          key={wordIndex}
          className="block text-center font-extralight leading-[0.85] animate-[fadeWord_2.8s_ease-in-out_infinite]"
          style={{
            fontSize: "clamp(80px, 18vw, 280px)",
            letterSpacing: "-0.04em",
            fontFamily: "'Inter', 'Helvetica Neue', sans-serif",
            color: "#FFFFFF",
          }}
        >
          {WORDS[wordIndex]}
        </span>
      </motion.h1>

      {/* Side meta */}
      <div className="pointer-events-none absolute bottom-8 left-6 z-30 md:left-12">
        <p className="text-[10px] font-medium tracking-[0.3em] text-black/60">
          [01] — IDEATION
        </p>
        <p className="mt-2 max-w-[220px] text-[11px] leading-relaxed text-black/70">
          From concept to physical object. Crafted with precision, printed in 3D.
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-8 right-6 z-30 md:right-12">
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-medium tracking-[0.3em] text-black/60">
            SCROLL
          </span>
          <span
            className="block h-px w-12 origin-left animate-[scrollLine_2s_ease-in-out_infinite]"
            style={{ backgroundColor: "#FF6B00" }}
          />
        </div>
        <p className="mt-2 text-right text-[10px] font-medium tracking-[0.3em] text-black/60">
          NOOMO × 3D HUB
        </p>
      </div>

      {/* Status pill top center */}
      <div className="absolute left-1/2 top-24 z-30 -translate-x-1/2 md:top-28">
        <div className="flex items-center gap-2 rounded-full border border-black/15 bg-white/40 px-3.5 py-1.5 backdrop-blur-md">
          <span className="h-1.5 w-1.5 rounded-full animate-pulse" style={{ backgroundColor: "#FF6B00" }} />
          <span className="text-[10px] font-medium tracking-[0.28em] text-black">
            NEW LAB / 2026
          </span>
        </div>
      </div>

      {/* Local keyframes */}
      <style>{`
        @keyframes fadeWord {
          0%, 100% { opacity: 0; transform: translateY(20px); filter: blur(8px); }
          15%, 85% { opacity: 1; transform: translateY(0); filter: blur(0); }
        }
        @keyframes scrollLine {
          0%, 100% { transform: scaleX(0.2); }
          50% { transform: scaleX(1); }
        }
      `}</style>
    </section>
  );
}
