import { getUpcomingRenewals } from "@/lib/api";
import LeaseTable from "@/components/LeaseTable";

export const revalidate = 30;

interface Props {
  searchParams: { page?: string };
}

export default async function UpcomingRenewalsPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  let result;
  let error: string | null = null;

  try {
    result = await getUpcomingRenewals(page, 20);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load data";
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Upcoming Renewals</h1>
        <p className="page-subtitle">
          Leases with <strong>lease_end_date</strong> within the next <strong>90 days</strong>.
        </p>
      </div>

      {error ? (
        <div className="error-box">⚠ {error}</div>
      ) : result ? (
        <LeaseTable data={result.data} pagination={result.pagination} baseHref="/leases/upcoming-renewals" />
      ) : (
        <div className="state-box">
          <span className="state-icon">⟳</span>
          <span className="state-msg">Loading…</span>
        </div>
      )}
    </>
  );
}
