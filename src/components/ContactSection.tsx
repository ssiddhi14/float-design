import { useEffect, useRef } from "react";
import { Link } from "@tanstack/react-router";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Video slot is index 3 - between PROTOTYPING and MANUFACTURING
// Total items = 8 (7 words + 1 video)
const WORDS = [
  "INNOVATION",
  "PRECISION",
  "PROTOTYPING",
  "MANUFACTURING",
  "ENGINEERING",
  "FUTURE",
  "CUSTOMIZATION",
];

const SUBTITLES = [
  "Pushing the boundaries of what is possible",
  "Every micron matters in what we build",
  "From concept to physical reality",
  "Industrial grade, human centered",
  "Where science meets craftsmanship",
  "Building the world of tomorrow",
  "Made exactly the way you need it",
];

// Video plays in background when INNOVATION (index 0) is visible
const VIDEO_INDEX = 0;

export default function ContactSection() {
  const wrapperRef  = useRef<HTMLDivElement>(null);
  const wordRefs    = useRef<(HTMLDivElement | null)[]>([]);
  const videoRef    = useRef<HTMLVideoElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const counterRef  = useRef<HTMLSpanElement>(null);
  const lineRef     = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const N        = WORDS.length;
    const segSize  = 1 / N;
    const transDur = segSize * 0.60;
    const DIAG_X   = "8vw";
    const OVER     = 0.65;

    // Set initial states
    wordRefs.current.forEach((el, i) => {
      if (!el) return;
      gsap.set(el, {
        yPercent: i === 0 ? 0     : 115,
        x:        i === 0 ? "0vw" : DIAG_X,
        opacity:  i === 0 ? 1     : 0,
        scale:    i === 0 ? 1     : 1.08,
        filter:   i === 0 ? "blur(0px)" : "blur(14px)",
        force3D: true,
      });
    });

    const ctx = gsap.context(() => {
      // Progress line
      gsap.fromTo(lineRef.current, { scaleX: 0 }, {
        scaleX: 1, ease: "none",
        scrollTrigger: { trigger: wrapper, start: "top top", end: "bottom bottom", scrub: true },
      });

      // Unified scroll-scrubbed timeline for word animations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: wrapper,
          start: "top top",
          end: "bottom bottom",
          scrub: 1.4,
        }
      });

      WORDS.forEach((_, i) => {
        const el       = wordRefs.current[i];
        if (!el) return;
        const segStart = i * segSize;
        const segEnd   = (i + 1) * segSize;
        const mid      = (segStart + segEnd) / 2;

        const tEnterStart = segStart - transDur * (OVER * 0.5);
        const tEnterEnd   = segStart + transDur * (OVER * 0.5);
        const enterDur    = tEnterEnd - tEnterStart;

        const tExitStart  = segEnd - transDur * (OVER * 0.5);
        const tExitEnd    = segEnd + transDur * (OVER * 0.5);
        const exitDur     = tExitEnd - tExitStart;

        // ENTER from bottom-right diagonal
        if (i > 0) {
          tl.fromTo(el,
            { yPercent: 115, x: DIAG_X, opacity: 0, scale: 1.08, filter: "blur(14px)" },
            {
              yPercent: 0, x: "0vw", opacity: 1, scale: 1, filter: "blur(0px)",
              ease: "none",
              duration: enterDur,
              immediateRender: false,
            },
            tEnterStart
          );
        }

        // EXIT to top-left diagonal
        if (i < N - 1) {
          tl.to(el,
            {
              yPercent: -115, x: `-${DIAG_X}`, opacity: 0.04, scale: 0.88, filter: "blur(12px)",
              ease: "none",
              duration: exitDur,
              immediateRender: false,
            },
            tExitStart
          );
        }

        // Play/pause video based on visibility
        if (i === VIDEO_INDEX) {
          ScrollTrigger.create({
            trigger: wrapper,
            start: `${(segStart) * 100}% top`,
            end:   `${(segEnd) * 100}% top`,
            onEnter:     () => { videoRef.current?.play(); },
            onLeave:     () => { videoRef.current?.pause(); },
            onEnterBack: () => { videoRef.current?.play(); },
            onLeaveBack: () => { videoRef.current?.pause(); },
          });
        }

        // Update meta
        ScrollTrigger.create({
          trigger: wrapper,
          start: `${(mid - 0.015) * 100}% top`,
          end:   `${(mid + 0.015) * 100}% top`,
          onEnter:     () => updateMeta(i),
          onEnterBack: () => updateMeta(i),
        });
      });

      // Anchor timeline duration to 1.0 to match scroll percentage range
      tl.addLabel("end", 1.0);
    }, wrapper);

    function updateMeta(i: number) {
      if (counterRef.current) {
        const N = WORDS.length;
        counterRef.current.textContent = `${String(i + 1).padStart(2, "0")} / ${String(N).padStart(2, "0")}`;
      }
      if (subtitleRef.current) {
        subtitleRef.current.style.opacity = "0";
        subtitleRef.current.style.transform = "translateY(8px)";
        setTimeout(() => {
          if (!subtitleRef.current) return;
          subtitleRef.current.textContent = SUBTITLES[i] ?? "";
          subtitleRef.current.style.opacity = "1";
          subtitleRef.current.style.transform = "translateY(0)";
        }, 90);
      }
    }

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{ height: `${WORDS.length * 130}vh`, position: "relative", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      {/* STICKY STAGE */}
      <div className="dark-gradient-bg" style={{
        position: "sticky", top: 0, height: "100vh", width: "100%", overflow: "hidden",
        background: "var(--bg-gradient)",
      }}>
        {/* Glow */}
        <div aria-hidden style={{
          position: "absolute", left: "50%", top: "50%",
          transform: "translate(-50%,-50%)",
          width: "90vw", height: "70vh", borderRadius: "9999px",
          background: "radial-gradient(ellipse at 50% 50%, rgba(155,180,235,0.28) 0%, rgba(220,226,242,0) 68%)",
          filter: "blur(60px)", pointerEvents: "none", zIndex: 0,
        }} />

        {/* MASKED STAGE - words + video share same slot */}
        <div style={{
          position: "absolute", left: 0, right: 0,
          top: "50%", transform: "translateY(-50%)",
          height: "85vh", overflow: "hidden", zIndex: 4,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          {WORDS.map((word, i) => (
            <div
              key={word + i}
              ref={(el) => { wordRefs.current[i] = el; }}
              style={{
                position: "absolute", width: "100%",
                textAlign: "center", lineHeight: 1,
                willChange: "transform, opacity, filter",
              }}
            >
              {/* Video plays behind INNOVATION text */}
              {i === VIDEO_INDEX && (
                <video
                  ref={videoRef}
                  src="/prateek.mp4"
                  muted
                  loop
                  playsInline
                  style={{
                    position: "absolute",
                    left: "50%", top: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "45vw", height: "50vh",
                    objectFit: "cover",
                    zIndex: -1,
                    opacity: 0.85,
                    borderRadius: 0,
                    pointerEvents: "none",
                  }}
                />
              )}
              <span style={{
                display: "inline-block",
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                fontSize: "clamp(5rem, 22vw, 15rem)",
                fontWeight: i === 5 ? 400 : 300,
                fontStyle: i % 3 === 2 ? "italic" : "normal",
                letterSpacing: "-0.04em", lineHeight: 0.9,
                color: i === VIDEO_INDEX ? "#ffffff" : i === 5 ? "#FF6B00" : "#0c0c14",
                whiteSpace: "nowrap",
                mixBlendMode: i === VIDEO_INDEX ? "difference" : "normal",
                textShadow: i === 5
                  ? "0 0 120px rgba(255,107,0,0.2)"
                  : i === VIDEO_INDEX
                  ? "0 0 40px rgba(0,0,0,0.3)"
                  : "0 8px 60px rgba(0,0,0,0.05)",
              }}>
                {word}
              </span>
            </div>
          ))}
        </div>

        {/* Subtitle */}
        <div style={{ position: "absolute", left: 0, right: 0, bottom: "6vh", display: "flex", justifyContent: "center", zIndex: 5, pointerEvents: "none" }}>
          <p ref={subtitleRef} style={{ fontSize: "clamp(11px,1.1vw,15px)", fontWeight: 300, letterSpacing: "0.12em", color: "rgba(12,12,20,0.38)", margin: 0, transition: "opacity 0.3s ease, transform 0.3s ease" }}>
            {SUBTITLES[0]}
          </p>
        </div>

        {/* Progress line */}
        <div style={{ position: "absolute", bottom: 70, left: "8%", width: "84%", height: 1, background: "rgba(12,12,20,0.06)", zIndex: 10 }}>
          <div ref={lineRef} style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(90deg, transparent 0%, #FF6B00 50%, transparent 100%)",
            transformOrigin: "left center", transform: "scaleX(0)",
          }} />
        </div>

        {/* Bottom meta */}
        <div style={{ position: "absolute", bottom: 28, left: 52, zIndex: 40, pointerEvents: "none" }}>
          <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.32em", color: "rgba(12,12,20,0.28)", textTransform: "uppercase", margin: "0 0 4px" }}>3D HUB STUDIO</p>
          <p style={{ fontSize: 10, lineHeight: 1.65, color: "var(--text-soft)", margin: 0 }}>Think it. Design it. Print it.</p>
        </div>

        {/* Scroll indicator */}
        <div style={{ position: "absolute", bottom: 28, right: 52, zIndex: 40, display: "flex", alignItems: "center", gap: 12, pointerEvents: "none" }}>
          <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.32em", color: "rgba(12,12,20,0.28)", textTransform: "uppercase" }}>SCROLL</span>
          <span style={{ display: "block", height: 1, width: 38, background: "#FF6B00", transformOrigin: "left", animation: "scrollLine 2s ease-in-out infinite" }} />
        </div>
      </div>

      {/* Contact form */}
      <div className="dark-gradient-bg" style={{ background: "var(--bg-gradient)", padding: "120px 56px 100px", display: "flex", flexDirection: "column", alignItems: "center", gap: 56 }}>
        <div style={{ textAlign: "center", maxWidth: 560 }}>
          <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(12,12,20,0.35)", textTransform: "uppercase", margin: "0 0 20px" }}>GET IN TOUCH</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.2rem,4.5vw,4rem)", fontWeight: 300, letterSpacing: "-0.02em", color: "var(--text-primary)", margin: "0 0 20px", lineHeight: 1.15 }}>
            Let's build something<br />
            <span style={{ fontStyle: "italic", color: "#FF6B00" }}>extraordinary.</span>
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.8, color: "var(--text-muted)", margin: 0 }}>
            Whether you have a complex engineering challenge or a creative concept that needs to become physical reality, we are here to make it happen.
          </p>
        </div>

        <form style={{ width: "100%", maxWidth: 540, display: "flex", flexDirection: "column", gap: 16 }} onSubmit={(e) => e.preventDefault()}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
            {["Name", "Email"].map((lbl) => (
              <div key={lbl} style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-soft)", textTransform: "uppercase" }}>{lbl}</label>
                <input type={lbl === "Email" ? "email" : "text"} placeholder={lbl === "Email" ? "your@email.com" : "Your name"}
                  style={{ padding: "13px 16px", border: "1px solid rgba(12,12,20,0.1)", borderRadius: 10, background: "var(--card-bg)", fontSize: 13, color: "var(--text-primary)", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
              </div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-soft)", textTransform: "uppercase" }}>Project</label>
            <input type="text" placeholder="3D printing, prototyping, manufacturing..."
              style={{ padding: "13px 16px", border: "1px solid rgba(12,12,20,0.1)", borderRadius: 10, background: "var(--card-bg)", fontSize: 13, color: "var(--text-primary)", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
            <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-soft)", textTransform: "uppercase" }}>Message</label>
            <textarea rows={4} placeholder="Describe your vision..."
              style={{ padding: "13px 16px", border: "1px solid rgba(12,12,20,0.1)", borderRadius: 10, background: "var(--card-bg)", fontSize: 13, color: "var(--text-primary)", outline: "none", resize: "none", lineHeight: 1.7, fontFamily: "'Plus Jakarta Sans', sans-serif" }} />
          </div>
          <button type="submit" style={{
            alignSelf: "flex-start", padding: "15px 38px", background: "#0c0c14", color: "#fff",
            border: "none", borderRadius: 9999, fontSize: 11, fontWeight: 600,
            letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 10,
            boxShadow: "0 20px 60px rgba(12,12,20,0.14)", fontFamily: "'Plus Jakarta Sans', sans-serif",
          }}>
            Send Message <span style={{ color: "#FF6B00" }}>&rarr;</span>
          </button>
        </form>
      </div>

      <style>{`
        @keyframes scrollLine { 0%,100%{transform:scaleX(0.2)} 50%{transform:scaleX(1)} }
      `}</style>
    </div>
  );
}
