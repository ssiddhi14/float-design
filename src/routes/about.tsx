import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "Great Work Can't Happen Without Team A - 3D HUB" },
      {
        name: "description",
        content: "See how leading brands collaborate with 3D HUB.",
      },
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
    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M0 0h11.377l3.122 3.124H8.5L5.375 6.249H2.25L0 4V0zm24 24H12.623l-3.122-3.124H15.5l3.125-3.125H21.75L24 20V24zM2.25 9.375h3.127l6.246 6.249H8.498L7.874 15H4.748l-.624.624H0V12l2.25-2.625zm19.5 5.25h-3.127l-6.246-6.249h3.125l.624.624h3.126l.624-.624H24V12l-2.25 2.625z" />
    </svg>
    <span className="font-black text-[15px] tracking-widest text-black">AMD</span>
  </div>
);

const SalesforceLogo = () => (
  <div
    className="inline-flex items-center gap-1.5 px-3 py-1.5"
    style={{ background: "#1a1a1a", borderRadius: "999px", width: "fit-content" }}
  >
    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="white">
      <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z" />
    </svg>
    <span className="font-semibold text-white text-[12px] tracking-tight">salesforce</span>
  </div>
);

const RedBullLogo = () => (
  <div className="flex items-center gap-2">
    <div className="flex items-center justify-center w-7 h-7 rounded-full bg-[#E01E3C]">
      <span className="text-white font-black text-[10px]">RB</span>
    </div>
    <span className="font-black italic text-black text-[14px] tracking-tighter uppercase">Red Bull</span>
  </div>
);

const CoinbaseLogo = () => (
  <div className="flex items-center gap-1.5">
    <div className="h-6 w-6 rounded-full bg-[#0052FF] flex items-center justify-center">
      <span className="text-white text-[11px] font-bold">c</span>
    </div>
    <span className="font-semibold text-black text-[15px] tracking-tight">coinbase</span>
  </div>
);

// Testimonial Data

const TESTIMONIALS = [
  {
    logo: <AmdLogo />,
    quote: "Noomo does such incredible and thoughtful work. I have been at this almost 25 years and have never been more impressed with an agency.",
    author: "WALLIS MILLS",
    role: "Director of Marketing, Network Technology Solutions Group",
  },
  {
    logo: <SalesforceLogo />,
    quote: "I've been very impressed with how the Noomo team has worked quickly to immerse themselves in the narrative of our often complicated suite of products and solutions. Their willingness to collaborate in partnership with our Salesforce creative team has allowed us to explore innovative web experiences.",
    author: "JONNY FRUITS",
    role: "Sr. Creative Director",
  },
  {
    logo: <RedBullLogo />,
    quote: "The entire Noomo team have been an exceptional and trusted creative partner in shaping our global digital products. Their dedication to listening, iterating, and pushing for the best possible experience makes them invaluable collaborators.",
    author: "DAVID GRAU",
    role: "Director Global Product Design & Research",
  },
  {
    logo: <CoinbaseLogo />,
    quote: "Noomo demonstrates an abundance of creativity and ambition when it comes to complex Web3 projects. I'm grateful for their willingness to adapt to any challenge and remain committed partners through the entire development process.",
    author: "ERIC DAVES",
    role: "Senior Producer",
  },
];

// Component

