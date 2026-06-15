"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { User, ArrowLeft } from "lucide-react";
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
            className="rounded-lg bg-muted text-muted-foreground hover:bg-muted w-10 h-10 flex items-center justify-center transition-colors mr-1"
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
          />
          <span className="text-xl font-bold font-heading tracking-tight text-foreground">
            Acme Corp
          </span>
        </div>
      </div>

      {isHome && (
        <Link href="/profile" passHref>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full bg-muted text-muted-foreground hover:bg-muted/80 w-10 h-10 flex items-center justify-center transition-colors duration-200"
          >
            <User className="w-5 h-5 text-foreground" />
            <span className="sr-only">Profile</span>
          </Button>
        </Link>
      )}
    </header>
  );
}
