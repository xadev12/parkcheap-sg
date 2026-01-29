'use client';

import { useState, useCallback } from 'react';
import { LocationState } from '@/types/carpark';

export function useGeolocation() {
  const [location, setLocation] = useState<LocationState>({ status: 'idle' });

  const getCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocation({
        status: 'error',
        error: 'Geolocation is not supported by your browser.',
      });
      return;
    }

    setLocation({ status: 'loading' });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          status: 'success',
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          address: 'Current Location',
        });
      },
      (error) => {
        let message = 'Unable to get your location.';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location access denied. Please enable in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information unavailable.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
        }
        setLocation({ status: 'error', error: message });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 min cache
      }
    );
  }, []);

  return { location, getCurrentLocation, setLocation };
}
