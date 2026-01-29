'use client';

import { openWaze, openGoogleMaps } from '@/lib/navigation';

interface NavigationButtonsProps {
  lat: number;
  lng: number;
  carparkName: string;
}

export default function NavigationButtons({ lat, lng, carparkName }: NavigationButtonsProps) {
  return (
    <div className="flex gap-2 mt-3">
      <button
        onClick={() => openWaze(lat, lng)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg
                   bg-sky-50 text-sky-700 text-sm font-medium
                   hover:bg-sky-100 active:bg-sky-200 transition-colors
                   touch-manipulation min-h-[44px]"
        aria-label={`Navigate to ${carparkName} with Waze`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20.54 6.63c-1.13-4.2-5.09-5.63-8.54-5.63-5.14 0-8.5 3.93-8.5 9 0 2.25.5 3.75 1.5 5.25-1.5 2.25-1.5 2.25-1.5 2.25s3.5 0 4.5-1.5c1 .5 2.5 1 4 1 5.79 0 9.5-3.67 9.5-9 0-.75-.17-1.5-.46-2.37zM9 11.5c-.83 0-1.5-.67-1.5-1.5S8.17 8.5 9 8.5s1.5.67 1.5 1.5S9.83 11.5 9 11.5zm6 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5z" />
        </svg>
        Waze
      </button>
      <button
        onClick={() => openGoogleMaps(lat, lng)}
        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-lg
                   bg-emerald-50 text-emerald-700 text-sm font-medium
                   hover:bg-emerald-100 active:bg-emerald-200 transition-colors
                   touch-manipulation min-h-[44px]"
        aria-label={`Navigate to ${carparkName} with Google Maps`}
      >
        <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
        Maps
      </button>
    </div>
  );
}
