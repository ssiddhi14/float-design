export interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  desc: string;
  badge: string | null;
  image: string; // base64 or URL
  images?: string[];
}

const DEFAULT_PRODUCTS: Product[] = [
  { id: 1, name: "Precision Prototype Kit",  category: "Prototyping",   price: 2999, desc: "Professional-grade prototype components for rapid iteration.",  badge: "BESTSELLER", image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
  { id: 2, name: "Custom Enclosure Set",      category: "Manufacturing", price: 1799, desc: "Fully customizable enclosures printed in durable ABS.",        badge: null,          image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
  { id: 3, name: "Titanium Bracket Series",   category: "Engineering",   price: 4499, desc: "High-strength titanium alloy brackets for industrial use.",    badge: "NEW",         image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
  { id: 4, name: "Flexible Filament Bundle",  category: "Materials",     price:  899, desc: "Premium TPU filament bundle in 6 colors, 500g each.",         badge: null,          image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
  { id: 5, name: "Modular Design Framework",  category: "Prototyping",   price: 3299, desc: "Interlocking modular components for concept validation.",       badge: "NEW",         image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
  { id: 6, name: "Industrial Nozzle Pack",    category: "Materials",     price:  649, desc: "Hardened steel nozzles for abrasive material printing.",       badge: null,          image: "/pragya.jpeg", images: ["/pragya.jpeg"] },
];

export const getProducts = (): Product[] => {
  try {
    const s = localStorage.getItem("3dhub_products");
    const parsed: Product[] = s ? JSON.parse(s) : DEFAULT_PRODUCTS;
    return parsed.map(p => ({
      ...p,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
    }));
  } catch {
    return DEFAULT_PRODUCTS.map(p => ({
      ...p,
      images: Array.isArray(p.images) && p.images.length > 0 ? p.images : (p.image ? [p.image] : [])
    }));
  }
};

export const saveProducts = (products: Product[]): boolean => {
  try {
    localStorage.setItem("3dhub_products", JSON.stringify(products));
    window.dispatchEvent(new Event("products-updated"));
    return true;
  } catch (e) {
    console.error("Storage failed:", e);
    alert(
      "Failed to save products: Browser local storage limit exceeded. The uploaded images are too large. Please compress your images or upload smaller files."
    );
    return false;
  }
};

export const addProduct = (p: Omit<Product, "id">): boolean => {
  const products = getProducts();
  const id = products.length > 0 ? Math.max(...products.map(x => x.id)) + 1 : 1;
  products.push({ ...p, id });
  return saveProducts(products);
};

export const deleteProduct = (id: number) => {
  const products = getProducts().filter(p => p.id !== id);
  saveProducts(products);
};

export const isAdmin = (email: string, password: string) =>
  email.trim().toLowerCase() === "admin@1234" && password.trim() === "admin@1234";

const DEFAULT_CATEGORIES = ["Prototyping", "Manufacturing", "Engineering", "Materials"];

export const getCategories = (): string[] => {
  try {
    const s = localStorage.getItem("3dhub_categories");
    return s ? JSON.parse(s) : DEFAULT_CATEGORIES;
  } catch {
    return DEFAULT_CATEGORIES;
  }
};

export const saveCategories = (categories: string[]) => {
  localStorage.setItem("3dhub_categories", JSON.stringify(categories));
  window.dispatchEvent(new Event("categories-updated"));
};

export const addCategory = (name: string): boolean => {
  const trimmed = name.trim();
  if (!trimmed) return false;
  const categories = getCategories();
  if (categories.some(c => c.toLowerCase() === trimmed.toLowerCase())) {
    alert("Category already exists!");
    return false;
  }
  categories.push(trimmed);
  saveCategories(categories);
  return true;
};

export const deleteCategory = (name: string) => {
  const categories = getCategories().filter(c => c !== name);
  saveCategories(categories);

  // Update existing products with this category to fallback to "General"
  const products = getProducts();
  let updated = false;
  products.forEach(p => {
    if (p.category === name) {
      p.category = "General";
      updated = true;
    }
  });
  if (updated) {
    saveProducts(products);
  }
};
