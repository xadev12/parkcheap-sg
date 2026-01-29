export interface Carpark {
  id: string;
  name: string;
  type: 'HDB' | 'LTA' | 'URA' | 'Private';
  address: string;
  latitude: number;
  longitude: number;
  distance_m: number;
  walk_time_min: number;
  total_cost: number;
  rate_per_hour: number;
  available_lots: number;
  total_lots: number;
  updated_at: string;
}

export interface SearchParams {
  lat: number;
  lng: number;
  duration: number;
  radius: number;
}

export interface SearchState {
  status: 'idle' | 'loading' | 'success' | 'error' | 'empty';
  results: Carpark[];
  error?: string;
}

export interface LocationState {
  status: 'idle' | 'loading' | 'success' | 'error';
  lat?: number;
  lng?: number;
  address?: string;
  error?: string;
}
