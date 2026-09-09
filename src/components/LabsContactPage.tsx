import { Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

function FloatingOrbs() {
  return (
    <div aria-hidden style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 0 }}>
      <div style={{ position: "absolute", left: "50%", top: "40%", transform: "translate(-50%,-50%)", width: "70vw", height: "70vw", maxWidth: 900, maxHeight: 900, borderRadius: "9999px", background: "radial-gradient(circle at 40% 40%, rgba(255,107,0,0.07) 0%, rgba(180,200,240,0.18) 40%, rgba(222,231,241,0) 70%)", filter: "blur(60px)", animation: "orbFloat1 12s ease-in-out infinite" }} />
      <div style={{ position: "absolute", right: "5%", top: "8%", width: "28vw", height: "28vw", maxWidth: 340, borderRadius: "9999px", background: "radial-gradient(circle, rgba(255,107,0,0.12) 0%, rgba(255,107,0,0) 70%)", filter: "blur(40px)", animation: "orbFloat2 9s ease-in-out infinite" }} />
      <div style={{ position: "absolute", left: "2%", bottom: "10%", width: "22vw", height: "22vw", maxWidth: 260, borderRadius: "9999px", background: "radial-gradient(circle, rgba(150,180,230,0.2) 0%, rgba(150,180,230,0) 70%)", filter: "blur(35px)", animation: "orbFloat3 11s ease-in-out infinite" }} />
    </div>
  );
}

function Counter({ end, suffix = "" }: { end: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obj = { val: 0 };
    gsap.to(obj, { val: end, duration: 2.2, ease: "power2.out", delay: 0.3, onUpdate: () => { el.textContent = Math.round(obj.val) + suffix; } });
  }, [end, suffix]);
  return <span ref={ref}>0{suffix}</span>;
}

function Field({ label, type = "text", placeholder, span = false }: { label: string; type?: string; placeholder: string; span?: boolean }) {
  const [focused, setFocused] = useState(false);
  const [filled, setFilled] = useState(false);
  const base: React.CSSProperties = {
    padding: "16px 18px",
    background: focused ? "rgba(255,255,255,0.72)" : "rgba(255,255,255,0.42)",
    border: focused ? "1px solid rgba(255,107,0,0.5)" : filled ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(0,0,0,0.08)",
    borderRadius: 12, fontSize: 13, fontWeight: 300, color: "var(--text-primary)",
    outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
    backdropFilter: "blur(12px)", transition: "all 0.25s ease",
    boxShadow: focused ? "0 0 0 3px rgba(255,107,0,0.08)" : "none",
  };
  return (
    <div style={{ gridColumn: span ? "1 / -1" : undefined, display: "flex", flexDirection: "column", gap: 6 }}>
      <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.28em", color: focused ? "rgba(255,107,0,0.8)" : "rgba(10,10,20,0.4)", textTransform: "uppercase", transition: "color 0.2s ease" }}>{label}</label>
      {type === "textarea"
        ? <textarea rows={5} placeholder={placeholder} style={{ ...base, resize: "none", lineHeight: 1.7 }} onFocus={() => setFocused(true)} onBlur={(e) => { setFocused(false); setFilled(e.target.value.length > 0); }} />
        : <input type={type} placeholder={placeholder} style={base} onFocus={() => setFocused(true)} onBlur={(e) => { setFocused(false); setFilled(e.target.value.length > 0); }} />
      }
    </div>
  );
}

