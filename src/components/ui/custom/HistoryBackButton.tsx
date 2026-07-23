"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export function HistoryBackButton({ label = "Back" }: { label?: string }) {
  const router = useRouter();

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={() => router.back()}
    >
      <ArrowLeft />
      {label}
    </Button>
  );
}
