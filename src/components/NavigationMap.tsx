import React, { useRef, useEffect, useState, useMemo } from 'react';
import { RouteAlert, SpeedRadar, DashboardPreferences } from '../types';
import { Map as MapIcon, Navigation, Wifi, WifiOff, Plus, AlertTriangle, ShieldAlert, Navigation2, ZoomIn, ZoomOut, Compass, Info, MapPin } from 'lucide-react';
import { APIProvider, Map, AdvancedMarker, Pin, useMap, useMapsLibrary } from '@vis.gl/react-google-maps';

interface NavigationMapProps {
  alerts: RouteAlert[];
  radars: SpeedRadar[];
  currentSpeed: number;
  preferences: DashboardPreferences;
  isDriving: boolean;
  onSpeedChange: (speed: number) => void;
  onRadarTriggered: (radar: SpeedRadar) => void;
  onAlertTriggered: (alert: RouteAlert) => void;
  isOffline: boolean;
  origin: string;
  destination: string;
  originCoords?: {lat: number; lng: number} | null;
  destinationCoords?: {lat: number; lng: number} | null;
  transportMode?: 'auto' | 'moto' | 'bicicleta' | 'monopatin' | 'camion';
}

const API_KEY =
  process.env.GOOGLE_MAPS_PLATFORM_KEY ||
  (import.meta as any).env?.VITE_GOOGLE_MAPS_PLATFORM_KEY ||
  (globalThis as any).GOOGLE_MAPS_PLATFORM_KEY ||
  '';
const hasValidKey =
  Boolean(API_KEY) &&
  API_KEY.trim() !== '' &&
  API_KEY !== 'YOUR_API_KEY' &&
  API_KEY !== 'YOUR_GOOGLE_MAPS_KEY' &&
  API_KEY.startsWith('AIzaSy');

// Dictionary of precise coordinates for Chaco towns and global locations to ensure robust offline functionality
const OFFLINE_COORDINATES: Record<string, [number, number]> = {
  "buenos aires, argentina": [-34.6037, -58.3816],
  "buenos aires": [-34.6037, -58.3816],
  "cordoba, argentina": [-31.4135, -64.1810],
  "cordoba": [-31.4135, -64.1810],
  "resistencia, chaco, argentina": [-27.4514, -58.9867],
  "resistencia": [-27.4514, -58.9867],
  "presidencia roque saenz pena, chaco, argentina": [-26.7852, -60.4388],
  "presidencia roque saenz pena": [-26.7852, -60.4388],
  "saenz pena": [-26.7852, -60.4388],
  "makalle, chaco, argentina": [-27.2083, -59.2831],
  "makalle": [-27.2083, -59.2831],
  "quitilipi, chaco, argentina": [-26.8711, -60.2176],
  "quitilipi": [-26.8711, -60.2176],
  "presidencia de la plaza, chaco, argentina": [-27.0014, -59.8428],
  "presidencia de la plaza": [-27.0014, -59.8428],
  "charata, chaco, argentina": [-27.2141, -61.1878],
  "charata": [-27.2141, -61.1878],
  "villa angela, chaco, argentina": [-27.5738, -60.7153],
  "villa angela": [-27.5738, -60.7153],
  "barranqueras, chaco, argentina": [-27.4833, -58.9333],
  "barranqueras": [-27.4833, -58.9333],
  "fontana, chaco, argentina": [-27.4167, -59.0167],
  "fontana": [-27.4167, -59.0167],
  "las brenas, chaco, argentina": [-27.0867, -61.0811],
  "las brenas": [-27.0867, -61.0811],
  "tres isletas, chaco, argentina": [-26.3394, -60.4314],
  "tres isletas": [-26.3394, -60.4314],
  "general jose de san martin, chaco, argentina": [-26.5333, -59.3333],
  "general jose de san martin": [-26.5333, -59.3333],
  "juan jose castelli, chaco, argentina": [-25.9469, -60.5189],
  "juan jose castelli": [-25.9469, -60.5189],
  "machagai, chaco, argentina": [-26.9250, -60.0483],
  "machagai": [-26.9250, -60.0483],
  "corrientes, argentina": [-27.4692, -58.8306],
  "corrientes": [-27.4692, -58.8306],
  "posadas, misiones, argentina": [-27.3671, -55.8961],
  "posadas": [-27.3671, -55.8961],
  "formosa, argentina": [-26.1775, -58.1781],
  "formosa": [-26.1775, -58.1781],
  "parana, entre rios, argentina": [-31.7331, -60.5238],
  "parana": [-31.7331, -60.5238],
  "santiago, chile": [-33.4489, -70.6693],
  "santiago": [-33.4489, -70.6693],
  "sao paulo, brasil": [-23.5505, -46.6333],
  "sao paulo": [-23.5505, -46.6333],
  "madrid, espana": [40.4168, -3.7038],
  "madrid": [40.4168, -3.7038],
  "new york, usa": [40.7128, -74.0060],
  "new york": [40.7128, -74.0060],
  "london, uk": [51.5074, -0.1278],
  "london": [51.5074, -0.1278]
};

