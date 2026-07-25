import type { ReactNode } from "react";
import Image from "next/image";

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
  return (
    <div className="min-h-screen w-full bg-white flex flex-col md:flex-row relative">
      {/* Left Side: Image */}
      <div className="hidden md:block md:w-1/2 relative bg-zinc-200">
        <Image
          src="/auth-image.png"
          alt="Authentication background"
          fill
          className="object-cover"
          priority
          unoptimized
        />
        <div className="absolute top-6 left-6 text-white/80 text-sm font-medium tracking-wide z-10 drop-shadow-md">
          Authentication
        </div>
      </div>

      {/* Right Side: Auth Content */}
      <div className="w-full md:w-1/2 flex flex-col relative bg-white overflow-y-auto h-screen">
        {children}
      </div>
    </div>
  );
}