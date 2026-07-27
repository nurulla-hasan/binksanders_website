import Image from "next/image";
import { JoinTrainingForm } from "@/components/training/JoinTrainingForm";
import type { TParams } from "@/lib/types/global.type";

export default async function TrainingTokenJoinPage({
  params,
}: {
  params: TParams<{ trainingId: string; token: string }>;
}) {
  const { trainingId, token } = await params;

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-sm flex-col items-center justify-center px-6">
      <div className="mb-10 flex items-center gap-3">
        <Image src="/acme-logo.svg" alt="Act Inc" width={36} height={36} priority />
        <span className="font-heading text-2xl font-bold">Act Inc</span>
      </div>
      <JoinTrainingForm trainingId={trainingId} authType="guest" inviteToken={token} />
    </main>
  );
}
