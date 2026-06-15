import LeadsTable from "@/components/admin/LeadsTable";
import { getLeads } from "@/lib/queries/leads";
import type { LeadStatus } from "@/types";
import adminStyles from "@/components/admin/admin.module.css";

interface PageProps {
  searchParams: Promise<{ status?: string }>;
}

export default async function AdminLeadsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const status = params.status as LeadStatus | undefined;
  const leads = await getLeads(status ? { status } : {});

  const rows = leads.map((l) => ({
    ...l,
    createdAt: l.createdAt.toISOString(),
  }));

  return (
    <>
      <h1 className={adminStyles.pageTitle}>Leadler</h1>
      <p className={adminStyles.pageDesc}>{leads.length} kayıt</p>
      <LeadsTable leads={rows} currentStatus={params.status} />
    </>
  );
}
