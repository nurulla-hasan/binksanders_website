"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`OTP sent to ${email}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground justify-between font-sans relative pb-10 w-full">
      
      {/* Top Header Section */}
      <div className="w-full pt-8 px-6 relative">
        <Link href="/auth/login" className="inline-block">
          <div className="w-10 h-10 bg-muted/40 rounded-sm flex items-center justify-center hover:bg-muted/60 transition-colors">
            <ArrowLeft className="w-5 h-5 text-foreground" />
          </div>
        </Link>
      </div>

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full py-10">
        <div className="flex flex-col items-center mb-10">
          <div className="flex items-center gap-3">
            <Image
              src="/acme-logo.svg"
              alt="Acme Corp Logo"
              width={36}
              height={36}
              priority
              style={{ height: "auto" }}
            />
            <span className="text-2xl font-bold font-heading tracking-tight text-foreground">
              Acme Corp
            </span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8 animate-fadeIn">
          <div className="space-y-2">
            <h1 className="text-[28px] font-bold font-heading tracking-tight text-foreground leading-[1.2]">
              Forgot Password?
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Enter your email and we&apos;ll send you a link to reset your password
            </p>
          </div>

          <FieldGroup className="space-y-4">
            <Field>
              <div className="relative flex items-center">
                <Input
                  type="email"
                  placeholder="Email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pr-10"
                />
                <Mail className="absolute right-3.5 w-5 h-5 text-muted-foreground/60" />
              </div>
            </Field>
          </FieldGroup>

          <Link href="/auth/verify-otp" className="w-full block">
            <Button
              type="submit"
              size="lg"
              className="w-full"
            >
              SEND OTP
            </Button>
          </Link>
        </form>
      </div>

      {/* Bottom Footer Section */}
      <div className="flex items-center justify-center gap-1.5 text-[10px] tracking-widest text-muted-foreground font-bold uppercase">
        <span>Powered By</span>
        <Image
          src="/acme-inc.svg"
          alt="Act Inc Logo"
          width={60}
          height={16}
          className="opacity-70 dark:invert"
        />
      </div>

    </div>
  );
}
