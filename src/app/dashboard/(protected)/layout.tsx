import { redirect } from "next/navigation";
import { getCurrentLeague } from "@/lib/auth";
import { DashboardChrome } from "@/components/dashboard/DashboardChrome";

export default async function ProtectedDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const league = await getCurrentLeague();
  if (!league) redirect("/dashboard/login");

  return (
    <DashboardChrome leagueName={league.leagueName} inviteSlug={league.inviteSlug}>
      {children}
    </DashboardChrome>
  );
}
