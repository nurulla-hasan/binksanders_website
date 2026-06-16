"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import { User, ArrowLeft, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  const isHome = pathname === "/";

  return (
    <header className="flex items-center justify-between px-4 h-16 bg-background border-b border-border/50 sticky top-0 z-30">
      <div className="flex items-center gap-3">
        {!isHome && (
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="bg-muted"
          >
            <ArrowLeft className="w-5 h-5 text-foreground" />
            <span className="sr-only">Go back</span>
          </Button>
        )}
        <div className="flex items-center gap-2.5">
          <Image
            src="/acme-logo.svg"
            alt="Acme Corp Logo"
            width={32}
            height={32}
            priority
            style={{ height: "auto" }}
            className="dark:invert"
          />
          <span className="text-xl font-bold font-heading tracking-tight text-foreground">
            Acme Corp
          </span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="h-5 w-5 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0 text-foreground" />
          <Moon className="absolute h-5 w-5 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 text-foreground" />
          <span className="sr-only">Toggle theme</span>
        </Button>
        <Link href="/profile" passHref>
          <Button
            variant="ghost"
            size="icon"
          >
            <User className="w-5 h-5 text-foreground" />
            <span className="sr-only">Profile</span>
          </Button>
        </Link>
      </div>
    </header>
  );
}
