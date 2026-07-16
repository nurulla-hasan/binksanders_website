"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Mail, Eye, EyeOff, User, Scan } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";

type LoginMode = "email" | "employee" | "scan";

export default function LoginPage() {
  const [mode, setMode] = useState<LoginMode>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Logged in via ${mode} mode!`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground justify-between font-sans relative pb-10 w-full">
      
      {/* Dev Switcher - Styled like a premium floating bar */}
      <div className="p-3 bg-muted/40 border-b border-border flex items-center justify-center gap-2">
        <button
          onClick={() => setMode("email")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
            mode === "email"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Email Login
        </button>
        <button
          onClick={() => setMode("employee")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
            mode === "employee"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Employee ID Login
        </button>
        <button
          onClick={() => setMode("scan")}
          className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all duration-300 ${
            mode === "scan"
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          }`}
        >
          Scan QR
        </button>
      </div>

      {/* Top Section / Logo Area */}
      <div className="flex flex-col items-center pt-16 px-6">
        <div className="flex items-center gap-3 mb-2">
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

      {/* Main Form Content */}
      <div className="flex-1 flex flex-col justify-center px-6 max-w-sm mx-auto w-full py-10">
        
        {/* Render mode conditionally */}
        {mode === "email" && (
          <form onSubmit={handleLoginSubmit} className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grow your skills, one quick lesson at a time.
              </p>
            </div>

            <FieldGroup>
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

              <Field className="space-y-2">
                <div className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <div className="text-right">
                  <Link href="/auth/forgot-password" className="text-xs font-semibold text-destructive hover:underline">
                    Forgot Password
                  </Link>
                </div>
              </Field>
            </FieldGroup>

            <Button
              type="submit"
              size="lg-full"
            >
              Log In
            </Button>

            <div className="text-center">
              <Link
                href="/auth/admin-login"
                className="text-xs font-semibold text-primary hover:underline"
              >
                Admin login
              </Link>
            </div>
          </form>
        )}

        {mode === "employee" && (
          <form onSubmit={handleLoginSubmit} className="space-y-8 animate-fadeIn">
            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
                Welcome Back
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Grow your skills, one quick lesson at a time.
              </p>
            </div>

            <FieldGroup>
              <Field>
                <div className="relative flex items-center">
                  <Input
                    type="text"
                    placeholder="Employ ID"
                    required
                    value={employeeId}
                    onChange={(e) => setEmployeeId(e.target.value)}
                    className="pr-10"
                  />
                  <User className="absolute right-3.5 w-5 h-5 text-muted-foreground/60" />
                </div>
              </Field>

              <Field>
                <div className="relative flex items-center">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-muted-foreground hover:text-foreground focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </Field>
            </FieldGroup>

            <div className="space-y-6">
              <Button
                type="submit"
                size="lg"
                className="w-full"
              >
                Log In
              </Button>

              {/* Informational Help Box - Styled using secondary theme colors with opacity */}
              <div className="flex gap-2.5 p-4 bg-secondary/20 border border-secondary/30 rounded-md text-xs text-secondary-foreground leading-relaxed">
                <span>
                  Your employee number is on your onboarding card or ask your manager.
                </span>
              </div>
            </div>
          </form>
        )}

        {mode === "scan" && (
          <div className="space-y-8 animate-fadeIn text-center flex flex-col items-center">
            {/* Scan illustration image from Figma */}
            <div className="relative w-44 h-28 flex items-center justify-center mb-2">
              <Image
                src="/scan-illustration.svg"
                alt="Scan Illustration"
                width={171}
                height={112}
                priority
                style={{ height: "auto" }}
              />
            </div>

            <div className="space-y-2">
              <h1 className="text-3xl font-bold font-heading tracking-tight text-foreground">
                Scan To Authenticate
              </h1>
              <p className="text-sm text-muted-foreground max-w-70 mx-auto leading-relaxed">
                Scan the QR code to gain access for the training
              </p>
            </div>

            <Button
              onClick={() => alert("Scanner opened!")}
              className="w-full gap-2"
              size="lg"
            >
              <Scan className="w-5 h-5" />
              SCAN QR CODE
            </Button>
          </div>
        )}

      </div>

      {/* Bottom Footer Section - Styled matching the screenshots */}
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
