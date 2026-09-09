import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { setUser } from "@/lib/store";
import { isAdmin } from "@/lib/products";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Login / Sign Up - 3D HUB" }],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap" },
    ],
  }),
  component: LoginPage,
});

const inp: React.CSSProperties = {
  width: "100%", padding: "14px 18px",
  background: "var(--card-bg)",
  border: "1px solid var(--card-border)", borderRadius: 12,
  fontSize: 13, fontWeight: 300, color: "var(--text-primary)",
  outline: "none", fontFamily: "'Plus Jakarta Sans', sans-serif",
  boxSizing: "border-box", transition: "border-color 0.2s ease",
};

const lbl: React.CSSProperties = {
  fontSize: 9, fontWeight: 600, letterSpacing: "0.24em",
  color: "rgba(10,10,20,0.42)", textTransform: "uppercase",
  marginBottom: 7, display: "block",
};

function Field({ label, type = "text", placeholder, value, onChange }: {
  label: string; type?: string; placeholder: string;
  value: string; onChange: (v: string) => void;
}) {
  return (
    <div>
      <label style={lbl}>{label}</label>
      <input type={type} placeholder={placeholder} value={value}
        onChange={e => onChange(e.target.value)}
        style={inp}
        onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,107,0,0.5)"; }}
        onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
      />
    </div>
  );
}

