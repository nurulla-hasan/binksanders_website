"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { LoaderCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { qrLogin } from "@/services/auth.service";
import { useAuthStore } from "@/stores/auth.store";

function QrLoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setUser = useAuthStore((state) => state.setUser);
  const hasAttempted = useRef(false);
  const qrToken = searchParams.get("token");
  const [errorMessage, setErrorMessage] = useState(() =>
    qrToken ? "" : "This QR login link is invalid."
  );

  useEffect(() => {
    if (hasAttempted.current) return;
    hasAttempted.current = true;

    if (!qrToken) return;

    const authenticate = async () => {
      const result = await qrLogin({ qrToken });

      if (!result.success) {
        setErrorMessage(result.message);
        ErrorToast(result.message);
        return;
      }

      setUser(result.data.user);
      SuccessToast(result.message);
      router.replace("/");
      router.refresh();
    };

    void authenticate();
  }, [qrToken, router, setUser]);

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-6 text-center">
      <div className="mb-10 flex items-center gap-3">
        <Image src="/acme-logo.svg" alt="Acme Corp" width={36} height={36} priority />
        <span className="font-heading text-2xl font-bold">Acme Corp</span>
      </div>

      {errorMessage ? (
        <div className="w-full space-y-5">
          <div className="space-y-2">
            <h1 className="font-heading text-2xl font-bold">QR Login Failed</h1>
            <p className="text-sm text-muted-foreground">{errorMessage}</p>
          </div>
          <Button asChild size="lg-full">
            <Link href="/auth/login">Go to login</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          <LoaderCircle className="mx-auto size-8 animate-spin text-primary" />
          <div className="space-y-1">
            <h1 className="font-heading text-2xl font-bold">Signing you in</h1>
            <p className="text-sm text-muted-foreground">
              Please wait while we verify your QR code.
            </p>
          </div>
        </div>
      )}
    </main>
  );
}

export default function QrLoginPage() {
  return (
    <Suspense>
      <QrLoginContent />
    </Suspense>
  );
}
