import React, { createContext, useState, useEffect } from "react";

// Create Context for Theme
const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  // Get the saved theme from localStorage or default to 'light'
  const savedTheme = localStorage.getItem("theme") || "light";
  const [theme, setTheme] = useState(savedTheme);

  // Update theme in localStorage whenever the theme changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Toggle between light and dark mode
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
