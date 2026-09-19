import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  getCart,
  getUser,
  CartItem,
  createOrder,
  Order,
  OrderItem,
  ShippingDetails,
} from "@/lib/store";
import { getProducts } from "@/lib/products";

export const Route = createFileRoute("/cart")({
  head: () => ({ meta: [{ title: "Cart & Checkout - 3D HUB" }] }),
  component: CartPage,
});

function removeFromCart(id: number) {
  const cart = getCart();
  const idx = cart.findIndex((i) => i.id === id);
  if (idx !== -1) {
    cart.splice(idx, 1);
    localStorage.setItem("3dhub_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }
}

function setQty(id: number, qty: number) {
  if (qty < 1) {
    removeFromCart(id);
    return;
  }
  const cart = getCart();
  const item = cart.find((i) => i.id === id);
  if (item) {
    item.qty = qty;
    localStorage.setItem("3dhub_cart", JSON.stringify(cart));
    window.dispatchEvent(new Event("cart-updated"));
  }
}

function CartPage() {
  const [items, setItems] = useState<CartItem[]>([]);
  const user = getUser();

  // Checkout Modal State
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [placedOrder, setPlacedOrder] = useState<Order | null>(null);

  // Form State
  const [shipping, setShipping] = useState<ShippingDetails>({
    fullName: user ? `${user.firstName} ${user.lastName}`.trim() : "",
    email: user ? user.email : "",
    phone: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    shippingMethod: "standard",
  });

  const [paymentMethod, setPaymentMethod] = useState<"upi" | "card" | "cod">("upi");
  const [upiId, setUpiId] = useState("");
  const [cardDetails, setCardDetails] = useState({ number: "", expiry: "", cvv: "" });
  const [formError, setFormError] = useState("");

  const refresh = () => setItems([...getCart()]);

  useEffect(() => {
    refresh();
    window.addEventListener("cart-updated", refresh);
    return () => window.removeEventListener("cart-updated", refresh);
  }, []);

  const enriched = items.map((item) => ({
    ...item,
    product: getProducts().find((p) => p.id === item.id),
  }));

  const subtotal = enriched.reduce((s, i) => s + (i.product?.price ?? 0) * i.qty, 0);
  const shippingFee = shipping.shippingMethod === "express" ? 150 : 0;
  const grandTotal = subtotal + shippingFee;

  const handleOpenCheckout = () => {
    if (items.length === 0) return;
    setStep(1);
    setFormError("");
    setIsCheckoutOpen(true);
  };

  const handleNextStep1 = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");
    if (!shipping.fullName.trim() || !shipping.email.trim() || !shipping.phone.trim()) {
      setFormError("Please enter your full name, email, and phone number.");
      return;
    }
    if (!shipping.address.trim() || !shipping.city.trim() || !shipping.zip.trim()) {
      setFormError("Please fill out complete delivery address fields.");
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError("");

    if (paymentMethod === "upi" && !upiId.trim()) {
      setFormError("Please enter a valid UPI ID (e.g. name@upi).");
      return;
    }
    if (paymentMethod === "card" && (!cardDetails.number || !cardDetails.cvv)) {
      setFormError("Please enter complete card details.");
      return;
    }

    const orderItems: OrderItem[] = enriched
      .filter((i) => i.product)
      .map((i) => ({
        id: i.id,
        name: i.product!.name,
        price: i.product!.price,
        qty: i.qty,
        category: i.product!.category,
        image: i.product!.image,
      }));

    const order = createOrder(orderItems, shipping, paymentMethod, subtotal, shippingFee);
    setPlacedOrder(order);
    setStep(3);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 16px",
    background: "rgba(255,255,255,0.7)",
    border: "1px solid rgba(0,0,0,0.12)",
    borderRadius: 10,
    fontSize: 13,
    color: "#0a0a0a",
    outline: "none",
    fontFamily: "'Plus Jakarta Sans', sans-serif",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 9,
    fontWeight: 600,
    letterSpacing: "0.22em",
    color: "rgba(10,10,20,0.45)",
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(160deg,#F5F6FA 0%,#EAECF5 45%,#DCE2F2 100%)",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Navbar */}
      <nav
        style={{
          position: "sticky",
          top: 0,
          zIndex: 50,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "20px 52px",
          background: "var(--nav-bg, rgba(245,246,250,0.85))",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(0,0,0,0.05)",
        }}
      >
        <Link to="/" style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none" }}>
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>3D</span>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#FF6B00", display: "inline-block" }} />
          <span style={{ fontSize: 15, fontWeight: 600, letterSpacing: "0.28em", color: "var(--text-primary)" }}>HUB</span>
        </Link>
        <div style={{ display: "flex", gap: 32 }}>
          {[
            ["HOME", "/"],
            ["SHOP", "/shop"],
            ["CONTACT US", "/contact-us"],
          ].map(([l, t]) => (
            <Link
              key={l}
              to={t as "/" | "/shop" | "/contact-us"}
              style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.22em", color: "var(--text-muted)", textDecoration: "none" }}
            >
              {l}
            </Link>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          {user && <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>Hello, {user.firstName}</span>}
          <Link to="/shop" style={{ fontSize: 11, fontWeight: 500, letterSpacing: "0.18em", color: "#FF6B00", textDecoration: "none" }}>
            BACK TO SHOP
          </Link>
        </div>
      </nav>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 52px" }}>
        <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.42em", color: "rgba(255,107,0,0.8)", textTransform: "uppercase", margin: "0 0 12px" }}>YOUR CART</p>
        <h1
          style={{
            fontFamily: "'Cormorant Garamond',serif",
            fontSize: "clamp(2rem,5vw,4rem)",
            fontWeight: 300,
            color: "var(--text-primary)",
            margin: "0 0 48px",
            letterSpacing: "-0.03em",
          }}
        >
          {items.length === 0 ? (
            "Your cart is empty."
          ) : (
            <>
              Review your <em style={{ fontStyle: "italic", color: "#FF6B00" }}>order.</em>
            </>
          )}
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 14, fontWeight: 300, color: "rgba(10,10,20,0.45)", marginBottom: 28 }}>
              Browse our collection and add items to get started.
            </p>
            <Link
              to="/shop"
              style={{
                padding: "14px 36px",
                background: "#0a0a0a",
                color: "#fff",
                borderRadius: 9999,
                fontSize: 11,
                fontWeight: 600,
                letterSpacing: "0.2em",
                textDecoration: "none",
              }}
            >
              GO TO SHOP <span style={{ color: "#FF6B00" }}>&rarr;</span>
            </Link>
          </div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 340px", gap: 32, alignItems: "start" }}>
            {/* Items list */}
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {enriched.map(
                ({ id, qty, product }) =>
                  product && (
                    <div
                      key={id}
                      style={{
                        display: "flex",
                        gap: 20,
                        background: "var(--card-bg, rgba(255,255,255,0.65))",
                        backdropFilter: "blur(16px)",
                        border: "1px solid var(--card-border, rgba(0,0,0,0.08))",
                        borderRadius: 16,
                        padding: 18,
                        alignItems: "center",
                      }}
                    >
                      {/* Product image */}
                      <div style={{ width: 90, height: 90, borderRadius: 10, overflow: "hidden", flexShrink: 0, background: "#e8edf5" }}>
                        <img src={product.image} alt={product.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.22em", color: "rgba(255,107,0,0.7)", textTransform: "uppercase", margin: "0 0 4px" }}>
                          {product.category}
                        </p>
                        <p style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", margin: "0 0 4px" }}>{product.name}</p>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.2rem", fontWeight: 400, color: "var(--text-primary)", margin: 0 }}>
                          Rs. {product.price.toLocaleString()}
                        </p>
                      </div>
                      {/* Qty controls */}
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
                        <button
                          onClick={() => setQty(id, qty - 1)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: "var(--card-bg, rgba(255,255,255,0.8))",
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-primary)",
                          }}
                        >
                          -
                        </button>
                        <span style={{ fontSize: 14, fontWeight: 600, minWidth: 24, textAlign: "center", color: "var(--text-primary)" }}>{qty}</span>
                        <button
                          onClick={() => setQty(id, qty + 1)}
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: "50%",
                            border: "1px solid rgba(0,0,0,0.12)",
                            background: "var(--card-bg, rgba(255,255,255,0.8))",
                            cursor: "pointer",
                            fontSize: 16,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "var(--text-primary)",
                          }}
                        >
                          +
                        </button>
                      </div>
                      {/* Line total + remove */}
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <p style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.3rem", fontWeight: 400, color: "var(--text-primary)", margin: "0 0 6px" }}>
                          Rs. {(product.price * qty).toLocaleString()}
                        </p>
                        <button
                          onClick={() => removeFromCart(id)}
                          style={{
                            background: "none",
                            border: "none",
                            cursor: "pointer",
                            fontSize: 10,
                            fontWeight: 600,
                            letterSpacing: "0.18em",
                            color: "rgba(10,10,20,0.35)",
                            textTransform: "uppercase",
                            fontFamily: "'Plus Jakarta Sans',sans-serif",
                          }}
                        >
                          REMOVE
                        </button>
                      </div>
                    </div>
                  )
              )}
            </div>

            {/* Order summary */}
            <div
              style={{
                background: "var(--card-bg, rgba(255,255,255,0.65))",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--card-border, rgba(0,0,0,0.08))",
                borderRadius: 20,
                padding: 28,
                position: "sticky",
                top: 100,
              }}
            >
              <p style={{ fontSize: 10, fontWeight: 600, letterSpacing: "0.3em", color: "rgba(10,10,20,0.45)", textTransform: "uppercase", margin: "0 0 20px" }}>
                ORDER SUMMARY
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 12, marginBottom: 20 }}>
                {enriched.map(
                  ({ id, qty, product }) =>
                    product && (
                      <div key={id} style={{ display: "flex", justifyContent: "space-between" }}>
                        <span style={{ fontSize: 12, fontWeight: 300, color: "rgba(10,10,20,0.65)" }}>
                          {product.name} x{qty}
                        </span>
                        <span style={{ fontSize: 12, fontWeight: 500, color: "var(--text-primary)" }}>Rs. {(product.price * qty).toLocaleString()}</span>
                      </div>
                    )
                )}
              </div>
              <div style={{ borderTop: "1px solid rgba(0,0,0,0.08)", paddingTop: 16, marginBottom: 24 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--text-primary)" }}>Subtotal</span>
                  <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: "1.4rem", fontWeight: 400, color: "var(--text-primary)" }}>
                    Rs. {subtotal.toLocaleString()}
                  </span>
                </div>
              </div>
              <button
                onClick={handleOpenCheckout}
                style={{
                  width: "100%",
                  padding: "15px 0",
                  background: "#0a0a0a",
                  color: "#fff",
                  border: "none",
                  borderRadius: 12,
                  fontSize: 11,
                  fontWeight: 600,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  cursor: "pointer",
                  fontFamily: "'Plus Jakarta Sans',sans-serif",
                  boxShadow: "0 12px 40px rgba(10,10,20,0.15)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Proceed to Checkout <span style={{ color: "#FF6B00" }}>&rarr;</span>
              </button>
              <Link
                to="/shop"
                style={{
                  display: "block",
                  textAlign: "center",
                  marginTop: 14,
                  fontSize: 11,
                  fontWeight: 500,
                  letterSpacing: "0.18em",
                  color: "rgba(10,10,20,0.45)",
                  textDecoration: "none",
                }}
              >
                CONTINUE SHOPPING
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* --- MULTI-STEP CHECKOUT MODAL --------------------------------------- */}
      {isCheckoutOpen && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 100,
            background: "rgba(10,10,20,0.65)",
            backdropFilter: "blur(12px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: 20,
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: 620,
              maxHeight: "90vh",
              overflowY: "auto",
              background: "#ffffff",
              borderRadius: 24,
              padding: "36px 32px",
              boxShadow: "0 24px 80px rgba(0,0,0,0.2)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              onClick={() => setIsCheckoutOpen(false)}
              style={{
                position: "absolute",
                top: 20,
                right: 20,
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: "rgba(0,0,0,0.05)",
                border: "none",
                fontSize: 16,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &times;
            </button>

            {/* Stepper Header */}
            <div style={{ marginBottom: 28, textAlign: "center" }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.35em", color: "#FF6B00", textTransform: "uppercase", margin: "0 0 6px" }}>
                SECURE CHECKOUT
              </p>
              <h2 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "2.2rem", fontWeight: 300, margin: 0, color: "#0a0a0a" }}>
                {step === 1 && "Shipping & Contact Details"}
                {step === 2 && "Shipping Speed & Payment"}
                {step === 3 && "Order Confirmed!"}
              </h2>

              {/* Progress Bar Dots */}
              {step < 3 && (
                <div style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: step >= 1 ? "#FF6B00" : "#ccc", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>1</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: step >= 1 ? "#0a0a0a" : "#aaa" }}>Details</span>
                  </div>
                  <div style={{ width: 40, height: 1, background: "#e0e0e0", alignSelf: "center" }} />
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <span style={{ width: 22, height: 22, borderRadius: "50%", background: step >= 2 ? "#FF6B00" : "#ccc", color: "#fff", fontSize: 10, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center" }}>2</span>
                    <span style={{ fontSize: 11, fontWeight: 600, color: step >= 2 ? "#0a0a0a" : "#aaa" }}>Payment</span>
                  </div>
                </div>
              )}
            </div>

            {/* STEP 1: Shipping Details */}
            {step === 1 && (
              <form onSubmit={handleNextStep1} style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                  <div>
                    <label style={labelStyle}>Full Name *</label>
                    <input style={inputStyle} placeholder="John Doe" value={shipping.fullName} onChange={(e) => setShipping({ ...shipping, fullName: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>Email Address *</label>
                    <input style={inputStyle} type="email" placeholder="john@example.com" value={shipping.email} onChange={(e) => setShipping({ ...shipping, email: e.target.value })} required />
                  </div>
                </div>

                <div>
                  <label style={labelStyle}>Phone Number *</label>
                  <input style={inputStyle} type="tel" placeholder="+91 98290 51866" value={shipping.phone} onChange={(e) => setShipping({ ...shipping, phone: e.target.value })} required />
                </div>

                <div>
                  <label style={labelStyle}>Street Address *</label>
                  <input style={inputStyle} placeholder="Flat, House no., Building, Street" value={shipping.address} onChange={(e) => setShipping({ ...shipping, address: e.target.value })} required />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
                  <div>
                    <label style={labelStyle}>City *</label>
                    <input style={inputStyle} placeholder="Jaipur" value={shipping.city} onChange={(e) => setShipping({ ...shipping, city: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>State *</label>
                    <input style={inputStyle} placeholder="Maharashtra" value={shipping.state} onChange={(e) => setShipping({ ...shipping, state: e.target.value })} required />
                  </div>
                  <div>
                    <label style={labelStyle}>PIN Code *</label>
                    <input style={inputStyle} placeholder="400001" value={shipping.zip} onChange={(e) => setShipping({ ...shipping, zip: e.target.value })} required />
                  </div>
                </div>

                {formError && <p style={{ fontSize: 11, color: "#dc3545", margin: 0, fontWeight: 500 }}>{formError}</p>}

                <button
                  type="submit"
                  style={{
                    width: "100%",
                    padding: "14px 0",
                    background: "#0a0a0a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 12,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                    marginTop: 10,
                  }}
                >
                  Continue to Payment &rarr;
                </button>
              </form>
            )}

            {/* STEP 2: Shipping Speed & Payment Selection */}
            {step === 2 && (
              <form onSubmit={handlePlaceOrder} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                {/* Shipping Method Option */}
                <div>
                  <label style={labelStyle}>Shipping Speed</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div
                      onClick={() => setShipping({ ...shipping, shippingMethod: "standard" })}
                      style={{
                        padding: 14,
                        border: "1.5px solid",
                        borderColor: shipping.shippingMethod === "standard" ? "#FF6B00" : "rgba(0,0,0,0.1)",
                        borderRadius: 12,
                        background: shipping.shippingMethod === "standard" ? "rgba(255,107,0,0.04)" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px", color: "#0a0a0a" }}>Standard Delivery</p>
                      <p style={{ fontSize: 11, color: "#666", margin: "0 0 6px" }}>3-5 Business Days</p>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#27ae60" }}>FREE</span>
                    </div>

                    <div
                      onClick={() => setShipping({ ...shipping, shippingMethod: "express" })}
                      style={{
                        padding: 14,
                        border: "1.5px solid",
                        borderColor: shipping.shippingMethod === "express" ? "#FF6B00" : "rgba(0,0,0,0.1)",
                        borderRadius: 12,
                        background: shipping.shippingMethod === "express" ? "rgba(255,107,0,0.04)" : "#fff",
                        cursor: "pointer",
                      }}
                    >
                      <p style={{ fontSize: 12, fontWeight: 700, margin: "0 0 2px", color: "#0a0a0a" }}>Express Priority</p>
                      <p style={{ fontSize: 11, color: "#666", margin: "0 0 6px" }}>1-2 Business Days</p>
                      <span style={{ fontSize: 11, fontWeight: 700, color: "#0a0a0a" }}>Rs. 150</span>
                    </div>
                  </div>
                </div>

                {/* Payment Methods */}
                <div>
                  <label style={labelStyle}>Payment Method</label>
                  <div style={{ display: "flex", gap: 10, marginBottom: 14 }}>
                    {(
                      [
                        ["upi", "UPI / QR Code"],
                        ["card", "Credit / Debit Card"],
                        ["cod", "Cash on Delivery"],
                      ] as const
                    ).map(([method, name]) => (
                      <button
                        type="button"
                        key={method}
                        onClick={() => setPaymentMethod(method)}
                        style={{
                          flex: 1,
                          padding: "10px 4px",
                          border: "1px solid",
                          borderColor: paymentMethod === method ? "#FF6B00" : "rgba(0,0,0,0.12)",
                          borderRadius: 10,
                          background: paymentMethod === method ? "#0a0a0a" : "#fff",
                          color: paymentMethod === method ? "#fff" : "#444",
                          fontSize: 10,
                          fontWeight: 600,
                          cursor: "pointer",
                        }}
                      >
                        {name}
                      </button>
                    ))}
                  </div>

                  {paymentMethod === "upi" && (
                    <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 12, border: "1px solid #e0e0e0" }}>
                      <label style={labelStyle}>Enter UPI ID (Google Pay / PhonePe / Paytm)</label>
                      <input style={inputStyle} placeholder="username@upi" value={upiId} onChange={(e) => setUpiId(e.target.value)} />
                    </div>
                  )}

                  {paymentMethod === "card" && (
                    <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 12, border: "1px solid #e0e0e0", display: "flex", flexDirection: "column", gap: 10 }}>
                      <div>
                        <label style={labelStyle}>Card Number</label>
                        <input style={inputStyle} placeholder="4532 1234 5678 9012" value={cardDetails.number} onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })} />
                      </div>
                      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                        <div>
                          <label style={labelStyle}>Expiry (MM/YY)</label>
                          <input style={inputStyle} placeholder="12/28" value={cardDetails.expiry} onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })} />
                        </div>
                        <div>
                          <label style={labelStyle}>CVV</label>
                          <input style={inputStyle} type="password" placeholder="123" maxLength={4} value={cardDetails.cvv} onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })} />
                        </div>
                      </div>
                    </div>
                  )}

                  {paymentMethod === "cod" && (
                    <div style={{ background: "#f8f9fa", padding: 16, borderRadius: 12, border: "1px solid #e0e0e0" }}>
                      <p style={{ fontSize: 12, color: "#555", margin: 0 }}>
                        Pay with cash upon package delivery at your address.
                      </p>
                    </div>
                  )}
                </div>

                {/* Final Price Breakdown */}
                <div style={{ borderTop: "1px solid #eee", paddingTop: 14 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 4 }}>
                    <span>Subtotal</span>
                    <span>Rs. {subtotal.toLocaleString()}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, color: "#666", marginBottom: 8 }}>
                    <span>Shipping ({shipping.shippingMethod === "express" ? "Express" : "Standard"})</span>
                    <span>{shippingFee > 0 ? `Rs. ${shippingFee}` : "FREE"}</span>
                  </div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: 16, fontWeight: 700, color: "#0a0a0a" }}>
                    <span>Total Amount</span>
                    <span>Rs. {grandTotal.toLocaleString()}</span>
                  </div>
                </div>

                {formError && <p style={{ fontSize: 11, color: "#dc3545", margin: 0, fontWeight: 500 }}>{formError}</p>}

                <div style={{ display: "flex", gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    style={{
                      padding: "14px 20px",
                      background: "#f0f0f0",
                      color: "#333",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      cursor: "pointer",
                    }}
                  >
                    &larr; Back
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: "14px 0",
                      background: "#0a0a0a",
                      color: "#fff",
                      border: "none",
                      borderRadius: 12,
                      fontSize: 11,
                      fontWeight: 600,
                      letterSpacing: "0.18em",
                      textTransform: "uppercase",
                      cursor: "pointer",
                      boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
                    }}
                  >
                    Confirm & Place Order (Rs. {grandTotal.toLocaleString()}) &rarr;
                  </button>
                </div>
              </form>
            )}

            {/* STEP 3: Order Receipt Screen */}
            {step === 3 && placedOrder && (
              <div style={{ textAlign: "center", padding: "10px 0" }}>
                <div style={{ width: 64, height: 64, borderRadius: "50%", background: "#27ae60", color: "#fff", fontSize: 32, display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
                  &#10003;
                </div>
                <h3 style={{ fontSize: 20, fontWeight: 700, margin: "0 0 6px", color: "#0a0a0a" }}>Thank You for Your Order!</h3>
                <p style={{ fontSize: 12, color: "#666", margin: "0 0 20px" }}>
                  Order ID: <strong style={{ color: "#FF6B00" }}>{placedOrder.id}</strong> | Placed on {placedOrder.date}
                </p>

                {/* Receipt Details Box */}
                <div style={{ background: "#f8f9fa", borderRadius: 16, padding: 20, textAlign: "left", marginBottom: 24, border: "1px solid #eee" }}>
                  <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase", margin: "0 0 10px" }}>DELIVERY TO</p>
                  <p style={{ fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{placedOrder.shipping.fullName}</p>
                  <p style={{ fontSize: 12, color: "#555", margin: "0 0 2px" }}>{placedOrder.shipping.address}, {placedOrder.shipping.city}, {placedOrder.shipping.state} - {placedOrder.shipping.zip}</p>
                  <p style={{ fontSize: 12, color: "#555", margin: "0 0 14px" }}>Phone: {placedOrder.shipping.phone} | Email: {placedOrder.shipping.email}</p>

                  <div style={{ borderTop: "1px solid #e0e0e0", paddingTop: 10, marginTop: 10 }}>
                    <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#888", textTransform: "uppercase", margin: "0 0 8px" }}>ITEMS ORDERED</p>
                    {placedOrder.items.map((item) => (
                      <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: 12, marginBottom: 4 }}>
                        <span>{item.name} x{item.qty}</span>
                        <span style={{ fontWeight: 600 }}>Rs. {(item.price * item.qty).toLocaleString()}</span>
                      </div>
                    ))}
                    <div style={{ borderTop: "1px solid #e0e0e0", marginTop: 8, paddingTop: 8, display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 14 }}>
                      <span>Total Paid ({placedOrder.paymentMethod.toUpperCase()})</span>
                      <span>Rs. {placedOrder.total.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setIsCheckoutOpen(false)}
                  style={{
                    padding: "14px 36px",
                    background: "#0a0a0a",
                    color: "#fff",
                    border: "none",
                    borderRadius: 9999,
                    fontSize: 11,
                    fontWeight: 600,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    cursor: "pointer",
                  }}
                >
                  Continue Shopping &rarr;
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
