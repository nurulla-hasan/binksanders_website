"use client";

import { useEffect } from "react";

function getContrastYIQ(hexcolor: string) {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexcolor)) return "oklch(1 0 0)";
  let hex = hexcolor.replace("#", "");
  if (hex.length === 3) {
    hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  }
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "oklch(0.145 0 0)" : "oklch(1 0 0)";
}

const THEME_PRESETS = [
  { name: "Magenta (Default)", primary: "oklch(60.691% 0.22607 355.384)", primaryForeground: "oklch(1 0 0)" },
  { name: "Corporate Blue", primary: "oklch(0.55 0.15 250)", primaryForeground: "oklch(1 0 0)" },
  { name: "Forest Green", primary: "oklch(0.55 0.15 150)", primaryForeground: "oklch(1 0 0)" },
  { name: "Deep Orange", primary: "oklch(0.65 0.18 40)", primaryForeground: "oklch(1 0 0)" },
  { name: "Royal Purple", primary: "oklch(0.55 0.2 300)", primaryForeground: "oklch(1 0 0)" },
];

const SECONDARY_PRESETS = [
  { name: "Aqua Blue (Default)", secondary: "oklch(72.469% 0.11517 218.16)" },
  { name: "Pale Blue", secondary: "oklch(0.85 0.05 250)" },
  { name: "Mint Green", secondary: "oklch(0.85 0.1 150)" },
  { name: "Peach", secondary: "oklch(0.85 0.1 40)" },
  { name: "Lavender", secondary: "oklch(0.85 0.1 300)" },
];

export function DynamicThemeProvider() {
  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme-color");
    const savedSecondary = localStorage.getItem("app-secondary-color");
    const root = document.documentElement;

    const applyPrimary = (primary: string, primaryForeground: string) => {
      root.style.setProperty("--primary", primary);
      root.style.setProperty("--primary-foreground", primaryForeground);
    };

    const applySecondary = (secondary: string, secondaryForeground: string) => {
      root.style.setProperty("--secondary", secondary);
      root.style.setProperty("--secondary-foreground", secondaryForeground);
    };

    // Primary Logic
    if (savedTheme) {
      const preset = THEME_PRESETS.find((p) => p.name === savedTheme);
      if (preset) {
        applyPrimary(preset.primary, preset.primaryForeground);
      } else if (savedTheme.startsWith("#")) {
        applyPrimary(savedTheme, getContrastYIQ(savedTheme));
      }
    } else {
      applyPrimary(THEME_PRESETS[0].primary, THEME_PRESETS[0].primaryForeground);
    }

    // Secondary Logic
    if (savedSecondary) {
      const preset = SECONDARY_PRESETS.find((p) => p.name === savedSecondary);
      if (preset) {
        applySecondary(preset.secondary, getContrastYIQ(preset.secondary));
      } else if (savedSecondary.startsWith("#")) {
        applySecondary(savedSecondary, getContrastYIQ(savedSecondary));
      }
    }
  }, []);

  return null;
}
