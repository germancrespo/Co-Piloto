export interface RouteAlert {
  id: string;
  type: 'weather' | 'traffic' | 'toll' | 'road_closed' | 'radar';
  severity: 'high' | 'medium' | 'low';
  title: string;
  desc: string;
  km?: number;
}

export interface SpeedRadar {
  id: string;
  route: string;
  km: number;
  speedLimit: number;
  type: string;
  active: boolean;
}

export interface FuelLog {
  id: string;
  date: string;
  trip: string;
  distance: number;
  fuelUsed: number;
  cost: number;
  efficiency: number;
}

export interface CalendarEvent {
  id: string;
  title: string;
  location: string;
  time: string;
  date: string;
  syncStatus: string;
}

export interface MaintenanceItem {
  id: string;
  name: string;
  intervalKm: number;
  lastChangedKm: number;
  nextDueKm: number;
  desc: string;
  category: 'motor' | 'frenos' | 'neumaticos' | 'general';
}

export interface DashboardPreferences {
  theme: 'night' | 'day' | 'auto';
  colorAccent: 'amber' | 'blue' | 'green' | 'magenta' | 'orange' | 'coral' | 'violet' | 'teal' | 'aurora';
  layout: 'standard' | 'map-heavy' | 'split-compact';
  speechVolume: number;
  voiceGender: 'male' | 'female';
  soundAlertsEnabled: boolean;
  voiceReadAloudEnabled: boolean;
  mapStyle: 'vector' | 'satellite' | 'outline';
  offlineMapCached: boolean;
}
