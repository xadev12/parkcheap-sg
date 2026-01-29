import { Carpark, SearchParams } from '@/types/carpark';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

export async function searchCarparks(params: SearchParams): Promise<Carpark[]> {
  const url = new URL(`${API_BASE}/api/carparks/search`, window.location.origin);
  url.searchParams.set('lat', params.lat.toString());
  url.searchParams.set('lng', params.lng.toString());
  url.searchParams.set('duration', params.duration.toString());
  url.searchParams.set('radius', params.radius.toString());

  const res = await fetch(url.toString());

  if (!res.ok) {
    if (res.status === 404) {
      return [];
    }
    throw new Error(`Search failed: ${res.statusText}`);
  }

  const data = await res.json();
  return data.results || data;
}

export async function geocodeAddress(query: string): Promise<{ lat: number; lng: number; address: string } | null> {
  try {
    const res = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );
    const data = await res.json();

    if (data.found > 0) {
      const result = data.results[0];
      return {
        lat: parseFloat(result.LATITUDE),
        lng: parseFloat(result.LONGITUDE),
        address: result.ADDRESS,
      };
    }
    return null;
  } catch {
    return null;
  }
}

export async function searchAddresses(query: string): Promise<Array<{ address: string; lat: number; lng: number }>> {
  if (query.length < 3) return [];

  try {
    const res = await fetch(
      `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(query)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`
    );
    const data = await res.json();

    if (data.found > 0) {
      return data.results.slice(0, 5).map((r: Record<string, string>) => ({
        address: r.ADDRESS,
        lat: parseFloat(r.LATITUDE),
        lng: parseFloat(r.LONGITUDE),
      }));
    }
    return [];
  } catch {
    return [];
  }
}
