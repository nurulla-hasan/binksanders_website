"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { getCompany } from "@/services/company.service";
import { getMyProfile } from "@/services/user.service";

const THEME_PROPERTIES = [
  "--primary",
  "--primary-foreground",
  "--secondary",
  "--secondary-foreground",
  "--ring",
  "--sidebar-primary",
  "--sidebar-ring",
] as const;

const isValidColor = (color?: string) =>
  Boolean(color && CSS.supports("color", color));

const getContrastColor = (color: string) => {
  const hex = color.replace("#", "");
  const normalized =
    hex.length === 3
      ? hex
          .split("")
          .map((character) => character.repeat(2))
          .join("")
      : hex;

  if (!/^[0-9a-f]{6}$/i.test(normalized)) return "#ffffff";

  const red = Number.parseInt(normalized.slice(0, 2), 16);
  const green = Number.parseInt(normalized.slice(2, 4), 16);
  const blue = Number.parseInt(normalized.slice(4, 6), 16);
  const brightness = (red * 299 + green * 587 + blue * 114) / 1000;

  return brightness >= 128 ? "#171717" : "#ffffff";
};

const clearCompanyTheme = () => {
  const root = document.documentElement;
  THEME_PROPERTIES.forEach((property) => root.style.removeProperty(property));
};

const applyCompanyTheme = (primaryColor: string, secondaryColor: string) => {
  const root = document.documentElement;

  if (isValidColor(primaryColor)) {
    root.style.setProperty("--primary", primaryColor);
    root.style.setProperty("--primary-foreground", getContrastColor(primaryColor));
    root.style.setProperty("--ring", primaryColor);
    root.style.setProperty("--sidebar-primary", primaryColor);
    root.style.setProperty("--sidebar-ring", primaryColor);
  }

  if (isValidColor(secondaryColor)) {
    root.style.setProperty("--secondary", secondaryColor);
    root.style.setProperty(
      "--secondary-foreground",
      getContrastColor(secondaryColor)
    );
  }
};

export function DynamicThemeProvider() {
  const pathname = usePathname();

  useEffect(() => {
    let isCancelled = false;

    if (pathname.startsWith("/auth")) {
      clearCompanyTheme();
      return;
    }

    const loadCompanyTheme = async () => {
      try {
        const profileResponse = await getMyProfile();
        const companyId = profileResponse.success
          ? profileResponse.data.companyId
          : undefined;

        if (!companyId) {
          if (!isCancelled) clearCompanyTheme();
          return;
        }

        const companyResponse = await getCompany(companyId);
        if (!companyResponse.success || isCancelled) return;

        applyCompanyTheme(
          companyResponse.data.branding.primaryColor,
          companyResponse.data.branding.secondaryColor
        );
      } catch {
        if (!isCancelled) clearCompanyTheme();
      }
    };

    void loadCompanyTheme();

    return () => {
      isCancelled = true;
    };
  }, [pathname]);

  return null;
}
