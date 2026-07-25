"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Download, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { downloadCompanyReport } from "@/services/company.service";
import { ErrorToast, SuccessToast } from "@/lib/utils";

export function FooterActions({ companyId, companyName }: { companyId: string; companyName: string }) {
  const router = useRouter();
  const [isDownloading, setIsDownloading] = useState(false);

  const handleDownload = async () => {
    try {
      setIsDownloading(true);
      const base64 = await downloadCompanyReport(companyId);
      
      const binaryString = window.atob(base64);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const blob = new Blob([bytes], { type: "application/pdf" });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      // Sanitize company name for filename
      const safeName = companyName.replace(/[^a-z0-9]/gi, '_').toLowerCase();
      link.download = `${safeName}-analytics-report.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      SuccessToast("Report downloaded successfully");
    } catch (error) {
      console.error("Download error:", error);
      ErrorToast("Failed to download report");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 pb-6">
      <Button
        variant="outline"
        onClick={() => router.back()}
        className="order-2 sm:order-1"
        disabled={isDownloading}
      >
        <X className="w-4 h-4 mr-2" />
        Close
      </Button>
      <Button className="order-1 sm:order-2" onClick={handleDownload} disabled={isDownloading}>
        {isDownloading ? (
          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
        ) : (
          <Download className="w-4 h-4 mr-2" />
        )}
        {isDownloading ? "Downloading..." : "Download Detailed Report"}
      </Button>
    </div>
  );
}
