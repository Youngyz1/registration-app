// src/contexts/ThemeContext.js
import React, { createContext, useContext, useState, useMemo } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { getTheme } from "../theme";

const ThemeContext = createContext({ toggleDark: () => {}, isDark: false });
export const useThemeMode = () => useContext(ThemeContext);

export function AppThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(
    () => localStorage.getItem("theme") === "dark"
  );

  const toggleDark = () => {
    setIsDark((prev) => {
      localStorage.setItem("theme", !prev ? "dark" : "light");
      return !prev;
    });
  };

  const theme = useMemo(() => getTheme(isDark ? "dark" : "light"), [isDark]);

  return (
    <ThemeContext.Provider value={{ toggleDark, isDark }}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
