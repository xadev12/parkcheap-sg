'use client';

import { useState, useCallback, useRef } from 'react';
import { SearchState, SearchParams } from '@/types/carpark';
import { searchCarparks } from '@/lib/api';

const CACHE_KEY = 'parking-search-cache';
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CacheEntry {
  key: string;
  results: SearchState['results'];
  timestamp: number;
}

function getCached(key: string): SearchState['results'] | null {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const entry: CacheEntry = JSON.parse(raw);
    if (entry.key === key && Date.now() - entry.timestamp < CACHE_TTL) {
      return entry.results;
    }
  } catch { /* ignore */ }
  return null;
}

function setCache(key: string, results: SearchState['results']) {
  try {
    const entry: CacheEntry = { key, results, timestamp: Date.now() };
    localStorage.setItem(CACHE_KEY, JSON.stringify(entry));
  } catch { /* ignore */ }
}

export function useSearch() {
  const [state, setState] = useState<SearchState>({ status: 'idle', results: [] });
  const abortRef = useRef<AbortController | null>(null);

  const search = useCallback(async (params: SearchParams) => {
    // Abort previous request
    abortRef.current?.abort();
    abortRef.current = new AbortController();

    const cacheKey = `${params.lat},${params.lng},${params.duration},${params.radius}`;

    // Check cache
    const cached = getCached(cacheKey);
    if (cached) {
      setState({
        status: cached.length > 0 ? 'success' : 'empty',
        results: cached,
      });
      return;
    }

    setState({ status: 'loading', results: [] });

    try {
      const results = await searchCarparks(params);
      setCache(cacheKey, results);

      setState({
        status: results.length > 0 ? 'success' : 'empty',
        results,
      });
    } catch (err) {
      // Don't update state if aborted
      if (err instanceof DOMException && err.name === 'AbortError') return;

      setState({
        status: 'error',
        results: [],
        error: err instanceof Error ? err.message : 'Something went wrong. Please try again.',
      });
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', results: [] });
  }, []);

  return { ...state, search, reset };
}
