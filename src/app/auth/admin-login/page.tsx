"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { adminLogin } from "@/services/admin.service";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsPending(true);

    try {
      const result = await adminLogin({ identifier, password });
      SuccessToast("Logged in successfully");
      router.replace(result.role === "superAdmin" ? "/super-admin" : "/company");
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error
          ? error.message
          : "Unable to log in. Please try again."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full flex-col justify-between bg-background pb-10 text-foreground">
      <div className="w-full px-6 pt-8">
        <Link href="/auth/login" className="inline-flex h-10 w-10 items-center justify-center rounded-sm bg-muted/40 transition-colors hover:bg-muted/60">
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Back to user login</span>
        </Link>
      </div>

      <main className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
        <div className="mb-10 flex flex-col items-center gap-3">
          <Image
            src="/acme-inc.svg"
            alt="Act Inc"
            width={92}
            height={28}
            priority
          />
          <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Administration Portal
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <h1 className="font-heading text-3xl font-bold tracking-tight">
              Admin Login
            </h1>
            <p className="text-sm leading-relaxed text-muted-foreground">
              Sign in to manage the Act Inc platform.
            </p>
          </div>

          <FieldGroup>
            <Field>
              <div className="relative flex items-center">
                <Input
                  name="identifier"
                  type="email"
                  placeholder="Email"
                  autoComplete="email"
                  value={identifier}
                  onChange={(event) => setIdentifier(event.target.value)}
                  required
                />
                <Mail className="pointer-events-none absolute right-3.5 h-5 w-5 text-muted-foreground/60" />
              </div>
            </Field>

            <Field>
              <div className="relative flex items-center">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  className="absolute right-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </Field>
          </FieldGroup>

          <Button type="submit" size="lg-full" disabled={isPending}>
            {isPending ? "Logging in..." : "Log In"}
          </Button>

          <div className="text-center">
            <Link
              href="/auth/forgot-password?account=admin"
              className="text-xs font-semibold text-destructive hover:underline"
            >
              Forgot Password?
            </Link>
          </div>
        </form>
      </main>

      <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>Powered By</span>
        <Image src="/acme-inc.svg" alt="Act Inc" width={60} height={16} />
      </div>
    </div>
  );
}
