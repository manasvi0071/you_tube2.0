"use client";
import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const ThemeContext = createContext({
  theme: "dark",
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState("dark");

  useEffect(() => {
    const checkTheme = async () => {
      const hour = new Date().getHours();
      try {
        const res = await axios.get("https://ipapi.co/json/");
        const region = res.data.region.toLowerCase();

        const southStates = [
          "tamil nadu",
          "kerala",
          "karnataka",
          "andhra pradesh",
          "telangana",
        ];

        const isSouth = southStates.some((state) => region.includes(state));

        if (hour >= 10 && hour < 12 && isSouth) {
          setTheme("light");
          document.documentElement.classList.remove("dark"); // ⬅️ important
        } else {
          setTheme("dark");
          document.documentElement.classList.add("dark"); // ⬅️ important
        }

        console.log("Region:", region);
        console.log("Hour:", hour);
        console.log("Theme:", theme);
      } catch (err) {
        console.error("Location check failed:", err);
        setTheme("dark");
        document.documentElement.classList.add("dark"); // ⬅️ fallback to dark
      }
    };

    checkTheme();
  }, []);

  return (
    <ThemeContext.Provider value={{ theme }}>
      <div className={theme === "light" ? "bg-white text-black" : "bg-black text-white"}>
        {children}
      </div>
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
