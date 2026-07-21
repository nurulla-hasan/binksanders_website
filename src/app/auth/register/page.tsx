"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { register } from "@/services/auth.service";

export default function RegisterPage() {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    companyId: "",
    teamId: "",
  });

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!acceptedTerms) return ErrorToast("Please accept the terms");
    setIsPending(true);

    try {
      const response = await register({ ...form, acceptedTerms });
      if (!response.success) throw new Error(response.message);
      SuccessToast(response.message || "OTP sent successfully");
      router.push(`/auth/verify-otp?identifier=${encodeURIComponent(form.email)}`);
    } catch (error: unknown) {
      ErrorToast(error instanceof Error ? error.message : "Unable to register");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-10">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h1 className="font-heading text-3xl font-bold">Create Account</h1>
          <p className="mt-2 text-sm text-muted-foreground">Use the company and team IDs provided to you.</p>
        </div>
        <FieldGroup>
          <div className="grid grid-cols-2 gap-3">
            <Field><FieldLabel>First Name</FieldLabel><Input value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} required /></Field>
            <Field><FieldLabel>Last Name</FieldLabel><Input value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} required /></Field>
          </div>
          <Field><FieldLabel>Email</FieldLabel><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required /></Field>
          <Field><FieldLabel>Password</FieldLabel><Input type="password" minLength={8} value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required /></Field>
          <Field><FieldLabel>Company ID</FieldLabel><Input value={form.companyId} onChange={(e) => setForm({ ...form, companyId: e.target.value })} required /></Field>
          <Field><FieldLabel>Team ID</FieldLabel><Input value={form.teamId} onChange={(e) => setForm({ ...form, teamId: e.target.value })} required /></Field>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={acceptedTerms} onChange={(e) => setAcceptedTerms(e.target.checked)} />
            I accept the terms and conditions
          </label>
        </FieldGroup>
        <Button type="submit" size="lg-full" disabled={isPending}>{isPending ? "Creating..." : "Create Account"}</Button>
        <p className="text-center text-sm text-muted-foreground">Already registered? <Link href="/auth/login" className="text-primary hover:underline">Log in</Link></p>
      </form>
    </div>
  );
}
