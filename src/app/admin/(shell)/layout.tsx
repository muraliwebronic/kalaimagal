import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { isAdminRole } from "@/lib/admin/auth";
import { getAdminLang } from "@/lib/admin/lang";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopBar } from "@/components/admin/AdminTopBar";

export const metadata = {
  title: "Admin · Kalaimagal",
  robots: { index: false, follow: false },
};

export default async function AdminShellLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");
  if (!isAdminRole(user.role)) redirect("/");

  const lang = await getAdminLang();

  return (
    <div className="flex min-h-screen">
      <AdminSidebar lang={lang} />
      <div className="flex flex-1 flex-col">
        <AdminTopBar lang={lang} userName={user.name} userEmail={user.email} />
        <main className="flex-1 bg-background">{children}</main>
      </div>
    </div>
  );
}
