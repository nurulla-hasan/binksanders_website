"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

export default function VerifyOtpPage() {
  const [otp, setOtp] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Verified OTP: ${otp}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground justify-between font-sans relative pb-10 w-full">
      
      {/* Top Header Section */}
      <div className="w-full pt-8 px-6 relative">
        <Link href="/auth/forgot-password" className="inline-block">
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
              Verify Otp
            </h1>
            <p className="text-sm text-muted-foreground leading-relaxed">
              We sent an otp to xxxx12@gmail.com enter it below to continue
            </p>
          </div>

          <div className="space-y-6">
            <div className="flex justify-center w-full">
              <InputOTP
                maxLength={6}
                value={otp}
                onChange={(value) => setOtp(value)}
                className="w-full flex justify-between gap-2"
                containerClassName="w-full"
              >
                <InputOTPGroup className="w-full flex justify-between gap-2">
                  <InputOTPSlot index={0} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                  <InputOTPSlot index={1} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                  <InputOTPSlot index={2} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                  <InputOTPSlot index={3} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                  <InputOTPSlot index={4} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                  <InputOTPSlot index={5} className="w-12 h-14 text-xl rounded-md bg-muted/30 border-muted" />
                </InputOTPGroup>
              </InputOTP>
            </div>
            
            <div className="text-center text-xs text-muted-foreground">
              Don&apos;t get the code? <button type="button" className="text-primary hover:underline">Resend Otp.</button>
            </div>
          </div>

          <Link href="/auth/reset-password" className="w-full block">
            <Button
              type="submit"
              size="lg"
              className="w-full"
            >
              VERIFY OTP
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
