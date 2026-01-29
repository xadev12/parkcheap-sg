# ParkCheap SG - Find Cheap Parking in Singapore

A mobile-first web app to search and compare carpark prices near your destination in Singapore.

## 🚀 Live Demo

**Production:** https://frontend-omega-steel.vercel.app

## Features

- 🔍 **Smart Search** - OneMap address autocomplete with Singapore addresses
- 📍 **Geolocation** - Use current location with one tap
- 💰 **Cost Comparison** - Carparks sorted by total cost (cheapest first)
- 🅿️ **Availability** - Real-time lot availability with visual indicators
- 🗺️ **Navigation** - Deep links to Waze and Google Maps
- 📱 **Mobile-First** - iOS safe areas, touch-optimized, PWA-ready
- ⚡ **Fast** - Skeleton loading, cached results, optimistic UI
- ♿ **Accessible** - WCAG AA compliant, proper ARIA labels

## Tech Stack

- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS 4
- **APIs:** OneMap Singapore (geocoding), Backend API (carpark data)
- **Deployment:** Vercel

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BACKEND_API_URL` | Backend API base URL | Mock data |
| `NEXT_PUBLIC_API_URL` | Client-side API URL | `` (same origin) |

## Project Structure

```
src/
├── app/
│   ├── api/carparks/search/route.ts  # API route (proxy + mock)
│   ├── globals.css                    # Global styles + safe areas
│   ├── layout.tsx                     # Root layout + metadata
│   └── page.tsx                       # Main search page
├── components/
│   ├── SearchForm.tsx                 # Location input + duration + search
│   ├── CarparkCard.tsx                # Result card with pricing
│   ├── NavigationButtons.tsx          # Waze + Google Maps deep links
│   ├── SkeletonCard.tsx               # Loading skeleton
│   └── EmptyState.tsx                 # Idle/empty/error states
├── hooks/
│   ├── useGeolocation.ts              # Browser geolocation
│   └── useSearch.ts                   # Search state + caching
├── lib/
│   ├── api.ts                         # API client + OneMap geocoding
│   └── navigation.ts                  # Deep link helpers
└── types/
    └── carpark.ts                     # TypeScript interfaces
```

## API Contract

### Search Carparks
```
GET /api/carparks/search?lat=1.304&lng=103.832&duration=3&radius=1000
```

Response:
```json
{
  "results": [
    {
      "id": "HDB-OR1",
      "name": "Orchard Central",
      "type": "HDB",
      "address": "181 Orchard Rd",
      "latitude": 1.3006,
      "longitude": 103.8393,
      "distance_m": 250,
      "walk_time_min": 3,
      "total_cost": 3.60,
      "rate_per_hour": 1.20,
      "available_lots": 45,
      "total_lots": 200,
      "updated_at": "2024-01-30T00:00:00Z"
    }
  ]
}
```
