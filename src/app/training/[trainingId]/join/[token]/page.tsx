/* eslint-disable @typescript-eslint/no-explicit-any */
import Image from "next/image";
import { JoinTrainingForm } from "@/components/training/JoinTrainingForm";
import type { TParams, TSearchParams } from "@/lib/types/global.type";

export default async function TrainingTokenJoinPage({
  params,
  searchParams,
}: {
  params: TParams<{ trainingId: string; token: string }>;
  searchParams: TSearchParams;
}) {
  const { trainingId, token } = await params;
  const resolvedSearchParams = await searchParams;
  const authType = (resolvedSearchParams.authType as string) || "guest";

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-sm flex-col items-center justify-center px-6">
      <div className="mb-10 flex items-center gap-3">
        <Image src="/acme-logo.svg" alt="Act Inc" width={36} height={36} priority />
        <span className="font-heading text-2xl font-bold">Act Inc</span>
      </div>
      <JoinTrainingForm trainingId={trainingId} authType={authType as any} inviteToken={token} />
    </main>
  );
}
