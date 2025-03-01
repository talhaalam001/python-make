import { create } from "zustand";

interface ThemeStore {
  theme: string;
  setTheme: (theme: string) => void;
}

const useThemeStore = create<ThemeStore>((set) => ({
  theme: typeof window !== "undefined" ? localStorage.getItem("theme") || "light" : "light",
  setTheme: (theme) => {
    localStorage.setItem("theme", theme);
    if (theme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    set({ theme });
  },
}));

export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  return { theme, setTheme };
}