const normalizeText = (t: string) => {
  return t.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim();
};

// Route display child component for Google Maps
function RouteDisplay({
  origin,
  destination,
  onRouteComputed,
}: {
  origin: string | google.maps.LatLngLiteral;
  destination: string | google.maps.LatLngLiteral;
  onRouteComputed: (distance: string, duration: string, path: google.maps.LatLngLiteral[]) => void;
}) {
  const map = useMap();
  const routesLib = useMapsLibrary('routes');
  const polylinesRef = useRef<google.maps.Polyline[]>([]);

  useEffect(() => {
    if (!routesLib || !map || !origin || !destination) return;

    // Clear previous polylines
    polylinesRef.current.forEach((p) => p.setMap(null));
    polylinesRef.current = [];

    const parseLoc = (locStr: string | google.maps.LatLngLiteral): string | google.maps.LatLngLiteral => {
      if (typeof locStr === 'object') return locStr;
      const coordsMatch = locStr.match(/Mi Ubicación GPS \(([^,]+),\s*([^)]+)\)/);
      if (coordsMatch) {
        const lat = parseFloat(coordsMatch[1]);
        const lng = parseFloat(coordsMatch[2]);
        if (!isNaN(lat) && !isNaN(lng)) {
          return { lat, lng };
        }
      }
      return locStr;
    };

    const parsedOrigin = parseLoc(origin);
    const parsedDestination = parseLoc(destination);

    routesLib.Route.computeRoutes({
      origin: parsedOrigin,
      destination: parsedDestination,
      travelMode: 'DRIVING',
      fields: ['path', 'distanceMeters', 'durationMillis', 'viewport'],
    })
      .then(({ routes }) => {
        if (routes?.[0]) {
          const route = routes[0];
          const newPolylines = route.createPolylines();
          newPolylines.forEach((p) => p.setMap(map));
          polylinesRef.current = newPolylines;

          if (route.viewport) {
            map.fitBounds(route.viewport, 50);
          }

          if (onRouteComputed) {
            const distanceKm = (route.distanceMeters / 1000).toFixed(1);
            const durationMin = Math.round(route.durationMillis / 60000);
            onRouteComputed(`${distanceKm} km`, `${durationMin} min`, route.path || []);
          }
        }
      })
      .catch((err) => {
        console.warn("Could not compute route: ", err);
      });

    return () => {
      polylinesRef.current.forEach((p) => p.setMap(null));
    };
  }, [routesLib, map, origin, destination]);

  return null;
}

