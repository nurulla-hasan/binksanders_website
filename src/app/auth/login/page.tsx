"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Eye, EyeOff, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup } from "@/components/ui/field";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CompanyTeamSelect } from "@/components/auth/CompanyTeamSelect";
import { AuthPageLinks } from "@/components/auth/AuthPageLinks";
import { QrCodeScanner } from "@/components/auth/QrCodeScanner";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import {
  employeeIdLogin,
  guestLogin,
  login,
} from "@/services/auth.service";

type LoginMode = "email" | "employee" | "guest" | "scan";

const loginTabs: { value: LoginMode; label: string }[] = [
  { value: "guest", label: "Guest" },
  { value: "email", label: "Email" },
  { value: "employee", label: "Employee ID" },
  { value: "scan", label: "QR Scan" },
];

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState<LoginMode>("email");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [employeeId, setEmployeeId] = useState("");
  const [companyId, setCompanyId] = useState("");
  const [teamId, setTeamId] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [passcode, setPasscode] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if ((mode === "employee" || mode === "guest") && (!companyId || !teamId)) {
      ErrorToast("Please select a company and team");
      return;
    }

    setIsPending(true);

    try {
      if (mode === "email") {
        const response = await login({ identifier: email, password });
        if (!response.success) throw new Error(response.message);
        const user = response.data.user;
        SuccessToast(response.message || "Logged in successfully");
        router.replace(user.role === "company" ? "/company" : "/");
      } else if (mode === "employee") {
        const response = await employeeIdLogin({
          employeeId,
          companyId,
          teamId,
          firstName,
          lastName,
        });
        if (!response.success) throw new Error(response.message);
        SuccessToast(response.message || "Logged in successfully");
        router.replace("/");
      } else if (mode === "guest") {
        const response = await guestLogin({ passcode, companyId, teamId });
        if (!response.success) throw new Error(response.message);
        SuccessToast(response.message || "Logged in successfully");
        router.replace("/");
      }
      router.refresh();
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to log in");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div>
      <Tabs
        value={mode}
        onValueChange={(value) => setMode(value as LoginMode)}
        className="relative min-h-screen max-w-lg mx-auto justify-between gap-0 bg-background pb-10 font-sans text-foreground pt-4"
      >
        <TabsList
          // variant="line"
          className="grid h-12 w-full grid-cols-4"
        >
          {loginTabs.map((tab) => (
            <TabsTrigger key={tab.value} value={tab.value}>
              {tab.label}
            </TabsTrigger>
          ))}
        </TabsList>

        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center px-6 py-10">
          <div className="mb-8 flex items-center justify-center gap-3">
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

          <TabsContent value="email" className="mt-0 flex-none">
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-8 animate-fadeIn"
            >
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
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  <div className="text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-semibold text-destructive hover:underline"
                    >
                      Forgot Password
                    </Link>
                  </div>
                </Field>
              </FieldGroup>

              <Button type="submit" size="lg-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="employee" className="mt-0 flex-none">
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-8 animate-fadeIn"
            >
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

                <CompanyTeamSelect
                  companyId={companyId}
                  teamId={teamId}
                  onCompanyChange={setCompanyId}
                  onTeamChange={setTeamId}
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First name"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                  <Input
                    placeholder="Last name"
                    required
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </FieldGroup>

              <div className="space-y-6">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  disabled={isPending}
                >
                  {isPending ? "Logging in..." : "Log In"}
                </Button>

                {/* Informational Help Box - Styled using secondary theme colors with opacity */}
                {/* <div className="flex gap-2.5 p-4 bg-secondary/20 border border-secondary/30 rounded-md text-xs text-foreground leading-relaxed">
                  <span>
                    Your employee number is on your onboarding card or ask your
                    manager.
                  </span>
                </div> */}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="guest" className="mt-0 flex-none">
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-8 animate-fadeIn"
            >
              <div className="space-y-2">
                <h1 className="text-3xl font-bold font-heading">
                  Guest Access
                </h1>
                <p className="text-sm text-muted-foreground">
                  Use the access details provided by your company.
                </p>
              </div>
              <FieldGroup>
                <Field>
                  <Input
                    placeholder="Passcode"
                    required
                    value={passcode}
                    onChange={(e) => setPasscode(e.target.value)}
                  />
                </Field>
                <CompanyTeamSelect
                  companyId={companyId}
                  teamId={teamId}
                  onCompanyChange={setCompanyId}
                  onTeamChange={setTeamId}
                />
              </FieldGroup>
              <Button type="submit" size="lg-full" disabled={isPending}>
                {isPending ? "Logging in..." : "Log In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="scan" className="mt-0 flex-none">
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
                  Open the camera and scan the QR code provided by your company.
                </p>
              </div>

              <QrCodeScanner />
            </div>
          </TabsContent>

          <AuthPageLinks />
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
      </Tabs>
    </div>
  );
}
