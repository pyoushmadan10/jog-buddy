import React, { useEffect, useState } from 'react';
import { Droplets, Clock, Bell, BellOff, CheckCircle } from 'lucide-react';
import { useJoggingStore } from '../store/useJoggingStore';
import { showHydrationNotification, requestNotificationPermission } from '../utils/notificationUtils';

export const HydrationReminder: React.FC = () => {
  const {
    hydrationEnabled,
    lastHydrationTime,
    nextHydrationTime,
    hydrationInterval,
    isJogging,
    toggleHydrationReminder,
    recordHydration,
    setHydrationInterval,
  } = useJoggingStore();

  const [timeUntilNext, setTimeUntilNext] = useState<string>('');
  const [notificationPermission, setNotificationPermission] = useState<boolean>(false);


  useEffect(() => {
    const checkPermission = async () => {
      const hasPermission = await requestNotificationPermission();
      setNotificationPermission(hasPermission);
    };
    checkPermission();
  }, []);


  useEffect(() => {
    const updateCountdown = () => {
      if (!nextHydrationTime || !isJogging) {
        setTimeUntilNext('');
        return;
      }

      const now = Date.now();
      const timeLeft = nextHydrationTime.getTime() - now;

      if (timeLeft <= 0) {
        setTimeUntilNext('Time to hydrate!');
        if (notificationPermission) {
          showHydrationNotification();
        }
        return;
      }

      const minutes = Math.floor(timeLeft / 60000);
      const seconds = Math.floor((timeLeft % 60000) / 1000);
      setTimeUntilNext(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [nextHydrationTime, isJogging, notificationPermission]);

  const handleHydrationIntervalChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHydrationInterval(Number(event.target.value));
  };

  const isTimeToHydrate = timeUntilNext === 'Time to hydrate!';

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 border border-cyan-100">
      <div className="flex items-center gap-3 mb-4">
        <div className={`p-2 rounded-lg ${
          hydrationEnabled ? 'bg-cyan-100' : 'bg-gray-100'
        }`}>
          <Droplets className={`w-5 h-5 ${
            hydrationEnabled ? 'text-cyan-600' : 'text-gray-400'
          }`} />
        </div>
        <h3 className="text-lg font-semibold text-gray-900">Hydration Reminder</h3>
        <button
          onClick={toggleHydrationReminder}
          className={`p-1 rounded-full transition-colors ${
            hydrationEnabled 
              ? 'bg-cyan-100 text-cyan-600 hover:bg-cyan-200' 
              : 'bg-gray-100 text-gray-400 hover:bg-gray-200'
          }`}
          title={hydrationEnabled ? 'Disable reminders' : 'Enable reminders'}
        >
          {hydrationEnabled ? <Bell className="w-4 h-4" /> : <BellOff className="w-4 h-4" />}
        </button>
      </div>

      <div className="space-y-4">
        {/* Interval Setting */}
        <div className="bg-gray-50 rounded-lg p-3">
          <div className="text-xs text-gray-500 mb-2">Reminder Interval</div>
          <select
            value={hydrationInterval}
            onChange={handleHydrationIntervalChange}
            className="w-full p-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            disabled={!hydrationEnabled}
          >
            <option value={10}>Every 10 minutes</option>
            <option value={15}>Every 15 minutes</option>
            <option value={20}>Every 20 minutes</option>
            <option value={30}>Every 30 minutes</option>
          </select>
        </div>

        {/* Next Reminder Countdown */}
        {hydrationEnabled && isJogging && (
          <div className={`rounded-lg p-4 border-2 transition-all ${
            isTimeToHydrate
              ? 'bg-cyan-50 border-cyan-200 animate-pulse'
              : 'bg-blue-50 border-blue-200'
          }`}>
            <div className="flex items-center gap-2 mb-2">
              <Clock className={`w-4 h-4 ${isTimeToHydrate ? 'text-cyan-600' : 'text-blue-600'}`} />
              <div className="text-sm font-medium text-gray-700">
                {isTimeToHydrate ? 'Hydration Time!' : 'Next Reminder'}
              </div>
            </div>
            <div className={`text-2xl font-bold ${
              isTimeToHydrate ? 'text-cyan-600' : 'text-blue-600'
            }`}>
              {timeUntilNext || 'Calculating...'}
            </div>
          </div>
        )}

        {/* Hydration Button */}
        <button
          onClick={recordHydration}
          disabled={!isJogging}
          className={`w-full flex items-center justify-center gap-2 p-3 rounded-lg font-medium transition-all ${
            isJogging
              ? 'bg-cyan-600 text-white hover:bg-cyan-700 active:scale-95'
              : 'bg-gray-100 text-gray-400 cursor-not-allowed'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          I've Hydrated
        </button>

        {/* Last Hydration */}
        {lastHydrationTime && (
          <div className="bg-green-50 rounded-lg p-3">
            <div className="text-xs text-gray-500 mb-1">Last Hydration</div>
            <div className="font-medium text-green-700">
              {lastHydrationTime.toLocaleTimeString()}
            </div>
          </div>
        )}

        {/* Notification Status */}
        {!notificationPermission && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="text-sm text-yellow-800">
              Enable notifications for hydration reminders even when the app is in the background.
            </div>
          </div>
        )}

        {!hydrationEnabled && (
          <div className="text-center py-4 text-gray-500 text-sm">
            Hydration reminders are disabled
          </div>
        )}
      </div>
    </div>
  );
};