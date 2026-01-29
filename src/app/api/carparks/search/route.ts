import { NextRequest, NextResponse } from 'next/server';

// Mock data for development - will be replaced by real backend
const MOCK_CARPARKS = [
  {
    id: 'HDB-OR1',
    name: 'Orchard Central',
    type: 'HDB',
    address: '181 Orchard Rd, Singapore 238896',
    latitude: 1.3006,
    longitude: 103.8393,
    distance_m: 250,
    walk_time_min: 3,
    total_cost: 3.60,
    rate_per_hour: 1.20,
    available_lots: 45,
    total_lots: 200,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'URA-OR2',
    name: 'Dhoby Ghaut MRT',
    type: 'URA',
    address: '11 Penang Rd, Singapore 238485',
    latitude: 1.2988,
    longitude: 103.8456,
    distance_m: 480,
    walk_time_min: 6,
    total_cost: 4.50,
    rate_per_hour: 1.50,
    available_lots: 120,
    total_lots: 350,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'LTA-OR3',
    name: 'Plaza Singapura',
    type: 'LTA',
    address: '68 Orchard Rd, Singapore 238839',
    latitude: 1.3008,
    longitude: 103.8451,
    distance_m: 550,
    walk_time_min: 7,
    total_cost: 5.10,
    rate_per_hour: 1.70,
    available_lots: 85,
    total_lots: 500,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'PVT-OR4',
    name: 'The Centrepoint',
    type: 'Private',
    address: '176 Orchard Rd, Singapore 238843',
    latitude: 1.3016,
    longitude: 103.8398,
    distance_m: 320,
    walk_time_min: 4,
    total_cost: 6.00,
    rate_per_hour: 2.00,
    available_lots: 12,
    total_lots: 180,
    updated_at: new Date().toISOString(),
  },
  {
    id: 'HDB-OR5',
    name: 'Cuppage Terrace',
    type: 'HDB',
    address: '55 Cuppage Rd, Singapore 229469',
    latitude: 1.3021,
    longitude: 103.8370,
    distance_m: 780,
    walk_time_min: 10,
    total_cost: 2.40,
    rate_per_hour: 0.80,
    available_lots: 0,
    total_lots: 90,
    updated_at: new Date().toISOString(),
  },
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lng = searchParams.get('lng');
  const duration = searchParams.get('duration') || '3';
  const radius = searchParams.get('radius') || '1000';

  if (!lat || !lng) {
    return NextResponse.json(
      { error: 'Missing lat/lng parameters' },
      { status: 400 }
    );
  }

  // Try real backend first
  const backendUrl = process.env.BACKEND_API_URL;
  if (backendUrl) {
    try {
      const url = `${backendUrl}/api/carparks/search?lat=${lat}&lng=${lng}&duration=${duration}&radius=${radius}`;
      const res = await fetch(url, { next: { revalidate: 60 } });
      if (res.ok) {
        const data = await res.json();
        return NextResponse.json(data);
      }
    } catch (err) {
      console.error('Backend API error, falling back to mock:', err);
    }
  }

  // Fallback to mock data
  const durationNum = parseFloat(duration);
  const results = MOCK_CARPARKS
    .map((cp) => ({
      ...cp,
      total_cost: parseFloat((cp.rate_per_hour * durationNum).toFixed(2)),
    }))
    .filter((cp) => cp.distance_m <= parseFloat(radius))
    .sort((a, b) => a.total_cost - b.total_cost);

  // Simulate network delay
  await new Promise((r) => setTimeout(r, 400));

  return NextResponse.json({ results });
}
