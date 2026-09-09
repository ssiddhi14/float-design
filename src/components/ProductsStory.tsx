import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import VariableProximity from "./VariableProximity";
import CircularText from "./CircularText";

// Shared navbar
function Navbar() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "22px 56px",
      background: "rgba(222,231,241,0.7)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid rgba(0,0,0,0.05)",
    }}>
      <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
        <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
      </Link>
      <ul style={{ display: "flex", gap: 36, listStyle: "none", margin: 0, padding: 0 }}>
        {([["HOME","/"],["SHOP","/shop"],["CONTACT US","/contact-us"]] as [string, "/"|"/shop"|"/contact-us"][]).map(([label, to]) => (
          <li key={label} style={{ position: "relative" }}>
            <Link to={to} style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-primary)", textDecoration: "none" }}>
              {label}
            </Link>
          </li>
        ))}
      </ul>
      <button style={{ display: "flex", alignItems: "center", gap: 8, borderRadius: 9999, border: "1px solid rgba(0,0,0,0.18)", background: "transparent", padding: "8px 18px", fontSize: 11, fontWeight: 500, letterSpacing: "0.2em", cursor: "pointer", color: "var(--text-primary)" }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
        LET'S TALK
      </button>
    </nav>
  );
}

export default function ProductsStory({ showNav = true, showCircularText = true }: { showNav?: boolean; showCircularText?: boolean }) {
  const [mounted, setMounted] = useState(false);
  const wrapperRef   = useRef<HTMLDivElement>(null);

  // Scene refs
  const scene1Ref    = useRef<HTMLDivElement>(null);
  const s1Line1Ref   = useRef<HTMLDivElement>(null);
  const s1Line2Ref   = useRef<HTMLDivElement>(null);
  const s1Line3Ref   = useRef<HTMLDivElement>(null);
  const s1TagRef     = useRef<HTMLDivElement>(null);

  const scene2Ref    = useRef<HTMLDivElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const videoMaskRef = useRef<HTMLDivElement>(null);
  const s2TextRef    = useRef<HTMLDivElement>(null);

  const scene3Ref    = useRef<HTMLDivElement>(null);
  const s3LeftRef    = useRef<HTMLDivElement>(null);
  const s3RightRef   = useRef<HTMLDivElement>(null);

  const scene4Ref    = useRef<HTMLDivElement>(null);
  const s4Word0      = useRef<HTMLDivElement>(null);
  const s4Word1      = useRef<HTMLDivElement>(null);
  const s4Word2      = useRef<HTMLDivElement>(null);
  const s4Word3      = useRef<HTMLDivElement>(null);
  const s4Words      = [s4Word0, s4Word1, s4Word2, s4Word3];

  const glowRef      = useRef<HTMLDivElement>(null);
  const proximityContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const ctx = gsap.context(() => {

      // -- Global ambient glow parallax ------------------------------
      gsap.to(glowRef.current, {
        y: "-30%", scale: 1.3, ease: "none",
        scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true },
      });

      // -- SCENE 1: pure scrub - fully reversible both directions
      // No separate entrance tween - everything scroll-controlled
      gsap.fromTo(
        [s1TagRef.current, s1Line1Ref.current, s1Line2Ref.current, s1Line3Ref.current],
        { opacity: 1, y: 0, x: "0vw", scale: 1, filter: "blur(0px)" },
        {
          opacity: 0, y: "-12vh", x: "-3vw", scale: 0.93, filter: "blur(8px)",
          ease: "none",
          scrollTrigger: {
            trigger: scene1Ref.current,
            start: "80% top",
            end: "98% top",
            scrub: 2,
          },
        }
      );

      // -- SCENE 1 text: scroll word reveal (ghost -> visible stagger)
      // Words start dim/blurred, become sharp as user scrolls through the section
      ScrollTrigger.create({
        trigger: scene1Ref.current,
        start: "5% top",
        end: "75% top",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;
          const container = proximityContainerRef.current;
          if (!container) return;
          const spans = container.querySelectorAll<HTMLElement>("span[aria-hidden='true']");
          const total = spans.length;
          spans.forEach((span, i) => {
            const threshold = i / total;
            const localP = Math.max(0, Math.min(1, (p - threshold * 0.6) / 0.4));
            span.style.opacity = String(0.12 + localP * 0.88);
            span.style.filter = localP > 0.5 ? "blur(0px)" : `blur(${(1 - localP * 2) * 2}px)`;
          });
        },
      });
      // -- SCENE 2: Video reveal --------------------------------------
      // Clip-path mask reveal - starts as a thin horizontal slit
      gsap.fromTo(videoMaskRef.current,
        { clipPath: "inset(45% 12% 45% 12% round 12px)", scale: 0.85, opacity: 0 },
        {
          clipPath: "inset(0% 0% 0% 0% round 0px)", scale: 1, opacity: 1,
          ease: "none",
          scrollTrigger: {
            trigger: scene2Ref.current,
            start: "top 85%",
            end: "top 10%",
            scrub: 1.2,
          },
        }
      );

      // Scene 2 supporting text slides in from right
      gsap.fromTo(s2TextRef.current,
        { x: "8vw", opacity: 0 },
        {
          x: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: scene2Ref.current,
            start: "top 60%",
            end: "top 15%",
            scrub: 1,
          },
        }
      );

      // -- SCENE 3: Split layout --------------------------------------
      gsap.fromTo(s3LeftRef.current,
        { x: "-10vw", opacity: 0 },
        {
          x: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: scene3Ref.current,
            start: "top 75%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );
      gsap.fromTo(s3RightRef.current,
        { x: "10vw", opacity: 0 },
        {
          x: 0, opacity: 1, ease: "none",
          scrollTrigger: {
            trigger: scene3Ref.current,
            start: "top 75%",
            end: "top 20%",
            scrub: 1,
          },
        }
      );

      // -- SCENE 4: Kinetic words -------------------------------------
      if (showCircularText) {
        const WORDS_COUNT = 4;
        const segSize = 1 / WORDS_COUNT;
        s4Words.forEach((ref, i) => {
          const el = ref.current;
          if (!el) return;
          gsap.set(el, { opacity: 0, y: "80px", x: "6vw", filter: "blur(12px)" });

          // Enter
          ScrollTrigger.create({
            trigger: scene4Ref.current,
            start: `${(i * segSize) * 100}% top`,
            end: `${((i + 0.5) * segSize) * 100}% top`,
            scrub: 1.2,
            onUpdate: (self) => {
              const p = self.progress;
              gsap.set(el, {
                opacity: Math.min(1, p * 3),
                y: gsap.utils.interpolate(80, 0, gsap.parseEase("power2.out")(p)),
                x: gsap.utils.interpolate("6vw", "0vw", gsap.parseEase("power2.out")(p)),
                filter: `blur(${gsap.utils.interpolate(12, 0, p)}px)`,
              });
            },
          });
        });
      }

    }, wrapper);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="dark-page-bg" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", background: "var(--bg-primary)", position: "relative" }}>
      {showNav && <Navbar />}

      {/* Ambient glow */}
      <div ref={glowRef} aria-hidden style={{
        position: "fixed", left: "50%", top: "40%",
        transform: "translate(-50%,-50%)",
        width: "80vw", height: "80vw", maxWidth: 1000,
        borderRadius: "9999px",
        background: "radial-gradient(circle at 50% 50%, rgba(255,107,0,0.06) 0%, rgba(170,195,240,0.22) 40%, rgba(222,231,241,0) 70%)",
        filter: "blur(70px)",
        zIndex: 0, pointerEvents: "none",
        willChange: "transform",
      }} />

      {/* --- SCENE 1 - About Us ------------------------------------------ */}
      <div ref={scene1Ref} style={{
        position: "relative", height: "300vh",
        zIndex: 1,
      }}>
        <div style={{
          position: "sticky", top: 0, height: "100vh", width: "100%",
          display: "flex", flexDirection: "column",
          justifyContent: "center", alignItems: "flex-start",
          padding: "80px 8vw 0", overflow: "hidden",
        }}>
          {/* Tag */}
          <div ref={s1TagRef} style={{
            fontSize: 10, fontWeight: 600, letterSpacing: "0.45em",
            color: "rgba(255,107,0,0.8)", textTransform: "uppercase", marginBottom: 28,
            
          }}>
            [01] - ABOUT US
          </div>

          {/* Big serif headline */}
          <div ref={s1Line1Ref} style={{  marginBottom: 6 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 7.5rem)",
              fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1,
              color: "var(--text-primary)", margin: 0,
            }}>
              We transform ideas
            </h1>
          </div>
          <div ref={s1Line2Ref} style={{  marginBottom: 36 }}>
            <h1 style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              fontSize: "clamp(2.8rem, 6vw, 7.5rem)",
              fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1,
              color: "var(--text-primary)", margin: 0,
            }}>
              into <em style={{ fontStyle: "italic", color: "#FF6B00" }}>physical reality.</em>
            </h1>
          </div>

          {/* Two column body text with VariableProximity effect */}
          <div
            ref={(el) => {
              (s1Line3Ref as React.MutableRefObject<HTMLDivElement | null>).current = el;
              (proximityContainerRef as React.MutableRefObject<HTMLDivElement | null>).current = el;
            }}
            style={{
              maxWidth: "82vw",
              cursor: "default",
            }}
          >
            <p style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2, color: "rgba(10,10,20,0.65)", margin: "0 0 6px" }}>
              <VariableProximity
                label="We transform ideas into reality through precision 3D printing and advanced manufacturing solutions. Our mission is to make innovation accessible by helping businesses, creators, engineers, and startups turn digital concepts into high-quality physical products."
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 700, 'opsz' 40"
                containerRef={proximityContainerRef}
                radius={120}
                falloff="gaussian"
                style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2 }}
              />
            </p>
            <p style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2, color: "rgba(10,10,20,0.65)", margin: "0 0 6px" }}>
              <VariableProximity
                label="With a focus on accuracy, speed, and customization, we provide end-to-end support from prototyping to final production. Whether you need functional prototypes, custom-designed components, product models, or small-batch manufacturing, our technology and expertise ensure exceptional results."
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 700, 'opsz' 40"
                containerRef={proximityContainerRef}
                radius={120}
                falloff="gaussian"
                style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2 }}
              />
            </p>
            <p style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2, color: "rgba(10,10,20,0.65)", margin: "0 0 6px" }}>
              <VariableProximity
                label="We believe that great ideas deserve great execution. By combining cutting-edge 3D printing technology with creative problem-solving, we help our clients reduce development time, lower costs, and bring products to market faster."
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 700, 'opsz' 40"
                containerRef={proximityContainerRef}
                radius={120}
                falloff="gaussian"
                style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2 }}
              />
            </p>
            <p style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2, color: "rgba(10,10,20,0.65)", margin: "0 0 20px" }}>
              <VariableProximity
                label="At our core, we are driven by innovation, precision, and a passion for building the future - one layer at a time."
                fromFontVariationSettings="'wght' 300, 'opsz' 9"
                toFontVariationSettings="'wght' 700, 'opsz' 40"
                containerRef={proximityContainerRef}
                radius={120}
                falloff="gaussian"
                style={{ fontSize: "clamp(13px, 1.1vw, 16px)", lineHeight: 2 }}
              />
            </p>
            <div style={{ width: 60, height: 1, background: "#FF6B00" }} />
          </div>
        </div>
      </div>

      {/* --- SCENE 2 - Video Reveal --------------------------------------- */}
      <div ref={scene2Ref} style={{
        position: "relative", zIndex: 2,
        background: "var(--bg-primary)", padding: "10vh 0 16vh",
        display: "flex", flexDirection: "column", alignItems: "center",
      }}>
        {/* Video mask container */}
        <div ref={videoMaskRef} style={{
          width: "86vw", maxWidth: 1200,
          aspectRatio: "16 / 9",
          borderRadius: 0,
          overflow: "hidden",
          boxShadow: "0 40px 120px rgba(0,0,0,0.15)",
          position: "relative",
          willChange: "transform, clip-path",
          opacity: 0,
        }}>
          <iframe
            src="https://www.youtube.com/embed/Eh03QQF-AQk?autoplay=0&mute=1&controls=1&rel=0&modestbranding=1&loop=1&playlist=Eh03QQF-AQk"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
            style={{
              position: "absolute", inset: 0,
              width: "100%", height: "100%",
              border: "none",
            }}
            title="3D HUB Showreel"
          />
          {/* Subtle overlay for premium feel */}
          <div style={{
            position: "absolute", inset: 0, pointerEvents: "none",
            background: "linear-gradient(180deg, rgba(222,231,241,0.12) 0%, transparent 20%, transparent 80%, rgba(222,231,241,0.12) 100%)",
          }} />
        </div>

        {/* Supporting text below video */}
        <div ref={s2TextRef} style={{
          marginTop: 48, maxWidth: 680, textAlign: "center", padding: "0 24px",
          opacity: 0,
        }}>
          <p style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(1.3rem, 2.5vw, 2rem)",
            fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.5,
            color: "rgba(10,10,20,0.7)", margin: 0,
          }}>
            Where precision engineering meets creative vision - every object we produce is a statement of craft.
          </p>
        </div>
      </div>

      {/* --- SCENE 3 - Split Layout --------------------------------------- */}
      {/* <div ref={scene3Ref} style={{
        position: "relative", zIndex: 3,
        padding: "14vh 8vw",
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "6vw", alignItems: "center",
        background: "rgba(10,10,20,0.03)",
        borderTop: "1px solid rgba(0,0,0,0.06)",
        borderBottom: "1px solid rgba(0,0,0,0.06)",
      }}>
        <div ref={s3LeftRef} style={{ opacity: 0 }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 20px" }}>
            [02] - THE PROCESS
          </p>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "clamp(2.2rem, 4vw, 4.5rem)",
            fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.1,
            color: "var(--text-primary)", margin: "0 0 28px",
          }}>
            From idea<br />to <em style={{ fontStyle: "italic", color: "#FF6B00" }}>physical reality</em><br />in days.
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: "rgba(10,10,20,0.52)", margin: "0 0 36px", maxWidth: 400 }}>
            Our end-to-end workflow takes your concept through design, prototyping, testing and final production - with full transparency at every stage.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {["Concept & Brief", "3D Modelling", "Rapid Prototyping", "Final Production"].map((step, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <span style={{ width: 28, height: 28, borderRadius: "50%", border: "1px solid rgba(255,107,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 700, color: "#FF6B00", flexShrink: 0 }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontSize: 13, fontWeight: 400, color: "rgba(10,10,20,0.7)", letterSpacing: "0.02em" }}>{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div ref={s3RightRef} style={{ opacity: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {[
            { num: "48h", label: "Average turnaround for prototypes" },
            { num: "0.1mm", label: "Precision tolerance achieved" },
            { num: "200+", label: "Materials available for print" },
            { num: "100%", label: "Quality checked before delivery" },
          ].map((s, i) => (
            <div key={i} style={{
              padding: "24px 28px",
              background: "rgba(255,255,255,0.45)",
              backdropFilter: "blur(16px)",
              border: "1px solid var(--card-border)",
              borderRadius: 14,
              display: "flex", alignItems: "center", gap: 24,
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.8rem, 3vw, 3rem)",
                fontWeight: 300, color: "var(--text-primary)", lineHeight: 1,
                minWidth: 90,
              }}>
                {s.num}
              </span>
              <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(10,10,20,0.52)", lineHeight: 1.5 }}>{s.label}</span>
            </div>
          ))}
        </div>
      </div> */}

      {/* --- SCENE 4 - Circular Text -------------------------------------- */}
      {showCircularText && (
        <div ref={scene4Ref} style={{
          position: "relative", zIndex: 4,
          height: "100vh",
          display: "flex", alignItems: "center", justifyContent: "center",
          overflow: "hidden",
        }}>
          {/* 3D background - constant */}
          <div aria-hidden style={{
            position: "absolute",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: "60vw", fontWeight: 300,
            color: "rgba(0,0,0,0.04)",
            lineHeight: 1, userSelect: "none",
            letterSpacing: "-0.05em",
            pointerEvents: "none",
            zIndex: 0,
          }}>
            3D
          </div>

          {/* Circular text + center label */}
          <div style={{
            position: "relative", zIndex: 1,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            {/* CircularText ring */}
            <div style={{ width: 320, height: 320 }}>
              <CircularText
                text="PRECISION * CRAFT * SPEED * "
                spinDuration={18}
                onHover="speedUp"
                className="products-circular"
              />
            </div>

            {/* Center "3D" label */}
            <div style={{
              position: "absolute",
              display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center",
              textAlign: "center",
              pointerEvents: "none",
            }}>
              <span style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(2.5rem, 5vw, 5rem)",
                fontWeight: 300,
                color: "var(--text-primary)",
                letterSpacing: "-0.04em",
                lineHeight: 1,
              }}>
                3D
              </span>
              <span style={{
                display: "block",
                width: 32, height: 1,
                background: "#FF6B00",
                margin: "10px auto 0",
              }} />
            </div>
          </div>
        </div>
      )}

      {/* --- SCENE 5 - CTA ------------------------------------------------ */}
      <div style={{
        position: "relative", zIndex: 5,
        padding: "16vh 8vw 14vh",
        textAlign: "center",
        borderTop: "1px solid rgba(0,0,0,0.06)",
      }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.45em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 24px" }}>
          [03] - START A PROJECT
        </p>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif",
          fontSize: "clamp(2.5rem, 6vw, 7rem)",
          fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 1.05,
          color: "var(--text-primary)", margin: "0 0 36px",
        }}>
          Ready to bring<br />
          <em style={{ fontStyle: "italic", color: "#FF6B00" }}>your idea to life?</em>
        </h2>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <Link to="/labs" style={{
            padding: "16px 44px", background: "#0a0a0a", color: "#fff",
            borderRadius: 9999, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.22em", textTransform: "uppercase",
            textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
            boxShadow: "0 20px 60px rgba(10,10,20,0.16)",
          }}>
            Start a Project <span style={{ color: "#FF6B00" }}>&rarr;</span>
          </Link>
          <Link to="/" style={{
            padding: "16px 44px", background: "transparent", color: "var(--text-primary)",
            borderRadius: 9999, border: "1px solid rgba(0,0,0,0.18)",
            fontSize: 11, fontWeight: 600, letterSpacing: "0.22em",
            textTransform: "uppercase", textDecoration: "none",
          }}>
            See Our Work
          </Link>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}" }} />
    </div>
  );
}
