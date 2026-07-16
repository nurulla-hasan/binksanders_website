"use client";

import { useRouter } from "next/navigation";
import { X, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

export function FooterActions() {
  const router = useRouter();

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-2 pb-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="order-2 sm:order-1"
      >
        <X className="w-4 h-4 mr-2" />
        Close
      </Button>
      <Button className="order-1 sm:order-2">
        <Download className="w-4 h-4 mr-2" />
        Download Detailed Report
      </Button>
    </div>
  );
}
