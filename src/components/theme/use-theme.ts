import { useContext } from "react";
import { ThemeProviderContext } from "./theme-context";
import type { ThemeProviderState } from "./theme-context";

export function useTheme(): ThemeProviderState {
  const context = useContext(ThemeProviderContext);

  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
}
