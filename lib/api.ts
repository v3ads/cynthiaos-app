/**
 * CynthiaOS API Client
 * Wraps all calls to the cynthiaos-api service.
 *
 * Fix log (data-flow trace):
 *  1. Backend returns flat { success, total, limit, offset, data } — not { data, pagination }.
 *     Added adaptResponse() to normalise the shape for all consumers.
 *  2. /expiring endpoint did not exist — corrected to /expiring-soon.
 *  3. Backend uses offset/limit pagination — converted page → offset in query params.
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

/** Raw shape returned by cynthiaos-api */
interface RawApiResponse {
  success: boolean;
  total: number;
  limit: number;
  offset: number;
  data: LeaseRecord[];
}

/**
 * Normalise the flat backend response into the { data, pagination } shape
 * expected by all frontend components.
 */
function adaptResponse(raw: RawApiResponse, page: number): LeaseListResponse {
  const limit = raw.limit ?? 20;
  const total = raw.total ?? 0;
  const total_pages = Math.max(1, Math.ceil(total / limit));
  return {
    data: raw.data ?? [],
    pagination: {
      page,
      limit,
      total,
      total_pages,
      has_prev: page > 1,
      has_next: page < total_pages,
    },
  };
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
  const offset = (page - 1) * limit;
  const raw = await fetchApi<RawApiResponse>("/api/v1/leases/expirations", { limit, offset });
  return adaptResponse(raw, page);
}

export async function getUpcomingRenewals(page = 1, limit = 20): Promise<LeaseListResponse> {
  const offset = (page - 1) * limit;
  const raw = await fetchApi<RawApiResponse>("/api/v1/leases/upcoming-renewals", { limit, offset });
  return adaptResponse(raw, page);
}

export async function getExpiringLeases(page = 1, limit = 20): Promise<LeaseListResponse> {
  const offset = (page - 1) * limit;
  // Endpoint is /expiring-soon (not /expiring)
  const raw = await fetchApi<RawApiResponse>("/api/v1/leases/expiring-soon", { limit, offset });
  return adaptResponse(raw, page);
}
