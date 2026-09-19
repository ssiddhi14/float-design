import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState, lazy, Suspense } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import ContactSection from "@/components/ContactSection";
import ProductsStory from "@/components/ProductsStory";
import { About } from "@/routes/about";
import { getUser, logout, getCartCount, addToCart } from "@/lib/store";
import { getProducts, Product } from "@/lib/products";
import { getTheme, toggleTheme, applyTheme } from "@/lib/theme";

const HeroScene = lazy(() => import("@/components/HeroScene"));

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "3D HUB - Think It. Design It. Print It." },
      { name: "description", content: "3D HUB is an immersive creative studio for 3D design, prototyping and printing." },
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
  component: Index,
});

// -- Navbar --------------------------------------------------------------

function Navbar({ active }: { active?: string }) {
  const [user, setUser] = useState(getUser());
  const [cartCount, setCartCount] = useState(getCartCount());
  const [isDark, setIsDark] = useState(getTheme() === "dark");

  useEffect(() => {
    applyTheme(getTheme());
    const onAuth = () => setUser(getUser());
    const onCart = () => setCartCount(getCartCount());
    const onTheme = () => setIsDark(getTheme() === "dark");
    window.addEventListener("auth-updated", onAuth);
    window.addEventListener("cart-updated", onCart);
    window.addEventListener("theme-updated", onTheme);
    return () => {
      window.removeEventListener("auth-updated", onAuth);
      window.removeEventListener("cart-updated", onCart);
      window.removeEventListener("theme-updated", onTheme);
    };
  }, []);

  return (
    <nav className="absolute inset-x-0 top-0 z-40 flex items-center justify-between px-8 py-7 md:px-14">
      <Link to="/" className="flex items-center gap-2">
        <span className="text-[15px] font-semibold tracking-[0.28em] text-black">3D</span>
        <span className="h-1.5 w-1.5 rounded-full bg-[#FF6B00]" />
        <span className="text-[15px] font-semibold tracking-[0.28em] text-black">HUB</span>
      </Link>
      <ul className="hidden items-center gap-9 md:flex">
        {[
          { label: "HOME", to: "/" as const },
          { label: "SHOP", to: "/shop" as const },
          { label: "CONTACT US", to: "/contact-us" as const },
        ].map(({ label, to }) => (
          <li key={label} style={{ position: "relative" }}>
            <Link to={to} className="group relative text-[12px] font-medium tracking-[0.22em] text-black transition-opacity hover:opacity-70">
              {label}
              {((label === "HOME" && active === "HOME") || (label === "SHOP" && active === "SHOP") || (label === "CONTACT US" && active === "CONTACT-US"))
                ? <span className="absolute -bottom-1 left-0 h-px w-full bg-[#FF6B00]" />
                : <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#FF6B00] transition-all duration-500 group-hover:w-full" />
              }
            </Link>
          </li>
        ))}
      </ul>
      <div className="hidden md:flex items-center gap-3">
        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          title={isDark ? "Switch to light" : "Switch to dark"}
          className="rounded-full border border-black/20 p-2 transition-colors hover:border-black"
          style={{ background: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.04)", borderColor: isDark ? "rgba(255,255,255,0.15)" : undefined }}
        >
          {isDark ? (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#eef0f8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" /><line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" /><line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" /><line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </svg>
          ) : (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#0a0a0a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          )}
        </button>
        {/* Cart */}
        <Link to="/cart"
          style={{ position: "relative", textDecoration: "none", padding: "7px 14px", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 9999, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: isDark ? "#eef0f8" : "#0a0a0a", display: "flex", alignItems: "center", gap: 6 }}>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 01-8 0" />
          </svg>
          CART
          {cartCount > 0 && (
            <span style={{ width: 17, height: 17, borderRadius: "50%", background: "#FF6B00", color: "#fff", fontSize: 8, fontWeight: 700, display: "inline-flex", alignItems: "center", justifyContent: "center" }}>
              {cartCount}
            </span>
          )}
        </Link>
        {/* Auth */}
        {user ? (
          <div className="flex items-center gap-2">
            {user.email.trim().toLowerCase() === "admin@1234" && (
              <Link
                to="/admin"
                className="rounded-full px-3 py-1.5 text-[10px] font-bold tracking-[0.18em] transition-colors"
                style={{ background: "#FF6B00", color: "#fff", textDecoration: "none" }}
              >
                ADMIN PANEL
              </Link>
            )}
            {user.avatar && (
              <img
                src={user.avatar}
                alt={user.firstName}
                className="h-6 w-6 rounded-full object-cover border border-black/10"
              />
            )}
            <span className="text-[12px] font-medium tracking-[0.08em] text-black">Hello, {user.firstName}</span>
            <button
              onClick={() => { logout(); setUser(null); window.dispatchEvent(new Event("auth-updated")); }}
              className="rounded-full border border-black/20 px-3 py-1.5 text-[10px] font-medium tracking-[0.18em] text-black/55 hover:text-black hover:border-black transition-colors"
            >
              LOGOUT
            </button>
          </div>
        ) : (
          <Link to="/login" className="inline-flex items-center rounded-full px-4 py-2 text-[11px] font-medium tracking-[0.2em] transition-colors" style={{ background: "#0a0a0a", color: "#fff", textDecoration: "none" }}>
            LOGIN / SIGN UP
          </Link>
        )}
      </div>
    </nav>
  );
}

// -- Hero ----------------------------------------------------------------

const HERO_WORDS = ["THINK IT", "DESIGN IT", "PRINT IT"];

function HeroSection() {
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
    const id = setInterval(() => setWordIndex((i) => (i + 1) % HERO_WORDS.length), 2800);
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth) * 2 - 1;
      const y = (e.clientY / window.innerHeight) * 2 - 1;
      mouse.current.x = x;
      mouse.current.y = -y;
      mx.set(x);
      my.set(-y);
    };
    window.addEventListener("mousemove", onMove);
    return () => { clearInterval(id); window.removeEventListener("mousemove", onMove); };
  }, [mx, my]);

  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: "100vh", backgroundColor: "var(--bg-primary)" }}
    >
      <Navbar active="HOME" />

      <div className="absolute inset-0 z-10">
        {mounted && (
          <Suspense fallback={null}>
            <HeroScene mouse={mouse} />
          </Suspense>
        )}
      </div>

      <motion.h1
        style={{ x: textX, y: textY, mixBlendMode: "difference" }}
        className="pointer-events-none absolute inset-0 z-20 flex select-none items-center justify-center"
      >
        <span
          key={wordIndex}
          className="block text-center font-extralight leading-[0.85] animate-[fadeWord_2.8s_ease-in-out_infinite]"
          style={{ fontSize: "clamp(80px, 18vw, 280px)", letterSpacing: "-0.04em", fontFamily: "'Inter','Helvetica Neue',sans-serif", color: "#FFFFFF" }}
        >
          {HERO_WORDS[wordIndex]}
        </span>
      </motion.h1>

      <div className="pointer-events-none absolute bottom-8 right-6 z-30 md:right-12">
        <div className="flex items-center gap-3">
          <span className="block h-px w-12 origin-left animate-[scrollLine_2s_ease-in-out_infinite]" style={{ backgroundColor: "#FF6B00" }} />
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: "@keyframes fadeWord{0%,100%{opacity:0;transform:translateY(20px);filter:blur(8px)}15%,85%{opacity:1;transform:translateY(0);filter:blur(0)}}@keyframes scrollLine{0%,100%{transform:scaleX(0.2)}50%{transform:scaleX(1)}}" }} />
    </section>
  );
}

function FeaturedProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [added, setAdded] = useState<number | null>(null);

  const refreshProducts = () => setProducts([...getProducts()]);

  useEffect(() => {
    refreshProducts();
    window.addEventListener("products-updated", refreshProducts);
    return () => window.removeEventListener("products-updated", refreshProducts);
  }, []);

  if (products.length === 0) return null;

  const handleCart = (id: number) => {
    addToCart(id);
    setAdded(id);
    setTimeout(() => setAdded(null), 1400);
  };

  return (
    <section style={{ padding: "100px 8vw", background: "var(--bg-primary)", position: "relative", zIndex: 10 }}>
      <div style={{ textAlign: "center", marginBottom: 48 }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.42em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 14px" }}>
          OUR COLLECTION
        </p>
        <h2 style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: "clamp(2.5rem, 5vw, 4.5rem)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 12px", lineHeight: 1.1 }}>
          Featured <em style={{ fontStyle: "italic", color: "#FF6B00" }}>3D creations.</em>
        </h2>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: 0 }}>
          Explore our latest 3D printed components, prototypes and manufacturing models.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto 48px" }}>
        {products.slice(0, 6).map((p) => {
          const pImage = p.images && p.images.length > 0 ? p.images[0] : p.image;
          return (
            <div key={p.id} style={{
              background: "var(--card-bg, rgba(255,255,255,0.65))",
              backdropFilter: "blur(18px)",
              border: "1px solid var(--card-border, rgba(0,0,0,0.08))",
              borderRadius: 18,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              boxShadow: "0 4px 24px rgba(0,0,0,0.04)",
              transition: "transform 0.2s ease, box-shadow 0.2s ease",
            }}>
              <div style={{ height: 200, background: "#e8edf5", position: "relative", overflow: "hidden" }}>
                {pImage ? (
                  <img src={pImage} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }} />
                ) : (
                  <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#888", fontSize: 12 }}>No image</div>
                )}
                {p.badge && (
                  <span style={{ position: "absolute", top: 12, left: 12, background: p.badge === "NEW" ? "#FF6B00" : "#0a0a0a", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", padding: "4px 10px", borderRadius: 6, zIndex: 1 }}>
                    {p.badge}
                  </span>
                )}
              </div>
              <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.24em", color: "rgba(255,107,0,0.7)", textTransform: "uppercase", margin: "0 0 6px" }}>{p.category}</p>
                <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{p.name}</h3>
                <p style={{ fontSize: 12, fontWeight: 300, color: "var(--text-muted)", margin: "0 0 18px", lineHeight: 1.6, flex: 1 }}>{p.desc}</p>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text-primary)" }}>
                    Rs. {p.price.toLocaleString()}
                  </span>
                  <button
                    onClick={() => handleCart(p.id)}
                    style={{ padding: "9px 18px", background: added === p.id ? "#27ae60" : "#0a0a0a", color: "#fff", border: "none", borderRadius: 9999, fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background 0.25s ease" }}
                  >
                    {added === p.id ? "Added!" : "+ Cart"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ textAlign: "center" }}>
        <Link to="/shop" style={{
          padding: "16px 44px", background: "#0a0a0a", color: "#fff",
          borderRadius: 9999, fontSize: 11, fontWeight: 600,
          letterSpacing: "0.22em", textTransform: "uppercase",
          textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 10,
          boxShadow: "0 20px 60px rgba(10,10,20,0.16)",
        }}>
          Explore Full Shop Collection <span style={{ color: "#FF6B00" }}>&rarr;</span>
        </Link>
      </div>
    </section>
  );
}

// -- Index Component ----------------------------------------------------

function Index() {
  return (
    <main>
      <HeroSection />
      <FeaturedProductsSection />
      <ContactSection />
      <ProductsStory showNav={false} showCircularText={false} />
      <About showNav={false} />
    </main>
  );
}
