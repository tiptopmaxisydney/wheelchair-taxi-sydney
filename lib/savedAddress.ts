// Local-first address cache on the shared tipopride-backend (see saved-address module
// there) — search our own previously-selected addresses before falling back to Google
// Places, and cache whatever a visitor picks from Google so it's local next time.
// A no-op when NEXT_PUBLIC_API_ROOT isn't set: the booking form still works, it just
// always falls back to Google directly (same as before this existed).

const API_ROOT = process.env.NEXT_PUBLIC_API_ROOT || "";

async function get(path: string) {
  if (!API_ROOT) return { data: [] };
  const res = await fetch(`${API_ROOT}${path}`);
  if (!res.ok) throw new Error(`saved-address request failed: ${res.status}`);
  return res.json();
}

async function post(path: string, body: unknown) {
  if (!API_ROOT) return null;
  const res = await fetch(`${API_ROOT}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`saved-address request failed: ${res.status}`);
  return res.json();
}

async function patch(path: string, body: unknown) {
  if (!API_ROOT) return null;
  const res = await fetch(`${API_ROOT}${path}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`saved-address request failed: ${res.status}`);
  return res.json();
}

export interface SavedAddressItem {
  _id: string;
  display_name: string;
  latitude: number;
  longitude: number;
}

export const savedAddress = {
  search: (q: string): Promise<{ data: SavedAddressItem[] }> =>
    get(`saved-address/search/web?q=${encodeURIComponent(q)}`),
  resolve: (info: {
    place_id?: string;
    formatted_address: string;
    latitude: number;
    longitude: number;
    name?: string;
  }) => post(`saved-address/resolve/web`, info),
  markUsed: (id: string) => patch(`saved-address/${id}/use`, {}),
};
