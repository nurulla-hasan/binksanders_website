"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ArrowLeft, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();

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
        <Link href="/" className="flex items-center gap-2.5 hover:opacity-80 transition-opacity">
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
        </Link>
      </div>

      <div className="flex items-center gap-2">
        <Link href="/" passHref>
          <Button
            variant="ghost"
            size="icon"
          >
            <Home className="w-5 h-5 text-foreground" />
            <span className="sr-only">Home</span>
          </Button>
        </Link>
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
