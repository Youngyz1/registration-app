// src/theme.js
import { createTheme } from "@mui/material/styles";

export const getTheme = (mode) =>
  createTheme({
    palette: {
      mode,
      primary: { main: "#6366f1" },
      secondary: { main: "#f59e0b" },
      success: { main: "#10b981" },
      error: { main: "#ef4444" },
      warning: { main: "#f59e0b" },
      background: {
        default: mode === "dark" ? "#0f1117" : "#f3f4f8",
        paper: mode === "dark" ? "#1a1d27" : "#ffffff",
      },
      text: {
        primary: mode === "dark" ? "#e2e8f0" : "#1e293b",
        secondary: mode === "dark" ? "#94a3b8" : "#64748b",
      },
      divider: mode === "dark" ? "rgba(255,255,255,0.07)" : "rgba(0,0,0,0.07)",
    },
    typography: {
      fontFamily: "'Plus Jakarta Sans', 'Outfit', sans-serif",
      h4: { fontWeight: 800, letterSpacing: "-0.5px" },
      h5: { fontWeight: 700 },
      h6: { fontWeight: 700 },
    },
    shape: { borderRadius: 14 },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: "none",
            boxShadow:
              mode === "dark"
                ? "0 1px 3px rgba(0,0,0,0.4), 0 0 0 1px rgba(255,255,255,0.05)"
                : "0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.04)",
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: "none", fontWeight: 700, borderRadius: 10 },
        },
      },
      MuiChip: {
        styleOverrides: { root: { fontWeight: 700, borderRadius: 8 } },
      },
    },
  });

// Default export for backward compat
export default getTheme("light");
