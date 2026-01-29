'use client';

import { useCallback, useRef, useState } from 'react';
import SearchForm from '@/components/SearchForm';
import CarparkCard from '@/components/CarparkCard';
import SkeletonCard from '@/components/SkeletonCard';
import EmptyState from '@/components/EmptyState';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useSearch } from '@/hooks/useSearch';

export default function Home() {
  const { location, getCurrentLocation, setLocation } = useGeolocation();
  const { status, results, error, search, reset } = useSearch();
  const [currentDuration, setCurrentDuration] = useState(3);
  const resultsRef = useRef<HTMLDivElement>(null);

  const handleLocationSelect = useCallback(
    (lat: number, lng: number, address: string) => {
      setLocation({
        status: 'success',
        lat,
        lng,
        address,
      });
      reset();
    },
    [setLocation, reset]
  );

  const handleSearch = useCallback(
    async (duration: number) => {
      if (location.lat === undefined || location.lng === undefined) return;

      setCurrentDuration(duration);
      await search({
        lat: location.lat,
        lng: location.lng,
        duration,
        radius: 1000,
      });

      // Scroll to results
      setTimeout(() => {
        resultsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    },
    [location.lat, location.lng, search]
  );

  const handleRetry = useCallback(() => {
    if (location.lat !== undefined && location.lng !== undefined) {
      search({
        lat: location.lat,
        lng: location.lng,
        duration: currentDuration,
        radius: 1000,
      });
    }
  }, [location.lat, location.lng, currentDuration, search]);

  return (
    <div className="min-h-screen pb-safe">
      {/* Header */}
      <header className="bg-emerald-600 pt-safe">
        <div className="max-w-lg mx-auto px-4 py-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0H21M3.375 14.25h17.25" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">ParkCheap SG</h1>
              <p className="text-xs text-emerald-100">Find the cheapest parking</p>
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <main className="max-w-lg mx-auto px-4 -mt-2 relative z-10">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4 mb-6">
          <SearchForm
            location={location}
            onGetLocation={getCurrentLocation}
            onLocationSelect={handleLocationSelect}
            onSearch={handleSearch}
            isSearching={status === 'loading'}
          />
        </div>

        {/* Results Section */}
        <div ref={resultsRef}>
          {status === 'loading' && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-emerald-600 border-t-transparent" />
                <span className="text-sm text-gray-500">Finding cheapest carparks...</span>
              </div>
              {[1, 2, 3].map((i) => (
                <SkeletonCard key={i} />
              ))}
            </div>
          )}

          {status === 'success' && results.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-gray-700">
                  {results.length} carpark{results.length !== 1 ? 's' : ''} found
                </h2>
                <span className="text-xs text-gray-400">Sorted by price</span>
              </div>
              <div className="space-y-3 pb-8">
                {results.map((carpark, index) => (
                  <CarparkCard
                    key={carpark.id}
                    carpark={carpark}
                    duration={currentDuration}
                    rank={index + 1}
                  />
                ))}
              </div>
            </div>
          )}

          {status === 'empty' && <EmptyState type="empty" />}
          {status === 'error' && <EmptyState type="error" message={error} onRetry={handleRetry} />}
          {status === 'idle' && <EmptyState type="idle" />}
        </div>
      </main>
    </div>
  );
}
