import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { 
  LayoutDashboard, 
  GraduationCap, 
  Megaphone, 
  MapPin,
  LayoutList,
  Users,
  UserPlus,
  LogOut
} from "lucide-react";
import { ScrollArea } from "../ui/scroll-area";

interface SidebarProps {
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}

const navItems = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { name: "Course", href: "/admin/course", icon: GraduationCap },
  { name: "Branding", href: "/admin/branding", icon: Megaphone },
  { name: "Location / Team", href: "/admin/location-team", icon: MapPin },
  { name: "Location & Performance", href: "/admin/location-performance", icon: LayoutList },
  { name: "All user", href: "/admin/users", icon: Users },
  { name: "Make admin", href: "/admin/make-admin", icon: UserPlus },
];

export default function Sidebar({ isSidebarOpen, setIsSidebarOpen }: SidebarProps) {
  const pathname = usePathname();

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
            // Exact match for /admin to avoid matching everything, startsWith for others
            const isActive =
              item.href === "/admin"
                ? pathname === "/admin"
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
          variant="ghost"
          className="flex justify-start items-center gap-3 px-4 h-full w-full rounded-none transition-all text-muted-foreground hover:bg-red-500/10 hover:text-red-500"
        >
          <LogOut className="h-5 w-5" />
          <span className="text-base font-medium">Log out</span>
        </Button>
      </div>
    </aside>
  );
}
