import { useEffect, useRef } from "react";
import gsap from "gsap";

export default function InteractiveShowcase() {
  const sectionRef = useRef<HTMLElement>(null);
  const sphereRef = useRef<HTMLDivElement>(null);
  const ambientRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const foregroundRef = useRef<HTMLDivElement>(null);

  // Mouse + sphere state
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const time = useRef(0);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const rect = () => section.getBoundingClientRect();

    const onMove = (e: MouseEvent) => {
      const r = rect();
      // Normalized -0.5 .. 0.5 around section center
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      target.current.x = nx;
      target.current.y = ny;
    };

    const onLeave = () => {
      target.current.x = 0;
      target.current.y = 0;
    };

    section.addEventListener("mousemove", onMove);
    section.addEventListener("mouseleave", onLeave);

    let raf = 0;
    const tick = () => {
      time.current += 0.012;

      // Inertial easing toward target
      current.current.x += (target.current.x - current.current.x) * 0.06;
      current.current.y += (target.current.y - current.current.y) * 0.06;

      const r = rect();
      const cx = current.current.x * r.width;
      const cy = current.current.y * r.height;

      // Organic floating offset (always alive)
      const floatX = Math.sin(time.current * 0.9) * 30 + Math.cos(time.current * 0.4) * 18;
      const floatY = Math.cos(time.current * 0.7) * 26 + Math.sin(time.current * 0.5) * 14;
      const breathe = 1 + Math.sin(time.current * 0.8) * 0.06;

      // Layer 3 — sphere (moves WITH cursor, strong)
      if (sphereRef.current) {
        gsap.set(sphereRef.current, {
          x: cx * 0.55 + floatX,
          y: cy * 0.55 + floatY,
          scale: breathe,
          force3D: true,
        });
      }

      // Layer 1 — ambient glow (slowest, slight)
      if (ambientRef.current) {
        gsap.set(ambientRef.current, {
          x: cx * 0.08 - floatX * 0.4,
          y: cy * 0.08 - floatY * 0.4,
          force3D: true,
        });
      }

      // Layer 2 — big typography (opposite direction, subtle)
      if (textRef.current) {
        gsap.set(textRef.current, {
          x: cx * -0.06,
          y: cy * -0.04,
          force3D: true,
        });
      }

      // Layer 4 — foreground content (opposite, a bit more)
      if (foregroundRef.current) {
        gsap.set(foregroundRef.current, {
          x: cx * -0.14,
          y: cy * -0.08,
          force3D: true,
        });
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      section.removeEventListener("mousemove", onMove);
      section.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "#EAEAEA" }}
    >
      {/* LAYER 1 — ambient background glow */}
      <div
        ref={ambientRef}
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ willChange: "transform" }}
      >
        <div
          className="absolute left-1/2 top-1/2"
          style={{
            width: "120vw",
            height: "120vw",
            transform: "translate(-50%, -50%)",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.7) 0%, rgba(234,234,234,0) 60%)",
          }}
        />
      </div>

      {/* LAYER 2 — massive typography */}
      <div
        ref={textRef}
        className="pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center"
        style={{ willChange: "transform" }}
      >
        <h2
          className="select-none text-center font-black uppercase leading-[0.85] tracking-tight text-black"
          style={{
            fontSize: "clamp(4rem, 14vw, 16rem)",
            letterSpacing: "-0.04em",
          }}
        >
          <span className="block">THINK IT</span>
          <span className="block">DESIGN IT</span>
          <span className="block">PRINT IT</span>
        </h2>
      </div>

      {/* LAYER 3 — glowing sphere */}
      <div
        ref={sphereRef}
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-20"
        style={{
          width: "min(55vw, 640px)",
          height: "min(55vw, 640px)",
          marginLeft: "calc(min(55vw, 640px) / -2)",
          marginTop: "calc(min(55vw, 640px) / -2)",
          borderRadius: "9999px",
          background:
            "radial-gradient(circle at 35% 30%, rgba(255,180,140,0.95) 0%, rgba(255,110,80,0.7) 25%, rgba(255,80,160,0.45) 50%, rgba(120,90,255,0.25) 70%, rgba(234,234,234,0) 85%)",
          filter: "blur(40px)",
          mixBlendMode: "multiply",
          willChange: "transform",
        }}
      />

      {/* LAYER 4 — foreground content */}
      <div
        ref={foregroundRef}
        className="absolute inset-0 z-30 flex flex-col"
        style={{ willChange: "transform" }}
      >
        <div className="mt-auto flex w-full items-end justify-between gap-6 px-6 pb-10 md:px-12 md:pb-14">
          {/* Bottom left */}
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-black md:text-base">
            3D Printing Studio
          </div>

          {/* Bottom center — CTA */}
          <button
            type="button"
            className="group relative inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-medium uppercase tracking-[0.18em] text-white transition-transform duration-300 hover:scale-105 md:text-base"
            style={{ boxShadow: "0 20px 60px -20px rgba(0,0,0,0.45)" }}
          >
            <span>Explore Projects</span>
            <span
              aria-hidden
              className="inline-block transition-transform duration-300 group-hover:translate-x-1"
              style={{ color: "#FF6B00" }}
            >
              →
            </span>
          </button>

          {/* Bottom right */}
          <p className="hidden max-w-xs text-right text-xs leading-relaxed text-[#2D2D2D] md:block md:text-sm">
            3D HUB is an immersive creative studio crafting tactile,
            future-forward objects — from concept and form to final print.
          </p>
        </div>
      </div>
    </section>
  );
}
