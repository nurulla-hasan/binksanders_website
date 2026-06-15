import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] px-6 text-center">
      <h2 className="text-4xl font-bold font-heading mb-4 text-foreground">404</h2>
      <p className="text-muted-foreground mb-8">This page could not be found.</p>
      <Link href="/">
        <Button>Return Home</Button>
      </Link>
    </div>
  );
}
