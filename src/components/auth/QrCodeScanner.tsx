"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { Html5Qrcode } from "html5-qrcode";
import { Camera, ExternalLink, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const normalizeQrLoginUrl = (decodedText: string) => {
  try {
    const decodedUrl = new URL(decodedText, window.location.origin);
    const token = decodedUrl.searchParams.get("token");

    if (decodedUrl.pathname !== "/qr-login" || !token) return null;

    const loginUrl = new URL("/qr-login", window.location.origin);
    loginUrl.searchParams.set("token", token);
    return loginUrl.toString();
  } catch {
    return null;
  }
};

export function QrCodeScanner() {
  const readerId = `qr-reader-${useId().replaceAll(":", "")}`;
  const scannerRef = useRef<Html5Qrcode | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scannedUrl, setScannedUrl] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const stopScanner = async () => {
    const scanner = scannerRef.current;
    if (!scanner) return;

    try {
      if (scanner.isScanning) await scanner.stop();
      scanner.clear();
    } catch {
      // The camera may already be stopped during navigation or cleanup.
    } finally {
      scannerRef.current = null;
      setIsScanning(false);
    }
  };

  useEffect(() => {
    return () => {
      const scanner = scannerRef.current;
      if (!scanner) return;

      if (scanner.isScanning) {
        void scanner.stop().finally(() => scanner.clear());
      } else {
        scanner.clear();
      }
    };
  }, []);

  const startScanner = async () => {
    setIsStarting(true);
    setErrorMessage("");
    setScannedUrl("");

    try {
      const { Html5Qrcode } = await import("html5-qrcode");
      const scanner = new Html5Qrcode(readerId);
      scannerRef.current = scanner;

      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 220, height: 220 } },
        (decodedText) => {
          const safeUrl = normalizeQrLoginUrl(decodedText);

          if (!safeUrl) {
            setErrorMessage("This is not a valid Act Inc QR login code.");
            return;
          }

          void stopScanner().then(() => setScannedUrl(safeUrl));
        },
        () => undefined
      );

      setIsScanning(true);
    } catch (error: unknown) {
      scannerRef.current = null;
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to access the camera. Please check camera permission."
      );
    } finally {
      setIsStarting(false);
    }
  };

  return (
    <div className="w-full space-y-4">
      <div
        id={readerId}
        className={`overflow-hidden rounded-md border border-border bg-black [&_video]:max-h-72 [&_video]:w-full [&_video]:object-cover ${
          isScanning ? "block" : "hidden"
        }`}
      />

      {scannedUrl ? (
        <div className="space-y-3 rounded-md border border-success/40 bg-success/10 p-4">
          <p className="text-sm font-medium text-foreground">
            QR code scanned successfully.
          </p>
          <Button asChild size="lg-full">
            <a href={scannedUrl}>
              Open login link
              <ExternalLink className="size-4" />
            </a>
          </Button>
          <button
            type="button"
            onClick={() => setScannedUrl("")}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
          >
            <RefreshCw className="size-3.5" />
            Scan another code
          </button>
        </div>
      ) : !isScanning ? (
        <Button
          type="button"
          size="lg-full"
          onClick={startScanner}
          disabled={isStarting}
        >
          <Camera className="size-5" />
          {isStarting ? "Opening camera..." : "Open camera"}
        </Button>
      ) : (
        <Button type="button" variant="outline" size="lg-full" onClick={stopScanner}>
          Stop camera
        </Button>
      )}

      {errorMessage && (
        <p className="text-center text-xs text-destructive">{errorMessage}</p>
      )}
    </div>
  );
}
