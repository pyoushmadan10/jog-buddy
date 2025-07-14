import type React from "react"
import { useEffect, useState } from "react"
import { Play, Square, RotateCcw } from "lucide-react"
import { LocationTracker } from "./components/LocationTracker"
import { NetworkStatus } from "./components/NetworkStatus"
import { HydrationReminder } from "./components/HydrationReminder"
import { ThemeToggle } from "./components/ThemeToggle"
import { ParticleBackground } from "./components/ParticleBackground"
import { useJoggingStore } from "./store/useJoggingStore"
import { useGeolocation } from "./hooks/useGeoLocation"
import { useNetworkStatus } from "./hooks/useNetworkStatus"
import { formatTime } from "./utils/notificationUtils"
import { MotivationTip } from "./components/MotivationTip"

const App: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)

  const { isJogging, sessionDuration, sessionStartTime, startJog, stopJog, updateSessionDuration } = useJoggingStore()

  useGeolocation()
  useNetworkStatus()

  useEffect(() => {
    const checkDarkMode = () => {
      setIsDarkMode(document.documentElement.classList.contains("dark"))
    }

    checkDarkMode()

    const observer = new MutationObserver(checkDarkMode)
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    })

    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout

    if (isJogging) {
      interval = setInterval(() => {
        updateSessionDuration()
      }, 1000)
    }

    return () => {
      if (interval) {
        clearInterval(interval)
      }
    }
  }, [isJogging, updateSessionDuration])

  const handleReset = () => {
    if (window.confirm("Are you sure you want to reset the session? This will clear all data.")) {
      stopJog()
      console.log("🔄 Session reset")
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 relative">
      
      <ParticleBackground isDark={isDarkMode} />

      
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-7 top-0 z-10 relative">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">🏃</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Jog-Buddy</h1>
                <p className="text-sm text-gray-600 dark:text-gray-300">Your Smart Jogging Companion</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              {isJogging && (
                <div className="bg-green-100 dark:bg-green-900 px-4 py-2 rounded-lg">
                  <div className="text-xs text-green-600 dark:text-green-400 font-medium">Session Time</div>
                  <div className="text-lg font-bold text-green-700 dark:text-green-300">
                    {formatTime(sessionDuration)}
                  </div>
                </div>
              )}

              
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      
      <main className="max-w-4xl mx-auto px-4 py-6 relative z-1">
        <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg p-6 mb-6 border border-gray-100 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Session Control</h2>

          <div className="flex flex-col sm:flex-row gap-4">
            {!isJogging ? (
              <button
                onClick={startJog}
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors active:scale-95"
              >
                <Play className="w-5 h-5" />
                Start Jogging
              </button>
            ) : (
              <button
                onClick={stopJog}
                className="flex-1 flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors active:scale-95"
              >
                <Square className="w-5 h-5" />
                Stop Jogging
              </button>
            )}

            <button
              onClick={handleReset}
              className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-gray-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-700 transition-colors active:scale-95"
            >
              <RotateCcw className="w-5 h-5" />
              Reset
            </button>
          </div>

          {sessionStartTime && (
            <div className="mt-4 text-sm text-gray-600 dark:text-gray-300 text-center">
              Session started at {sessionStartTime.toLocaleTimeString()}
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <LocationTracker />
          </div>
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <NetworkStatus />
          </div>
        </div>
        <div className="mb-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <HydrationReminder />
          </div>
        </div>

        
        <div className="h-[40vh]"></div>

        
        <div className="mb-6">
          <div className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
            <MotivationTip />
          </div>
        </div>

        
        <footer className="text-center py-6">
          <div className="text-sm text-gray-500 dark:text-gray-400">Built with ❤️ for runners everywhere</div>
          <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">
            By Pyoush Madan
          </div>
        </footer>
      </main>
    </div>
  )
}

export default App
