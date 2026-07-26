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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleSuccessfulLogin = (user: any, message?: string) => {
    SuccessToast(message || "Logged in successfully");
    router.replace(user?.role === "company" ? "/company" : "/");
    router.refresh();
  };

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
        handleSuccessfulLogin(response.data.user, response.message);
      } else if (mode === "employee") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await employeeIdLogin<any>({
          employeeId,
          companyId,
          teamId,
          firstName,
          lastName,
        });
        if (!response.success) throw new Error(response.message);
        handleSuccessfulLogin(response.data.user, response.message);
      } else if (mode === "guest") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const response = await guestLogin<any>({ passcode, companyId, teamId });
        if (!response.success) throw new Error(response.message);
        handleSuccessfulLogin(response.data.user, response.message);
      }
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

        <div className="flex w-full flex-col p-6 sm:p-10 flex-1 relative">

          
          <div className="flex-1 flex flex-col justify-center max-w-sm mx-auto w-full">
            <div className="mb-10 flex items-center justify-center">
              <Image
                src="/acme-inc.svg"
                alt="Logo"
                width={150}
                height={50}
                priority
                className="h-auto w-37.5 max-w-full dark:invert"
              />
            </div>

            <TabsContent value="email" className="mt-0 flex-none">
              <form
                onSubmit={handleLoginSubmit}
                className="space-y-6 animate-fadeIn"
              >
                <div className="space-y-2 mb-6">
                  <h1 className="text-3xl font-bold tracking-tight text-foreground">
                    Sign in to your account
                  </h1>
                  <p className="text-sm text-muted-foreground">
                    Don&apos;t have an account?
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
                  <div className="text-right mt-1">
                    <Link
                      href="/auth/forgot-password"
                      className="text-xs font-medium text-muted-foreground hover:text-foreground underline underline-offset-2"
                    >
                      Forgot Password?
                    </Link>
                  </div>
                </Field>
              </FieldGroup>

              <Button type="submit" size="lg-full" disabled={isPending} className="mt-4 text-base font-semibold tracking-wide uppercase">
                {isPending ? "Logging in..." : (
                  <>
                    Log In <span className="ml-2">→</span>
                  </>
                )}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="employee" className="mt-0 flex-none">
            <form
              onSubmit={handleLoginSubmit}
              className="space-y-6 animate-fadeIn"
            >
              <div className="space-y-2 mb-6">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">
                  Employee Access
                </h1>
                <p className="text-sm text-muted-foreground">
                  Sign in with your employee ID.
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