function LoginPage() {
  const nav = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");

  // Login fields
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");

  // Signup extra fields
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [confirm, setConfirm] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (mode === "signup") {
      if (!first.trim() || !last.trim()) { setError("Please enter your full name."); return; }
      if (!email.includes("@")) { setError("Please enter a valid email."); return; }
      if (pass.length < 6) { setError("Password must be at least 6 characters."); return; }
      if (pass !== confirm) { setError("Passwords do not match."); return; }
      setUser({ firstName: first.trim(), lastName: last.trim(), email: email.trim() });
    } else {
      if (!email.includes("@") || !pass) { setError("Please enter your email and password."); return; }
      // Admin check
      if (isAdmin(email.trim(), pass)) {
        setUser({ firstName: "Admin", lastName: "", email: email.trim() });
        window.dispatchEvent(new Event("auth-updated"));
        nav({ to: "/admin" });
        return;
      }
      const name = email.split("@")[0];
      setUser({ firstName: name, lastName: "", email: email.trim() });
    }

    window.dispatchEvent(new Event("auth-updated"));
    nav({ to: "/" });
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "var(--bg-gradient)",
      display: "flex", flexDirection: "column",
      fontFamily: "'Plus Jakarta Sans', sans-serif", position: "relative", overflow: "hidden",
    }}>
      <div aria-hidden style={{
        position: "absolute", left: "50%", top: "40%", transform: "translate(-50%,-50%)",
        width: "80vw", height: "80vw", maxWidth: 900, borderRadius: "9999px",
        background: "radial-gradient(circle, rgba(160,185,240,0.32) 0%, rgba(222,231,241,0) 65%)",
        filter: "blur(70px)", pointerEvents: "none", zIndex: 0,
      }} />
      <div aria-hidden style={{
        position: "absolute", right: "8%", top: "15%", width: "25vw", height: "25vw",
        maxWidth: 300, borderRadius: "9999px",
        background: "radial-gradient(circle, rgba(255,107,0,0.1) 0%, transparent 70%)",
        filter: "blur(40px)", pointerEvents: "none", zIndex: 0,
      }} />

      <nav style={{ position: "relative", zIndex: 10, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "24px 52px" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
        </Link>
        <Link to="/" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-muted)", textDecoration: "none" }}>
          BACK TO HOME
        </Link>
      </nav>

      <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 24px", position: "relative", zIndex: 1 }}>
        <div style={{ width: "100%", maxWidth: 440 }}>

          <div style={{ textAlign: "center", marginBottom: 36 }}>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.42em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 14px" }}>
              {mode === "login" ? "WELCOME BACK" : "GET STARTED"}
            </p>
            <h1 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2rem,5vw,3.2rem)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 10px", lineHeight: 1.1 }}>
              {mode === "login"
                ? <><span>Sign in to</span><br /><em style={{ fontStyle: "italic", color: "#FF6B00" }}>your account</em></>
                : <><span>Create your</span><br /><em style={{ fontStyle: "italic", color: "#FF6B00" }}>account</em></>}
            </h1>
          </div>

          {/* Toggle */}
          <div style={{ display: "flex", background: "rgba(255,255,255,0.4)", borderRadius: 12, padding: 4, marginBottom: 24, border: "1px solid var(--card-border)" }}>
            {(["login", "signup"] as const).map(m => (
              <button key={m} onClick={() => { setMode(m); setError(""); }}
                style={{ flex: 1, padding: "10px 0", border: "none", borderRadius: 9, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", transition: "all 0.25s ease", background: mode === m ? "#0a0a0a" : "transparent", color: mode === m ? "#fff" : "rgba(10,10,20,0.45)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                {m === "login" ? "LOG IN" : "SIGN UP"}
              </button>
            ))}
          </div>

          <div style={{ background: "var(--card-bg)", backdropFilter: "blur(24px)", border: "1px solid var(--card-border)", borderRadius: 20, padding: "32px 28px", boxShadow: "0 8px 48px rgba(0,0,0,0.06)" }}>
            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {mode === "signup" && (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
                  <Field label="First Name" placeholder="John" value={first} onChange={setFirst} />
                  <Field label="Last Name" placeholder="Doe" value={last} onChange={setLast} />
                </div>
              )}
              <Field label="Email Address" type="email" placeholder="your@email.com" value={email} onChange={setEmail} />
              <div>
                <label style={lbl}>Password</label>
                <div style={{ position: "relative" }}>
                  <input type={showPass ? "text" : "password"} placeholder={mode === "signup" ? "Min 6 characters" : "Enter your password"}
                    value={pass} onChange={e => setPass(e.target.value)}
                    style={{ ...inp, paddingRight: 56 }}
                    onFocus={e => { e.currentTarget.style.borderColor = "rgba(255,107,0,0.5)"; }}
                    onBlur={e => { e.currentTarget.style.borderColor = "rgba(0,0,0,0.1)"; }}
                  />
                  <button type="button" onClick={() => setShowPass(!showPass)}
                    style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "rgba(10,10,20,0.35)", fontSize: 10, fontWeight: 600, letterSpacing: "0.1em", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
                    {showPass ? "HIDE" : "SHOW"}
                  </button>
                </div>
              </div>
              {mode === "signup" && (
                <Field label="Confirm Password" type="password" placeholder="Repeat password" value={confirm} onChange={setConfirm} />
              )}
              {error && (
                <p style={{ fontSize: 11, color: "#c0392b", margin: 0, fontWeight: 500 }}>{error}</p>
              )}
              <button type="submit"
                style={{ width: "100%", padding: "15px 0", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 12, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", boxShadow: "0 12px 40px rgba(10,10,20,0.18)", transition: "transform 0.2s ease", marginTop: 4 }}
                onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.02)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}>
                {mode === "login" ? "Sign In" : "Create Account"} <span style={{ color: "#FF6B00" }}>&rarr;</span>
              </button>
            </form>

            <div style={{ display: "flex", alignItems: "center", gap: 12, margin: "18px 0" }}>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
              <span style={{ fontSize: 9.5, fontWeight: 500, letterSpacing: "0.18em", color: "rgba(10,10,20,0.35)", textTransform: "uppercase" }}>or</span>
              <div style={{ flex: 1, height: 1, background: "rgba(0,0,0,0.08)" }} />
            </div>

            <button type="button"
              style={{ width: "100%", padding: "13px 0", background: "var(--card-bg)", color: "var(--text-primary)", border: "1px solid var(--card-border)", borderRadius: 12, fontSize: 12, fontWeight: 500, letterSpacing: "0.06em", cursor: "pointer", fontFamily: "'Plus Jakarta Sans', sans-serif", display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          </div>

          <p style={{ textAlign: "center", marginTop: 18, fontSize: 12, fontWeight: 300, color: "rgba(10,10,20,0.48)" }}>
            {mode === "login" ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(""); }}
              style={{ background: "none", border: "none", cursor: "pointer", color: "#FF6B00", fontWeight: 600, fontSize: 12, fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              {mode === "login" ? "Sign up" : "Log in"}
            </button>
          </p>

        </div>
      </div>
    </div>
  );
}
