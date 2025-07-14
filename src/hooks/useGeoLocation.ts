import { useEffect, useRef } from 'react';
import { useJoggingStore } from '../store/useJoggingStore';

export const useGeolocation = () => {
  const watchIdRef = useRef<number | null>(null);
  const { setLocation, setLocationError, isJogging } = useJoggingStore();

  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationError('Geolocation is not supported by this browser');
      console.warn('Geolocation API not supported');
      return;
    }

    const startWatching = () => {
      const options: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 5000,
      };

      const onSuccess = (position: GeolocationPosition) => {
        const location = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        };
        setLocation(location);
        console.log('📍 Location updated:', location);
      };

      const onError = (error: GeolocationPositionError) => {
        let errorMessage = 'Unknown location error';
        
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Location access denied by user';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Location information unavailable';
            break;
          case error.TIMEOUT:
            errorMessage = 'Location request timed out';
            break;
        }
        
        setLocationError(errorMessage);
        console.warn('🚫 Geolocation error:', errorMessage);
      };

      watchIdRef.current = navigator.geolocation.watchPosition(
        onSuccess,
        onError,
        options
      );
    };

    const stopWatching = () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };

    if (isJogging) {
      startWatching();
    } else {
      stopWatching();
    }
    return () => {
      stopWatching();
    };
  }, [isJogging, setLocation, setLocationError]);

  const requestPermission = async (): Promise<boolean> => {
    try {
      if ('permissions' in navigator) {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        return permission.state === 'granted';
      }
      return true;
    } catch (error) {
      console.warn('Could not check geolocation permission:', error);
      return false;
    }
  };

  return { requestPermission };
};