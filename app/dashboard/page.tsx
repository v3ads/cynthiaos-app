import {
  getLeaseExpirations,
  getExpiringLeases,
  getUpcomingRenewals,
} from "@/lib/api";
import LeaseTable from "@/components/LeaseTable";
import Link from "next/link";

export const revalidate = 30;

export default async function DashboardPage() {
  let allData, expiringData, renewalData;
  let error: string | null = null;

  try {
    [allData, expiringData, renewalData] = await Promise.all([
      getLeaseExpirations(1, 5),
      getExpiringLeases(1, 1),
      getUpcomingRenewals(1, 1),
    ]);
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load data";
  }

  return (
    <>
      <div className="page-header">
        <h1 className="page-title">Dashboard</h1>
        <p className="page-subtitle">Overview of all lease activity across the portfolio.</p>
      </div>

      {error ? (
        <div className="error-box">⚠ {error}</div>
      ) : (
        <>
          <div className="stat-grid">
            <div className="stat-card">
              <div className="stat-label">Total Leases</div>
              <div className="stat-value">{allData?.pagination.total ?? "—"}</div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Expiring in 30d</div>
              <div className={`stat-value ${(expiringData?.pagination.total ?? 0) > 0 ? "danger" : "success"}`}>
                {expiringData?.pagination.total ?? "—"}
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-label">Renewals in 90d</div>
              <div className={`stat-value ${(renewalData?.pagination.total ?? 0) > 0 ? "warning" : "success"}`}>
                {renewalData?.pagination.total ?? "—"}
              </div>
            </div>
          </div>

          <div className="table-wrapper" style={{ marginBottom: "1rem" }}>
            <div className="table-title">
              Recent Expirations (preview)
              {allData && allData.pagination.total > 5 && (
                <Link href="/leases/expirations" className="btn" style={{ marginLeft: "1rem", fontSize: "0.75rem" }}>
                  View All {allData.pagination.total} →
                </Link>
              )}
            </div>
          </div>
          {allData && (
            <LeaseTable
              data={allData.data}
              pagination={allData.pagination}
              baseHref="/leases/expirations"
              showPagination={false}
            />
          )}
        </>
      )}
    </>
  );
}
