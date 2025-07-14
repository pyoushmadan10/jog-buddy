import React from 'react';
import { Wifi, WifiOff, Signal, AlertTriangle } from 'lucide-react';
import { useJoggingStore } from '../store/useJoggingStore';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

export const NetworkStatus: React.FC = () => {
  const { networkInfo, isOnline } = useJoggingStore();
  const { getConnectionQuality } = useNetworkStatus();

  const quality = getConnectionQuality(networkInfo);
  
  const getQualityConfig = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return { color: 'green', label: 'Excellent', icon: Signal };
      case 'good':
        return { color: 'blue', label: 'Good', icon: Signal };
      case 'poor':
        return { color: 'yellow', label: 'Poor', icon: AlertTriangle };
      case 'very-poor':
        return { color: 'red', label: 'Very Poor', icon: AlertTriangle };
      default:
        return { color: 'gray', label: 'Unknown', icon: Signal };
    }
  };

  const qualityConfig = getQualityConfig(quality);
  const QualityIcon = qualityConfig.icon;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          isOnline ? 'bg-green-100' : 'bg-red-100'
        }`}>
          {isOnline ? (
            <Wifi className="w-5 h-5 text-green-600" />
          ) : (
            <WifiOff className="w-5 h-5 text-red-600" />
          )}
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Network Status</h3>
        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
          isOnline ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {isOnline ? 'Online' : 'Offline'}
        </div>
      </div>

      {isOnline && networkInfo ? (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Connection Type</div>
              <div className="font-medium text-gray-900 capitalize">
                {networkInfo.effectiveType || networkInfo.type || 'Unknown'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Quality</div>
              <div className={`flex items-center gap-1 font-medium text-${qualityConfig.color}-600`}>
                <QualityIcon className="w-3 h-3" />
                <span>{qualityConfig.label}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Downlink Speed</div>
              <div className="font-medium text-gray-900">
                {networkInfo.downlink ? `${networkInfo.downlink} Mbps` : 'N/A'}
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <div className="text-xs text-gray-500 mb-1">Round Trip Time</div>
              <div className="font-medium text-gray-900">
                {networkInfo.rtt ? `${networkInfo.rtt}ms` : 'N/A'}
              </div>
            </div>
          </div>

          {(quality === 'poor' || quality === 'very-poor') && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                <div className="text-sm text-yellow-800">
                  Slow connection detected. GPS tracking may be affected.
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {isOnline ? (
              <div>
                <Signal className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-sm">Network information unavailable</p>
              </div>
            ) : (
              <div>
                <WifiOff className="w-8 h-8 text-red-300 mx-auto mb-2" />
                <p className="text-sm">No internet connection</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