export default function NavigationMap({
  alerts,
  radars,
  currentSpeed,
  preferences,
  isDriving,
  onSpeedChange,
  onRadarTriggered,
  onAlertTriggered,
  isOffline,
  origin,
  destination,
  originCoords,
  destinationCoords,
  transportMode = 'auto',
}: NavigationMapProps) {
  // Real Route State
  const [computedDistance, setComputedDistance] = useState<string>('');
  const [computedDuration, setComputedDuration] = useState<string>('');
  const [realRoutePath, setRealRoutePath] = useState<any[]>([]);
  const [currentPathIndex, setCurrentPathIndex] = useState(0);

  // Leaflet Dynamic loading states
  const [leafletLoaded, setLeafletLoaded] = useState(false);
  const leafletMapRef = useRef<any>(null);

  // Load Leaflet dynamic assets from CDN
  useEffect(() => {
    let active = true;

    // Load CSS
    if (!document.getElementById('leaflet-css-cdn')) {
      const link = document.createElement('link');
      link.id = 'leaflet-css-cdn';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load JS
    if (!(window as any).L) {
      const script = document.createElement('script');
      script.id = 'leaflet-js-cdn';
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.async = true;
      script.onload = () => {
        if (active) setLeafletLoaded(true);
      };
      document.head.appendChild(script);
    } else {
      setLeafletLoaded(true);
    }

    return () => {
      active = false;
    };
  }, []);

  const accentColors = {
    amber: '#f59e0b',
    blue: '#3b82f6',
    green: '#10b981',
    magenta: '#ec4899',
    orange: '#f97316',
    coral: '#f43f5e',
    violet: '#8b5cf6',
    teal: '#14b8a6',
    aurora: '#06b6d4'
  };

  const accentHex = accentColors[preferences.colorAccent] || '#3b82f6';

  const maxSpeedLimit = transportMode === 'bicicleta' ? 35 :
                        transportMode === 'monopatin' ? 25 :
                        transportMode === 'camion' ? 90 : 150;

  const recommendedSpeed = transportMode === 'bicicleta' ? 25 :
                           transportMode === 'monopatin' ? 20 :
                           transportMode === 'camion' ? 80 : 100;

  // Real Google Maps Route drive simulator loop (Used only when Google Maps API works)
  useEffect(() => {
    if (!isDriving || realRoutePath.length === 0 || isOffline || !hasValidKey) return;

    const interval = setInterval(() => {
      setCurrentPathIndex((prevIndex) => {
        const nextIndex = (prevIndex + 1) % realRoutePath.length;
        
        // Periodically trigger alerts and speed variations
        if (nextIndex > 0 && nextIndex % Math.floor(realRoutePath.length / 5) === 0) {
          const alertType = nextIndex % 2 === 0 ? 'traffic' : 'weather';
          if (alertType === 'weather') {
            onAlertTriggered({
              id: 'real-weather',
              type: 'weather',
              severity: 'medium',
              title: 'Visibilidad Ajustada',
              desc: 'Precaución copiloto: banco de neblina o humedad reportada.',
              km: 42
            });
          } else {
            onAlertTriggered({
              id: 'real-traffic',
              type: 'traffic',
              severity: 'medium',
              title: 'Aviso de Tráfico',
              desc: 'Tránsito moderado reportado en el carril.',
              km: 18
            });
          }
        }
        return nextIndex;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isDriving, realRoutePath, isOffline]);

  // Real Google Maps driving speed variation
  useEffect(() => {
    if (!isDriving || isOffline || !hasValidKey) return;

    const speedInterval = setInterval(() => {
      const variation = Math.floor(Math.random() * 12) - 6;
      let newSpeed = Math.max(75, Math.min(125, currentSpeed + variation));
      onSpeedChange(newSpeed);
    }, 4000);

    return () => clearInterval(speedInterval);
  }, [isDriving, currentSpeed, isOffline, onSpeedChange]);

  // Helper geocoder to resolve origin/destination to lat/lng coordinates
  const geocodeQuery = async (query: string): Promise<[number, number] | null> => {
    if (!query) return null;
    const norm = normalizeText(query);
    
    // 1. Exact offline match
    if (OFFLINE_COORDINATES[norm]) {
      return OFFLINE_COORDINATES[norm];
    }
    
    // 2. Partial offline match
    for (const [key, coords] of Object.entries(OFFLINE_COORDINATES)) {
      if (norm.includes(key) || key.includes(norm)) {
        return coords;
      }
    }

    // 3. Fallback to online geocoder
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
      const data = await res.json();
      if (data && data.length > 0) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (err) {
      console.warn("Geocoding failed for query:", query, err);
    }
    return null;
  };

  // Helper routing system using free OSRM driving service
  const fetchOSRMRoute = async (p1: [number, number], p2: [number, number]) => {
    try {
      const res = await fetch(`https://router.project-osrm.org/route/v1/driving/${p1[1]},${p1[0]};${p2[1]},${p2[0]}?overview=full&geometries=geojson`);
      const data = await res.json();
      if (data && data.routes && data.routes[0]) {
        const route = data.routes[0];
        const distanceKm = (route.distance / 1000).toFixed(1);
        const durationMin = Math.round(route.duration / 60);
        return {
          path: route.geometry.coordinates.map((c: [number, number]) => [c[1], c[0]]),
          distance: `${distanceKm} km`,
          duration: `${durationMin} min`
        };
      }
    } catch (err) {
      console.warn("OSRM Route lookup failed, using straight-line fallback:", err);
    }
    // Straight-line fallback
    return {
      path: [p1, p2],
      distance: "120 km",
      duration: "1h 30m"
    };
  };

  // Leaflet Dynamic map builder & route synchronizer
  useEffect(() => {
    if (hasValidKey && !isOffline) return; // Skip if using google maps
    if (!leafletLoaded) return;

    const L = (window as any).L;
    if (!L) return;

    // Clear previous map instance if exists
    if (leafletMapRef.current) {
      leafletMapRef.current.remove();
      leafletMapRef.current = null;
    }

    const container = document.getElementById('leaflet-map-container');
    if (!container) return;

    // Default center to Resistencia, Chaco
    const map = L.map('leaflet-map-container', {
      zoomControl: false,
      attributionControl: false
    }).setView([-27.4514, -58.9867], 10);
    leafletMapRef.current = map;

    // Elegant Theme selection based on dashboard settings
    const isNight = preferences.theme === 'night' || preferences.theme === 'auto';
    const tileUrl = isNight 
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19
    }).addTo(map);

    let isComponentMounted = true;
    let timer: NodeJS.Timeout | null = null;

    const buildMapElements = async () => {
      const origCoords = originCoords 
        ? [originCoords.lat, originCoords.lng] as [number, number]
        : await geocodeQuery(origin || "Resistencia, Chaco");
      const destCoords = destinationCoords
        ? [destinationCoords.lat, destinationCoords.lng] as [number, number]
        : await geocodeQuery(destination || "Presidencia Roque Sáenz Peña, Chaco");

      if (!isComponentMounted) return;

      if (!origCoords || !destCoords) {
        // Fallback marker at Resistencia Chaco center
        const defaultIcon = L.divIcon({
          html: `<div class="w-6 h-6 rounded-full bg-indigo-500 border-2 border-slate-900 shadow"></div>`,
          className: '',
          iconSize: [24, 24]
        });
        L.marker([-27.4514, -58.9867], { icon: defaultIcon }).addTo(map)
          .bindPopup("Co-Piloto Inteligente Chaco");
        return;
      }

      // Add start / origin marker
      const startIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-emerald-500 text-slate-950 font-bold flex items-center justify-center rounded-full border-2 border-slate-900 shadow-lg text-xs" style="transform: translate(-4px, -4px)">📍</div>`,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(origCoords, { icon: startIcon }).addTo(map)
        .bindPopup(`<b>Origen:</b> ${origin || "Resistencia"}`);

      // Add destination marker
      const endIcon = L.divIcon({
        html: `<div class="w-8 h-8 bg-rose-500 text-white font-bold flex items-center justify-center rounded-full border-2 border-slate-900 shadow-lg text-xs" style="transform: translate(-4px, -4px)">🏁</div>`,
        className: 'custom-leaflet-marker',
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
      L.marker(destCoords, { icon: endIcon }).addTo(map)
        .bindPopup(`<b>Destino:</b> ${destination || "Sáenz Peña"}`);

      // Fetch dynamic OSRM route path
      const routeData = await fetchOSRMRoute(origCoords, destCoords);
      if (!isComponentMounted) return;

      setComputedDistance(routeData.distance);
      setComputedDuration(routeData.duration);

      const polyColor = isNight ? '#6366f1' : '#4f46e5';
      const polyline = L.polyline(routeData.path, {
        color: polyColor,
        weight: 6,
        opacity: 0.9,
        lineCap: 'round',
        lineJoin: 'round'
      }).addTo(map);

      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      // Live animated driving simulation if isDriving is active
      if (isDriving && routeData.path.length > 0) {
        const carIconStr = transportMode === 'moto' ? '🏍️' :
                           transportMode === 'bicicleta' ? '🚲' :
                           transportMode === 'monopatin' ? '🛹' :
                           transportMode === 'camion' ? '🚛' : '🚗';
                           
        const carIcon = L.divIcon({
          html: `<div class="w-10 h-10 rounded-full bg-indigo-600 border-2 border-white flex items-center justify-center text-lg shadow-xl animate-pulse" style="transform: translate(-5px, -5px)">${carIconStr}</div>`,
          className: 'custom-car-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 20]
        });

        const carMarker = L.marker(origCoords, { icon: carIcon }).addTo(map);
        let idx = 0;
        
        timer = setInterval(() => {
          if (!isComponentMounted) return;
          if (idx >= routeData.path.length) {
            idx = 0;
          }
          const nextPoint = routeData.path[idx];
          carMarker.setLatLng(nextPoint);
          map.panTo(nextPoint);
          
          // Micro variations on simulated vehicle speed
          const variation = Math.floor(Math.random() * 8) - 4;
          let newSpeed = Math.max(45, Math.min(115, currentSpeed + variation));
          onSpeedChange(newSpeed);

          // Simulated smart triggers as vehicle cruises along highway
          if (idx > 0 && idx % Math.max(1, Math.floor(routeData.path.length / 4)) === 0) {
            const types = ['toll', 'radar', 'traffic', 'weather'];
            const chosenType = types[idx % types.length];
            if (chosenType === 'radar') {
              const r = radars[0] || { id: 'r1', route: 'Ruta Nacional 16', km: 45, speedLimit: 110, type: 'Móvil', active: true };
              onRadarTriggered(r);
            } else if (chosenType === 'weather') {
              onAlertTriggered({
                id: 'l-weather',
                type: 'weather',
                severity: 'medium',
                title: 'Alerta Climatológica',
                desc: 'Viento fuerte lateral reportado por sensores locales en autopista.',
                km: 64
              });
            } else if (chosenType === 'traffic') {
              onAlertTriggered({
                id: 'l-traffic',
                type: 'traffic',
                severity: 'high',
                title: 'Tránsito Demorado',
                desc: 'Reducción de velocidad promedio reportada adelante.',
                km: 42
              });
            } else if (chosenType === 'toll') {
              onAlertTriggered({
                id: 'l-toll',
                type: 'toll',
                severity: 'low',
                title: 'Peaje Próximo',
                desc: 'Cabinas habilitadas a 500 metros en la autovía.',
                km: 22
              });
            }
          }

          idx = (idx + 1) % routeData.path.length;
        }, 3000);
      }
    };

    buildMapElements();

    return () => {
      isComponentMounted = false;
      if (timer) clearInterval(timer);
    };
  }, [origin, destination, originCoords, destinationCoords, leafletLoaded, preferences, isDriving, transportMode]);

  // Handle route computation callback
  const handleRouteComputed = (distance: string, duration: string, path: google.maps.LatLngLiteral[]) => {
    setComputedDistance(distance);
    setComputedDuration(duration);
    setRealRoutePath(path);
    setCurrentPathIndex(0);
  };

  const currentCarCoordinate = useMemo(() => {
    if (realRoutePath.length > 0) {
      return realRoutePath[currentPathIndex];
    }
    return null;
  }, [realRoutePath, currentPathIndex]);

  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-950 shadow-xl flex flex-col" id="map-container">
      
      {/* Top Header Controls with connection status */}
      <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
        <div className="flex items-center gap-2 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-slate-800 pointer-events-auto">
          {isOffline || !hasValidKey ? (
            <span className="flex items-center gap-1.5 text-xs font-bold text-amber-400">
              <WifiOff className="w-3.5 h-3.5 animate-pulse" />
              <span className="text-[10px] tracking-wider uppercase">MAPA INTERACTIVO ABIERTO</span>
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
              <Wifi className="w-3.5 h-3.5" />
              <span className="text-[10px] tracking-wider uppercase">GOOGLE MAPS ONLINE ACTIVO</span>
            </span>
          )}
        </div>

        {/* Real Route details widget if computed */}
        {computedDistance && (
          <div className="flex items-center gap-2.5 bg-slate-950/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-slate-800 text-[10.5px] font-bold pointer-events-auto">
            <span className="text-blue-400 font-mono">📏 {computedDistance}</span>
            <span className="text-slate-600">|</span>
            <span className="text-emerald-400 font-mono">⏱️ {computedDuration}</span>
          </div>
        )}
      </div>

      {/* Main Map Render Area */}
      <div className="flex-1 w-full relative bg-slate-950 min-h-[360px]">
        
        {/* CASE A: Real Google Maps if Key is valid and online */}
        {hasValidKey && !isOffline ? (
          <APIProvider apiKey={API_KEY} version="weekly">
            <Map
              defaultCenter={{ lat: -34.6037, lng: -58.3816 }}
              defaultZoom={11}
              mapId="CO_PILOT_MAP_ID"
              internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
              style={{ width: '100%', height: '100%' }}
              gestureHandling="greedy"
              disableDefaultUI={false}
            >
              <RouteDisplay
                origin={originCoords || origin}
                destination={destinationCoords || destination}
                onRouteComputed={handleRouteComputed}
              />

              {currentCarCoordinate && (
                <AdvancedMarker position={currentCarCoordinate} title="Tu Vehículo en Ruta">
                  <div className="w-10 h-10 rounded-full bg-blue-600 border-2 border-white flex items-center justify-center text-lg shadow-xl animate-bounce">
                    {transportMode === 'moto' ? '🏍️' :
                     transportMode === 'bicicleta' ? '🚲' :
                     transportMode === 'monopatin' ? '🛹' :
                     transportMode === 'camion' ? '🚛' : '🚗'}
                  </div>
                </AdvancedMarker>
              )}

              {!isDriving && (
                <AdvancedMarker position={{ lat: -34.6037, lng: -58.3816 }}>
                  <Pin background="#10b981" glyphColor="#fff" scale={1.1} />
                </AdvancedMarker>
              )}
            </Map>
          </APIProvider>
        ) : (
          /* CASE B: Beautiful dynamic Leaflet Map */
          <div className="w-full h-full relative bg-slate-950">
            <div 
              id="leaflet-map-container" 
              className="w-full h-full absolute inset-0 z-0" 
            />
            
            {/* Guide Prompt to paste API Key inside Map tab if missing */}
            {!hasValidKey && !isOffline && (
              <div className="absolute top-16 left-4 right-4 bg-slate-950/95 border border-slate-800/80 p-3 rounded-xl text-slate-300 shadow-2xl flex flex-col gap-1.5 backdrop-blur-md z-10">
                <div className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs">
                  <Info className="w-4 h-4 text-indigo-400" />
                  <span>Navegación e Rutas Activa</span>
                </div>
                <p className="text-[9.5px] leading-relaxed text-slate-400">
                  Hemos activado <b>OpenStreetMap de alta precisión</b> de respaldo local. Puedes agregar tu clave de Google Maps en <b>Settings (⚙️) &gt; Secrets</b> con el nombre <code>GOOGLE_MAPS_PLATFORM_KEY</code> para habilitar la API de Google Maps opcional.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Speedometer Overlay Floating */}
        <div className="absolute bottom-4 left-4 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 shadow-2xl backdrop-blur-md z-10">
          <div className="text-center">
            <span className="block text-3xl font-black font-mono tracking-tight text-white leading-none">
              {currentSpeed}
            </span>
            <span className="block text-[8px] text-slate-500 font-bold tracking-wider mt-1.5">KM/H</span>
          </div>
          <div className="h-8 w-[1px] bg-slate-800" />
          <div>
            <span className="block text-[9px] text-slate-400 font-bold uppercase tracking-wider">Límite Permitido</span>
            <span className={`block text-xs font-bold font-mono ${currentSpeed > recommendedSpeed ? 'text-rose-500 font-black animate-pulse' : 'text-green-400'}`}>
              {recommendedSpeed} KM/H
            </span>
          </div>
        </div>

        {/* Next Alert Floating Widget */}
        <div className="absolute bottom-4 right-4 bg-slate-950/90 border border-slate-800 px-3.5 py-2 rounded-xl flex items-center gap-2 max-w-[200px] shadow-2xl backdrop-blur-md z-10">
          <AlertTriangle className={`w-4 h-4 text-amber-500 shrink-0 ${isDriving ? 'animate-bounce' : ''}`} />
          <div className="overflow-hidden">
            <span className="block text-[8px] text-amber-500 font-black tracking-widest uppercase leading-none mb-1">Indicación</span>
            <span className="block text-[10.5px] font-medium text-slate-200 truncate leading-tight">
              {isDriving ? `Navegando ruta real...` : `${origin.split(',')[0] || "Resistencia"} hacia ${destination.split(',')[0] || "Sáenz Peña"}`}
            </span>
          </div>
        </div>
      </div>

      {/* Speed Slider / Simulated driving accelerator controls */}
      <div className="bg-slate-950 border-t border-slate-800 p-3.5 flex flex-col gap-1.5 z-10 shrink-0">
        <div className="flex justify-between items-center text-xs">
          <span className="text-slate-400 font-medium text-[11px] uppercase tracking-wider font-mono">Acelerador Inteligente (Piloto de Pruebas)</span>
          <span className="font-mono text-slate-300 font-semibold text-xs">{currentSpeed} km/h</span>
        </div>
        <input
          id="speed-control-slider"
          type="range"
          min="0"
          max={maxSpeedLimit}
          value={currentSpeed}
          onChange={(e) => onSpeedChange(Number(e.target.value))}
          className="w-full accent-blue-500 h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-[9px] text-slate-500 font-mono">
          <span>0 KM/H (Detenido)</span>
          <span>{recommendedSpeed} KM/H (Límite)</span>
          <span>{maxSpeedLimit} KM/H (Máximo)</span>
        </div>
      </div>
    </div>
  );
}
