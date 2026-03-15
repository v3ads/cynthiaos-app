import type { LeaseRecord, Pagination } from "@/lib/api";
import Link from "next/link";

function daysBadge(days: number | null) {
  if (days === null) return <span className="badge badge-neutral">—</span>;
  if (days <= 30)  return <span className="badge badge-danger">{days}d</span>;
  if (days <= 90)  return <span className="badge badge-warning">{days}d</span>;
  return <span className="badge badge-success">{days}d</span>;
}

function formatDate(d: string | null) {
  if (!d) return "—";
  return new Date(d).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

interface Props {
  data: LeaseRecord[];
  pagination: Pagination;
  baseHref: string;
}

export default function LeaseTable({ data, pagination, baseHref }: Props) {
  const { page, limit, total, total_pages, has_prev, has_next } = pagination;

  if (data.length === 0) {
    return (
      <div className="state-box">
        <span className="state-icon">✓</span>
        <span className="state-msg">No records found.</span>
      </div>
    );
  }

  return (
    <div className="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>Tenant</th>
            <th>Unit</th>
            <th>Lease End</th>
            <th>Days Until Expiration</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={row.id}>
              <td>{row.tenant_id}</td>
              <td>{row.unit_id}</td>
              <td>{formatDate(row.lease_end_date)}</td>
              <td>{daysBadge(row.days_until_expiration)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <span className="pagination-info">
          Showing {(page - 1) * limit + 1}–{Math.min(page * limit, total)} of {total}
        </span>
        <div className="pagination-actions">
          {has_prev ? (
            <Link href={`${baseHref}?page=${page - 1}`} className="btn">← Prev</Link>
          ) : (
            <span className="btn" aria-disabled="true">← Prev</span>
          )}
          {has_next ? (
            <Link href={`${baseHref}?page=${page + 1}`} className="btn">Next →</Link>
          ) : (
            <span className="btn" aria-disabled="true">Next →</span>
          )}
        </div>
      </div>
    </div>
  );
}
