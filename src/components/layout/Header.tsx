import { Menu, User as UserIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/common/ThemeToggle";

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  return (
    <header className="absolute top-0 right-0 left-0 h-16 bg-background/80 backdrop-blur-md border-b border-border z-20 flex items-center justify-between px-4 lg:px-8 transition-all">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onMenuClick}
          className="lg:hidden text-muted-foreground hover:text-foreground"
        >
          <Menu className="h-6 w-6" />
        </Button>
        <h1 className="text-xl font-bold font-heading hidden sm:block">Welcome back, Admin</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Theme Toggle */}
        <ThemeToggle />
        
        {/* User Profile */}
        <div className="flex items-center gap-3 pl-4 border-l border-border cursor-pointer hover:opacity-80 transition-opacity">
          <div className="flex-col items-end hidden sm:flex">
            <span className="text-sm font-medium leading-none">Admin User</span>
            <span className="text-xs text-muted-foreground mt-1">Super Admin</span>
          </div>
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
            <UserIcon className="h-5 w-5" />
          </div>
        </div>
      </div>
    </header>
  );
}
