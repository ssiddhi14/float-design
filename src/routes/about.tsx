import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ContactSection from "@/components/ContactSection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Client Reviews - 3D HUB" },
      { name: "description", content: "See how leading brands collaborate with 3D HUB." },
    ],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@200;300;400;500;600;700&display=swap",
      },
    ],
  }),
  component: About,
});

// Brand Logos

const AmdLogo = () => (
  <div className="flex items-center gap-2 text-black">
    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h11.377l3.122 3.124H8.5L5.375 6.249H2.25L0 4V0zm24 24H12.623l-3.122-3.124H15.5l3.125-3.125H21.75L24 20V24zM2.25 9.375h3.127l6.246 6.249H8.498L7.874 15H4.748l-.624.624H0V12l2.25-2.625zm19.5 5.25h-3.127l-6.246-6.249h3.125l.624.624h3.126l.624-.624H24V12l-2.25 2.625z" />
    </svg>
    <span style={{ fontSize: "17px", fontWeight: 900, letterSpacing: "0.05em", color: "var(--text-primary)" }}>AMD</span>
  </div>
);

const SalesforceLogo = () => (
  <div className="flex items-center gap-2">
    <div style={{
      display: "inline-flex", alignItems: "center", gap: 6,
      background: "#1a1a1a", borderRadius: 999,
      padding: "5px 12px",
    }}>
      <svg width="14" height="14" viewBox="0 0 24 24" fill="white">
        <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
      </svg>
      <span style={{ fontSize: "13px", fontWeight: 600, color: "white", letterSpacing: "0.01em" }}>salesforce</span>
    </div>
  </div>
);

const RedBullLogo = () => (
  <div className="flex items-center gap-2">
    <div style={{
      width: 28, height: 28, borderRadius: "50%",
      background: "#CC1E1E",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ color: "white", fontWeight: 900, fontSize: "10px" }}>RB</span>
    </div>
    <span style={{ fontSize: "15px", fontWeight: 900, fontStyle: "italic", color: "var(--text-primary)", letterSpacing: "-0.02em", textTransform: "uppercase" }}>Red Bull</span>
  </div>
);

