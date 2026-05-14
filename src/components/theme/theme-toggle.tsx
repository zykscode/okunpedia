"use client";

import { useTheme } from "./theme-provider";
import { Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  return (
    <motion.button
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      onClick={toggleTheme}
      className="relative w-9 h-9 flex items-center justify-center rounded-xl border border-wiki-border bg-wiki-card hover:border-wiki-border-accent transition-all duration-300 cursor-pointer overflow-hidden"
      style={{ backdropFilter: "blur(12px)" }}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
    >
      <motion.div
        initial={false}
        animate={{
          rotate: resolvedTheme === "dark" ? 0 : 180,
          scale: 1,
        }}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="absolute"
      >
        {resolvedTheme === "dark" ? (
          <Moon className="h-4 w-4 text-[#e09920]" />
        ) : (
          <Sun className="h-4 w-4 text-[#e09920]" />
        )}
      </motion.div>
    </motion.button>
  );
}
