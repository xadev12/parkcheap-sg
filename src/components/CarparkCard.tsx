'use client';

import { Carpark } from '@/types/carpark';
import NavigationButtons from './NavigationButtons';

interface CarparkCardProps {
  carpark: Carpark;
  duration: number;
  rank: number;
}

function getAvailabilityColor(available: number, total: number): string {
  if (total === 0) return 'text-gray-400';
  const ratio = available / total;
  if (ratio > 0.3) return 'text-emerald-600';
  if (ratio > 0.1) return 'text-amber-500';
  return 'text-red-500';
}

function getAvailabilityBg(available: number, total: number): string {
  if (total === 0) return 'bg-gray-100';
  const ratio = available / total;
  if (ratio > 0.3) return 'bg-emerald-50';
  if (ratio > 0.1) return 'bg-amber-50';
  return 'bg-red-50';
}

function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`;
  return `${(meters / 1000).toFixed(1)}km`;
}

export default function CarparkCard({ carpark, duration, rank }: CarparkCardProps) {
  const availColor = getAvailabilityColor(carpark.available_lots, carpark.total_lots);
  const availBg = getAvailabilityBg(carpark.available_lots, carpark.total_lots);

  return (
    <article
      className="bg-white rounded-2xl border border-gray-100 shadow-sm 
                 hover:shadow-md transition-shadow duration-200 overflow-hidden"
      role="article"
      aria-label={`${carpark.name} - $${carpark.total_cost.toFixed(2)} for ${duration} hours`}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-gray-100 text-gray-600">
                {carpark.type}
              </span>
              {rank <= 3 && (
                <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium bg-emerald-100 text-emerald-700">
                  {rank === 1 ? '🏆 Cheapest' : rank === 2 ? '🥈 2nd' : '🥉 3rd'}
                </span>
              )}
            </div>
            <h3 className="text-base font-semibold text-gray-900 truncate">
              {carpark.name}
            </h3>
          </div>
          <div className="text-right shrink-0">
            <div className="text-lg font-bold text-emerald-700">
              ${carpark.total_cost.toFixed(2)}
            </div>
            <div className="text-xs text-gray-400">
              {duration}h total
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="flex items-center gap-3 text-sm text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
            </svg>
            {formatDistance(carpark.distance_m)}
          </span>
          <span className="text-gray-300">•</span>
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0" />
            </svg>
            {carpark.walk_time_min} min walk
          </span>
          <span className="text-gray-300">•</span>
          <span className="text-xs text-gray-400">
            ${carpark.rate_per_hour.toFixed(2)}/hr
          </span>
        </div>

        {/* Availability bar */}
        <div className={`flex items-center justify-between px-3 py-2 rounded-lg ${availBg}`}>
          <span className={`text-sm font-medium ${availColor}`}>
            {carpark.available_lots > 0 ? (
              <>
                {carpark.available_lots} / {carpark.total_lots} lots available
              </>
            ) : (
              'Full'
            )}
          </span>
          {carpark.total_lots > 0 && (
            <div className="w-16 h-1.5 bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  carpark.available_lots / carpark.total_lots > 0.3
                    ? 'bg-emerald-500'
                    : carpark.available_lots / carpark.total_lots > 0.1
                    ? 'bg-amber-500'
                    : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(100, (carpark.available_lots / carpark.total_lots) * 100)}%` }}
              />
            </div>
          )}
        </div>

        {/* Navigation */}
        <NavigationButtons lat={carpark.latitude} lng={carpark.longitude} carparkName={carpark.name} />
      </div>
    </article>
  );
}
