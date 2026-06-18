import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect, Suspense, lazy } from "react";

const InnovateScene = lazy(() => import("./InnovateScene"));

export const INNOVATE_CONTENT = {
  // Phase 1 (Top Left Header & Top Right Paragraph)
  topHeader: "CAN'T HAPPEN\nWITHOUT\nTEAM A.",
  topParagraph: "Our agency combines storytelling craft with technical expertise to create work that connects emotionally and drives engagement.",

  // Phase 2 (Bottom Left Header & Bottom Right Paragraph)
  bottomHeader: "INNOVATE —\nWITH A\nHUMAN TOUCH.",
  bottomParagraph: "Our design expertise and craftsmanship means we convert big, innovative ideas into powerful, accessible human experiences, which ignite emotions and provoke action."
};

export default function InnovateSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const mouse = useRef({ x: 0, y: 0 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = x;
      mouse.current.y = -y;
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  // Parallax for glow
  const glowY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);
  const glowScale = useTransform(scrollYProgress, [0, 0.5, 1], [0.85, 1.1, 0.95]);
  const glowOpacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0.6]);

  // Block 1 (top): scrolls up & fades faster
  const block1Y = useTransform(scrollYProgress, [0, 0.5], ["0%", "-60%"]);
  const block1Opacity = useTransform(scrollYProgress, [0.25, 0.5], [1, 0]);

  // Block 2 (INNOVATE): rises up from below into place, then drifts up
  const block2Y = useTransform(scrollYProgress, [0, 0.45, 0.85], ["25vh", "0vh", "-10vh"]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full"
      style={{ backgroundColor: "#DEE7F1", height: "220vh" }}
    >
      {/* Sticky viewport */}
      <div className="sticky top-0 h-screen w-full overflow-hidden">
        {/* Floating Glass Boxes in Background */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {mounted && (
            <Suspense fallback={null}>
              <InnovateScene mouse={mouse} />
            </Suspense>
          )}
        </div>
        {/* Soft cinematic glow with parallax */}
        <motion.div
          aria-hidden
          style={{
            y: glowY,
            scale: glowScale,
            opacity: glowOpacity,
            width: "70vw",
            height: "70vw",
            maxWidth: "900px",
            maxHeight: "900px",
            background:
              "radial-gradient(circle at 50% 50%, rgba(255,170,140,0.55) 0%, rgba(255,140,180,0.25) 30%, rgba(200,200,255,0.15) 55%, rgba(222,231,241,0) 75%)",
            filter: "blur(40px)",
          }}
          className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
        />

        <div className="relative z-10 mx-auto h-full w-full max-w-[1400px] px-6 md:px-12">
          {/* BLOCK 1 — TEAM A intro */}
          <motion.div
            style={{ y: block1Y, opacity: block1Opacity }}
            className="absolute inset-x-6 top-12 md:inset-x-12 md:top-16"
          >
            <h3
              className="font-light text-black"
              style={{
                fontSize: "clamp(2.5rem, 6vw, 5rem)",
                letterSpacing: "-0.02em",
                lineHeight: 1.05,
              }}
            >
              {INNOVATE_CONTENT.topHeader.split("\n").map((line, idx) => (
                <span key={idx}>
                  {line}
                  {idx < INNOVATE_CONTENT.topHeader.split("\n").length - 1 && <br />}
                </span>
              ))}
            </h3>
          </motion.div>

          <motion.p
            style={{ y: block1Y, opacity: block1Opacity }}
            className="absolute right-6 top-12 max-w-xs text-sm leading-relaxed md:right-12 md:top-16 md:max-w-sm md:text-base bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]"
          >
            <span style={{ color: "#2D2D2D" }}>
              {INNOVATE_CONTENT.topParagraph}
            </span>
          </motion.p>

          {/* BLOCK 2 — INNOVATE headline */}
          <div className="absolute inset-x-6 bottom-12 md:inset-x-12 md:bottom-16">
            <div className="flex flex-col items-start justify-between gap-10 md:flex-row md:items-end">
              <motion.h2
                className="font-light tracking-tight text-black"
                style={{
                  y: block2Y,
                  fontSize: "clamp(2.75rem, 7.5vw, 7rem)",
                  lineHeight: 1.02,
                  letterSpacing: "-0.03em",
                }}
              >
                {INNOVATE_CONTENT.bottomHeader.split("\n").map((line, idx) => (
                  <span key={idx}>
                    {line}
                    {idx < INNOVATE_CONTENT.bottomHeader.split("\n").length - 1 && <br />}
                  </span>
                ))}
              </motion.h2>

              <p
                className="max-w-xs text-sm leading-relaxed md:max-w-sm md:text-base bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 md:p-8 shadow-[0_8px_32px_0_rgba(0,0,0,0.06)]"
                style={{ color: "#2D2D2D" }}
              >
                {INNOVATE_CONTENT.bottomParagraph}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
