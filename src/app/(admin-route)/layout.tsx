import MainLayout from "@/components/layout/MainLayout";

export default function AdminRouteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <MainLayout>{children}</MainLayout>;
}
