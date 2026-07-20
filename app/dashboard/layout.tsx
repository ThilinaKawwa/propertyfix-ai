import { redirect } from "next/navigation";
import { ensureAgency } from "@/lib/actions/agency";
import { getSessionContext } from "@/lib/db/queries";
import { DesktopSidebar, MobileTopbar } from "@/components/app/app-nav";
import { Toaster } from "@/components/ui/sonner";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await ensureAgency();
  const { user, agency } = await getSessionContext();
  if (!user) redirect("/login");

  const agencyName = agency?.name ?? "My Agency";

  return (
    <div className="flex min-h-screen">
      <DesktopSidebar agencyName={agencyName} userEmail={user.email ?? ""} />
      <div className="flex min-w-0 flex-1 flex-col">
        <MobileTopbar agencyName={agencyName} />
        <main className="flex-1 px-5 py-8 sm:px-8">{children}</main>
      </div>
      <Toaster position="top-center" richColors />
    </div>
  );
}