const CoinbaseLogo = () => (
  <div className="flex items-center gap-2">
    <div style={{
      width: 26, height: 26, borderRadius: "50%",
      background: "#0052FF",
      display: "flex", alignItems: "center", justifyContent: "center",
    }}>
      <span style={{ color: "white", fontWeight: 700, fontSize: "13px" }}>c</span>
    </div>
    <span style={{ fontSize: "17px", fontWeight: 600, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>coinbase</span>
  </div>
);

// Testimonial Data

const TESTIMONIALS = [
  {
    logo: <AmdLogo />,
    quote: "Your products are awesome! I got one for my daughter for her graduation and she absolutely loved it.",
    author: "WALLIS MILLS",
    role: "Verified Customer",
  },
  {
    logo: <SalesforceLogo />,
    quote: "I've been very impressed with how the 3D HUB team has worked quickly to immerse themselves in the narrative of our often complicated suite of products and solutions. Their willingness to collaborate in partnership with our Salesforce creative team has allowed us to explore innovative web experiences.",
    author: "JONNY FRUITS",
    role: "Sr. Creative Director",
  },
  {
    logo: <RedBullLogo />,
    quote: "The entire 3D HUB team has been an exceptional and trusted creative partner in shaping our global digital products. Their dedication to listening, iterating, and pushing for the best possible experience makes them invaluable collaborators.",
    author: "DAVID GRAU",
    role: "Director Global Product Design & Research",
  },
  {
    logo: <CoinbaseLogo />,
    quote: "3D HUB demonstrates an abundance of creativity and ambition when it comes to complex Web3 projects. I'm grateful for their willingness to adapt to any challenge and remain committed partners through the entire development process.",
    author: "ERIC DAVES",
    role: "Senior Producer",
  },
];

// Component

export function About({ showNav = true }: { showNav?: boolean }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const stickyRef  = useRef<HTMLDivElement>(null);
  const card0      = useRef<HTMLDivElement>(null);
  const card1      = useRef<HTMLDivElement>(null);
  const card2      = useRef<HTMLDivElement>(null);
  const card3      = useRef<HTMLDivElement>(null);
  const cardRefs   = [card0, card1, card2, card3];

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const wrapper = wrapperRef.current;
    if (!wrapper) return;

    const vw = () => window.innerWidth;
    const vh = () => window.innerHeight;

    // Card dimensions (must match JSX)
    const CARD_H = () => Math.min(Math.max(340, vh() * 0.40), 460);

    // Arc: card TOP edge sits on arc, not center
    // So when we compute arcPoint, we add CARD_H/2 to Y so top lands on arc
    const ARC_CENTER_Y = -0.05;  // arc center 18% ABOVE viewport center = cards stay in lower 60%
    const ARC_RX       = 0.44;  // horizontal spread
    const ARC_RY       = 0.28;  // shallow arc height

    const arcPoint = (angleDeg: number) => {
      const rad = (angleDeg * Math.PI) / 180;
      const CW  = vw();
      const CH  = vh();
      // Raw arc point (center of arc ellipse)
      const rawX =  Math.cos(rad) * ARC_RX * CW;
      const rawY = -Math.sin(rad) * ARC_RY * CH + ARC_CENTER_Y * CH;
      // Shift down by half card height so TOP of card sits on the arc line
      return {
        x: rawX,
        y: rawY + CARD_H() / 2,
      };
    };

    const ENTRY_ANGLE = -50;
    const EXIT_ANGLE  = 290;
    // Rest angles - spread wider so cards don't overlap
    // card 0=leftmost, card 3=rightmost
    const restAngles = [138, 105, 75, 42];

    const cardConfigs = [
      { restAngle: restAngles[0], rot: -3,  enterAt: 0.04, exitAt: 0.52 },
      { restAngle: restAngles[1], rot: -1,  enterAt: 0.13, exitAt: 0.61 },
      { restAngle: restAngles[2], rot:  1,  enterAt: 0.22, exitAt: 0.70 },
      { restAngle: restAngles[3], rot:  3,  enterAt: 0.31, exitAt: 0.79 },
    ];

    const ENTER_DUR = 0.17;
    const EXIT_DUR  = 0.17;

    // Breathing tweens per card
    const breatheTweens: (gsap.core.Tween | null)[] = Array(cardRefs.length).fill(null);
    let breatheTimer: ReturnType<typeof setTimeout> | null = null;

    function startBreathing() {
      cardRefs.forEach((ref, i) => {
        const el = ref.current;
        if (!el) return;
        // Only breathe if card is actually visible on screen
        const currentOpacity = gsap.getProperty(el, "opacity") as number;
        if (currentOpacity < 0.05) return;
        if (breatheTweens[i]) return;
        const currentY = gsap.getProperty(el, "y") as number;
        breatheTweens[i] = gsap.to(el, {
          y: currentY - 8,
          duration: 2.6,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    }

    function stopBreathing() {
      if (breatheTimer) { clearTimeout(breatheTimer); breatheTimer = null; }
      cardRefs.forEach((ref, i) => {
        if (breatheTweens[i]) {
          breatheTweens[i]!.kill();
          breatheTweens[i] = null;
        }
      });
    }

    // Use native scroll event to detect stop
    const onScrollStart = () => stopBreathing();
    const onScrollStop  = () => {
      breatheTimer = setTimeout(startBreathing, 100);
    };

    let scrollEndTimer: ReturnType<typeof setTimeout> | null = null;
    const handleScroll = () => {
      onScrollStart();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      scrollEndTimer = setTimeout(onScrollStop, 150);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          // Any scroll movement - kill breathing immediately
          stopBreathing();

          const p = self.progress;

          cardRefs.forEach((ref, i) => {
            const el  = ref.current;
            if (!el) return;
            const cfg = cardConfigs[i];

            const entryPt = arcPoint(ENTRY_ANGLE);

            const eP     = gsap.utils.clamp(0, 1, (p - cfg.enterAt) / ENTER_DUR);
            const eEased = gsap.parseEase("power3.out")(eP);
            const eAngle = gsap.utils.interpolate(ENTRY_ANGLE, cfg.restAngle, eEased);
            const ePt    = arcPoint(eAngle);
            const enterRot   = gsap.utils.interpolate(cfg.rot + 14, cfg.rot, eEased);
            const enterScale = gsap.utils.interpolate(0.82, 1, eEased);
            const enterOp    = Math.min(1, eP * 5);

            const xP     = gsap.utils.clamp(0, 1, (p - cfg.exitAt) / EXIT_DUR);
            const xEased = gsap.parseEase("power3.in")(xP);
            const xAngle = gsap.utils.interpolate(cfg.restAngle, EXIT_ANGLE, xEased);
            const xPt    = arcPoint(xAngle);
            const exitRot   = gsap.utils.interpolate(cfg.rot, cfg.rot - 14, xEased);
            const exitScale = gsap.utils.interpolate(1, 0.82, xEased);

            if (xP > 0) {
              gsap.set(el, { x: xPt.x, y: xPt.y, rotation: exitRot, scale: exitScale, opacity: xP === 1 ? 0 : 1 });
            } else if (eP > 0) {
              gsap.set(el, { x: ePt.x, y: ePt.y, rotation: enterRot, scale: enterScale, opacity: enterOp });
            } else {
              gsap.set(el, { x: entryPt.x, y: entryPt.y, rotation: cfg.rot + 14, scale: 0.82, opacity: 0 });
            }
          });
        },
        // onUpdate kills breathing - handled by window scroll listener above
      });
    }, wrapper);

    return () => {
      stopBreathing();
      if (scrollEndTimer) clearTimeout(scrollEndTimer);
      window.removeEventListener("scroll", handleScroll);
      ctx.revert();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <>
    <div
      ref={wrapperRef}
      className="relative w-full dark-page-bg"
      style={{ backgroundColor: "var(--bg-primary)", height: "600vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full"
        style={{ overflow: "hidden" }}
      >
        {/* Navbar */}
        {showNav && (
        <nav className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-7 md:px-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-[0.28em] text-black">3D</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
            <span className="text-[15px] font-semibold tracking-[0.28em] text-black">HUB</span>
          </Link>
          <ul className="hidden items-center gap-9 md:flex">
            {[
              { label: "HOME",       to: "/" as const },
              { label: "SHOP",       to: "/shop" as const },
              { label: "CONTACT US", to: "/contact-us" as const },
            ].map(({ label, to }) => (
              <li key={label} style={{ position: "relative" }}>
                <Link to={to} className="group relative text-[12px] font-medium tracking-[0.22em] text-black transition-opacity hover:opacity-70">
                  {label}
                  <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FF6B00] transition-all duration-500 group-hover:w-full" />
                </Link>
              </li>
            ))}
          </ul>
          <button className="hidden md:inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[11px] font-medium tracking-[0.2em] text-black transition-colors hover:border-black">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            LET'S TALK
          </button>
        </nav>
        )}

        {/* Heading - top-left, stays ABOVE card zone */}
        <div className="absolute left-0 top-[10%] z-10 pl-8 md:pl-14 pointer-events-none select-none">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-black/40 uppercase mb-2">
            CLIENT
          </p>
          <h2
            className="font-black uppercase text-black"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            REVIEWS<span className="text-[#FF6B00]">.</span>
          </h2>
        </div>

        {/* Right paragraph */}
        <div className="absolute right-8 top-[13%] z-10 max-w-[240px] md:right-14 md:max-w-[260px] pointer-events-none">
          <p className="text-[11.5px] leading-[1.75] text-black/55 font-light">
            We work as one team with our clients. Through discovery workshops, we uncover your story and translate it into digital experiences that reflect your vision.
          </p>
        </div>

        {/* Arc Cards */}
        {TESTIMONIALS.map((t, i) => {
          // Arc-based tilt - matches arc curvature at each position
          const arcTilt = [-3, -1, 1, 3][i];

          return (
          <div
            key={i}
            ref={cardRefs[i]}
            className="absolute z-20"
            style={{
              left: "50%",
              top: "50%",
              width: "clamp(240px, 22vw, 310px)",
              marginLeft: "calc(clamp(240px, 22vw, 310px) / -2)",
              marginTop: "0px",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="w-full flex flex-col p-5"
              style={{
                height: "clamp(340px, 40vh, 460px)",
                borderRadius: "14px",
                background: "rgba(235, 240, 248, 0.55)",
                backdropFilter: "blur(40px) saturate(120%)",
                WebkitBackdropFilter: "blur(40px) saturate(120%)",
                border: "1px dashed rgba(0,0,0,0.12)",
                boxShadow: "0 2px 24px rgba(0,0,0,0.04)",
                transform: `perspective(900px) rotateY(${[-4, -1.5, 1.5, 4][i]}deg) rotateX(${[1.5, -1, 1, -1.5][i]}deg) rotate(${arcTilt}deg)`,
                transformStyle: "preserve-3d",
                overflow: "hidden",
              }}
            >
              {/* Logo */}
              <div className="flex-shrink-0 mb-4">{t.logo}</div>

              {/* Quote - left aligned, larger, readable */}
              <p
                className="flex-1 overflow-hidden"
                style={{
                  fontSize: "clamp(11px, 0.95vw, 14px)",
                  fontWeight: 400,
                  lineHeight: 1.65,
                  letterSpacing: "-0.01em",
                  color: "rgba(10,10,20,0.82)",
                  fontFamily: "'Plus Jakarta Sans', sans-serif",
                  display: "-webkit-box",
                  WebkitLineClamp: 8,
                  WebkitBoxOrient: "vertical",
                  textAlign: "left",
                }}
              >
                {t.quote}
              </p>

              {/* Author - always at bottom */}
              <div
                className="flex-shrink-0 mt-4 pt-3"
                style={{ borderTop: "1px solid rgba(0,0,0,0.07)" }}
              >
                <p
                  style={{
                    fontSize: "10px",
                    fontWeight: 700,
                    letterSpacing: "0.08em",
                    color: "rgba(10,10,20,0.88)",
                    textTransform: "uppercase",
                    margin: "0 0 3px",
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                  }}
                >
                  {t.author}
                </p>
                <p
                  style={{
                    fontSize: "9.5px",
                    fontWeight: 300,
                    color: "rgba(10,10,20,0.45)",
                    margin: 0,
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    lineHeight: 1.5,
                  }}
                >
                  {t.role}
                </p>
              </div>
            </div>
          </div>
          );
        })}

        {/* Bottom meta */}
        <div className="absolute bottom-7 inset-x-0 px-8 md:px-14 flex items-end justify-between z-30 pointer-events-none">
          <div>
            <p className="text-[9.5px] font-semibold tracking-[0.3em] text-black/45 uppercase">[02] - COLLABORATION</p>
            <p className="mt-1 text-[10px] leading-relaxed text-black/55 max-w-[260px]">
              Great ideas need great execution. We partner with leading brands to build the future.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-[9.5px] font-semibold tracking-[0.3em] text-black/45 uppercase">SCROLL</span>
            <span className="block h-px w-10 origin-left bg-[#FF6B00]" style={{ animation: "scrollLine 2s ease-in-out infinite" }} />
            <span className="text-[9.5px] font-semibold tracking-[0.3em] text-black/45 uppercase">3D HUB STUDIO</span>
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes scrollLine { 0%,100%{transform:scaleX(0.2)} 50%{transform:scaleX(1)} }" }} />
    </div>
    </>
  );
}
