"use client";

import { useState, useEffect, useRef } from "react";
import { Palette, Check, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const THEME_PRESETS = [
  { name: "Magenta (Default)", primary: "oklch(60.691% 0.22607 355.384)", primaryForeground: "oklch(1 0 0)", colorPreview: "bg-[#e21a60]" },
  { name: "Corporate Blue", primary: "oklch(0.55 0.15 250)", primaryForeground: "oklch(1 0 0)", colorPreview: "bg-blue-600" },
  { name: "Forest Green", primary: "oklch(0.55 0.15 150)", primaryForeground: "oklch(1 0 0)", colorPreview: "bg-green-600" },
  { name: "Deep Orange", primary: "oklch(0.65 0.18 40)", primaryForeground: "oklch(1 0 0)", colorPreview: "bg-orange-600" },
  { name: "Royal Purple", primary: "oklch(0.55 0.2 300)", primaryForeground: "oklch(1 0 0)", colorPreview: "bg-purple-600" },
];

const SECONDARY_PRESETS = [
  { name: "Aqua Blue (Default)", secondary: "oklch(72.469% 0.11517 218.16)", colorPreview: "bg-cyan-500" },
  { name: "Pale Blue", secondary: "oklch(0.85 0.05 250)", colorPreview: "bg-blue-200" },
  { name: "Mint Green", secondary: "oklch(0.85 0.1 150)", colorPreview: "bg-green-200" },
  { name: "Peach", secondary: "oklch(0.85 0.1 40)", colorPreview: "bg-orange-200" },
  { name: "Lavender", secondary: "oklch(0.85 0.1 300)", colorPreview: "bg-purple-200" },
];

function getContrastYIQ(hexcolor: string) {
  if (!/^#([0-9A-F]{3}){1,2}$/i.test(hexcolor)) return "oklch(1 0 0)";
  let hex = hexcolor.replace("#", "");
  if (hex.length === 3) hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;
  return yiq >= 128 ? "oklch(0.145 0 0)" : "oklch(1 0 0)";
}

export function ThemeCustomizerDrawer() {
  const [activeTheme, setActiveTheme] = useState(THEME_PRESETS[0]);
  const [activeSecondary, setActiveSecondary] = useState(SECONDARY_PRESETS[0]);
  const [isMounted, setIsMounted] = useState(false);

  const primaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const secondaryTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsMounted(true);
      
      const savedTheme = localStorage.getItem("app-theme-color");
      if (savedTheme) {
        const preset = THEME_PRESETS.find((p) => p.name === savedTheme);
        if (preset) {
          setActiveTheme(preset);
        } else if (savedTheme.startsWith("#")) {
          setActiveTheme({
            name: "Custom",
            primary: savedTheme,
            primaryForeground: getContrastYIQ(savedTheme),
            colorPreview: "",
          });
        }
      }

      const savedSecondary = localStorage.getItem("app-secondary-color");
      if (savedSecondary) {
        const preset = SECONDARY_PRESETS.find((p) => p.name === savedSecondary);
        if (preset) {
          setActiveSecondary(preset);
        } else if (savedSecondary.startsWith("#")) {
          setActiveSecondary({
            name: "Custom",
            secondary: savedSecondary,
            colorPreview: "",
          });
        }
      }
    }, 0);
    
    return () => {
      clearTimeout(timer);
      if (primaryTimeoutRef.current) clearTimeout(primaryTimeoutRef.current);
      if (secondaryTimeoutRef.current) clearTimeout(secondaryTimeoutRef.current);
    };
  }, []);

  const applyPrimaryTheme = (theme: { primary: string; primaryForeground: string }) => {
    const root = document.documentElement;
    root.style.setProperty("--primary", theme.primary);
    root.style.setProperty("--primary-foreground", theme.primaryForeground);
  };

  const applySecondaryTheme = (hex: string) => {
    const root = document.documentElement;
    root.style.setProperty("--secondary", hex);
    root.style.setProperty("--secondary-foreground", getContrastYIQ(hex));
  };

  const handlePrimaryChange = (theme: typeof THEME_PRESETS[0]) => {
    setActiveTheme(theme);
    applyPrimaryTheme(theme);
    localStorage.setItem("app-theme-color", theme.name);
  };

  const handleCustomPrimaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const customTheme = {
      name: "Custom",
      primary: hex,
      primaryForeground: getContrastYIQ(hex),
      colorPreview: "",
    };
    
    setActiveTheme(customTheme);
    
    if (primaryTimeoutRef.current) clearTimeout(primaryTimeoutRef.current);
    primaryTimeoutRef.current = setTimeout(() => {
      applyPrimaryTheme(customTheme);
      localStorage.setItem("app-theme-color", hex);
    }, 500);
  };

  const handleSecondaryChange = (theme: typeof SECONDARY_PRESETS[0]) => {
    setActiveSecondary(theme);
    applySecondaryTheme(theme.secondary);
    localStorage.setItem("app-secondary-color", theme.name);
  };

  const handleCustomSecondaryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    const customSecondary = {
      name: "Custom",
      secondary: hex,
      colorPreview: "",
    };
    
    setActiveSecondary(customSecondary);
    
    if (secondaryTimeoutRef.current) clearTimeout(secondaryTimeoutRef.current);
    secondaryTimeoutRef.current = setTimeout(() => {
      applySecondaryTheme(hex);
      localStorage.setItem("app-secondary-color", hex);
    }, 500);
  };

  if (!isMounted) return null;

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <button className="w-full flex items-center justify-between p-3.5 rounded-sm bg-muted hover:bg-muted/60 transition-colors mt-2">
          <div className="flex items-center gap-3">
            <Palette className="w-4 h-4 text-foreground/80" />
            <span className="text-[13px] font-medium text-foreground/90">Theme Customizer</span>
          </div>
          <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
        </button>
      </DrawerTrigger>
      <DrawerContent>
        <div className="mx-auto w-full max-w-120">
          <DrawerHeader>
            <DrawerTitle>Customize Theme</DrawerTitle>
            <DrawerDescription>
              Test dynamic branding by picking your colors.
            </DrawerDescription>
          </DrawerHeader>

          <div className="p-4">
            <Tabs defaultValue="primary" className="w-full">
              <TabsList variant={"line"} className="w-full grid grid-cols-2 mb-4">
                <TabsTrigger value="primary">Primary</TabsTrigger>
                <TabsTrigger value="secondary">Secondary</TabsTrigger>
              </TabsList>
              
              <TabsContent value="primary" className="space-y-4 max-h-[60vh] overflow-y-auto outline-none">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground mb-3">Primary Presets</p>
                  {THEME_PRESETS.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handlePrimaryChange(theme)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border",
                        activeTheme.name === theme.name ? "border-primary bg-primary/5" : "border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full shadow-sm", theme.colorPreview)} />
                        <span className="text-sm font-medium text-foreground">{theme.name}</span>
                      </div>
                      {activeTheme.name === theme.name && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50 space-y-4">
                  <p className="text-sm font-semibold text-foreground">Custom Primary Color</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border shrink-0 cursor-pointer">
                      <input
                        type="color"
                        value={activeTheme.name === "Custom" ? activeTheme.primary : "#cccccc"}
                        onChange={handleCustomPrimaryChange}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 px-3 py-2 bg-muted rounded flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">HEX CODE</span>
                      <span className="text-sm font-mono text-foreground uppercase">
                        {activeTheme.name === "Custom" ? activeTheme.primary : "PICK HEX"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="secondary" className="space-y-4 max-h-[60vh] overflow-y-auto outline-none">
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground mb-3">Secondary Presets</p>
                  {SECONDARY_PRESETS.map((theme) => (
                    <button
                      key={theme.name}
                      onClick={() => handleSecondaryChange(theme)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-md hover:bg-muted/50 transition-colors border",
                        activeSecondary.name === theme.name ? "border-primary bg-primary/5" : "border-transparent"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className={cn("w-5 h-5 rounded-full shadow-sm", theme.colorPreview)} />
                        <span className="text-sm font-medium text-foreground">{theme.name}</span>
                      </div>
                      {activeSecondary.name === theme.name && (
                        <Check className="w-4 h-4 text-primary" />
                      )}
                    </button>
                  ))}
                </div>

                <div className="pt-4 border-t border-border/50 space-y-4">
                  <p className="text-sm font-semibold text-foreground">Custom Secondary Color</p>
                  <div className="flex items-center gap-3">
                    <div className="relative w-10 h-10 rounded-full overflow-hidden shadow-sm border border-border shrink-0 cursor-pointer">
                      <input
                        type="color"
                        value={activeSecondary.name === "Custom" ? activeSecondary.secondary : "#cccccc"}
                        onChange={handleCustomSecondaryChange}
                        className="absolute -top-2 -left-2 w-16 h-16 cursor-pointer"
                      />
                    </div>
                    <div className="flex-1 px-3 py-2 bg-muted rounded flex flex-col justify-center">
                      <span className="text-[10px] text-muted-foreground font-semibold">HEX CODE</span>
                      <span className="text-sm font-mono text-foreground uppercase">
                        {activeSecondary.name === "Custom" ? activeSecondary.secondary : "PICK HEX"}
                      </span>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
