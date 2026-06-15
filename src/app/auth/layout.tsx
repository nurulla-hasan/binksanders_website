import type { ReactNode } from "react";

export default function AuthLayout({
    children,
}: Readonly<{
    children: ReactNode;
}>) {
  return (
    <div className="min-h-full w-full flex flex-col flex-1 justify-center">
      {children}
    </div>
  );
}