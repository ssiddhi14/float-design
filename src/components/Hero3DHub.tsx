import { useEffect, useRef } from "react";
import { gsap } from "gsap";

const lerp = (a: number, b: number, n: number) => a + (b - a) * n;

export default function Hero3DHub() {
  const sectionRef = useRef<HTMLElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLHeadingElement>(null);
  const fgRef = useRef<HTMLDivElement>(null);

  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const { innerWidth: w, innerHeight: h } = window;
      target.current.x = (e.clientX - w / 2) / (w / 2);
      target.current.y = (e.clientY - h / 2) / (h / 2);
    };
    window.addEventListener("mousemove", onMove);

    let raf = 0;
    let t = 0;
    const tick = () => {
      t += 0.005;
      current.current.x = lerp(current.current.x, target.current.x, 0.06);
      current.current.y = lerp(current.current.y, target.current.y, 0.06);
      const { x, y } = current.current;

      // floating organic motion
      const floatX = Math.sin(t) * 30;
      const floatY = Math.cos(t * 0.8) * 24;

      if (orbRef.current) {
        orbRef.current.style.transform = `translate3d(${x * 120 + floatX}px, ${y * 120 + floatY}px, 0)`;
      }
      if (bgRef.current) {
        bgRef.current.style.transform = `translate3d(${x * 20}px, ${y * 20}px, 0)`;
      }
      if (titleRef.current) {
        titleRef.current.style.transform = `translate3d(${-x * 40}px, ${-y * 25}px, 0)`;
      }
      if (fgRef.current) {
        fgRef.current.style.transform = `translate3d(${-x * 70}px, ${-y * 45}px, 0)`;
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    // intro
    gsap.fromTo(
      ".hero-line",
      { yPercent: 110, opacity: 0 },
      { yPercent: 0, opacity: 1, duration: 1.4, ease: "expo.out", stagger: 0.12, delay: 0.2 }
    );
    gsap.fromTo(
      ".hero-fg",
      { y: 30, opacity: 0 },
      { y: 0, opacity: 1, duration: 1, ease: "power3.out", delay: 1 }
    );

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: "#DEE7F1" }}
    >
      {/* Layer 1: ambient gradient background */}
      <div
        ref={bgRef}
        className="absolute inset-[-10%] will-change-transform"
        style={{
          background:
            "radial-gradient(ellipse at 20% 30%, rgba(255,255,255,0.7), transparent 60%), radial-gradient(ellipse at 80% 70%, rgba(255,170,120,0.18), transparent 55%)",
        }}
        aria-hidden
      />

      {/* Layer 2: glowing orb */}
      <div
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
        aria-hidden
      >
        <div
          ref={orbRef}
          className="will-change-transform"
          style={{
            width: "60vmin",
            height: "60vmin",
            borderRadius: "50%",
            background:
              "radial-gradient(circle at 35% 35%, rgba(255,255,255,0.95) 0%, rgba(255,180,130,0.55) 35%, rgba(255,107,0,0.25) 60%, rgba(222,231,241,0) 75%)",
            filter: "blur(40px)",
            mixBlendMode: "screen",
          }}
        />
      </div>

      {/* Layer 3: editorial typography */}
      <div className="relative z-10 flex h-full items-center justify-center px-6">
        <h1
          ref={titleRef}
          className="will-change-transform text-center font-semibold tracking-[-0.04em] leading-[0.85]"
          style={{
            color: "#000",
            fontSize: "clamp(3.5rem, 16vw, 18rem)",
            fontFamily: '"Playfair Display", "Times New Roman", serif',
          }}
        >
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">Think it.</span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block italic" style={{ color: "#FF6B00" }}>
              Design it.
            </span>
          </span>
          <span className="block overflow-hidden">
            <span className="hero-line inline-block">Print it.</span>
          </span>
        </h1>
      </div>

      {/* Layer 4: foreground UI */}
      <div
        ref={fgRef}
        className="hero-fg pointer-events-none absolute inset-x-0 bottom-0 z-20 flex items-end justify-between p-8 will-change-transform md:p-12"
      >
        <div
          className="pointer-events-auto rounded-full border border-white/40 bg-white/20 px-5 py-3 text-xs uppercase tracking-[0.25em] backdrop-blur-xl"
          style={{ color: "#2D2D2D" }}
        >
          3D HUB · Studio
        </div>
        <div
          className="pointer-events-auto max-w-xs text-right text-sm leading-relaxed"
          style={{ color: "#2D2D2D" }}
        >
          A creative studio crafting tactile futures through immersive 3D design, prototyping & print.
        </div>
      </div>

      {/* top nav */}
      <div className="absolute inset-x-0 top-0 z-30 flex items-center justify-between p-8 md:p-12">
        <div className="text-sm font-medium tracking-[0.3em]" style={{ color: "#000" }}>
          3D / HUB
        </div>
        <nav className="hidden gap-8 text-xs uppercase tracking-[0.25em] md:flex" style={{ color: "#2D2D2D" }}>
          <a href="#work" className="hover:text-black">Work</a>
          <a href="#studio" className="hover:text-black">Studio</a>
          <a href="#contact" className="hover:text-black">Contact</a>
        </nav>
      </div>
    </section>
  );
}
