"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useSyncExternalStore,
  type ReactNode,
} from "react";

export type ThemePreference = "light" | "dark" | "system";

type ThemeContextValue = {
  theme: ThemePreference;
  resolvedTheme: "light" | "dark";
  setTheme: (theme: ThemePreference) => void;
};

const STORAGE_KEY = "tekshe-theme:v1";
const THEME_EVENT = "tekshe-theme-change";

const ThemeContext = createContext<ThemeContextValue | null>(null);

function getStoredTheme(): ThemePreference {
  try {
    const saved = window.localStorage.getItem(STORAGE_KEY);

    if (saved === "light" || saved === "dark" || saved === "system") {
      return saved;
    }
  } catch {
    // Use system preference when storage is unavailable.
  }

  return "system";
}

function subscribeTheme(callback: () => void) {
  window.addEventListener(THEME_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(THEME_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}

function getThemeSnapshot(): ThemePreference {
  return getStoredTheme();
}

function getServerThemeSnapshot(): ThemePreference {
  return "system";
}

function subscribeSystemTheme(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");

  media.addEventListener("change", callback);

  return () => {
    media.removeEventListener("change", callback);
  };
}

function getSystemThemeSnapshot(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function getServerSystemThemeSnapshot(): "light" | "dark" {
  return "light";
}

function applyTheme(theme: ThemePreference) {
  const resolved =
    theme === "system" ? getSystemThemeSnapshot() : theme;

  document.documentElement.dataset.theme = resolved;
  document.documentElement.style.colorScheme = resolved;

  const themeColor = document.querySelector<HTMLMetaElement>(
    'meta[name="theme-color"]'
  );

  if (themeColor) {
    themeColor.content = resolved === "dark" ? "#070D21" : "#EAF4FA";
  }
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );

  const systemTheme = useSyncExternalStore(
    subscribeSystemTheme,
    getSystemThemeSnapshot,
    getServerSystemThemeSnapshot
  );

  const resolvedTheme =
    theme === "system" ? systemTheme : theme;

  useEffect(() => {
    applyTheme(theme);
  }, [theme, resolvedTheme]);

  const setTheme = useCallback((nextTheme: ThemePreference) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, nextTheme);
    } catch {
      // The selected theme remains active for this session.
    }

    applyTheme(nextTheme);
    window.dispatchEvent(new Event(THEME_EVENT));
  }, []);

  const value = useMemo(
    () => ({ theme, resolvedTheme, setTheme }),
    [theme, resolvedTheme, setTheme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme must be used inside ThemeProvider");
  }

  return context;
}
