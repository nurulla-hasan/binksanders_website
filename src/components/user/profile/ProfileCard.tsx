import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import type { CurrentUser } from "@/lib/types/user.type";
import { getInitials } from "@/lib/utils";

export function ProfileCard({
  user,
  isLoading,
}: {
  user: CurrentUser | null;
  isLoading: boolean;
}) {
  if (isLoading) return <ProfileCardSkeleton />;

  const displayName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").trim() ||
    user?.fullName ||
    "User";

  return (
    <div className="mb-8 rounded-sm bg-secondary/90 p-5 shadow-sm">
      <div className="mb-4 flex gap-4">
        <Avatar className="mt-1 size-14">
          {user?.image && <AvatarImage src={user.image} alt={displayName} />}
          <AvatarFallback>{getInitials(displayName)}</AvatarFallback>
        </Avatar>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-[17px] font-bold leading-tight">
            {displayName}
          </h2>
          <p className="mt-1 truncate text-[11px] font-medium text-foreground/80">
            {user?.email || "Email not available"}
          </p>
          <p className="mt-1 text-[10px] capitalize tracking-wide text-foreground/60">
            {user?.authType ? `${user.authType} account` : "Learning program"}
          </p>
        </div>
      </div>

      <div className="rounded-sm border border-border/50 bg-background/40 p-3 shadow-sm">
        <div className="mb-2 flex items-center justify-between">
          <span className="text-[11px] font-medium">Program progress</span>
          <span className="text-[9px] font-bold text-foreground/80">1/8</span>
        </div>
        <Progress value={12.5} className="h-1.5 bg-background/60" />
      </div>
    </div>
  );
}

function ProfileCardSkeleton() {
  return (
    <div className="mb-8 rounded-sm bg-secondary/90 p-5 shadow-sm">
      <div className="mb-4 flex items-center gap-4">
        <Skeleton className="size-14 shrink-0 rounded-full bg-background/55" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-32 bg-background/55" />
          <Skeleton className="h-3 w-48 max-w-full bg-background/45" />
          <Skeleton className="h-2.5 w-24 bg-background/40" />
        </div>
      </div>
      <div className="space-y-3 rounded-sm border border-border/50 bg-background/40 p-3">
        <div className="flex justify-between gap-4">
          <Skeleton className="h-3 w-24 bg-background/60" />
          <Skeleton className="h-3 w-8 bg-background/60" />
        </div>
        <Skeleton className="h-1.5 w-full bg-background/60" />
      </div>
    </div>
  );
}
