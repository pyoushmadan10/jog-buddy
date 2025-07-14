import { create } from 'zustand';

export interface Location {
  latitude: number;
  longitude: number;
  accuracy?: number;
  timestamp: number;
}

export interface NetworkInfo {
  type?: string;
  downlink?: number;
  effectiveType?: string;
  rtt?: number;
}

interface JoggingState {
  isJogging: boolean;
  sessionStartTime: Date | null;
  sessionDuration: number;
  
  currentLocation: Location | null;
  locationHistory: Location[];
  locationError: string | null;
  

  networkInfo: NetworkInfo | null;
  isOnline: boolean;
 
  hydrationEnabled: boolean;
  lastHydrationTime: Date | null;
  hydrationInterval: number; 
  nextHydrationTime: Date | null;
  
 
  startJog: () => void;
  stopJog: () => void;
  setLocation: (location: Location) => void;
  setLocationError: (error: string | null) => void;
  setNetworkInfo: (info: NetworkInfo) => void;
  setOnlineStatus: (isOnline: boolean) => void;
  toggleHydrationReminder: () => void;
  recordHydration: () => void;
  setHydrationInterval: (minutes: number) => void;
  updateSessionDuration: () => void;
}

export const useJoggingStore = create<JoggingState>((set, get) => ({

  isJogging: false,
  sessionStartTime: null,
  sessionDuration: 0,
  currentLocation: null,
  locationHistory: [],
  locationError: null,
  networkInfo: null,
  isOnline: navigator.onLine,
  hydrationEnabled: true,
  lastHydrationTime: null,
  hydrationInterval: 15, 
  nextHydrationTime: null,
  
  startJog: () => {
    const now = new Date();
    const state = get();
    const nextHydration = new Date(now.getTime() + state.hydrationInterval * 60000);
    
    set({
      isJogging: true,
      sessionStartTime: now,
      sessionDuration: 0,
      locationHistory: [],
      locationError: null,
      nextHydrationTime: state.hydrationEnabled ? nextHydration : null,
    });
    
    console.log('🏃‍♂️ Jogging session started at', now.toLocaleTimeString());
  },
  
  stopJog: () => {
    const state = get();
    const duration = state.sessionStartTime 
      ? Date.now() - state.sessionStartTime.getTime()
      : 0;
    
    set({
      isJogging: false,
      sessionStartTime: null,
      sessionDuration: Math.floor(duration / 1000),
      nextHydrationTime: null,
    });
    
    console.log('🛑 Jogging session ended. Duration:', Math.floor(duration / 60000), 'minutes');
  },
  
  setLocation: (location: Location) => {
    const state = get();
    set({
      currentLocation: location,
      locationHistory: state.isJogging 
        ? [...state.locationHistory.slice(-50), location]
        : state.locationHistory,
      locationError: null,
    });
  },
  
  setLocationError: (error: string | null) => {
    set({ locationError: error });
  },
  
  setNetworkInfo: (info: NetworkInfo) => {
    set({ networkInfo: info });
  },
  
  setOnlineStatus: (isOnline: boolean) => {
    set({ isOnline });
  },
  
  toggleHydrationReminder: () => {
    const state = get();
    const newEnabled = !state.hydrationEnabled;
    let nextHydration = null;
    
    if (newEnabled && state.isJogging) {
      const now = new Date();
      nextHydration = new Date(now.getTime() + state.hydrationInterval * 60000);
    }
    
    set({
      hydrationEnabled: newEnabled,
      nextHydrationTime: nextHydration,
    });
  },
  
  recordHydration: () => {
    const state = get();
    const now = new Date();
    let nextHydration = null;
    
    if (state.hydrationEnabled && state.isJogging) {
      nextHydration = new Date(now.getTime() + state.hydrationInterval * 60000);
    }
    
    set({
      lastHydrationTime: now,
      nextHydrationTime: nextHydration,
    });
    
    console.log('💧 Hydration recorded at', now.toLocaleTimeString());
  },
  
  setHydrationInterval: (minutes: number) => {
    set({ hydrationInterval: minutes });
  },
  
  updateSessionDuration: () => {
    const state = get();
    if (state.isJogging && state.sessionStartTime) {
      const duration = Date.now() - state.sessionStartTime.getTime();
      set({ sessionDuration: Math.floor(duration / 1000) });
    }
  },
}));