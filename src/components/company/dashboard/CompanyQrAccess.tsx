"use client";

import Image from "next/image";
import { useState } from "react";
import {
  Check,
  Clock3,
  Copy,
  Download,
  QrCode,
  RefreshCw,
  ShieldCheck,
  Users,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { GenerateQrData } from "@/lib/types/auth.type";
import type { TeamDropdownItem } from "@/lib/types/team.type";
import { ErrorToast, SuccessToast } from "@/lib/utils";
import { generateQrCode } from "@/services/auth.service";

type CompanyQrAccessProps = {
  companyId: string;
  companyName: string;
  teams: TeamDropdownItem[];
};

export function CompanyQrAccess({
  companyId,
  companyName,
  teams,
}: CompanyQrAccessProps) {
  const [teamId, setTeamId] = useState("");
  const [qrData, setQrData] = useState<GenerateQrData>();
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!companyId || !teamId) {
      ErrorToast("Please select a team first");
      return;
    }

    setIsGenerating(true);
    setIsCopied(false);

    try {
      const response = await generateQrCode({ companyId, teamId });
      if (!response.success) throw new Error(response.message);

      setQrData(response.data);
      SuccessToast(response.message || "QR code generated successfully");
    } catch (error: unknown) {
      ErrorToast(
        error instanceof Error ? error.message : "Unable to generate QR code"
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopyLink = async () => {
    if (!qrData) return;

    try {
      await navigator.clipboard.writeText(qrData.qrUrl);
      setIsCopied(true);
      SuccessToast("Login link copied");
      window.setTimeout(() => setIsCopied(false), 2000);
    } catch {
      ErrorToast("Unable to copy the login link");
    }
  };

  const handleDownload = () => {
    if (!qrData) return;

    const link = document.createElement("a");
    link.href = qrData.qrImage;
    link.download = `${qrData.company.name}-${qrData.team.name}-access-qr.png`
      .toLowerCase()
      .replaceAll(" ", "-");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_420px]">
        <Card className="border-primary/15 bg-linear-to-br from-card via-card to-primary/5">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-start gap-3">
              <div className="flex size-11 shrink-0 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <QrCode className="size-5" />
              </div>
              <div className="space-y-1">
                <CardTitle className="text-lg font-semibold">
                  Generate employee access QR
                </CardTitle>
                <CardDescription>
                  Create a secure, time-limited login code for one of your teams.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleGenerate} className="space-y-6">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company</label>
                  <div className="flex h-9 items-center rounded-md border border-input bg-muted/50 px-3 text-sm font-medium">
                    {companyName || "Current company"}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="qr-team" className="text-sm font-medium">
                    Team
                  </label>
                  <Select value={teamId} onValueChange={setTeamId}>
                    <SelectTrigger id="qr-team" className="h-10 w-full">
                      <SelectValue placeholder="Select a team" />
                    </SelectTrigger>
                    <SelectContent>
                      {teams.map((team) => (
                        <SelectItem key={team._id} value={team._id}>
                          {team.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {teams.length === 0 && (
                <p className="rounded-md border border-dashed border-border bg-muted/40 p-3 text-sm text-muted-foreground">
                  No teams are available yet. Ask an administrator to add a team
                  before generating access.
                </p>
              )}

              <div className="rounded-lg border border-border/70 bg-muted/30 p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 size-5 shrink-0 text-primary" />
                  <div>
                    <p className="text-sm font-medium">Secure temporary access</p>
                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                      Employees scan this QR code, open its link, and are signed in
                      to the selected team automatically. Each code expires after
                      five minutes.
                    </p>
                  </div>
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                disabled={!companyId || !teamId || isGenerating}
                className="w-full sm:w-auto"
              >
                {isGenerating ? (
                  <RefreshCw className="animate-spin" />
                ) : (
                  <QrCode />
                )}
                {isGenerating
                  ? "Generating access..."
                  : qrData
                    ? "Generate a new QR"
                    : "Generate access QR"}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="min-h-105">
          <CardHeader className="border-b border-border/70">
            <div className="flex items-center justify-between gap-3">
              <div>
                <CardTitle className="font-semibold">QR preview</CardTitle>
                <CardDescription>
                  Ready to display, download, or share.
                </CardDescription>
              </div>
              {qrData && <Badge variant="success">Active</Badge>}
            </div>
          </CardHeader>

          <CardContent className="flex flex-1 flex-col items-center justify-center">
            {qrData ? (
              <div className="w-full space-y-5 text-center">
                <div className="mx-auto w-fit rounded-xl border bg-white p-3 shadow-sm">
                  <Image
                    src={qrData.qrImage}
                    alt={`Access QR for ${qrData.team.name}`}
                    width={220}
                    height={220}
                    unoptimized
                  />
                </div>

                <div>
                  <p className="font-heading text-base font-semibold">
                    {qrData.team.name}
                  </p>
                  <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-muted-foreground">
                    <Clock3 className="size-3.5" />
                    Expires in {qrData.expiresIn}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Button type="button" variant="outline" onClick={handleDownload}>
                    <Download />
                    Download
                  </Button>
                  <Button type="button" variant="outline" onClick={handleCopyLink}>
                    {isCopied ? <Check /> : <Copy />}
                    {isCopied ? "Copied" : "Copy link"}
                  </Button>
                </div>
              </div>
            ) : (
              <div className="max-w-65 space-y-4 text-center">
                <div className="mx-auto flex size-24 items-center justify-center rounded-2xl border border-dashed border-primary/35 bg-primary/5">
                  <QrCode className="size-10 text-primary/60" />
                </div>
                <div>
                  <p className="font-heading text-base font-semibold">
                    No QR generated yet
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Select a team and generate a code to see its preview here.
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <DashboardFact
          icon={Users}
          value={String(teams.length)}
          label={teams.length === 1 ? "Available team" : "Available teams"}
        />
        <DashboardFact icon={Clock3} value="5 min" label="QR access lifetime" />
        <DashboardFact icon={ShieldCheck} value="Instant" label="Employee sign-in" />
      </div>
    </div>
  );
}

type DashboardFactProps = {
  icon: React.ComponentType<{ className?: string }>;
  value: string;
  label: string;
};

function DashboardFact({ icon: Icon, value, label }: DashboardFactProps) {
  return (
    <Card size="sm">
      <CardContent className="flex items-center gap-3">
        <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Icon className="size-5" />
        </div>
        <div>
          <p className="font-heading text-lg font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </CardContent>
    </Card>
  );
}
