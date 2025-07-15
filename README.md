# 🏃 Jog-Buddy

**Jog-Buddy** is your smart, responsive, and theme-aware jogging companion built using **React + TypeScript**, it is an intelligent jogging companion that leverages cutting-edge Web APIs to provide real-time tracking, network monitoring, and smart hydration reminders. Built with React, TypeScript, and Tailwind CSS, it offers a seamless experience for joggers who want to stay connected and hydrated during their runs.


## 🧠 Key Features

### 🚦 Session Control
- Start, Stop, and Reset jogging sessions
- Real-time session duration and start time display
- State managed via Zustand store

### 📍 Location Tracker
- Uses Geolocation API to fetch and display real-time location
- Alerts user on permission denial

### 🌐 Network Status Awareness
- Uses Network Information API
- Displays live connection status (online/offline)

### 💧 Hydration Reminder
- Uses Notification API to remind user to hydrate at regular intervals
- Checks notification permissions gracefully

### 💬 Motivation Tips
- Displays motivational quotes using Intersection Observer API
- Only visible when in viewport

### 🌌 Particle Background
- Canvas-based animated background
- Adapts to light/dark theme

### 🌗 Theme Toggle
- Light/Dark mode support via Tailwind
- Auto-detects system theme with MutationObserver

---

## 🌐 Web APIs Used

| API                      | Description                                                                 |
|--------------------------|-----------------------------------------------------------------------------|
| **Geolocation API**      | Fetches and watches user's location in real-time                            |
| **Network Information API** | Detects when the user goes offline/online                                |
| **Notification API**     | Pushes hydration reminder notifications to the user                        |
| **Intersection Observer API** | Used to trigger motivational tips when they enter the viewport         |
| **Canvas API**           | Renders themed background animations using HTML Canvas                     |

---
---

## 📁 Project Structure

src/
├── components/
│ ├── ui/
│ │ ├── HydrationReminder.tsx
│ │ ├── LocationTracker.tsx
│ │ ├── MotivationTip.tsx # Uses IntersectionObserver API
│ │ ├── NetworkStatus.tsx
│ │ ├── ParticleBackground.tsx # Uses Canvas API
│ │ └── ThemeToggle.tsx
│
├── hooks/
│ ├── use-mobile.tsx
│ ├── use-toast.ts
│ ├── useGeoLocation.ts # Uses Geolocation API
│ ├── useNetworkStatus.ts # Uses Network Information API
│ └── useTheme.ts
│
├── store/
│ └── useJoggingStore.ts # Zustand state store
│
├── lib/
│ └── utils.ts
│
├── utils/
│ └── notificationUtils.ts # Format time + notification helpers
│
├── pages/
│ ├── Index.tsx # Main App page
│ └── NotFound.tsx
│
├── App.css
└── main.tsx

---

## 🛠 Tech Stack

| Category         | Tools/Tech                            |
|------------------|----------------------------------------|
| Frontend         | React, TypeScript                      |
| Styling          | TailwindCSS, clsx, tailwind-merge      |
| State Management | Zustand                                |
| Icons            | Lucide-react                           |
| APIs             | Web APIs (Geolocation, Network, Notification, Canvas, IntersectionObserver) |

---

## 🎯 Core Components

### Location Tracker
- Real-time GPS coordinate display
- Distance calculation and formatting
- Location accuracy monitoring
- Error handling for permission issues

### Network Status Monitor
- Online/offline status detection
- Connection quality assessment
- Network type identification
- Responsive status indicators

### Hydration Reminder System
- Configurable reminder intervals
- Automatic scheduling during sessions
- Push notification integration
- Hydration event logging

### Session Control Panel
- Start/stop/reset functionality
- Real-time duration display
- Session state management
- User-friendly controls

## 🔧 Installation & Setup

### Prerequisites
- Node.js (version 18 or higher)
- npm package manager

### Quick Start
```bash
# Clone the repository
git clone https://github.com/pyoushmadan10/jog-buddy.git

# Navigate to project directory
cd jog-buddy

# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```