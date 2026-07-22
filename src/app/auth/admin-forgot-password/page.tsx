"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthPageLinks } from "@/components/auth/AuthPageLinks";
import { Field } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { useCountdown } from "@/hooks/useUtilityHook";
import { adminForgotPassword } from "@/services/admin.service";

export default function AdminForgotPasswordPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [isPending, setIsPending] = useState(false);
  const { start: startResendCountdown } = useCountdown(
    60,
    "admin-reset-otp-timer"
  );

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await adminForgotPassword({ identifier });
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "OTP sent successfully");
      startResendCountdown();
      router.push(
        `/auth/admin-reset-password?identifier=${encodeURIComponent(identifier)}`
      );
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to send OTP");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-background pb-10 font-sans text-foreground">
      <div className="w-full px-6 pt-8">
        <Link href="/auth/admin-login" className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-muted/40 hover:bg-muted/60">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to admin login</span>
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
        <div className="mb-10 flex flex-col items-center">
          <div className="flex items-center gap-3">
            <Image src="/acme-logo.svg" alt="Acme Corp Logo" width={36} height={36} priority />
            <span className="font-heading text-2xl font-bold tracking-tight">Acme Corp</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">Forgot Password?</h1>
            <p className="text-sm text-muted-foreground">Enter your admin email to receive an OTP.</p>
          </div>

          <Field>
            <div className="relative flex items-center">
              <Input
                type="email"
                placeholder="Admin email"
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
              <Mail className="pointer-events-none absolute right-3.5 h-5 w-5 text-muted-foreground/60" />
            </div>
          </Field>

          <Button type="submit" size="lg-full" disabled={isPending}>
            {isPending ? "Sending..." : "Send OTP"}
          </Button>
        </form>
        <AuthPageLinks />
      </main>

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>Powered By</span>
        <Image src="/acme-inc.svg" alt="Act Inc" width={60} height={16} className="opacity-70 dark:invert" />
      </div>
    </div>
  );
}
