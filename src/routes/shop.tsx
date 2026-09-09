import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import { addToCart, toggleWishlist, getWishlist, getCartCount } from "@/lib/store";
import { getProducts, Product, getCategories } from "@/lib/products";

export const Route = createFileRoute("/shop")({
  head: () => ({
    meta: [{ title: "Shop - 3D HUB" }],
    links: [
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400&family=Plus+Jakarta+Sans:wght@200;300;400;500;600&display=swap" },
    ],
  }),
  component: Shop,
});


interface ProductCardProps {
  product: Product;
  wishlist: number[];
  added: boolean;
  onCart: (id: number) => void;
}

function ProductCard({ product, wishlist, added, onCart }: ProductCardProps) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [hovered, setHovered] = useState(false);
  const images = product.images && product.images.length > 0 ? product.images : [product.image];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(prev => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setCurrentIdx(prev => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      style={{
        background: "var(--card-bg)",
        backdropFilter: "blur(18px)",
        border: "1px solid var(--card-border)",
        borderRadius: 18,
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        boxShadow: "0 4px 24px rgba(0,0,0,0.04)"
      }}
      onMouseEnter={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 12px 48px rgba(0,0,0,0.1)";
        setHovered(true);
      }}
      onMouseLeave={e => {
        (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px rgba(0,0,0,0.04)";
        setHovered(false);
      }}
    >
      {/* Product image */}
      <div style={{ height: 200, background: "#e8edf5", position: "relative", overflow: "hidden" }}>
        <img
          src={images[currentIdx]}
          alt={product.name}
          style={{ width: "100%", height: "100%", objectFit: "cover", display: "block", transition: "opacity 0.3s ease" }}
        />
        
        {product.badge && (
          <span style={{ position: "absolute", top: 14, left: 14, background: product.badge === "NEW" ? "#FF6B00" : "#0a0a0a", color: "#fff", fontSize: 9, fontWeight: 700, letterSpacing: "0.2em", padding: "4px 10px", borderRadius: 6, zIndex: 10 }}>
            {product.badge}
          </span>
        )}
        
        {/* Wishlist heart */}
        <button
          onClick={() => toggleWishlist(product.id)}
          style={{ position: "absolute", top: 12, right: 12, width: 34, height: 34, borderRadius: "50%", background: "rgba(255,255,255,0.8)", backdropFilter: "blur(8px)", border: "1px solid var(--card-border)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 10 }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={wishlist.includes(product.id) ? "#FF6B00" : "none"} stroke={wishlist.includes(product.id) ? "#FF6B00" : "rgba(0,0,0,0.4)"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
          </svg>
        </button>

        {/* Carousel Navigation Arrows */}
        {images.length > 1 && hovered && (
          <>
            <button
              onClick={handlePrev}
              style={{
                position: "absolute",
                top: "50%",
                left: 10,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "opacity 0.2s, background 0.2s",
                zIndex: 10
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fff"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="15 18 9 12 15 6"></polyline>
              </svg>
            </button>
            <button
              onClick={handleNext}
              style={{
                position: "absolute",
                top: "50%",
                right: 10,
                transform: "translateY(-50%)",
                width: 28,
                height: 28,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.9)",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                transition: "opacity 0.2s, background 0.2s",
                zIndex: 10
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#fff"}
              onMouseLeave={e => e.currentTarget.style.background = "rgba(255, 255, 255, 0.9)"}
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6"></polyline>
              </svg>
            </button>
          </>
        )}

        {/* Carousel Dots Indicators */}
        {images.length > 1 && (
          <div
            style={{
              position: "absolute",
              bottom: 12,
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              gap: 5,
              background: "rgba(0, 0, 0, 0.25)",
              padding: "4px 8px",
              borderRadius: 20,
              backdropFilter: "blur(4px)",
              zIndex: 10
            }}
          >
            {images.map((_, dotIdx) => (
              <span
                key={dotIdx}
                onClick={(e) => {
                  e.stopPropagation();
                  setCurrentIdx(dotIdx);
                }}
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: currentIdx === dotIdx ? "#FF6B00" : "rgba(255, 255, 255, 0.5)",
                  cursor: "pointer",
                  transition: "background 0.2s, transform 0.2s",
                  transform: currentIdx === dotIdx ? "scale(1.2)" : "scale(1)"
                }}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: "20px 22px 22px", flex: 1, display: "flex", flexDirection: "column" }}>
        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.24em", color: "rgba(255,107,0,0.7)", textTransform: "uppercase", margin: "0 0 6px" }}>{product.category}</p>
        <h3 style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 8px", letterSpacing: "-0.01em" }}>{product.name}</h3>
        <p style={{ fontSize: 12, fontWeight: 300, color: "var(--text-muted)", margin: "0 0 18px", lineHeight: 1.6, flex: 1 }}>{product.desc}</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.5rem", fontWeight: 400, color: "var(--text-primary)" }}>
            Rs. {product.price.toLocaleString()}
          </span>
          <button
            onClick={() => onCart(product.id)}
            style={{ padding: "10px 20px", background: added ? "#27ae60" : "#0a0a0a", color: "#fff", border: "none", borderRadius: 9999, fontSize: 10, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", cursor: "pointer", fontFamily: "'Plus Jakarta Sans',sans-serif", transition: "background 0.25s ease", display: "flex", alignItems: "center", gap: 6 }}
          >
            {added ? (
              <><svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg> Added</>
            ) : (
              <>+ Cart</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [cartCount, setCartCount] = useState(0);
  const [added, setAdded] = useState<number | null>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState("ALL");

  const refreshProducts = () => setProducts([...getProducts()]);
  const refreshCategories = () => setCategories([...getCategories()]);

  useEffect(() => {
    setProducts(getProducts());
    setWishlist(getWishlist());
    setCartCount(getCartCount());
    setCategories(getCategories());

    const onCart     = () => setCartCount(getCartCount());
    const onWish     = () => setWishlist([...getWishlist()]);
    
    window.addEventListener("cart-updated",     onCart);
    window.addEventListener("wish-updated",     onWish);
    window.addEventListener("products-updated", refreshProducts);
    window.addEventListener("categories-updated", refreshCategories);

    return () => {
      window.removeEventListener("cart-updated",     onCart);
      window.removeEventListener("wish-updated",     onWish);
      window.removeEventListener("products-updated", refreshProducts);
      window.removeEventListener("categories-updated", refreshCategories);
    };
  }, []);

  const handleCart = (id: number) => {
    addToCart(id);
    setAdded(id);
    setTimeout(() => setAdded(null), 1400);
  };

  const filteredProducts = products.filter(p =>
    activeCategory === "ALL" || (p.category && p.category.toLowerCase() === activeCategory.toLowerCase())
  );

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(160deg,#F5F6FA 0%,#EAECF5 45%,#DCE2F2 100%)", fontFamily: "'Plus Jakarta Sans',sans-serif" }}>
      <nav style={{ position: "sticky", top: 0, zIndex: 50, display: "flex", alignItems: "center", justifyContent: "space-between", padding: "20px 52px", background: "rgba(245,246,250,0.8)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}>
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
        </Link>
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          <Link to="/" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-muted)", textDecoration: "none" }}>HOME</Link>
          <Link to="/shop" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-primary)", textDecoration: "none", position: "relative" }}>
            SHOP
            <span style={{ position: "absolute", bottom: -4, left: 0, width: "100%", height: 1, background: "#FF6B00" }} />
          </Link>
          <Link to="/contact-us" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-muted)", textDecoration: "none" }}>CONTACT US</Link>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {/* Cart badge */}
          <Link to="/cart" style={{ position: "relative", textDecoration: "none", padding: "8px 16px", border: "1px solid rgba(0,0,0,0.15)", borderRadius: 9999, fontSize: 11, fontWeight: 600, letterSpacing: "0.18em", color: "var(--text-primary)", display: "flex", alignItems: "center", gap: 7 }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
            </svg>
            CART
            {cartCount > 0 && (
              <span style={{ position: "absolute", top: -6, right: -6, width: 18, height: 18, borderRadius: "50%", background: "#FF6B00", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ padding: "80px 52px 32px", textAlign: "center" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.42em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 16px" }}>OUR COLLECTION</p>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "clamp(2.5rem,6vw,5rem)", fontWeight: 300, letterSpacing: "-0.03em", color: "var(--text-primary)", margin: "0 0 16px", lineHeight: 1 }}>
          Precision-crafted
          <br /><em style={{ fontStyle: "italic", color: "#FF6B00" }}>for makers.</em>
        </h1>
        <p style={{ fontSize: 14, fontWeight: 300, color: "var(--text-muted)", margin: "0 0 24px" }}>
          Professional 3D printing products, materials and components.
        </p>
      </div>

      {/* Category Pills Navigation */}
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, flexWrap: "wrap", margin: "0 auto 48px", padding: "0 52px", maxWidth: 1200 }}>
        {["ALL", ...categories].map(cat => {
          const isActive = activeCategory.toLowerCase() === cat.toLowerCase();
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: "8px 18px",
                borderRadius: 9999,
                border: "1px solid",
                borderColor: isActive ? "#FF6B00" : "rgba(0,0,0,0.06)",
                background: isActive ? "#FF6B00" : "rgba(255,255,255,0.45)",
                color: isActive ? "#fff" : "var(--text-soft, #555)",
                fontSize: 10,
                fontWeight: 600,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                cursor: "pointer",
                fontFamily: "'Plus Jakarta Sans',sans-serif",
                transition: "all 0.25s ease",
                boxShadow: isActive ? "0 4px 14px rgba(255,107,0,0.2)" : "0 2px 6px rgba(0,0,0,0.02)",
              }}
              onMouseEnter={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "#FF6B00";
                  e.currentTarget.style.background = "rgba(255,255,255,0.85)";
                  e.currentTarget.style.color = "#FF6B00";
                }
              }}
              onMouseLeave={e => {
                if (!isActive) {
                  e.currentTarget.style.borderColor = "rgba(0,0,0,0.06)";
                  e.currentTarget.style.background = "rgba(255,255,255,0.45)";
                  e.currentTarget.style.color = "var(--text-soft, #555)";
                }
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Grid */}
      <div style={{ padding: "0 52px 80px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24, maxWidth: 1200, margin: "0 auto" }}>
        {filteredProducts.map(p => (
          <ProductCard
            key={p.id}
            product={p}
            wishlist={wishlist}
            added={added === p.id}
            onCart={handleCart}
          />
        ))}
      </div>
    </div>
  );
}