function UploadField() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (incoming: FileList | null) => {
    if (!incoming) return;
    const valid = Array.from(incoming).filter((f) => {
      const isImage = f.type.startsWith("image/");
      const isVideo = f.type.startsWith("video/");
      return (isImage || isVideo) && f.size < 50 * 1024 * 1024; // 50MB max
    });
    setFiles((prev) => [...prev, ...valid].slice(0, 5));
  };

  const remove = (i: number) => setFiles((prev) => prev.filter((_, idx) => idx !== i));

  return (
    <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 8 }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-soft)", textTransform: "uppercase" }}>
          Photo / Video of Your Idea
        </label>
        <span style={{ fontSize: 9, fontWeight: 500, letterSpacing: "0.15em", color: "rgba(255,107,0,0.7)", textTransform: "uppercase" }}>
          Optional
        </span>
      </div>

      {/* Drop zone */}
      <div
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); handleFiles(e.dataTransfer.files); }}
        style={{
          padding: "32px 24px",
          border: dragging ? "1.5px dashed rgba(255,107,0,0.6)" : "1.5px dashed rgba(0,0,0,0.12)",
          borderRadius: 12,
          background: dragging ? "rgba(255,107,0,0.04)" : "rgba(255,255,255,0.38)",
          backdropFilter: "blur(12px)",
          cursor: "pointer",
          transition: "all 0.22s ease",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          boxShadow: dragging ? "0 0 0 3px rgba(255,107,0,0.08)" : "none",
        }}
      >
        {/* Upload icon */}
        <div style={{
          width: 44, height: 44, borderRadius: "50%",
          background: dragging ? "rgba(255,107,0,0.1)" : "rgba(0,0,0,0.04)",
          display: "flex", alignItems: "center", justifyContent: "center",
          transition: "background 0.2s ease",
        }}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={dragging ? "#FF6B00" : "rgba(10,10,20,0.4)"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="16 16 12 12 8 16" />
            <line x1="12" y1="12" x2="12" y2="21" />
            <path d="M20.39 18.39A5 5 0 0 0 18 9h-1.26A8 8 0 1 0 3 16.3" />
          </svg>
        </div>
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: 13, fontWeight: 400, color: "rgba(10,10,20,0.65)", margin: "0 0 4px" }}>
            <span style={{ color: "#FF6B00", fontWeight: 500 }}>Click to upload</span> or drag and drop
          </p>
          <p style={{ fontSize: 10, fontWeight: 300, color: "rgba(10,10,20,0.38)", margin: 0, letterSpacing: "0.05em" }}>
            JPG, PNG, GIF, MP4, MOV up to 50MB each (max 5 files)
          </p>
        </div>
      </div>

      {/* Hidden input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/*,video/*"
        multiple
        style={{ display: "none" }}
        onChange={(e) => handleFiles(e.target.files)}
      />

      {/* File previews */}
      {files.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 4 }}>
          {files.map((f, i) => (
            <div key={i} style={{
              position: "relative",
              display: "flex", alignItems: "center", gap: 10,
              padding: "10px 14px",
              background: "var(--card-bg)",
              border: "1px solid var(--card-border)",
              borderRadius: 10,
              backdropFilter: "blur(10px)",
              maxWidth: 220,
            }}>
              {/* Icon */}
              <div style={{
                width: 32, height: 32, borderRadius: 6,
                background: f.type.startsWith("video/") ? "rgba(255,107,0,0.1)" : "rgba(100,150,230,0.1)",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0,
              }}>
                {f.type.startsWith("video/") ? (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF6B00" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="23 7 16 12 23 17 23 7" />
                    <rect x="1" y="5" width="15" height="14" rx="2" ry="2" />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#6496e6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                )}
              </div>
              {/* Name + size */}
              <div style={{ overflow: "hidden", flex: 1 }}>
                <p style={{ fontSize: 11, fontWeight: 500, color: "var(--text-primary)", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {f.name}
                </p>
                <p style={{ fontSize: 9.5, fontWeight: 300, color: "rgba(10,10,20,0.42)", margin: 0 }}>
                  {(f.size / (1024 * 1024)).toFixed(1)} MB
                </p>
              </div>
              {/* Remove */}
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); remove(i); }}
                style={{ background: "none", border: "none", cursor: "pointer", padding: 2, color: "rgba(10,10,20,0.35)", flexShrink: 0, lineHeight: 1 }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const STATS = [
  { num: 200, suffix: "+", label: "Projects Delivered" },
  { num: 98,  suffix: "%", label: "Client Satisfaction" },
  { num: 8,   suffix: "+", label: "Years of Craft" },
  { num: 40,  suffix: "+", label: "Industry Partners" },
];

const INFO = [
  { icon: "01", title: "Email Us",  detail: "hello@3dhub.studio",  sub: "We reply within 24 hours" },
  { icon: "02", title: "Call Us",   detail: "+91 98765 43210",     sub: "Mon - Fri, 10am - 7pm IST" },
  { icon: "03", title: "Visit Us",  detail: "Mumbai, India",       sub: "By appointment only" },
];

export default function LabsContactPage({ activePage = "labs" }: { activePage?: string }) {
  const titleRef   = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const statsRef   = useRef<HTMLDivElement>(null);
  const formRef    = useRef<HTMLDivElement>(null);
  const lineRef    = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    tl.fromTo(titleRef.current, { opacity: 0, y: 60, filter: "blur(12px)" }, { opacity: 1, y: 0, filter: "blur(0px)", duration: 1.4, delay: 0.2 })
      .fromTo(taglineRef.current, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.9 }, "-=0.8")
      .fromTo(lineRef.current, { scaleX: 0 }, { scaleX: 1, duration: 1.2, ease: "power2.inOut" }, "-=0.6");

    if (statsRef.current) {
      gsap.fromTo(statsRef.current.querySelectorAll(".stat-item"),
        { opacity: 0, y: 40 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12, ease: "power2.out", scrollTrigger: { trigger: statsRef.current, start: "top 80%", once: true } }
      );
    }
    if (formRef.current) {
      gsap.fromTo(formRef.current, { opacity: 0, y: 50 }, { opacity: 1, y: 0, duration: 1, ease: "power2.out", scrollTrigger: { trigger: formRef.current, start: "top 75%", once: true } });
    }
    return () => { ScrollTrigger.getAll().forEach(t => t.kill()); };
  }, []);

  return (
    <div style={{ backgroundColor: "var(--bg-primary)", minHeight: "100vh", fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative" }}>

      <nav style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 56px", background: "var(--nav-bg)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
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
                {((label === "CONTACT US" && activePage === "contact-us") || (label === "HOME" && activePage === "work") || (label === "SHOP" && activePage === "shop")) && (
                  <span style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 1, background: "#FF6B00" }} />
                )}
              </Link>
            </li>
          ))}
        </ul>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>AVAILABLE FOR PROJECTS</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ position: "relative", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", paddingTop: 100, paddingBottom: 80, overflow: "hidden" }}>
        <FloatingOrbs />
        <div style={{ position: "relative", zIndex: 1, textAlign: "center", maxWidth: 900, padding: "0 40px" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.45em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 28px" }}>LET'S BUILD TOGETHER</p>
          <h1 ref={titleRef} style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(3.5rem, 10vw, 10rem)", fontWeight: 300, letterSpacing: "-0.03em", lineHeight: 0.95, color: "var(--text-primary)", margin: "0 0 32px", opacity: 0 }}>
            Every great object
            <br />
            <em style={{ fontStyle: "italic", color: "#FF6B00" }}>starts with</em>
            <br />
            a conversation.
          </h1>
          <p ref={taglineRef} style={{ fontSize: "clamp(13px, 1.4vw, 17px)", fontWeight: 300, lineHeight: 1.8, color: "var(--text-muted)", maxWidth: 520, margin: "0 auto 48px", opacity: 0 }}>
            We turn bold ideas into precision-crafted physical realities. Tell us about your project and let's create something extraordinary.
          </p>
          <div style={{ position: "relative", width: 120, height: 1, margin: "0 auto", background: "rgba(0,0,0,0.08)" }}>
            <div ref={lineRef} style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, transparent, #FF6B00, transparent)", transformOrigin: "left", transform: "scaleX(0)" }} />
          </div>
          <div style={{ marginTop: 40, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.35em", color: "rgba(10,10,20,0.3)", textTransform: "uppercase" }}>SCROLL TO CONNECT</span>
            <span style={{ display: "block", width: 32, height: 1, background: "#FF6B00", animation: "slideRight 2s ease-in-out infinite" }} />
          </div>
        </div>
      </div>

      {/* Stats */}
      <div ref={statsRef} style={{ background: "rgba(10,10,20,0.04)", borderTop: "1px solid rgba(0,0,0,0.06)", borderBottom: "1px solid rgba(0,0,0,0.06)", padding: "52px 56px", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 0 }}>
        {STATS.map((s, i) => (
          <div key={i} className="stat-item" style={{ textAlign: "center", borderRight: i < 3 ? "1px solid rgba(0,0,0,0.08)" : "none", padding: "0 24px" }}>
            <div style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2.8rem, 5vw, 5rem)", fontWeight: 300, color: "var(--text-primary)", lineHeight: 1, marginBottom: 8 }}>
              <Counter end={s.num} suffix={s.suffix} />
            </div>
            <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", color: "rgba(10,10,20,0.45)", textTransform: "uppercase", margin: 0 }}>{s.label}</p>
          </div>
        ))}
      </div>

      {/* Form + Info */}
      <div style={{ padding: "120px 56px 140px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, maxWidth: 1200, margin: "0 auto" }}>
        <div>
          <p style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 20px" }}>REACH OUT</p>
          <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(2rem, 3.5vw, 3.5rem)", fontWeight: 300, letterSpacing: "-0.02em", lineHeight: 1.15, color: "var(--text-primary)", margin: "0 0 28px" }}>
            Ready to make<br /><em style={{ fontStyle: "italic", color: "#FF6B00" }}>something real?</em>
          </h2>
          <p style={{ fontSize: 14, fontWeight: 300, lineHeight: 1.85, color: "rgba(10,10,20,0.52)", margin: "0 0 48px" }}>
            Whether it's a prototype, a full production run, or an experimental concept pushing the boundaries of what's physically possible - we're the team to call.
          </p>
          {INFO.map((c, i) => (
            <div key={i} style={{ display: "flex", gap: 20, alignItems: "flex-start", marginBottom: 28, paddingBottom: 28, borderBottom: i < 2 ? "1px solid rgba(0,0,0,0.07)" : "none" }}>
              <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", color: "#FF6B00", minWidth: 24, marginTop: 3 }}>{c.icon}</span>
              <div>
                <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.2em", color: "var(--text-soft)", textTransform: "uppercase", margin: "0 0 4px" }}>{c.title}</p>
                <p style={{ fontSize: 16, fontWeight: 400, color: "var(--text-primary)", margin: "0 0 3px" }}>{c.detail}</p>
                <p style={{ fontSize: 11, fontWeight: 300, color: "rgba(10,10,20,0.42)", margin: 0 }}>{c.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <div ref={formRef} style={{ opacity: 0 }}>
          {submitted ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "100%", textAlign: "center", gap: 20 }}>
              <div style={{ width: 64, height: 64, borderRadius: "50%", background: "rgba(255,107,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <span style={{ fontSize: 28, color: "#FF6B00" }}>&#10003;</span>
              </div>
              <h3 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, color: "var(--text-primary)", margin: 0 }}>Message received.</h3>
              <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: 0, lineHeight: 1.7 }}>We'll be in touch within 24 hours.<br />Exciting things ahead.</p>
            </div>
          ) : (
            <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
              <Field label="First Name" placeholder="Your first name" />
              <Field label="Last Name" placeholder="Your last name" />
              <Field label="Email Address" type="email" placeholder="your@email.com" span />
              {/* <Field label="Company / Studio" placeholder="Where do you work?" span /> */}
              {/* <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 6 }}>
                <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-soft)", textTransform: "uppercase" }}>SERVICE</label>
                <select style={{ padding: "16px 18px", background: "var(--card-bg)", border: "1px solid var(--card-border)", borderRadius: 12, fontSize: 13, fontWeight: 300, color: "var(--text-primary)", outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif", backdropFilter: "blur(12px)", cursor: "pointer" }}>
                  <option value="">Select a service</option>
                  <option>3D Prototyping</option>
                  <option>Product Design</option>
                  <option>Manufacturing</option>
                  <option>Custom Engineering</option>
                  <option>Consultation</option>
                </select>
              </div> */}
              <Field label="Tell us about your project" type="textarea" placeholder="Describe your vision, timeline, and any specific requirements..." span />

              {/* Upload field - optional */}
              <UploadField />
              <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 8 }}>
                <p style={{ fontSize: 10, fontWeight: 300, color: "rgba(10,10,20,0.38)", margin: 0, lineHeight: 1.6, maxWidth: 240 }}>By submitting you agree to our privacy policy. We never share your data.</p>
                <button type="submit" style={{ padding: "16px 40px", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 9999, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", display: "flex", alignItems: "center", gap: 10, boxShadow: "0 20px 60px rgba(10,10,20,0.16)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}
                  onMouseEnter={(e) => { e.currentTarget.style.transform = "scale(1.04)"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.transform = "scale(1)"; }}>
                  Send Message <span style={{ color: "#FF6B00", fontSize: 16 }}>&rarr;</span>
                </button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Footer */}
      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", padding: "32px 56px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
          <span style={{ width: 5, height: 5, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 13, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
        </Link>
        <p style={{ fontSize: 10, fontWeight: 300, color: "rgba(10,10,20,0.35)", margin: 0, letterSpacing: "0.1em" }}>2026 3D HUB Studio. Think it. Design it. Print it.</p>
        <p style={{ fontSize: 10, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-soft)", textTransform: "uppercase", margin: 0 }}>MUMBAI, INDIA</p>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes orbFloat1{0%,100%{transform:translate(-50%,-50%) scale(1)}50%{transform:translate(-50%,-54%) scale(1.06)}}@keyframes orbFloat2{0%,100%{transform:translateY(0)}50%{transform:translateY(-18px)}}@keyframes orbFloat3{0%,100%{transform:translateY(0)}60%{transform:translateY(-14px)}}@keyframes slideRight{0%,100%{transform:scaleX(0.3);opacity:0.4}50%{transform:scaleX(1);opacity:1}}" }} />
    </div>
  );
}
