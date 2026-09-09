import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, useEffect, useRef } from "react";
import { getUser, logout, getOrders, updateOrderStatus, Order } from "@/lib/store";
import {
  getProducts,
  addProduct,
  deleteProduct,
  Product,
  getCategories,
  addCategory,
  deleteCategory,
} from "@/lib/products";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Admin Panel - 3D HUB" }] }),
  component: AdminPage,
});

const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = base64Str;
    img.onload = () => {
      const canvas = document.createElement("canvas");
      let width = img.width;
      let height = img.height;

      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      } else {
        resolve(base64Str);
      }
    };
    img.onerror = () => {
      resolve(base64Str);
    };
  });
};

function AdminPage() {
  const nav = useNavigate();
  const user = getUser();

  const [activeTab, setActiveTab] = useState<"products" | "orders">("products");

  useEffect(() => {
    if (!user || user.email !== "admin@1234") {
      nav({ to: "/login" });
    }
  }, []);

  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [form, setForm] = useState({ name: "", category: "", price: "", desc: "", badge: "" });
  const [images, setImages] = useState<string[]>(["/pragya.jpeg"]);
  const [saved, setSaved] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const [categories, setCategories] = useState<string[]>([]);
  const [newCatName, setNewCatName] = useState("");

  const refreshProducts = () => setProducts([...getProducts()]);
  const refreshCategories = () => setCategories([...getCategories()]);
  const refreshOrders = () => setOrders([...getOrders()]);

  useEffect(() => {
    refreshProducts();
    refreshCategories();
    refreshOrders();

    window.addEventListener("products-updated", refreshProducts);
    window.addEventListener("categories-updated", refreshCategories);
    window.addEventListener("orders-updated", refreshOrders);

    return () => {
      window.removeEventListener("products-updated", refreshProducts);
      window.removeEventListener("categories-updated", refreshCategories);
      window.removeEventListener("orders-updated", refreshOrders);
    };
  }, []);

  const handleImagesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const spaceLeft = 4 - images.length;
    if (spaceLeft <= 0) {
      alert("You can upload a maximum of 4 images.");
      return;
    }

    const filesToUpload = files.slice(0, spaceLeft);

    filesToUpload.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const src = ev.target?.result as string;
        compressImage(src).then((compressedSrc) => {
          setImages((prev) => {
            if (prev.length >= 4) return prev;
            if (prev.length === 1 && prev[0] === "/pragya.jpeg") {
              return [compressedSrc];
            }
            return [...prev, compressedSrc];
          });
        });
      };
      reader.readAsDataURL(file);
    });

    e.target.value = "";
  };

  const removeImage = (index: number) => {
    if (images.length <= 1) {
      alert("Minimum 1 image is required.");
      return;
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName.trim()) return;
    const ok = addCategory(newCatName);
    if (ok) {
      setNewCatName("");
    }
  };

  const handleDeleteCategory = (catName: string) => {
    deleteCategory(catName);
  };

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.category) {
      alert("Please fill in all required fields (Name, Category, and Price).");
      return;
    }
    if (images.length === 0) {
      alert("At least one image is required.");
      return;
    }
    const success = addProduct({
      name: form.name,
      category: form.category,
      price: Number(form.price),
      desc: form.desc,
      badge: form.badge || null,
      image: images[0],
      images: images,
    });
    if (success) {
      setForm({ name: "", category: "", price: "", desc: "", badge: "" });
      setImages(["/pragya.jpeg"]);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleStatusChange = (orderId: string, newStatus: Order["status"]) => {
    updateOrderStatus(orderId, newStatus);
  };

  const inp: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "var(--input-bg, rgba(255,255,255,0.55))",
    border: "1px solid rgba(0,0,0,0.1)",
    borderRadius: 10,
    fontSize: 13,
    color: "var(--text-primary, #0a0a0a)",
    outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: "border-box",
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg-gradient)", fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "18px 52px",
          background: "var(--nav-bg, rgba(245,246,250,0.85))",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.06)",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
        </Link>
        <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase" }}>
          ADMIN PANEL
        </span>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/shop" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", color: "var(--text-muted)", textDecoration: "none" }}>
            VIEW SHOP
          </Link>
          <button
            onClick={() => {
              logout();
              nav({ to: "/login" });
            }}
            style={{
              background: "none",
              border: "1px solid rgba(0,0,0,0.12)",
              borderRadius: 9999,
              padding: "6px 16px",
              fontSize: 10,
              fontWeight: 600,
              letterSpacing: "0.18em",
              cursor: "pointer",
              color: "var(--text-primary)",
              fontFamily: "'Plus Jakarta Sans', sans-serif",
            }}
          >
            LOGOUT
          </button>
        </div>
      </nav>

      {/* Tab Selector */}
      <div style={{ maxWidth: 1200, margin: "32px auto 0", padding: "0 52px" }}>
        <div style={{ display: "flex", gap: 12, borderBottom: "1px solid rgba(0,0,0,0.08)", paddingBottom: 16 }}>
          <button
            onClick={() => setActiveTab("products")}
            style={{
              padding: "10px 24px",
              borderRadius: 9999,
              border: "none",
              background: activeTab === "products" ? "#0a0a0a" : "rgba(0,0,0,0.05)",
              color: activeTab === "products" ? "#fff" : "#444",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
            }}
          >
            PRODUCTS & CATEGORIES ({products.length})
          </button>

          <button
            onClick={() => setActiveTab("orders")}
            style={{
              padding: "10px 24px",
              borderRadius: 9999,
              border: "none",
              background: activeTab === "orders" ? "#0a0a0a" : "rgba(0,0,0,0.05)",
              color: activeTab === "orders" ? "#fff" : "#444",
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: 8,
            }}
          >
            CUSTOMER ORDERS ({orders.length})
            {orders.filter((o) => o.status === "Processing").length > 0 && (
              <span style={{ width: 18, height: 18, borderRadius: "50%", background: "#FF6B00", color: "#fff", fontSize: 9, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>
                {orders.filter((o) => o.status === "Processing").length}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* TAB 1: Products Management */}
      {activeTab === "products" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 52px 60px", display: "grid", gridTemplateColumns: "400px 1fr", gap: 40, alignItems: "start" }}>
          {/* Left Column (Sticky Container) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 24, position: "sticky", top: 100 }}>
            {/* Add Product Form */}
            <div style={{ background: "var(--card-bg, rgba(255,255,255,0.65))", backdropFilter: "blur(20px)", border: "1px solid var(--card-border, rgba(0,0,0,0.08))", borderRadius: 20, padding: 28 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 18px" }}>ADD NEW PRODUCT</p>
              <form onSubmit={handleAdd} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {/* Image upload */}
                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>
                    Product Images ({images.length} of 4) *
                  </label>

                  <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 10 }}>
                    {images.map((img, idx) => (
                      <div key={idx} style={{ position: "relative", height: 100, borderRadius: 10, overflow: "hidden", border: "1px solid rgba(0,0,0,0.08)", background: "#e8edf5" }}>
                        <img src={img} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />

                        {images.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeImage(idx)}
                            style={{
                              position: "absolute",
                              top: 6,
                              right: 6,
                              width: 24,
                              height: 24,
                              borderRadius: "50%",
                              background: "rgba(220, 53, 69, 0.9)",
                              border: "none",
                              color: "#fff",
                              fontSize: 12,
                              fontWeight: "bold",
                              cursor: "pointer",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              lineHeight: 1,
                              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
                            }}
                          >
                            &times;
                          </button>
                        )}

                        {idx === 0 && (
                          <span style={{ position: "absolute", bottom: 6, left: 6, background: "rgba(10,10,10,0.75)", color: "#fff", fontSize: 8, fontWeight: 600, letterSpacing: "0.1em", padding: "2px 6px", borderRadius: 4, backdropFilter: "blur(4px)" }}>
                            PRIMARY
                          </span>
                        )}
                      </div>
                    ))}

                    {images.length < 4 && (
                      <div
                        onClick={() => fileRef.current?.click()}
                        style={{
                          height: 100,
                          borderRadius: 10,
                          border: "1.5px dashed rgba(255,107,0,0.4)",
                          background: "rgba(255,107,0,0.02)",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          gap: 4,
                        }}
                      >
                        <span style={{ fontSize: 18, fontWeight: 300, color: "#FF6B00" }}>+</span>
                        <span style={{ fontSize: 9, fontWeight: 600, color: "#FF6B00", letterSpacing: "0.1em", textTransform: "uppercase" }}>Add Image</span>
                      </div>
                    )}
                  </div>

                  <input ref={fileRef} type="file" accept="image/*" multiple style={{ display: "none" }} onChange={handleImagesSelected} />
                </div>

                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Product Name *</label>
                  <input style={inp} placeholder="e.g. Titanium Nozzle Set" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Category *</label>
                    <select style={{ ...inp, cursor: "pointer" } as React.CSSProperties} value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))} required>
                      <option value="">Select category</option>
                      {categories.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                      <option value="General">General</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Price (Rs.) *</label>
                    <input style={inp} type="number" placeholder="1999" value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} required />
                  </div>
                </div>

                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Description</label>
                  <textarea style={{ ...inp, resize: "none", lineHeight: 1.6 } as React.CSSProperties} rows={3} placeholder="Product description..." value={form.desc} onChange={(e) => setForm((f) => ({ ...f, desc: e.target.value }))} />
                </div>

                <div>
                  <label style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "var(--text-muted)", textTransform: "uppercase", display: "block", marginBottom: 7 }}>Badge (optional)</label>
                  <select style={{ ...inp, cursor: "pointer" } as React.CSSProperties} value={form.badge} onChange={(e) => setForm((f) => ({ ...f, badge: e.target.value }))}>
                    <option value="">No badge</option>
                    <option value="NEW">NEW</option>
                    <option value="BESTSELLER">BESTSELLER</option>
                    <option value="SALE">SALE</option>
                  </select>
                </div>

                <button type="submit" style={{ width: "100%", padding: "14px 0", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 12, fontSize: 11, fontWeight: 600, letterSpacing: "0.22em", textTransform: "uppercase", cursor: "pointer", marginTop: 4, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                  {saved ? "+ Product Added!" : "+ ADD PRODUCT"}
                </button>
              </form>
            </div>

            {/* Manage Categories Card */}
            <div style={{ background: "var(--card-bg, rgba(255,255,255,0.65))", backdropFilter: "blur(20px)", border: "1px solid var(--card-border, rgba(0,0,0,0.08))", borderRadius: 20, padding: 24 }}>
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 16px" }}>MANAGE CATEGORIES</p>
              <form onSubmit={handleAddCategory} style={{ display: "flex", gap: 8, marginBottom: 16 }}>
                <input style={{ ...inp, flex: 1, padding: "10px 14px" }} placeholder="New category..." value={newCatName} onChange={(e) => setNewCatName(e.target.value)} />
                <button type="submit" style={{ padding: "0 16px", background: "#0a0a0a", color: "#fff", border: "none", borderRadius: 10, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                  ADD
                </button>
              </form>

              <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 150, overflowY: "auto" }}>
                {categories.map((cat) => (
                  <div key={cat} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "8px 12px", background: "rgba(255,255,255,0.45)", border: "1px solid rgba(0,0,0,0.05)", borderRadius: 8 }}>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>{cat}</span>
                    <button type="button" onClick={() => handleDeleteCategory(cat)} style={{ background: "none", border: "none", color: "#dc3545", fontSize: 11, fontWeight: 600, cursor: "pointer" }}>
                      DELETE
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Products List */}
          <div>
            <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 24px" }}>
              ALL PRODUCTS ({products.length})
            </p>

            <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
              {products.map((p) => (
                <div key={p.id} style={{ display: "flex", gap: 18, background: "var(--card-bg, rgba(255,255,255,0.65))", backdropFilter: "blur(16px)", border: "1px solid var(--card-border, rgba(0,0,0,0.08))", borderRadius: 16, padding: 16, alignItems: "center" }}>
                  <div style={{ width: 80, height: 80, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#e8edf5" }}>
                    <img src={p.images?.[0] || p.image} alt={p.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                      <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", margin: 0 }}>{p.name}</p>
                      {p.badge && <span style={{ background: p.badge === "NEW" ? "#FF6B00" : "#0a0a0a", color: "#fff", fontSize: 8, fontWeight: 700, padding: "2px 8px", borderRadius: 5 }}>{p.badge}</span>}
                    </div>
                    <p style={{ fontSize: 11, color: "var(--text-muted)", margin: "0 0 4px" }}>{p.category}</p>
                    <p style={{ fontSize: 12, color: "var(--text-soft)", margin: 0 }}>{p.desc}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 8px" }}>
                      Rs. {p.price.toLocaleString()}
                    </p>
                    <button onClick={() => deleteProduct(p.id)} style={{ padding: "7px 16px", background: "rgba(220,53,69,0.08)", color: "#dc3545", border: "1px solid rgba(220,53,69,0.25)", borderRadius: 9999, fontSize: 10, fontWeight: 600, cursor: "pointer" }}>
                      DELETE
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Orders Management */}
      {activeTab === "orders" && (
        <div style={{ maxWidth: 1200, margin: "0 auto", padding: "32px 52px 60px" }}>
          <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.38em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 24px" }}>
            PLACED CUSTOMER ORDERS ({orders.length})
          </p>

          {orders.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.6)", borderRadius: 16, padding: 48, textAlign: "center" }}>
              <p style={{ fontSize: 14, color: "#666", margin: 0 }}>No orders have been placed yet.</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {orders.map((o) => (
                <div
                  key={o.id}
                  style={{
                    background: "rgba(255,255,255,0.75)",
                    backdropFilter: "blur(20px)",
                    border: "1px solid rgba(0,0,0,0.08)",
                    borderRadius: 20,
                    padding: 24,
                    boxShadow: "0 4px 20px rgba(0,0,0,0.03)",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid rgba(0,0,0,0.06)", paddingBottom: 16, marginBottom: 16 }}>
                    <div>
                      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>Order #{o.id}</span>
                        <span
                          style={{
                            padding: "3px 10px",
                            borderRadius: 9999,
                            fontSize: 9,
                            fontWeight: 700,
                            letterSpacing: "0.1em",
                            textTransform: "uppercase",
                            background: o.status === "Delivered" ? "#d4edda" : o.status === "Shipped" ? "#cce5ff" : "#fff3cd",
                            color: o.status === "Delivered" ? "#155724" : o.status === "Shipped" ? "#004085" : "#856404",
                          }}
                        >
                          {o.status}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: "#777", margin: "4px 0 0" }}>Placed on: {o.date}</p>
                    </div>

                    {/* Status Changer Selector */}
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <span style={{ fontSize: 10, fontWeight: 600, color: "#666", textTransform: "uppercase" }}>Status:</span>
                      <select
                        value={o.status}
                        onChange={(e) => handleStatusChange(o.id, e.target.value as Order["status"])}
                        style={{
                          padding: "6px 12px",
                          borderRadius: 8,
                          border: "1px solid rgba(0,0,0,0.15)",
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: "pointer",
                          outline: "none",
                        }}
                      >
                        <option value="Processing">Processing</option>
                        <option value="Shipped">Shipped</option>
                        <option value="Delivered">Delivered</option>
                      </select>
                    </div>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24, alignItems: "start" }}>
                    {/* Customer & Address */}
                    <div>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", margin: "0 0 6px" }}>CUSTOMER DETAILS</p>
                      <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{o.shipping.fullName}</p>
                      <p style={{ fontSize: 12, color: "#444", margin: "0 0 2px" }}>
                        {o.shipping.address}, {o.shipping.city}, {o.shipping.state} - {o.shipping.zip}
                      </p>
                      <p style={{ fontSize: 12, color: "#444", margin: 0 }}>
                        Phone: <strong>{o.shipping.phone}</strong> | Email: {o.shipping.email}
                      </p>
                    </div>

                    {/* Items & Payment */}
                    <div style={{ background: "rgba(0,0,0,0.02)", padding: 16, borderRadius: 12, border: "1px solid rgba(0,0,0,0.05)" }}>
                      <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.18em", color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>ITEMS & PAYMENT</p>
                      {o.items.map((item) => (
                        <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                          <span>
                            {item.name} <strong style={{ color: "#FF6B00" }}>x{item.qty}</strong>
                          </span>
                          <span>Rs. {(item.price * item.qty).toLocaleString()}</span>
                        </div>
                      ))}
                      <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 13 }}>
                        <span>Total ({o.paymentMethod.toUpperCase()})</span>
                        <span>Rs. {o.total.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
