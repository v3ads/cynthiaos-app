import { getLeaseExpirations } from "@/lib/api";
import LeaseTable from "@/components/LeaseTable";

export const revalidate = 30;

interface Props {
  searchParams: { page?: string };
}

export default async function AllExpirationsPage({ searchParams }: Props) {
  const page = Math.max(1, parseInt(searchParams.page ?? "1", 10) || 1);
  let result;
  let error: string | null = null;

  try {
    result = await getLeaseExpirations(page, 20);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load data";
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">All Lease Expirations</h1>
        <p className="page-subtitle">
          Complete list of all leases from the Gold layer, ordered by days until expiration.
        </p>
      </div>

      {error ? (
        <div className="error-box">⚠ {error}</div>
      ) : result ? (
        <LeaseTable data={result.data} pagination={result.pagination} baseHref="/leases/expirations" />
      ) : (
        <div className="state-box">
          <span className="state-icon">⟳</span>
          <span className="state-msg">Loading…</span>
        </div>
      )}
    </>
  );
}
