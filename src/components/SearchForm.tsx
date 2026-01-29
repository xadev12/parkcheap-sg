'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { LocationState } from '@/types/carpark';
import { searchAddresses } from '@/lib/api';

const DURATION_OPTIONS = [
  { value: 0.5, label: '30 min' },
  { value: 1, label: '1 hour' },
  { value: 2, label: '2 hours' },
  { value: 3, label: '3 hours' },
  { value: 4, label: '4 hours' },
  { value: 6, label: '6 hours' },
  { value: 12, label: '12 hours' },
];

interface SearchFormProps {
  location: LocationState;
  onGetLocation: () => void;
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onSearch: (duration: number) => void;
  isSearching: boolean;
}

export default function SearchForm({
  location,
  onGetLocation,
  onLocationSelect,
  onSearch,
  isSearching,
}: SearchFormProps) {
  const [query, setQuery] = useState('');
  const [duration, setDuration] = useState(3);
  const [suggestions, setSuggestions] = useState<Array<{ address: string; lat: number; lng: number }>>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const formRef = useRef<HTMLFormElement>(null);

  // Update query when location changes (e.g., from geolocation)
  useEffect(() => {
    if (location.status === 'success' && location.address) {
      setQuery(location.address);
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [location]);

  const handleQueryChange = useCallback((value: string) => {
    setQuery(value);

    if (debounceRef.current) clearTimeout(debounceRef.current);

    if (value.length >= 3) {
      debounceRef.current = setTimeout(async () => {
        const results = await searchAddresses(value);
        setSuggestions(results);
        setShowSuggestions(results.length > 0);
      }, 300);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, []);

  const handleSuggestionSelect = (suggestion: { address: string; lat: number; lng: number }) => {
    setQuery(suggestion.address);
    setSuggestions([]);
    setShowSuggestions(false);
    onLocationSelect(suggestion.lat, suggestion.lng, suggestion.address);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.status === 'success' && location.lat && location.lng) {
      onSearch(duration);
    }
  };

  const canSearch = location.status === 'success' && location.lat !== undefined && location.lng !== undefined;

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
      {/* Location Input */}
      <div className="relative">
        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1.5">
          Where are you heading?
        </label>
        <div className="relative">
          <input
            id="location"
            type="text"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            placeholder="Enter destination address"
            className="w-full px-4 py-3.5 pr-12 rounded-xl border border-gray-200 bg-white text-gray-900 
                       placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 
                       focus:border-emerald-500 text-base transition-all"
            autoComplete="off"
          />
          <button
            type="button"
            onClick={onGetLocation}
            disabled={location.status === 'loading'}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-lg text-emerald-600 
                       hover:bg-emerald-50 active:bg-emerald-100 transition-colors touch-manipulation"
            aria-label="Use current location"
            title="Use current location"
          >
            {location.status === 'loading' ? (
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            )}
          </button>
        </div>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div className="absolute z-20 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
            {suggestions.map((s, i) => (
              <button
                key={i}
                type="button"
                onMouseDown={() => handleSuggestionSelect(s)}
                className="w-full px-4 py-3 text-left text-sm text-gray-700 hover:bg-gray-50 
                           active:bg-gray-100 border-b border-gray-50 last:border-0 transition-colors"
              >
                {s.address}
              </button>
            ))}
          </div>
        )}

        {/* Location error */}
        {location.status === 'error' && (
          <p className="mt-1.5 text-sm text-red-500">{location.error}</p>
        )}
      </div>

      {/* Duration Selector */}
      <div>
        <label htmlFor="duration" className="block text-sm font-medium text-gray-700 mb-1.5">
          How long do you need?
        </label>
        <select
          id="duration"
          value={duration}
          onChange={(e) => setDuration(Number(e.target.value))}
          className="w-full px-4 py-3.5 rounded-xl border border-gray-200 bg-white text-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500 
                     text-base appearance-none transition-all
                     bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%2224%22%20height%3D%2224%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236b7280%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22M6%209l6%206%206-6%22%2F%3E%3C%2Fsvg%3E')]
                     bg-[length:24px] bg-[position:right_12px_center] bg-no-repeat"
        >
          {DURATION_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Search Button */}
      <button
        type="submit"
        disabled={!canSearch || isSearching}
        className="w-full py-4 px-6 rounded-xl font-semibold text-base text-white
                   bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800
                   disabled:bg-gray-300 disabled:cursor-not-allowed
                   transition-all duration-150 ease-out
                   shadow-sm hover:shadow-md active:shadow-sm
                   touch-manipulation select-none
                   flex items-center justify-center gap-2
                   min-h-[52px]"
      >
        {isSearching ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            Searching...
          </>
        ) : (
          <>
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
            </svg>
            Find Cheap Parking
          </>
        )}
      </button>
    </form>
  );
}
