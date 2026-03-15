/**
 * CynthiaOS API Client
 * Wraps all calls to the cynthiaos-api service.
 */

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "https://cynthiaos-api-production.up.railway.app";

export interface LeaseRecord {
  id: string;
  bronze_report_id: string | null;
  tenant_id: string;
  unit_id: string;
  lease_start_date: string | null;
  lease_end_date: string | null;
  days_until_expiration: number | null;
  created_at: string;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  total_pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface LeaseListResponse {
  data: LeaseRecord[];
  pagination: Pagination;
}

export interface HealthResponse {
  service: string;
  status: string;
  version: string;
  timestamp: string;
  db: { connected: boolean; verified_at: string | null };
}

async function fetchApi<T>(path: string, params?: Record<string, string | number>): Promise<T> {
  const url = new URL(`${API_BASE}${path}`);
  if (params) {
    Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, String(v)));
  }
  const res = await fetch(url.toString(), {
    next: { revalidate: 30 }, // ISR: revalidate every 30 seconds
  });
  if (!res.ok) {
    throw new Error(`API error ${res.status} on ${path}`);
  }
  return res.json() as Promise<T>;
}

export async function getHealth(): Promise<HealthResponse> {
  return fetchApi<HealthResponse>("/health");
}

export async function getLeaseExpirations(page = 1, limit = 20): Promise<LeaseListResponse> {
  return fetchApi<LeaseListResponse>("/api/v1/leases/expirations", { page, limit });
}

export async function getUpcomingRenewals(page = 1, limit = 20): Promise<LeaseListResponse> {
  return fetchApi<LeaseListResponse>("/api/v1/leases/upcoming-renewals", { page, limit });
}

export async function getExpiringLeases(page = 1, limit = 20): Promise<LeaseListResponse> {
  return fetchApi<LeaseListResponse>("/api/v1/leases/expiring", { page, limit });
}
