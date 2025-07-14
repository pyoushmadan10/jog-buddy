import { useEffect } from 'react';
import { useJoggingStore } from '../store/useJoggingStore';

export const useNetworkStatus = () => {
  const { setNetworkInfo, setOnlineStatus } = useJoggingStore();

  useEffect(() => {
    const updateOnlineStatus = () => {
      setOnlineStatus(navigator.onLine);
      console.log('🌐 Network status:', navigator.onLine ? 'Online' : 'Offline');
    };

    const updateNetworkInfo = () => {
      const connection = (navigator as any).connection || 
                        (navigator as any).mozConnection || 
                        (navigator as any).webkitConnection;

      if (connection) {
        const networkInfo = {
          type: connection.type,
          effectiveType: connection.effectiveType,
          downlink: connection.downlink,
          rtt: connection.rtt,
        };
        
        setNetworkInfo(networkInfo);
        console.log('📶 Network info updated:', networkInfo);
      } else {
        console.warn('Network Information API not supported');
        setNetworkInfo({
          type: 'unknown',
          effectiveType: navigator.onLine ? 'unknown' : 'offline',
        });
      }
    };

    updateOnlineStatus();
    updateNetworkInfo();

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    const connection = (navigator as any).connection;
    if (connection) {
      connection.addEventListener('change', updateNetworkInfo);
    }

    return () => {
      window.removeEventListener('online', updateOnlineStatus);
      window.removeEventListener('offline', updateOnlineStatus);
      
      if (connection) {
        connection.removeEventListener('change', updateNetworkInfo);
      }
    };
  }, [setNetworkInfo, setOnlineStatus]);

  const getConnectionQuality = (networkInfo: any) => {
    if (!networkInfo || !networkInfo.effectiveType) return 'unknown';
    
    switch (networkInfo.effectiveType) {
      case '4g':
        return 'excellent';
      case '3g':
        return 'good';
      case '2g':
        return 'poor';
      case 'slow-2g':
        return 'very-poor';
      default:
        return 'unknown';
    }
  };

  return { getConnectionQuality };
};