function About() {
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

    // Flat ellipse arc - center well below viewport center so cards stay below heading
    const ARC_CENTER_Y = 0.55;
    const ARC_RX       = 0.48;
    const ARC_RY       = 0.38;

    const arcPoint = (angleDeg: number) => {
      const rad = (angleDeg * Math.PI) / 180;
      return {
        x:  Math.cos(rad) * ARC_RX * vw(),
        y: -Math.sin(rad) * ARC_RY * vh() + ARC_CENTER_Y * vh(),
      };
    };

    const ENTRY_ANGLE = -50;
    const EXIT_ANGLE  = 230;
    const restAngles  = [140, 115, 88, 62];

    const cardConfigs = [
      { restAngle: restAngles[0], rot: -4,   enterAt: 0.04, exitAt: 0.52 },
      { restAngle: restAngles[1], rot:  1.5, enterAt: 0.13, exitAt: 0.61 },
      { restAngle: restAngles[2], rot: -1.5, enterAt: 0.22, exitAt: 0.70 },
      { restAngle: restAngles[3], rot:  3,   enterAt: 0.31, exitAt: 0.79 },
    ];

    const ENTER_DUR = 0.17;
    const EXIT_DUR  = 0.17;

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: wrapper,
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5,
        onUpdate: (self) => {
          const p = self.progress;

          cardRefs.forEach((ref, i) => {
            const el  = ref.current;
            if (!el) return;
            const cfg = cardConfigs[i];

            const entryPt = arcPoint(ENTRY_ANGLE);

            // Enter phase
            const eP      = gsap.utils.clamp(0, 1, (p - cfg.enterAt) / ENTER_DUR);
            const eEased  = gsap.parseEase("power3.out")(eP);
            const eAngle  = gsap.utils.interpolate(ENTRY_ANGLE, cfg.restAngle, eEased);
            const ePt     = arcPoint(eAngle);
            const enterRot   = gsap.utils.interpolate(cfg.rot + 14, cfg.rot, eEased);
            const enterScale = gsap.utils.interpolate(0.82, 1, eEased);
            const enterOp    = Math.min(1, eP * 5);

            // Exit phase
            const xP      = gsap.utils.clamp(0, 1, (p - cfg.exitAt) / EXIT_DUR);
            const xEased  = gsap.parseEase("power3.in")(xP);
            const xAngle  = gsap.utils.interpolate(cfg.restAngle, EXIT_ANGLE, xEased);
            const xPt     = arcPoint(xAngle);
            const exitRot   = gsap.utils.interpolate(cfg.rot, cfg.rot - 14, xEased);
            const exitScale = gsap.utils.interpolate(1, 0.82, xEased);

            if (xP > 0) {
              gsap.set(el, { x: xPt.x, y: xPt.y, rotation: exitRot, scale: exitScale, opacity: 1 });
            } else if (eP > 0) {
              gsap.set(el, { x: ePt.x, y: ePt.y, rotation: enterRot, scale: enterScale, opacity: enterOp });
            } else {
              gsap.set(el, { x: entryPt.x, y: entryPt.y, rotation: cfg.rot + 14, scale: 0.82, opacity: 0 });
            }
          });
        },
      });
    }, wrapper);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={wrapperRef}
      className="relative w-full"
      style={{ backgroundColor: "#DEE7F1", height: "600vh", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen w-full"
        style={{ overflow: "hidden" }}
      >
        {/* Navbar */}
        <nav className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-7 md:px-14">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-[15px] font-semibold tracking-[0.28em] text-black">3D</span>
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
            <span className="text-[15px] font-semibold tracking-[0.28em] text-black">HUB</span>
          </Link>
          <ul className="hidden items-center gap-9 md:flex">
            {["WORK", "PRODUCTS", "ABOUT", "LABS", "CONTACT"].map((item) => (
              <li key={item}>
                {item === "ABOUT" ? (
                  <Link to="/about" className="group relative text-[12px] font-medium tracking-[0.22em] text-black">
                    {item}
                    <span className="absolute -bottom-1 left-0 h-px w-full bg-[#FF6B00]" />
                  </Link>
                ) : item === "PRODUCTS" ? (
                  <Link to="/products" className="group relative text-[12px] font-medium tracking-[0.22em] text-black transition-opacity hover:opacity-60">
                    {item}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FF6B00] transition-all duration-500 group-hover:w-full" />
                  </Link>
                ) : (
                  <a href={`/#${item.toLowerCase()}`} className="group relative text-[12px] font-medium tracking-[0.22em] text-black transition-opacity hover:opacity-60">
                    {item}
                    <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FF6B00] transition-all duration-500 group-hover:w-full" />
                  </a>
                )}
              </li>
            ))}
          </ul>
          <button className="hidden md:inline-flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-[11px] font-medium tracking-[0.2em] text-black transition-colors hover:border-black">
            <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00] animate-pulse" />
            LET'S TALK
          </button>
        </nav>

        {/* Heading - top-left, stays ABOVE card zone */}
        <div className="absolute left-0 top-[10%] z-10 pl-8 md:pl-14 pointer-events-none select-none">
          <p className="text-[10px] font-semibold tracking-[0.35em] text-black/40 uppercase mb-2">
            GREAT WORK
          </p>
          <h2
            className="font-black uppercase text-black"
            style={{ fontSize: "clamp(2.8rem, 7.5vw, 7rem)", letterSpacing: "-0.03em", lineHeight: 0.92 }}
          >
            CAN'T HAPPEN
            <br />
            WITHOUT
            <br />
            TEAM&nbsp;A<span className="text-[#FF6B00]">.</span>
          </h2>
        </div>

        {/* Right paragraph */}
        <div className="absolute right-8 top-[13%] z-10 max-w-[240px] md:right-14 md:max-w-[260px] pointer-events-none">
          <p className="text-[11.5px] leading-[1.75] text-black/55 font-light">
            We work as one team with our clients. Through discovery workshops, we uncover your story and translate it into digital experiences that reflect your vision.
          </p>
        </div>

        {/* Arc Cards */}
        {TESTIMONIALS.map((t, i) => (
          <div
            key={i}
            ref={cardRefs[i]}
            className="absolute z-20"
            style={{
              left: "50%",
              top: "50%",
              width: "clamp(210px, 19vw, 270px)",
              marginLeft: "calc(clamp(210px, 19vw, 270px) / -2)",
              marginTop: "calc(clamp(280px, 32vh, 370px) / -2)",
              willChange: "transform, opacity",
            }}
          >
            <div
              className="w-full flex flex-col p-5"
              style={{
                height: "clamp(280px, 32vh, 370px)",
                borderRadius: "16px",
                background: "rgba(222, 231, 241, 0.42)",
                backdropFilter: "blur(30px) saturate(160%)",
                WebkitBackdropFilter: "blur(30px) saturate(160%)",
                border: "1px dashed rgba(0,0,0,0.11)",
                boxShadow: "0 1px 0 rgba(255,255,255,0.7) inset, 0 24px 64px rgba(0,0,0,0.07)",
                transform: `perspective(1000px) rotateY(${[-5, -2, 2, 4.5][i]}deg) rotateX(${[2, -1.5, 1.5, -2][i]}deg)`,
                overflow: "hidden",
              }}
            >
              <div className="flex-shrink-0 mb-3">{t.logo}</div>
              <p
                className="flex-1 text-black/82 overflow-hidden"
                style={{
                  fontSize: "clamp(10px, 0.82vw, 12px)",
                  fontWeight: 500,
                  lineHeight: 1.6,
                  letterSpacing: "-0.01em",
                  display: "-webkit-box",
                  WebkitLineClamp: 9,
                  WebkitBoxOrient: "vertical",
                }}
              >
                "{t.quote}"
              </p>
              <div className="flex-shrink-0 mt-3 pt-3" style={{ borderTop: "1px solid rgba(0,0,0,0.08)" }}>
                <p className="font-bold tracking-[0.1em] text-black/85 uppercase" style={{ fontSize: "9px" }}>
                  {t.author}
                </p>
                <p className="mt-0.5 text-black/45" style={{ fontSize: "8.5px", fontWeight: 300 }}>
                  {t.role}
                </p>
              </div>
            </div>
          </div>
        ))}

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
            <span className="text-[9.5px] font-semibold tracking-[0.3em] text-black/45 uppercase">NOOMO x 3D HUB</span>
          </div>
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
