import React from 'react';
import { MapPin, Navigation, AlertCircle } from 'lucide-react';
import { useJoggingStore } from '../store/useJoggingStore';
import { calculateDistance, formatDistance } from '../utils/notificationUtils';

export const LocationTracker: React.FC = () => {
  const { 
    currentLocation, 
    locationError, 
    locationHistory, 
    isJogging 
  } = useJoggingStore();

  const totalDistance = React.useMemo(() => {
    if (locationHistory.length < 2) return 0;
    
    let distance = 0;
    for (let i = 1; i < locationHistory.length; i++) {
      const prev = locationHistory[i - 1];
      const curr = locationHistory[i];
      distance += calculateDistance(prev.latitude, prev.longitude, curr.latitude, curr.longitude);
    }
    return distance;
  }, [locationHistory]);

  if (locationError) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 border border-red-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-red-100 rounded-lg">
            <AlertCircle className="w-5 h-5 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Location Error</h3>
        </div>
        <p className="text-red-600 text-sm mb-4">{locationError}</p>
        <div className="text-xs text-gray-500">
          Please enable location permissions and try again
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-blue-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${isJogging ? 'bg-green-100' : 'bg-blue-100'}`}>
          <MapPin className={`w-5 h-5 ${isJogging ? 'text-green-600' : 'text-blue-600'}`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Location Tracker</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isJogging ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
        }`}>
          {isJogging ? 'Tracking' : 'Paused'}
        </div>
      </div>

      {currentLocation ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Latitude</div>
              <div className="font-mono text-sm font-medium text-gray-900">
                {currentLocation.latitude.toFixed(6)}°
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Longitude</div>
              <div className="font-mono text-sm font-medium text-gray-900">
                {currentLocation.longitude.toFixed(6)}°
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Accuracy</div>
              <div className="font-medium text-gray-900">
                ±{currentLocation.accuracy?.toFixed(0) || 'N/A'}m
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Distance</div>
              <div className="font-medium text-gray-900">
                {formatDistance(totalDistance)}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-500">
            <Navigation className="w-3 h-3" />
            <span>
              Updated {new Date(currentLocation.timestamp).toLocaleTimeString()}
            </span>
          </div>
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="animate-pulse">
            <MapPin className="w-8 h-8 text-gray-300 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">Acquiring location...</p>
          </div>
        </div>
      )}
    </div>
  );
};