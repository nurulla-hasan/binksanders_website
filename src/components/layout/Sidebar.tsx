"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Megaphone, 
  MapPin,
  Users,
  UserPlus,
  LogOut,
  QrCode,
  Rss,
  LayoutList
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";
import { logout } from "@/services/auth.service";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const superAdminNavItems = [
  { name: "Dashboard", href: "/super-admin", icon: LayoutDashboard },
  { name: "Module Builder", href: "/super-admin/course", icon: GraduationCap },
  { name: "Client Branding", href: "/super-admin/branding", icon: Megaphone },
  { name: "Location & Team", href: "/super-admin/location-performance", icon: MapPin },
  { name: "Client", href: "/super-admin/clients", icon: Users },
  { name: "Broadcast Message", href: "/super-admin/broadcast", icon: Rss },
  { name: "Make admin", href: "/super-admin/make-admin", icon: UserPlus },
  { name: "Privacy Policy", href: "/super-admin/privacy-policy", icon: LayoutList },
  { name: "Terms & Conditions", href: "/super-admin/terms-and-conditions", icon: LayoutList },
];

const companyNavItems = [
  { name: "Dashboard", href: "/company", icon: LayoutDashboard },
  { name: "QR Access", href: "/company/qr-access", icon: QrCode },
  { name: "Course", href: "/company/course", icon: GraduationCap },
  { name: "Location & Performance", href: "/company/location-performance", icon: LayoutList },
  { name: "All user", href: "/company/users", icon: Users },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();
  const [isLoggingOut, setIsLoggingOutState] = useState(false);
  
  const isSuperAdmin = pathname?.startsWith("/super-admin");
  const navItems = isSuperAdmin ? superAdminNavItems : companyNavItems;
  const basePath = isSuperAdmin ? "/super-admin" : "/company";

  const handleLogout = async () => {
    setIsLoggingOutState(true);
    setIsSidebarOpen(false);
    await logout(isSuperAdmin ? "/auth/admin-login" : "/auth/login");
  };

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 w-70 bg-card border-r transform transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
    >
      <div className="flex h-16 items-center px-4 border-b shrink-0">
        <Image
          src="/acme-inc.svg"
          alt="Acme Inc Logo"
          width={160}
          height={48}
          priority
          className="dark:invert"
        />
      </div>

      <ScrollArea className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {navItems.map((item) => {
            // Exact match for basePath to avoid matching everything, startsWith for others
            const isActive =
              item.href === basePath
                ? pathname === basePath
                : pathname?.startsWith(item.href);

            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-md transition-all ${isActive
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  }`}
                onClick={() => setIsSidebarOpen(false)}
              >
                <Icon className="h-5 w-5" />
                <span className="text-base">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </ScrollArea>

      {/* Bottom fixed area: Logout */}
      <div className="h-12 border-t border-border shrink-0">
        <Button
          variant="sidebar-logout"
          size="sidebar-logout"
          onClick={handleLogout}
          disabled={isLoggingOut}
        >
          <LogOut className="h-5 w-5" />
          <span className="text-base font-medium">
            {isLoggingOut ? "Logging out..." : "Log out"}
          </span>
        </Button>
      </div>
    </aside>
  );
}
