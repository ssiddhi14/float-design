export const getTheme = (): "light" | "dark" => {
  if (typeof window === "undefined") return "light";
  try { return (localStorage.getItem("3dhub_theme") as "light" | "dark") || "light"; }
  catch { return "light"; }
};

export const applyTheme = (t: "light" | "dark") => {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  localStorage.setItem("3dhub_theme", t);
  if (t === "dark") document.documentElement.classList.add("dark");
  else document.documentElement.classList.remove("dark");
  window.dispatchEvent(new Event("theme-updated"));
};

export const toggleTheme = () => applyTheme(getTheme() === "dark" ? "light" : "dark");

// Apply on client load only
if (typeof window !== "undefined") applyTheme(getTheme());
