import Link from "next/link";

export function AuthPageLinks({ showUserLogin = false }: { showUserLogin?: boolean }) {
  return (
    <div className="flex items-center justify-center gap-4 pt-6 text-center">
      <Link
        href="/auth/register"
        className="text-xs font-semibold text-primary hover:underline"
      >
        Create account
      </Link>
      <Link
        href={showUserLogin ? "/auth/login" : "/auth/admin-login"}
        className="text-xs font-semibold text-primary hover:underline"
      >
        {showUserLogin ? "User login" : "Admin login"}
      </Link>
    </div>
  );
}
