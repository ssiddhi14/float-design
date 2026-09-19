// Simple localStorage-based global state (no backend)

export interface User {
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
  googleId?: string;
}

export interface CartItem {
  id: number;
  qty: number;
}

// Auth
export const getUser = (): User | null => {
  try {
    const s = localStorage.getItem("3dhub_user");
    return s ? JSON.parse(s) : null;
  } catch { return null; }
};

export const setUser = (u: User) =>
  localStorage.setItem("3dhub_user", JSON.stringify(u));

export const logout = () =>
  localStorage.removeItem("3dhub_user");

// Cart
export const getCart = (): CartItem[] => {
  try {
    const s = localStorage.getItem("3dhub_cart");
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

export const addToCart = (id: number) => {
  const cart = getCart();
  const existing = cart.find(i => i.id === id);
  if (existing) existing.qty += 1;
  else cart.push({ id, qty: 1 });
  localStorage.setItem("3dhub_cart", JSON.stringify(cart));
  window.dispatchEvent(new Event("cart-updated"));
};

export const getCartCount = () =>
  getCart().reduce((s, i) => s + i.qty, 0);

// Wishlist
export const getWishlist = (): number[] => {
  try {
    const s = localStorage.getItem("3dhub_wish");
    return s ? JSON.parse(s) : [];
  } catch { return []; }
};

export const toggleWishlist = (id: number) => {
  const w = getWishlist();
  const idx = w.indexOf(id);
  if (idx === -1) w.push(id);
  else w.splice(idx, 1);
  localStorage.setItem("3dhub_wish", JSON.stringify(w));
  window.dispatchEvent(new Event("wish-updated"));
};

export const isWishlisted = (id: number) =>
  getWishlist().includes(id);

export const clearCart = () => {
  localStorage.removeItem("3dhub_cart");
  window.dispatchEvent(new Event("cart-updated"));
};

// Orders & Checkout
export interface ShippingDetails {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip: string;
  shippingMethod: "standard" | "express";
}

export interface OrderItem {
  id: number;
  name: string;
  price: number;
  qty: number;
  category: string;
  image: string;
}

export interface Order {
  id: string;
  date: string;
  items: OrderItem[];
  shipping: ShippingDetails;
  paymentMethod: "upi" | "card" | "cod";
  subtotal: number;
  shippingFee: number;
  total: number;
  status: "Processing" | "Shipped" | "Delivered";
}

export const getOrders = (): Order[] => {
  try {
    const s = localStorage.getItem("3dhub_orders");
    return s ? JSON.parse(s) : [];
  } catch {
    return [];
  }
};

export const createOrder = (
  items: OrderItem[],
  shipping: ShippingDetails,
  paymentMethod: "upi" | "card" | "cod",
  subtotal: number,
  shippingFee: number
): Order => {
  const orders = getOrders();
  const randomNum = Math.floor(100000 + Math.random() * 900000);
  const newOrder: Order = {
    id: `HUB-${randomNum}`,
    date: new Date().toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }),
    items,
    shipping,
    paymentMethod,
    subtotal,
    shippingFee,
    total: subtotal + shippingFee,
    status: "Processing",
  };
  orders.unshift(newOrder);
  localStorage.setItem("3dhub_orders", JSON.stringify(orders));
  clearCart();
  window.dispatchEvent(new Event("orders-updated"));
  return newOrder;
};

export const updateOrderStatus = (orderId: string, status: Order["status"]) => {
  const orders = getOrders();
  const target = orders.find((o) => o.id === orderId);
  if (target) {
    target.status = status;
    localStorage.setItem("3dhub_orders", JSON.stringify(orders));
    window.dispatchEvent(new Event("orders-updated"));
  }
};

