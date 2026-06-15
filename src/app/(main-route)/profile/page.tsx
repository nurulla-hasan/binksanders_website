"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Pencil, 
  ShieldCheck, 
  Headset, 
  Gavel, 
  ChevronRight, 
  LogOut 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const settingsItems = [
    { id: "edit-profile", icon: Pencil, label: "Edit Profile", type: "drawer" },
    { id: "change-password", icon: ShieldCheck, label: "Change Password", type: "drawer" },
    { id: "privacy", icon: Headset, label: "Privacy Policy", type: "link", href: "/privacy-policy" },
    { id: "terms", icon: Gavel, label: "Terms & Condition", type: "link", href: "/terms-and-condition" },
  ];

  const router = useRouter()

  const handleLogOut = () => {
    router.push("/auth/login");
  }

  return (
    <div className="flex-1 flex flex-col pb-18 animate-fadeIn -m-4">
      <div className="p-4">

        {/* Profile Card */}
        <div className="bg-[#8ACDDE]/90 rounded-sm p-5 mb-8 shadow-sm">
          <div className="flex gap-4 mb-4">
            {/* Profile Picture */}
            <div className="relative w-14 h-14 rounded-full overflow-hidden shrink-0 mt-1">
              <Image
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop"
                alt="Profile Picture"
                fill
                className="object-cover"
              />
            </div>
            
            {/* Profile Info */}
            <div className="flex-1">
              <h2 className="text-[17px] font-bold text-foreground leading-tight">Willem</h2>
              <p className="text-[11px] text-foreground/80 font-medium mt-1">willem@gmail.com</p>
              <p className="text-[10px] text-foreground/60 mt-1 tracking-wide">Social safety programm</p>
            </div>
          </div>

          {/* Progress Card Inside Profile */}
          <div className="bg-white/40 border border-white/50 rounded-sm p-3 shadow-sm">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] font-medium text-foreground">Program progress</span>
              <span className="text-[9px] font-bold text-foreground/80">1/8</span>
            </div>
            <Progress value={12.5} className="h-1.5 bg-white/60" />
          </div>
        </div>

        {/* Settings Section */}
        <div className="flex-1 px-1">
          <h3 className="text-[15px] font-bold text-foreground mb-4 font-heading tracking-tight">Settings</h3>
          
          <div className="space-y-2">
            {settingsItems.map((item) => {
              const Icon = item.icon;
              
              if (item.type === "link") {
                return (
                  <Link
                    key={item.id}
                    href={item.href!}
                    className="w-full flex items-center justify-between p-3.5 rounded-sm bg-muted hover:bg-muted/60 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="w-4 h-4 text-foreground/80" />
                      <span className="text-[13px] font-medium text-foreground/90">{item.label}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                  </Link>
                );
              }

              return (
                <Drawer key={item.id}>
                  <DrawerTrigger asChild>
                    <button className="w-full flex items-center justify-between p-3.5 rounded-sm bg-muted hover:bg-muted/60 transition-colors">
                      <div className="flex items-center gap-3">
                        <Icon className="w-4 h-4 text-foreground/80" />
                        <span className="text-[13px] font-medium text-foreground/90">{item.label}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-muted-foreground/50" />
                    </button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-[480px]">
                      <DrawerHeader>
                        <DrawerTitle>{item.label}</DrawerTitle>
                        <DrawerDescription>
                          {item.id === "edit-profile" 
                            ? "Update your personal details below." 
                            : "Secure your account with a new password."}
                        </DrawerDescription>
                      </DrawerHeader>
                      <div className="p-4 pb-0">
                        {item.id === "edit-profile" ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="name">Full Name</Label>
                              <Input id="name" defaultValue="Willem" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="email" className="text-muted-foreground">Email Address</Label>
                              <Input id="email" defaultValue="willem@gmail.com" type="email" disabled className="bg-muted/50 cursor-not-allowed" />
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label htmlFor="current-password">Current Password</Label>
                              <Input id="current-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="new-password">New Password</Label>
                              <Input id="new-password" type="password" />
                            </div>
                            <div className="space-y-2">
                              <Label htmlFor="confirm-password">Confirm Password</Label>
                              <Input id="confirm-password" type="password" />
                            </div>
                          </div>
                        )}
                      </div>
                      <DrawerFooter className="mt-4">
                        <DrawerClose asChild>
                          <Button>Save changes</Button>
                        </DrawerClose>
                        <DrawerClose asChild>
                          <Button variant="outline">Cancel</Button>
                        </DrawerClose>
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              );
            })}
          </div>
        </div>

        {/* Log Out Button */}
        <div className="mt-12 px-1">
          <Button
          onClick={handleLogOut}
            variant="outline"
            className="w-full flex items-center justify-center gap-2 p-3.5 h-auto rounded-sm bg-muted hover:bg-muted/70 border-border/40 text-[#E11D48] hover:text-[#E11D48]"
          >
            <LogOut className="w-4 h-4" />
            <span className="text-[13px] font-medium">Log Out</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
