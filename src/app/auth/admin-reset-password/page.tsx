"use client";

import { Suspense, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { useCountdown } from "@/hooks/useUtilityHook";
import { adminResetPassword, resendAdminOtp } from "@/services/admin.service";

function AdminResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const identifier = searchParams.get("identifier") ?? "";
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const {
    secondsLeft,
    isRunning: isCountdownRunning,
    start: startCountdown,
  } = useCountdown(60, "admin-reset-otp-timer");

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const response = await adminResetPassword({ identifier, otp, newPassword });
      if (!response.success) throw new Error(response.message);

      SuccessToast(response.message || "Password reset successfully");
      router.replace("/auth/admin-login");
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to reset password");
    } finally {
      setIsPending(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);

    try {
      const response = await resendAdminOtp({ identifier });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "OTP resent successfully");
      startCountdown();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="relative flex min-h-screen w-full flex-col justify-between bg-background pb-10 font-sans text-foreground">
      <div className="w-full px-6 pt-8">
        <Link href="/auth/admin-forgot-password" className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-muted/40 hover:bg-muted/60">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back</span>
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
            <h1 className="font-heading text-3xl font-bold tracking-tight">Reset Password</h1>
            <p className="text-sm text-muted-foreground">Enter the OTP sent to {identifier} and create a new password.</p>
          </div>

          <FieldGroup>
            <Field>
              <div>
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot key={index} index={index} />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </Field>

            <Field>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="New password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  minLength={8}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </Field>
          </FieldGroup>

          <div className="space-y-4">
            <Button type="submit" size="lg-full" disabled={isPending || otp.length !== 6}>
              {isPending ? "Resetting..." : "Reset Password"}
            </Button>
            <button type="button" onClick={handleResend} disabled={isResending || isCountdownRunning} className="w-full text-center text-xs font-semibold text-primary hover:underline disabled:opacity-50">
              {isResending
                ? "Resending..."
                : isCountdownRunning
                  ? `Resend OTP in ${secondsLeft}`
                  : "Resend OTP"}
            </button>
          </div>
        </form>
      </main>

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>Powered By</span>
        <Image src="/acme-inc.svg" alt="Act Inc" width={60} height={16} className="opacity-70 dark:invert" />
      </div>
    </div>
  );
}

export default function AdminResetPasswordPage() {
  return (
    <Suspense>
      <AdminResetPasswordForm />
    </Suspense>
  );
}
