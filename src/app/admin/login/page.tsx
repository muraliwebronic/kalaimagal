import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/auth";
import { AdminLoginForm } from "./AdminLoginForm";

export const metadata = {
  title: "Admin sign in · Kalaimagal",
  robots: { index: false, follow: false },
};

export default async function AdminLoginPage() {
  // If an admin is already signed in, send them straight to /admin
  const user = await getCurrentUser();
  if (user && isAdminRole(user.role)) {
    redirect("/admin");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="border-b border-border/60">
        <div className="container mx-auto flex h-14 items-center px-4 md:px-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
            ← Kalaimagal
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="font-heading text-2xl tracking-tight">Admin sign in</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Authorized personnel only
            </p>
          </div>
          <AdminLoginForm signedInButNotAdmin={!!user && !isAdminRole(user.role)} />
        </div>
      </main>
    </div>
  );
}
