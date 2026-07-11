import React, { useState, useEffect } from 'react';
import { RouteAlert, SpeedRadar, FuelLog, CalendarEvent, DashboardPreferences } from './types';
import NavigationMap from './components/NavigationMap';
import VoiceController from './components/VoiceController';
import FuelLogs from './components/FuelLogs';
import MaintenancePredictor from './components/MaintenancePredictor';
import { 
  Navigation, 
  Settings, 
  Map as MapIcon, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun, 
  Compass, 
  Calendar, 
  AlertOctagon, 
  Fuel, 
  Wrench, 
  Music, 
  Check, 
  Smartphone, 
  Tv,
  Wifi,
  WifiOff,
  Bell,
  Sparkles,
  Search,
  Plus,
  Watch,
  Tablet,
  Clock,
  Cloud,
  Copy,
  ExternalLink,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudFog,
  CloudSun,
  Wind,
  Thermometer,
  AlertTriangle,
  Bluetooth,
  MessageSquare,
  Send,
  Mail,
  X
} from 'lucide-react';

const GLOBAL_CITIES = [
  "Buenos Aires, Argentina",
  "Córdoba, Argentina",
  "Rosario, Santa Fe, Argentina",
  "Mendoza, Argentina",
  "Resistencia, Chaco, Argentina",
  "Presidencia Roque Sáenz Peña, Chaco, Argentina",
  "Makallé, Chaco, Argentina",
  "Quitilipi, Chaco, Argentina",
  "Presidencia de la Plaza, Chaco, Argentina",
  "Charata, Chaco, Argentina",
  "Villa Ángela, Chaco, Argentina",
  "Barranqueras, Chaco, Argentina",
  "Fontana, Chaco, Argentina",
  "Las Breñas, Chaco, Argentina",
  "Tres Isletas, Chaco, Argentina",
  "General José de San Martín, Chaco, Argentina",
  "Juan José Castelli, Chaco, Argentina",
  "Machagai, Chaco, Argentina",
  "Corrientes, Argentina",
  "Posadas, Misiones, Argentina",
  "Formosa, Argentina",
  "Paraná, Entre Ríos, Argentina",
  "San Miguel de Tucumán, Argentina",
  "Salta, Argentina",
  "San Salvador de Jujuy, Argentina",
  "Santiago del Estero, Argentina",
  "La Rioja, Argentina",
  "San Fernando del Valle de Catamarca, Argentina",
  "San Juan, Argentina",
  "San Luis, Argentina",
  "Santa Rosa, La Pampa, Argentina",
  "Neuquén, Argentina",
  "Viedma, Río Negro, Argentina",
  "Rawson, Chubut, Argentina",
  "Río Gallegos, Santa Cruz, Argentina",
  "Ushuaia, Tierra del Fuego, Argentina",
  "La Plata, Buenos Aires, Argentina",
  "Mar del Plata, Buenos Aires, Argentina",
  "Bahía Blanca, Buenos Aires, Argentina",
  "San Carlos de Bariloche, Río Negro, Argentina",
  "Santiago, Chile",
  "Valparaíso, Chile",
  "Concepción, Chile",
  "São Paulo, Brasil",
  "Rio de Janeiro, Brasil",
  "Montevideo, Uruguay",
  "Punta del Estero, Uruguay",
  "Asunción, Paraguay",
  "Ciudad del Este, Paraguay",
  "Santa Cruz de la Sierra, Bolivia",
  "La Paz, Bolivia",
  "Lima, Perú",
  "Cusco, Perú",
  "Bogotá, Colombia",
  "Medellín, Colombia",
  "Quito, Ecuador",
  "Guayaquil, Ecuador",
  "Caracas, Venezuela",
  "Madrid, España",
  "Barcelona, España",
  "Paris, Francia",
  "Roma, Italia",
  "Londres, Reino Unido",
  "New York, USA",
  "Miami, Florida, USA",
  "Los Angeles, California, USA",
  "Chicago, Illinois, USA",
  "Houston, Texas, USA",
  "San Francisco, California, USA",
  "Tokyo, Japón",
  "Pekín, China",
  "Seúl, Corea del Sur",
  "Sídney, Australia",
  "El Cairo, Egipto",
  "Ciudad del Cabo, Sudáfrica",
  "Moscú, Rusia",
  "Dubái, Emiratos Árabes Unidos",
  "Nueva Delhi, India",
  "Singapur",
  "Bangkok, Tailandia"
];

const normalizeString = (str: string): string => {
  if (!str) return "";
  return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
};

interface PlaceSuggestion {
  display: string;
  lat: number;
  lng: number;
}

const LOCAL_COORDINATES: Record<string, {lat: number, lng: number}> = {
  "buenos aires, argentina": { lat: -34.6037, lng: -58.3816 },
  "buenos aires": { lat: -34.6037, lng: -58.3816 },
  "cordoba, argentina": { lat: -31.4135, lng: -64.1810 },
  "cordoba": { lat: -31.4135, lng: -64.1810 },
  "rosario, santa fe, argentina": { lat: -32.9468, lng: -60.6393 },
  "mendoza, argentina": { lat: -32.8894, lng: -68.8458 },
  "resistencia, chaco, argentina": { lat: -27.4514, lng: -58.9867 },
  "resistencia": { lat: -27.4514, lng: -58.9867 },
  "presidencia roque saenz pena, chaco, argentina": { lat: -26.7852, lng: -60.4388 },
  "presidencia roque saenz pena": { lat: -26.7852, lng: -60.4388 },
  "makalle, chaco, argentina": { lat: -27.2083, lng: -59.2831 },
  "makalle": { lat: -27.2083, lng: -59.2831 },
  "quitilipi, chaco, argentina": { lat: -26.8711, lng: -60.2176 },
  "quitilipi": { lat: -26.8711, lng: -60.2176 },
  "presidencia de la plaza, chaco, argentina": { lat: -27.0014, lng: -59.8428 },
  "presidencia de la plaza": { lat: -27.0014, lng: -59.8428 },
  "charata, chaco, argentina": { lat: -27.2141, lng: -61.1878 },
  "charata": { lat: -27.2141, lng: -61.1878 },
  "villa angela, chaco, argentina": { lat: -27.5738, lng: -60.7153 },
  "villa angela": { lat: -27.5738, lng: -60.7153 },
  "barranqueras, chaco, argentina": { lat: -27.4833, lng: -58.9333 },
  "barranqueras": { lat: -27.4833, lng: -58.9333 },
  "fontana, chaco, argentina": { lat: -27.4167, lng: -59.0167 },
  "fontana": { lat: -27.4167, lng: -59.0167 },
  "las brenas, chaco, argentina": { lat: -27.0867, lng: -61.0811 },
  "las brenas": { lat: -27.0867, lng: -61.0811 },
  "tres isletas, chaco, argentina": { lat: -26.3394, lng: -60.4314 },
  "tres isletas": { lat: -26.3394, lng: -60.4314 },
  "general jose de san martin, chaco, argentina": { lat: -26.5333, lng: -59.3333 },
  "general jose de san martin": { lat: -26.5333, lng: -59.3333 },
  "juan jose castelli, chaco, argentina": { lat: -25.9469, lng: -60.5189 },
  "juan jose castelli": { lat: -25.9469, lng: -60.5189 },
  "machagai, chaco, argentina": { lat: -26.9250, lng: -60.0483 },
  "machagai": { lat: -26.9250, lng: -60.0483 },
  "corrientes, argentina": { lat: -27.4692, lng: -58.8306 },
  "corrientes": { lat: -27.4692, lng: -58.8306 },
  "posadas, misiones, argentina": { lat: -27.3671, lng: -55.8961 },
  "posadas": { lat: -27.3671, lng: -55.8961 },
  "formosa, argentina": { lat: -26.1775, lng: -58.1781 },
  "formosa": { lat: -26.1775, lng: -58.1781 },
  "parana, entre rios, argentina": { lat: -31.7331, lng: -60.5238 },
  "parana": { lat: -31.7331, lng: -60.5238 },
  "santiago, chile": { lat: -33.4489, lng: -70.6693 },
  "santiago": { lat: -33.4489, lng: -70.6693 },
  "sao paulo, brasil": { lat: -23.5505, lng: -46.6333 },
  "sao paulo": { lat: -23.5505, lng: -46.6333 },
  "madrid, espana": { lat: 40.4168, lng: -3.7038 },
  "madrid": { lat: 40.4168, lng: -3.7038 },
  "new york, usa": { lat: 40.7128, lng: -74.0060 },
  "new york": { lat: 40.7128, lng: -74.0060 },
  "london, uk": { lat: 51.5074, lng: -0.1278 },
  "london": { lat: 51.5074, lng: -0.1278 }
};

export default function App() {
  const autocompleteService = null;

  // Application Data States
  const [alerts, setAlerts] = useState<RouteAlert[]>([
    { id: '1', type: 'traffic', severity: 'medium', title: 'Tránsito Fluido', desc: 'Flujo vehicular constante en autopistas principales.' },
    { id: '2', type: 'weather', severity: 'low', title: 'Visibilidad Moderada', desc: 'Reduzca velocidad en zonas con bancos de niebla.' },
    { id: '3', type: 'toll', severity: 'low', title: 'Cabina de Peaje', desc: 'Atención a cobros electrónicos habilitados.' }
  ]);
  const [radars, setRadars] = useState<SpeedRadar[]>([]);
  const [fuelLogs, setFuelLogs] = useState<FuelLog[]>([]);
  const [calendarEvents, setCalendarEvents] = useState<CalendarEvent[]>([]);
  
  // Driving & Simulation States
  const [currentSpeed, setCurrentSpeed] = useState(85);
  const [currentMileage, setCurrentMileage] = useState(89450);
  const [isDriving, setIsDriving] = useState(false);
  const [isOffline, setIsOffline] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [copilotResponse, setCopilotResponse] = useState<string>("Hola. Soy tu co-piloto de ruta inteligente. Listo para asistirte en tu viaje hacia cualquier destino del mundo.");
  const [destinationInput, setDestinationInput] = useState("Santiago, Chile");
  const [originInput, setOriginInput] = useState("Buenos Aires, Argentina");
  const [activeTab, setActiveTab] = useState<'map' | 'fuel' | 'maintenance' | 'calendar' | 'whatsapp'>('map');
  const [deviceFrame, setDeviceFrame] = useState<'none' | 'android' | 'ios' | 'watch' | 'carplay'>('none');
  const [transportMode, setTransportMode] = useState<'auto' | 'moto' | 'bicicleta' | 'monopatin' | 'camion'>('auto');
  const [showMobileModal, setShowMobileModal] = useState(false);
  const [linkCopied, setLinkCopied] = useState(false);
  const [linkType, setLinkType] = useState<'dev' | 'prod'>('dev');

  // Reloj de cabina en tiempo real: fecha, hora y año
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date, includeSeconds = true) => {
    return date.toLocaleTimeString('es-AR', {
      hour: '2-digit',
      minute: '2-digit',
      second: includeSeconds ? '2-digit' : undefined,
      hour12: false
    });
  };

  const formatDate = (date: Date) => {
    const options: Intl.DateTimeFormatOptions = {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    };
    const formatted = date.toLocaleDateString('es-AR', options);
    return formatted.charAt(0).toUpperCase() + formatted.slice(1);
  };

  // Bluetooth Connection States
  const [bluetoothEnabled, setBluetoothEnabled] = useState<boolean>(true);
  const [bluetoothStatus, setBluetoothStatus] = useState<'disconnected' | 'searching' | 'connecting' | 'connected'>('connected');
  const [pairedDevice, setPairedDevice] = useState<string | null>('iPhone de Gerardo');

  // Wi-Fi Connection States
  const [wifiEnabled, setWifiEnabled] = useState<boolean>(true);
  const [wifiStatus, setWifiStatus] = useState<'disconnected' | 'connecting' | 'connected'>('connected');
  const [wifiSSID, setWifiSSID] = useState<string>('Cabina-Inteligente-LTE');

  // WhatsApp Messages States
  const [whatsappMessages, setWhatsappMessages] = useState([
    { id: 'wa-1', sender: 'Mamá 👵', avatarColor: 'bg-emerald-500', time: 'Hace 5 min', message: '¡Hola hijo! ¿Ya pasaste el peaje de Makallé? Avisame cuando estés por llegar a Quitilipi.', read: false, replied: false, replyText: '' },
    { id: 'wa-2', sender: 'Diego (Mecánico) 🚗', avatarColor: 'bg-blue-500', time: 'Hace 15 min', message: 'Gerardo, acordate de revisar el nivel de refrigerante antes del tramo largo de la Ruta 16.', read: false, replied: false, replyText: '' },
    { id: 'wa-3', sender: 'Flavia ☕', avatarColor: 'bg-pink-500', time: 'Hace 30 min', message: '¿Compraste los pastelitos en Presidencia de la Plaza? Avisame si vas a parar ahí.', read: true, replied: false, replyText: '' }
  ]);
  const [newWaText, setNewWaText] = useState('');
  const [activeWaChat, setActiveWaChat] = useState<string | null>('wa-1');
  const [qrSynced, setQrSynced] = useState(false);
  const [syncingQr, setSyncingQr] = useState(false);

  // Simulated Bluetooth device list
  const bluetoothDevices = ["iPhone de Gerardo", "S24 de Germán", "Motorola de Flavia", "iPad CarPlay Pro"];

  const connectBluetooth = (deviceName: string) => {
    setBluetoothStatus('connecting');
    setPairedDevice(deviceName);
    setTimeout(() => {
      setBluetoothStatus('connected');
      addNotification(`Bluetooth: Conectado a ${deviceName}`);
      speakAloud(`Conectado con éxito a ${deviceName} vía Bluetooth. Canales de audio y mensajería sincronizados.`);
    }, 1500);
  };

  const disconnectBluetooth = () => {
    setBluetoothStatus('disconnected');
    setPairedDevice(null);
    addNotification("Bluetooth desconectado");
    speakAloud("Conectación de Bluetooth terminada.");
  };

  const simulateNewWhatsAppMessage = () => {
    const senders = [
      { name: "Central de Tránsito 👮", text: "Precaución: Congestión fuerte reportada más adelante en la ruta. Sugerimos desvío." },
      { name: "Papá 👴", text: "Hola, ¿cómo viene ese viaje? Acordate de avisar cuando pares a descansar." },
      { name: "Estación de Servicio ⛽", text: "¡Hola! Tu cupón de descuento para combustible y café está listo para canjear en la próxima parada." }
    ];
    const picked = senders[Math.floor(Math.random() * senders.length)];
    const newMsg = {
      id: `wa-${Date.now()}`,
      sender: picked.name,
      avatarColor: 'bg-indigo-500',
      time: 'Ahora',
      message: picked.text,
      read: false,
      replied: false,
      replyText: ''
    };
    setWhatsappMessages(prev => [newMsg, ...prev]);
    setActiveWaChat(newMsg.id);
    addNotification(`WhatsApp de ${picked.name.split(' ')[0]}: "${picked.text.substring(0, 30)}..."`);
    speakAloud(`Nuevo mensaje de WhatsApp de ${picked.name.split(' ')[0]}. ¿Querés que lo lea en voz alta?`);
  };

  const readMessageAloud = (msg: any) => {
    // Mark as read
    setWhatsappMessages(prev => prev.map(m => m.id === msg.id ? { ...m, read: true } : m));
    speakAloud(`Mensaje de ${msg.sender.split(' ')[0]}: ${msg.message}`);
  };

  const replyToMessage = (msgId: string, text: string) => {
    if (!text.trim()) return;
    setWhatsappMessages(prev => prev.map(m => m.id === msgId ? { ...m, replied: true, replyText: text, read: true } : m));
    addNotification(`Respuesta enviada a ${whatsappMessages.find(m => m.id === msgId)?.sender.split(' ')[0]}`);
    speakAloud(`Enviando respuesta hands-free: ${text}`);
  };

  // Global Autocomplete & GPS States
  const [gpsStatus, setGpsStatus] = useState<'idle' | 'searching' | 'connected' | 'error'>('idle');
  const [gpsCoords, setGpsCoords] = useState<{lat: number; lng: number; accuracy: number} | null>(null);
  
  const [showOriginSuggestions, setShowOriginSuggestions] = useState(false);
  const [showDestSuggestions, setShowDestSuggestions] = useState(false);
  const [originSuggestions, setOriginSuggestions] = useState<PlaceSuggestion[]>([]);
  const [destSuggestions, setDestSuggestions] = useState<PlaceSuggestion[]>([]);
  const [originCoords, setOriginCoords] = useState<{lat: number; lng: number} | null>({ lat: -34.6037, lng: -58.3816 }); // Default Buenos Aires
  const [destinationCoords, setDestinationCoords] = useState<{lat: number; lng: number} | null>({ lat: -33.4489, lng: -70.6693 }); // Default Santiago
  const [isSearchingOrigin, setIsSearchingOrigin] = useState(false);
  const [isSearchingDest, setIsSearchingDest] = useState(false);

  // Push notifications queue
  const [notifications, setNotifications] = useState<string[]>([
    "Viaje activo: Buenos Aires -> Santiago",
    "Sincronizado satelitalmente con GPS del celular"
  ]);

  // Weather and meteorology states
  const [weather, setWeather] = useState({
    condition: 'niebla' as 'despejado' | 'lluvia' | 'tormenta' | 'niebla' | 'viento',
    temp: 14,
    humidity: 95,
    windSpeed: 12,
    alertTitle: "Alerta por Niebla Densa",
    alertDesc: "Visibilidad reducida a menos de 100 metros en el trayecto actual. Conduzca con precaución.",
    hasAlert: true
  });

  // Dashboard customization state
  const [preferences, setPreferences] = useState<DashboardPreferences>({
    theme: 'night',
    colorAccent: 'blue',
    layout: 'standard',
    speechVolume: 80,
    voiceGender: 'female',
    soundAlertsEnabled: true,
    voiceReadAloudEnabled: true,
    mapStyle: 'vector',
    offlineMapCached: true
  });

  // Load initial data on mount
  useEffect(() => {
    fetchRadars();
    fetchFuelLogs();
    fetchCalendarEvents();
  }, []);

  // Sync dark/light theme on body based on preference and auto-conducción
  useEffect(() => {
    const root = window.document.documentElement;
    if (preferences.theme === 'night') {
      root.classList.add('dark');
    } else if (preferences.theme === 'day') {
      root.classList.remove('dark');
    } else {
      // Auto: check if it is evening (hours > 18 or < 7)
      const hour = new Date().getHours();
      if (hour >= 18 || hour < 7) {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
    }
  }, [preferences.theme]);

  // Helper function to read text ALOUD (Text-To-Speech / TTS)
  const speakAloud = (text: string) => {
    if (!preferences.voiceReadAloudEnabled) return;
    
    // Stop any speaking in progress
    window.speechSynthesis?.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'es-CL'; // Spanish voice accent
    
    // Attempt to find a suitable Spanish voice if available
    const voices = window.speechSynthesis?.getVoices() || [];
    const esVoice = voices.find(v => v.lang.includes('es'));
    if (esVoice) utterance.voice = esVoice;
    
    utterance.rate = 1.05; // Slightly faster for driving ease
    utterance.volume = preferences.speechVolume / 100;

    window.speechSynthesis?.speak(utterance);
  };

  // Speak welcome message on load
  useEffect(() => {
    const timer = setTimeout(() => {
      speakAloud(copilotResponse);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Fetch from our local full-stack server
  const fetchRadars = async () => {
    try {
      const res = await fetch('/api/radars');
      const data = await res.json();
      if (data.success) setRadars(data.radars);
    } catch (e) {
      console.warn("Could not fetch radars from server. Using local states.");
    }
  };

  const fetchFuelLogs = async () => {
    try {
      const res = await fetch('/api/fuel');
      const data = await res.json();
      if (data.success) setFuelLogs(data.logs);
    } catch (e) {
      console.warn("Could not fetch fuel logs from server.");
    }
  };

  const fetchCalendarEvents = async () => {
    try {
      const res = await fetch('/api/calendar');
      const data = await res.json();
      if (data.success) setCalendarEvents(data.events);
    } catch (e) {
      console.warn("Could not fetch calendar events from server.");
    }
  };

  // Add new fuel entry
  const handleAddFuelLog = async (newLog: { trip: string; distance: number; fuelUsed: number; cost: number }) => {
    try {
      const res = await fetch('/api/fuel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newLog)
      });
      const data = await res.json();
      if (data.success) {
        setFuelLogs(prev => [data.log, ...prev]);
        addNotification(`Nuevo log guardado: ${newLog.trip}. Eficiencia: ${data.log.efficiency} km/L.`);
        speakAloud(`Consumo guardado con éxito. Rendimiento de ${data.log.efficiency} kilómetros por litro.`);
      }
    } catch (e) {
      // Offline fallback
      const mockSavedLog = {
        id: `offline-${Date.now()}`,
        date: new Date().toISOString().split('T')[0],
        trip: newLog.trip,
        distance: newLog.distance,
        fuelUsed: newLog.fuelUsed,
        cost: newLog.cost,
        efficiency: Number((newLog.distance / newLog.fuelUsed).toFixed(1))
      };
      setFuelLogs(prev => [mockSavedLog, ...prev]);
      addNotification("Guardado localmente sin conexión.");
    }
  };

  // Add new Calendar Event
  const [newCalTitle, setNewCalTitle] = useState("");
  const [newCalLoc, setNewCalLoc] = useState("");
  const [newCalTime, setNewCalTime] = useState("");
  const [newCalDate, setNewCalDate] = useState("");

  const handleAddCalendarEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCalTitle || !newCalLoc) return;

    const eventPayload = {
      title: newCalTitle,
      location: newCalLoc,
      time: newCalTime || "12:00",
      date: newCalDate || new Date().toISOString().split('T')[0]
    };

    try {
      const res = await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventPayload)
      });
      const data = await res.json();
      if (data.success) {
        setCalendarEvents(prev => [...prev, data.event]);
        addNotification(`Evento sincronizado: ${newCalTitle}`);
        speakAloud(`Calendario sincronizado. Nuevo destino detectado en ${newCalLoc}.`);
        setNewCalTitle("");
        setNewCalLoc("");
        setNewCalTime("");
        setNewCalDate("");
      }
    } catch (err) {
      const mockEvent = {
        id: `offline-${Date.now()}`,
        ...eventPayload,
        syncStatus: "Local"
      };
      setCalendarEvents(prev => [...prev, mockEvent]);
    }
  };

  const handleConnectSatelliteGPS = () => {
    setGpsStatus('searching');
    addNotification("Estableciendo conexión con constelación GPS...");
    speakAloud("Conectando satelitalmente con el GPS de tu celular. Buscando órbita...");

    if (!navigator.geolocation) {
      setTimeout(() => {
        setGpsStatus('connected');
        setGpsCoords({ lat: -34.6037, lng: -58.3816, accuracy: 5 });
        setOriginInput("Buenos Aires, Argentina (GPS)");
        setOriginCoords({ lat: -34.6037, lng: -58.3816 });
        addNotification("GPS Satelital conectado.");
        speakAloud("Conexión de GPS establecida en Buenos Aires, Argentina.");
      }, 1500);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;
        setGpsStatus('connected');
        setGpsCoords({ lat: latitude, lng: longitude, accuracy });
        
        const resolvedLocation = `Mi Ubicación GPS (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;
        setOriginInput(resolvedLocation);
        setOriginCoords({ lat: latitude, lng: longitude });
        addNotification(`GPS Satelital conectado.`);
        speakAloud(`Señal satelital establecida con éxito. Ubicación vinculada con precisión de ${Math.round(accuracy)} metros.`);
      },
      (error) => {
        console.warn("GPS connection failed. Standard fallback applied:", error);
        setTimeout(() => {
          setGpsStatus('connected');
          setGpsCoords({ lat: -34.6037, lng: -58.3816, accuracy: 12 });
          setOriginInput("Buenos Aires, Argentina (GPS)");
          setOriginCoords({ lat: -34.6037, lng: -58.3816 });
          addNotification("GPS conectado vía satélites.");
          speakAloud("Sincronizado satelitalmente. Señal GPS del celular activa.");
        }, 1500);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  const handleOriginChange = (val: string) => {
    setOriginInput(val);
    if (!val) {
      setOriginSuggestions([]);
      setShowOriginSuggestions(false);
      setIsSearchingOrigin(false);
      return;
    }
    const valNorm = normalizeString(val);
    const localFiltered: PlaceSuggestion[] = GLOBAL_CITIES.filter(city => 
      normalizeString(city).includes(valNorm)
    ).map(city => {
      const cityNorm = normalizeString(city);
      const coords = LOCAL_COORDINATES[cityNorm] || { lat: -27.4514, lng: -58.9867 };
      return {
        display: city,
        lat: coords.lat,
        lng: coords.lng
      };
    });
    setOriginSuggestions(localFiltered);
    setShowOriginSuggestions(true);
    if (val.length >= 2) {
      setIsSearchingOrigin(true);
    } else {
      setIsSearchingOrigin(false);
    }
  };

  const handleDestChange = (val: string) => {
    setDestinationInput(val);
    if (!val) {
      setDestSuggestions([]);
      setShowDestSuggestions(false);
      setIsSearchingDest(false);
      return;
    }
    const valNorm = normalizeString(val);
    const localFiltered: PlaceSuggestion[] = GLOBAL_CITIES.filter(city => 
      normalizeString(city).includes(valNorm)
    ).map(city => {
      const cityNorm = normalizeString(city);
      const coords = LOCAL_COORDINATES[cityNorm] || { lat: -27.4514, lng: -58.9867 };
      return {
        display: city,
        lat: coords.lat,
        lng: coords.lng
      };
    });
    setDestSuggestions(localFiltered);
    setShowDestSuggestions(true);
    if (val.length >= 2) {
      setIsSearchingDest(true);
    } else {
      setIsSearchingDest(false);
    }
  };

  // Debounce online search for origin
  useEffect(() => {
    if (originInput.length < 2 || isOffline) {
      setIsSearchingOrigin(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(originInput)}&addressdetails=1&limit=8`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const onlineSuggestions: PlaceSuggestion[] = data.map((item: any) => ({
              display: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
            
            const valNorm = normalizeString(originInput);
            const localFiltered: PlaceSuggestion[] = GLOBAL_CITIES.filter(city => 
              normalizeString(city).includes(valNorm)
            ).map(city => {
              const cityNorm = normalizeString(city);
              const coords = LOCAL_COORDINATES[cityNorm] || { lat: -27.4514, lng: -58.9867 };
              return {
                display: city,
                lat: coords.lat,
                lng: coords.lng
              };
            });

            const seen = new Set(localFiltered.map(item => item.display.toLowerCase()));
            const combined = [...localFiltered];
            onlineSuggestions.forEach(item => {
              const key = item.display.toLowerCase();
              if (!seen.has(key)) {
                seen.add(key);
                combined.push(item);
              }
            });

            setOriginSuggestions(combined);
            setShowOriginSuggestions(combined.length > 0);
          }
          setIsSearchingOrigin(false);
        })
        .catch(err => {
          console.warn("Error fetching origin predictions:", err);
          setIsSearchingOrigin(false);
        });
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [originInput, isOffline]);

  // Debounce online search for destination
  useEffect(() => {
    if (destinationInput.length < 2 || isOffline) {
      setIsSearchingDest(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destinationInput)}&addressdetails=1&limit=8`)
        .then(res => res.json())
        .then(data => {
          if (Array.isArray(data)) {
            const onlineSuggestions: PlaceSuggestion[] = data.map((item: any) => ({
              display: item.display_name,
              lat: parseFloat(item.lat),
              lng: parseFloat(item.lon)
            }));
            
            const valNorm = normalizeString(destinationInput);
            const localFiltered: PlaceSuggestion[] = GLOBAL_CITIES.filter(city => 
              normalizeString(city).includes(valNorm)
            ).map(city => {
              const cityNorm = normalizeString(city);
              const coords = LOCAL_COORDINATES[cityNorm] || { lat: -27.4514, lng: -58.9867 };
              return {
                display: city,
                lat: coords.lat,
                lng: coords.lng
              };
            });

            const seen = new Set(localFiltered.map(item => item.display.toLowerCase()));
            const combined = [...localFiltered];
            onlineSuggestions.forEach(item => {
              const key = item.display.toLowerCase();
              if (!seen.has(key)) {
                seen.add(key);
                combined.push(item);
              }
            });

            setDestSuggestions(combined);
            setShowDestSuggestions(combined.length > 0);
          }
          setIsSearchingDest(false);
        })
        .catch(err => {
          console.warn("Error fetching dest predictions:", err);
          setIsSearchingDest(false);
        });
    }, 600);

    return () => clearTimeout(delayDebounce);
  }, [destinationInput, isOffline]);

  const handleWeatherChange = (condition: 'despejado' | 'lluvia' | 'tormenta' | 'niebla' | 'viento') => {
    let temp = 24;
    let humidity = 40;
    let windSpeed = 8;
    let alertTitle = "";
    let alertDesc = "";
    let hasAlert = false;

    switch (condition) {
      case 'despejado':
        temp = 25;
        humidity = 45;
        windSpeed = 10;
        alertTitle = "Cielo Despejado";
        alertDesc = "Condiciones óptimas de conducción en todo el recorrido.";
        hasAlert = false;
        break;
      case 'lluvia':
        temp = 17;
        humidity = 88;
        windSpeed = 18;
        alertTitle = "Alerta por Calzada Resbaladiza";
        alertDesc = "Precipitaciones en el trayecto actual. Disminuya la velocidad y aumente la distancia de seguridad.";
        hasAlert = true;
        break;
      case 'tormenta':
        temp = 19;
        humidity = 92;
        windSpeed = 38;
        alertTitle = "Alerta de Tormenta Eléctrica";
        alertDesc = "Aviso meteorológico: Tormentas fuertes con abundante caída de agua, actividad eléctrica y ráfagas en la ruta seleccionada.";
        hasAlert = true;
        break;
      case 'niebla':
        temp = 14;
        humidity = 98;
        windSpeed = 5;
        alertTitle = "Alerta de Niebla Intensa";
        alertDesc = "Visibilidad reducida a menos de 50 metros en el tramo actual de la carretera. Encienda luces bajas.";
        hasAlert = true;
        break;
      case 'viento':
        temp = 29;
        humidity = 25;
        windSpeed = 55;
        alertTitle = "Alerta de Vientos Fuertes";
        alertDesc = "Vientos intensos con ráfagas de hasta 55 km/h en el trayecto actual. Sujete el volante firmemente.";
        hasAlert = true;
        break;
    }

    const updatedWeather = { condition, temp, humidity, windSpeed, alertTitle, alertDesc, hasAlert };
    setWeather(updatedWeather);

    // Filter out previous weather alerts and push the new one
    setAlerts(prev => {
      const remaining = prev.filter(a => a.type !== 'weather');
      if (hasAlert) {
        const newWeatherAlert: RouteAlert = {
          id: `weather-dyn-${Date.now()}`,
          type: 'weather',
          severity: condition === 'tormenta' ? 'high' : 'medium',
          title: alertTitle,
          desc: alertDesc
        };
        return [newWeatherAlert, ...remaining];
      }
      return remaining;
    });

    addNotification(`Clima: ${condition.toUpperCase()} ${temp}°C`);
    
    const condSp = condition === 'despejado' ? 'Despejado' :
                   condition === 'lluvia' ? 'Lluvia moderada' :
                   condition === 'tormenta' ? 'Tormenta eléctrica' :
                   condition === 'niebla' ? 'Niebla intensa' : 'Vientos intensos';
    
    speakAloud(`El clima ha cambiado a ${condSp}. ${hasAlert ? alertDesc : 'No se registran alertas meteorológicas activas en tu ruta.'}`);
  };

  // Add notification to active tray
  const addNotification = (text: string) => {
    setNotifications(prev => [text, ...prev.slice(0, 4)]);
  };

  // Analyze route via server Gemini API
  const handleAnalyzeRoute = async (customCommand?: string) => {
    // Instantly update active travel notification
    const origPart = originInput.split(',')[0].trim() || "Origen";
    const destPart = destinationInput.split(',')[0].trim() || "Destino";
    addNotification(`Viaje activo: ${origPart} ➔ ${destPart}`);

    try {
      const res = await fetch('/api/copilot/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentRoute: `${originInput} -> ${destinationInput}`,
          origin: originInput,
          destination: destinationInput,
          voiceCommand: customCommand || "",
          offlineMode: isOffline,
          vehicleType: transportMode
        })
      });
      const data = await res.json();
      if (data.success) {
        setCopilotResponse(data.copilotSpeech);
        speakAloud(data.copilotSpeech);
        
        if (data.alerts && data.alerts.length > 0) {
          setAlerts(data.alerts);
          // Highlight critical alerts
          data.alerts.forEach((alert: RouteAlert) => {
            addNotification(`ALERTA: ${alert.title}. ${alert.desc}`);
          });
        }

        // Apply command action side-effects on client dashboard
        if (data.action) {
          handleActionSideEffect(data.action, customCommand || "");
        }
      } else {
        throw new Error("API success is false");
      }
    } catch (e) {
      console.error(e);
      const fallbackSpeech = `Buscando ruta inteligente alternativa desde ${origPart} hacia ${destPart}. Condiciones de tránsito normales en autopista. Conduzca con precaución.`;
      setCopilotResponse(fallbackSpeech);
      speakAloud(fallbackSpeech);
      addNotification("Co-piloto: Usando cobertura satelital de respaldo local.");
    }
  };

  const handleActionSideEffect = (action: string, command: string) => {
    const cmdLower = command.toLowerCase();
    if (action === "Radares" || cmdLower.includes("radar") || cmdLower.includes("velocidad")) {
      setActiveTab('map');
      addNotification("Mostrando radar de velocidad en tiempo real.");
    } else if (cmdLower.includes("nocturno") || cmdLower.includes("noche")) {
      setPreferences(prev => ({ ...prev, theme: 'night' }));
      addNotification("Modo conducción nocturna activado.");
    } else if (cmdLower.includes("día") || cmdLower.includes("diurno")) {
      setPreferences(prev => ({ ...prev, theme: 'day' }));
      addNotification("Modo diurno activado.");
    } else if (cmdLower.includes("calendario") || cmdLower.includes("sincronizar")) {
      setActiveTab('calendar');
      addNotification("Sincronizando calendario de viajes frecuentes.");
    }
  };

  // Triggered when car passes a radar in Map simulator
  const handleRadarTriggered = (radar: SpeedRadar) => {
    const msg = `Atención. Control de velocidad detectado. Radar ${radar.type} a continuación. Límite obligatorio de ${radar.speedLimit} kilómetros por hora. Reduzca velocidad.`;
    setCopilotResponse(msg);
    speakAloud(msg);
    addNotification(`CONTROL RADAR: Próximo Km ${radar.km}. Límite ${radar.speedLimit} km/h.`);
  };

  // Triggered when route conditions shift abruptly in Map simulator
  const handleAlertTriggered = (alert: RouteAlert) => {
    const msg = `Alerta de seguridad. ${alert.title}. ${alert.desc}`;
    setCopilotResponse(msg);
    speakAloud(msg);
    addNotification(`CAMBIO DE RUTA: ${alert.title}. ${alert.desc}`);
  };

  // Sync destination from a calendar event to navigation
  const handleNavigateToEvent = (location: string, title: string) => {
    setDestinationInput(location);
    addNotification(`Navegación configurada hacia: ${title} (${location})`);
    speakAloud(`Calculando ruta más segura hacia ${location} para tu evento ${title}.`);
    setActiveTab('map');
    handleAnalyzeRoute();
  };

  // Accent Color tailwind color mappings
  const accentBgs = {
    amber: 'bg-amber-500 text-white shadow-amber-500/20',
    blue: 'bg-blue-600 text-white shadow-blue-600/20',
    green: 'bg-green-600 text-white shadow-green-600/20',
    magenta: 'bg-magenta-600 text-white shadow-magenta-600/20',
    orange: 'bg-orange-500 text-white shadow-orange-500/20',
    coral: 'bg-rose-500 text-white shadow-rose-500/20',
    violet: 'bg-violet-600 text-white shadow-violet-600/20',
    teal: 'bg-teal-600 text-white shadow-teal-600/20',
    aurora: 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-emerald-500/20'
  };

  const borderFocusAccents = {
    amber: 'focus:border-amber-500 focus:ring-amber-500',
    blue: 'focus:border-blue-500 focus:ring-blue-500',
    green: 'focus:border-green-500 focus:ring-green-500',
    magenta: 'focus:border-magenta-500 focus:ring-magenta-500',
    orange: 'focus:border-orange-500 focus:ring-orange-500',
    coral: 'focus:border-rose-500 focus:ring-rose-500',
    violet: 'focus:border-violet-500 focus:ring-violet-500',
    teal: 'focus:border-teal-500 focus:ring-teal-500',
    aurora: 'focus:border-emerald-500 focus:ring-emerald-500'
  };

  const textAccents = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    magenta: 'text-magenta-500',
    orange: 'text-orange-500',
    coral: 'text-rose-500',
    violet: 'text-violet-500',
    teal: 'text-teal-500',
    aurora: 'text-cyan-400'
  };

  const accentColor = textAccents[preferences.colorAccent];
  const activeAccentBg = accentBgs[preferences.colorAccent];
  const activeFocus = borderFocusAccents[preferences.colorAccent];

  // Render Android / iOS phone frames or bare view
  const renderDashboardContent = () => (
    <div className="w-full max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
      
      {/* Left Column: Tactics Controller, Voice, Status & Customizer (5 cols) */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        
        {/* Quick Driver Controls Console */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4" id="quick-controls-console">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 font-mono">Consola del Vehículo</span>
              <h2 className="text-lg font-bold text-slate-100">Control de Cabina</h2>
            </div>
            
            {/* Offline/Online toggle */}
            <button
              id="toggle-offline-mode"
              onClick={() => {
                setIsOffline(!isOffline);
                const status = !isOffline ? "Modo sin conexión satelital activado." : "De vuelta en línea con mapas de Google.";
                addNotification(status);
                speakAloud(status);
              }}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                isOffline 
                  ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' 
                  : 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
              }`}
            >
              {isOffline ? <WifiOff className="w-4 h-4" /> : <Wifi className="w-4 h-4" />}
              <span>{isOffline ? 'Offline Activo' : 'Online'}</span>
            </button>
          </div>

          {/* Reloj Inteligente de Cabina - Dynamic Date, Time, Year */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex items-center justify-between font-mono text-xs">
            <div className="flex items-center gap-2.5">
              <Clock className="w-4 h-4 text-indigo-400 animate-pulse" />
              <div className="flex flex-col text-left">
                <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider font-sans leading-none">Reloj Co-Piloto</span>
                <span className="text-slate-100 font-bold mt-1 text-[13px] tracking-tight">{formatTime(currentDateTime)}</span>
              </div>
            </div>
            <div className="text-right flex flex-col justify-center">
              <span className="text-[10px] font-black uppercase text-indigo-400 tracking-widest font-sans leading-none">Fecha de Viaje</span>
              <span className="text-slate-400 font-semibold mt-1 text-[10.5px] truncate">{formatDate(currentDateTime)}</span>
            </div>
          </div>

          {/* Destination Form input tactil */}
          <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900 flex flex-col gap-2.5 relative">
            <div className="flex justify-between items-center">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Planificador de Ruta Global</span>
              
              {/* Satellite GPS button */}
              <button
                type="button"
                id="connect-gps-satellite-btn"
                onClick={handleConnectSatelliteGPS}
                className={`px-2 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer ${
                  gpsStatus === 'connected'
                    ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-black shadow-sm'
                    : gpsStatus === 'searching'
                    ? 'bg-blue-500/10 text-blue-400 border border-blue-500/30 animate-pulse'
                    : 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-500/20'
                }`}
              >
                <span>🛰️</span>
                <span>
                  {gpsStatus === 'connected' ? 'GPS Celular Activo' : gpsStatus === 'searching' ? 'Buscando...' : 'Conectar GPS Celular'}
                </span>
              </button>
            </div>

            {/* Selector de Vehículo y Medio de Transporte */}
            <div className="flex flex-col gap-1 bg-slate-100 dark:bg-slate-900/50 p-2 rounded-xl border border-slate-200/50 dark:border-slate-800/60">
              <span className="text-[9px] text-slate-400 font-black uppercase tracking-wider block text-left">Vehículo / Tipo de Transporte</span>
              <div className="grid grid-cols-5 gap-1.5 mt-1">
                <button
                  type="button"
                  id="vehicle-auto-btn"
                  onClick={() => {
                    setTransportMode('auto');
                    setCurrentSpeed(85);
                    speakAloud("Modo automóvil seleccionado. Listo para calcular tiempos en carretera.");
                    addNotification("Transporte: Automóvil seleccionado.");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'auto'
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">🚗</span>
                  <span className="text-[9px] font-bold leading-none">Auto</span>
                </button>

                <button
                  type="button"
                  id="vehicle-moto-btn"
                  onClick={() => {
                    setTransportMode('moto');
                    setCurrentSpeed(90);
                    speakAloud("Modo motocicleta seleccionado. Recuerda usar casco y conducir a velocidad moderada.");
                    addNotification("Transporte: Motocicleta seleccionada.");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'moto'
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">🏍️</span>
                  <span className="text-[9px] font-bold leading-none">Moto</span>
                </button>

                <button
                  type="button"
                  id="vehicle-bici-btn"
                  onClick={() => {
                    setTransportMode('bicicleta');
                    setCurrentSpeed(18);
                    speakAloud("Modo bicicleta seleccionado. Planificando ruta apta para ciclovías y vías secundarias.");
                    addNotification("Transporte: Bicicleta seleccionada.");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'bicicleta'
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">🚲</span>
                  <span className="text-[9px] font-bold leading-none">Bici</span>
                </button>

                <button
                  type="button"
                  id="vehicle-scooter-btn"
                  onClick={() => {
                    setTransportMode('monopatin');
                    setCurrentSpeed(15);
                    speakAloud("Modo monopatín eléctrico seleccionado. Optimizado para veredas y ciclovías urbanas.");
                    addNotification("Transporte: Monopatín eléctrico seleccionado.");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'monopatin'
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">🛹</span>
                  <span className="text-[9px] font-bold leading-none">Scooter</span>
                </button>

                <button
                  type="button"
                  id="vehicle-camion-btn"
                  onClick={() => {
                    setTransportMode('camion');
                    setCurrentSpeed(70);
                    speakAloud("Modo camión seleccionado. Monitoreando límites de peso, altura y velocidad comercial.");
                    addNotification("Transporte: Camión seleccionado.");
                  }}
                  className={`py-1.5 px-1 rounded-lg text-[10px] font-bold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                    transportMode === 'camion'
                      ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                      : 'text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200 hover:bg-slate-200/50 dark:hover:bg-slate-800/50'
                  }`}
                >
                  <span className="text-sm">🚛</span>
                  <span className="text-[9px] font-bold leading-none">Camión</span>
                </button>
              </div>
            </div>

            {/* GPS Status Indicator banner if connected */}
            {gpsStatus === 'connected' && (
              <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-2 text-[10px] text-emerald-400 font-mono flex items-center justify-between">
                <span>🛰️ GPS Celular Sincronizado</span>
                <span>Precisión: {gpsCoords ? `${Math.round(gpsCoords.accuracy)}m` : '8m'}</span>
              </div>
            )}
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 relative">
              {/* Origen Input with Suggestions */}
              <div className="flex flex-col gap-0.5 relative">
                <label className="text-[9px] text-slate-400 uppercase font-black">Origen</label>
                <input
                  id="route-origin"
                  type="text"
                  value={originInput}
                  onChange={(e) => handleOriginChange(e.target.value)}
                  onFocus={() => setShowOriginSuggestions(originSuggestions.length > 0 || isSearchingOrigin)}
                  onBlur={() => setTimeout(() => setShowOriginSuggestions(false), 250)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${activeFocus} text-slate-800 dark:text-slate-200`}
                  placeholder="Ej: Resistencia"
                />
                
                {(showOriginSuggestions && (originSuggestions.length > 0 || isSearchingOrigin)) && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto z-50 shadow-2xl">
                    {isSearchingOrigin && (
                      <div className="px-2.5 py-1.5 text-[10px] text-slate-400 font-medium flex items-center gap-1.5 animate-pulse border-b border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        Buscando ciudades en el mundo...
                      </div>
                    )}
                    {originSuggestions.map((city, idx) => (
                      <button
                        key={`${city.display}-${idx}`}
                        type="button"
                        onMouseDown={() => {
                          setOriginInput(city.display);
                          setOriginCoords({ lat: city.lat, lng: city.lng });
                          setShowOriginSuggestions(false);
                          addNotification(`Origen configurado: ${city.display}`);
                          speakAloud(`Origen fijado en ${city.display.split(',')[0]}.`);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800 border-b border-slate-850 last:border-b-0"
                      >
                        📍 {city.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Destino Input with Suggestions */}
              <div className="flex flex-col gap-0.5 relative">
                <label className="text-[9px] text-slate-400 uppercase font-black">Destino</label>
                <input
                  id="route-destination"
                  type="text"
                  value={destinationInput}
                  onChange={(e) => handleDestChange(e.target.value)}
                  onFocus={() => setShowDestSuggestions(destSuggestions.length > 0 || isSearchingDest)}
                  onBlur={() => setTimeout(() => setShowDestSuggestions(false), 250)}
                  className={`w-full px-2.5 py-1.5 text-xs rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 ${activeFocus} text-slate-800 dark:text-slate-200`}
                  placeholder="Ej: Presidencia"
                />

                {(showDestSuggestions && (destSuggestions.length > 0 || isSearchingDest)) && (
                  <div className="absolute left-0 right-0 top-full mt-1 bg-slate-900 border border-slate-700 rounded-lg max-h-40 overflow-y-auto z-50 shadow-2xl">
                    {isSearchingDest && (
                      <div className="px-2.5 py-1.5 text-[10px] text-slate-400 font-medium flex items-center gap-1.5 animate-pulse border-b border-slate-850">
                        <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping" />
                        Buscando ciudades en el mundo...
                      </div>
                    )}
                    {destSuggestions.map((city, idx) => (
                      <button
                        key={`${city.display}-${idx}`}
                        type="button"
                        onMouseDown={() => {
                          setDestinationInput(city.display);
                          setDestinationCoords({ lat: city.lat, lng: city.lng });
                          setShowDestSuggestions(false);
                          addNotification(`Destino configurado: ${city.display}`);
                          speakAloud(`Destino establecido hacia ${city.display.split(',')[0]}.`);
                        }}
                        className="w-full text-left px-2.5 py-1.5 text-[11px] text-slate-200 hover:bg-slate-800 border-b border-slate-850 last:border-b-0"
                      >
                        🏁 {city.display}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button
              id="analyze-route-btn"
              onClick={() => handleAnalyzeRoute()}
              className={`w-full py-2.5 text-xs font-black uppercase rounded-xl transition-all tracking-wider ${activeAccentBg}`}
            >
              Iniciar Navegación / Buscar Alertas
            </button>
          </div>

          {/* Quick Simulation controls */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              id="simulate-driving-toggle"
              onClick={() => {
                setIsDriving(!isDriving);
                const status = !isDriving ? "Simulador de conducción iniciado. El auto avanza por la autopista." : "Conducción pausada.";
                addNotification(status);
                speakAloud(status);
              }}
              className={`py-2 px-3 rounded-xl text-xs font-bold text-center border transition-all cursor-pointer ${
                isDriving 
                  ? 'bg-red-500/10 text-red-500 border-red-500/30' 
                  : 'bg-blue-500/10 text-blue-500 border-blue-500/30'
              }`}
            >
              {isDriving ? 'Detener Simulación' : 'Simular Conducir'}
            </button>

            <button
              id="toggle-mute-tts"
              onClick={() => setPreferences(prev => ({ ...prev, voiceReadAloudEnabled: !prev.voiceReadAloudEnabled }))}
              className={`py-2 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border transition-all cursor-pointer ${
                preferences.voiceReadAloudEnabled 
                  ? 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30' 
                  : 'bg-slate-500/10 text-slate-500 border-slate-500/30'
              }`}
            >
              {preferences.voiceReadAloudEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span>{preferences.voiceReadAloudEnabled ? 'Voz Activada' : 'Voz Silenciada'}</span>
            </button>
          </div>
        </div>

        {/* Weather Monitor Card (Clima y Alertas Chaco) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4" id="weather-monitor-card">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-mono">Monitoreo de Clima</span>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2">
                <span>🛰️</span> Clima en Ruta de Chaco
              </h2>
            </div>
            {/* Active alert indicator */}
            {weather.hasAlert && (
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-red-500/25 text-red-400 border border-red-500/40 animate-pulse uppercase tracking-wider">
                Alerta Activa
              </span>
            )}
          </div>

          {/* Current weather primary display */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-850 grid grid-cols-12 gap-3 items-center">
            <div className="col-span-4 flex flex-col items-center justify-center text-center border-r border-slate-800 py-1">
              {weather.condition === 'despejado' && <Sun className="w-8 h-8 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.3)]" />}
              {weather.condition === 'lluvia' && <CloudRain className="w-8 h-8 text-blue-400 drop-shadow-[0_0_8px_rgba(96,165,250,0.3)]" />}
              {weather.condition === 'tormenta' && <CloudLightning className="w-8 h-8 text-purple-400 drop-shadow-[0_0_8px_rgba(192,132,252,0.3)]" />}
              {weather.condition === 'niebla' && <CloudFog className="w-8 h-8 text-slate-400 drop-shadow-[0_0_8px_rgba(148,163,184,0.3)]" />}
              {weather.condition === 'viento' && <Wind className="w-8 h-8 text-teal-400 drop-shadow-[0_0_8px_rgba(45,212,191,0.3)]" />}
              
              <span className="text-[11px] font-black uppercase tracking-wider text-slate-300 mt-1.5 leading-none">
                {weather.condition === 'despejado' ? 'Despejado' :
                 weather.condition === 'lluvia' ? 'Lluvia' :
                 weather.condition === 'tormenta' ? 'Tormenta' :
                 weather.condition === 'niebla' ? 'Niebla' : 'Viento Nte'}
              </span>
            </div>

            <div className="col-span-8 pl-1 flex flex-col gap-1.5">
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-black text-slate-100">{weather.temp}°C</span>
                <span className="text-[10px] text-slate-500">Chaco, AR</span>
              </div>
              <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 text-[10px] text-slate-400 font-mono">
                <div className="flex items-center gap-1">
                  <Thermometer className="w-3 h-3 text-slate-500" />
                  <span>Hum: {weather.humidity}%</span>
                </div>
                <div className="flex items-center gap-1">
                  <Wind className="w-3 h-3 text-slate-500" />
                  <span>Vto: {weather.windSpeed} km/h</span>
                </div>
              </div>
            </div>
          </div>

          {/* Active alert detail banner */}
          {weather.hasAlert ? (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 flex flex-col gap-1 relative overflow-hidden">
              <div className="flex items-center gap-1.5 text-red-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span>{weather.alertTitle}</span>
              </div>
              <p className="text-[10.5px] text-slate-300 leading-relaxed font-medium">
                {weather.alertDesc}
              </p>
              
              {/* Listen to Voice report */}
              <button
                type="button"
                id="listen-weather-alert-btn"
                onClick={() => speakAloud(`Atención copiloto. Alerta climática activa: ${weather.alertTitle}. ${weather.alertDesc}`)}
                className="mt-1.5 self-start px-2 py-1 rounded bg-red-500/15 text-red-300 border border-red-500/20 text-[9px] font-black uppercase tracking-wider hover:bg-red-500/25 transition-colors cursor-pointer flex items-center gap-1"
              >
                <Volume2 className="w-3.5 h-3.5" />
                Escuchar Alerta por Voz
              </button>
            </div>
          ) : (
            <div className="bg-slate-950 p-3 rounded-xl border border-slate-850 text-center py-4">
              <p className="text-xs text-slate-400 font-medium flex items-center justify-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Ruta Segura: Sin alertas climáticas activas
              </p>
            </div>
          )}

          {/* Simulator Quick Change weather condition pills */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Simular Escenario de Clima</span>
            <div className="grid grid-cols-5 gap-1.5">
              {(['despejado', 'lluvia', 'tormenta', 'niebla', 'viento'] as const).map((cond) => {
                const colors = {
                  despejado: 'border-amber-500/30 hover:bg-amber-500/10 text-amber-400 bg-amber-500/5',
                  lluvia: 'border-blue-500/30 hover:bg-blue-500/10 text-blue-400 bg-blue-500/5',
                  tormenta: 'border-purple-500/30 hover:bg-purple-500/10 text-purple-400 bg-purple-500/5',
                  niebla: 'border-slate-500/30 hover:bg-slate-500/10 text-slate-400 bg-slate-500/5',
                  viento: 'border-teal-500/30 hover:bg-teal-500/10 text-teal-400 bg-teal-500/5',
                };
                const activeColors = {
                  despejado: 'bg-amber-500 text-slate-950 border-amber-500 font-bold',
                  lluvia: 'bg-blue-500 text-slate-950 border-blue-500 font-bold',
                  tormenta: 'bg-purple-500 text-slate-950 border-purple-500 font-bold',
                  niebla: 'bg-slate-500 text-slate-950 border-slate-500 font-bold',
                  viento: 'bg-teal-500 text-slate-950 border-teal-500 font-bold',
                };
                const labels = {
                  despejado: 'Soleado',
                  lluvia: 'Lluvia',
                  tormenta: 'Tormenta',
                  niebla: 'Niebla',
                  viento: 'Viento',
                };
                return (
                  <button
                    key={cond}
                    id={`weather-sim-${cond}`}
                    onClick={() => handleWeatherChange(cond)}
                    className={`py-1.5 rounded-lg border text-[10px] text-center font-bold transition-all cursor-pointer ${
                      weather.condition === cond ? activeColors[cond] : colors[cond]
                    }`}
                  >
                    {labels[cond]}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Real-Time hands-free Voice commands panel */}
        <VoiceController
          onVoiceCommand={(cmd) => handleAnalyzeRoute(cmd)}
          copilotResponseText={copilotResponse}
          isListeningExternal={isListening}
          onListeningChange={(state) => setIsListening(state)}
          preferences={preferences}
        />

        {/* Connection Control Card (Wi-Fi & Bluetooth Panel) */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4" id="connections-control-card">
          <div className="flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-black tracking-wider text-indigo-400 font-mono">CONECTIVIDAD DE CABINA</span>
              <h2 className="text-sm font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                <Wifi className="w-4 h-4 text-indigo-400" />
                <span>Panel de Conexiones</span>
              </h2>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
              {wifiEnabled && wifiStatus === 'connected' ? 'ONLINE' : 'DESCONECTADO'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Wi-Fi Column */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Wifi className={`w-4 h-4 ${wifiEnabled && wifiStatus === 'connected' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  Conexión Wi-Fi
                </span>
                
                {/* Toggle Wi-Fi Switch */}
                <button
                  id="toggle-wifi-btn"
                  onClick={() => {
                    const next = !wifiEnabled;
                    setWifiEnabled(next);
                    if (!next) {
                      setWifiStatus('disconnected');
                      addNotification("Wi-Fi desactivado.");
                      speakAloud("Wi-Fi desactivado. El streaming de música de YouTube no estará disponible.");
                    } else {
                      setWifiStatus('connecting');
                      addNotification("Buscando redes Wi-Fi...");
                      setTimeout(() => {
                        setWifiStatus('connected');
                        addNotification("Conectado a Cabina-Inteligente-LTE.");
                        speakAloud("Conectado con éxito a la red Cabina Inteligente L T E.");
                      }, 1200);
                    }
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${wifiEnabled ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${wifiEnabled ? 'translate-x-4' : ''}`} />
                </button>
              </div>

              {wifiEnabled ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Red Actual:</span>
                    <span className="font-bold text-slate-200">{wifiStatus === 'connected' ? wifiSSID : wifiStatus === 'connecting' ? 'Conectando...' : 'Ninguna'}</span>
                  </div>

                  {/* Available WiFi Networks selector list */}
                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Redes Disponibles (Chaco)</span>
                    {[
                      { ssid: 'Cabina-Inteligente-LTE', label: 'Cabina Inteligente (LTE/5G)', speed: 'Excelente' },
                      { ssid: 'Ruta-16-Aero-Net', label: 'Ruta 16 Aero Net', speed: 'Media' },
                      { ssid: 'Peaje-Makalle-WiFi-Libre', label: 'Peaje Makallé Libre', speed: 'Abierta' },
                      { ssid: 'YPF-Full-Chaco', label: 'YPF Full Plaza', speed: 'Inestable' }
                    ].map((net) => {
                      const isActive = wifiStatus === 'connected' && wifiSSID === net.ssid;
                      return (
                        <button
                          key={net.ssid}
                          id={`wifi-net-${net.ssid}`}
                          onClick={() => {
                            setWifiStatus('connecting');
                            addNotification(`Conectando a ${net.ssid}...`);
                            speakAloud(`Conectando a la red ${net.label}.`);
                            setTimeout(() => {
                              setWifiStatus('connected');
                              setWifiSSID(net.ssid);
                              addNotification(`Wi-Fi: Conectado a ${net.ssid}`);
                              speakAloud(`Conectado con éxito a ${net.label}.`);
                            }, 1000);
                          }}
                          className={`w-full text-left p-1.5 rounded-lg border text-[10px] flex justify-between items-center transition-all cursor-pointer ${
                            isActive 
                              ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300 font-bold' 
                              : 'bg-slate-900 border-slate-900 hover:bg-slate-850 text-slate-400'
                          }`}
                        >
                          <span>{net.label}</span>
                          <span className="text-[8px] font-mono px-1 bg-slate-950 border border-slate-900 rounded text-slate-500">{net.speed}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-[11px] font-medium font-mono">
                  Wi-Fi Desactivado
                </div>
              )}
            </div>

            {/* Bluetooth Column */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-850 flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-slate-200 flex items-center gap-1.5">
                  <Bluetooth className={`w-4 h-4 ${bluetoothEnabled && bluetoothStatus === 'connected' ? 'text-indigo-400' : 'text-slate-500'}`} />
                  Canal Bluetooth
                </span>
                
                {/* Toggle Bluetooth Switch */}
                <button
                  id="toggle-bluetooth-btn"
                  onClick={() => {
                    const next = !bluetoothEnabled;
                    setBluetoothEnabled(next);
                    if (!next) {
                      disconnectBluetooth();
                    } else {
                      addNotification("Bluetooth activado.");
                      speakAloud("Bluetooth activado. Buscando dispositivos vinculados.");
                      connectBluetooth("iPhone de Gerardo");
                    }
                  }}
                  className={`w-9 h-5 rounded-full transition-colors relative cursor-pointer ${bluetoothEnabled ? 'bg-indigo-600' : 'bg-slate-800'}`}
                >
                  <span className={`absolute top-0.5 left-0.5 bg-white w-4 h-4 rounded-full transition-transform ${bluetoothEnabled ? 'translate-x-4' : ''}`} />
                </button>
              </div>

              {bluetoothEnabled ? (
                <div className="flex flex-col gap-2">
                  <div className="text-[10px] text-slate-400 font-mono flex items-center justify-between">
                    <span>Dispositivo:</span>
                    <span className="font-bold text-slate-200">{bluetoothStatus === 'connected' ? pairedDevice : bluetoothStatus === 'connecting' ? 'Buscando...' : 'Desconectado'}</span>
                  </div>

                  <div className="flex flex-col gap-1 mt-1">
                    <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider font-mono">Dispositivos en Rango</span>
                    {bluetoothDevices.map((device) => {
                      const isPaired = pairedDevice === device && bluetoothStatus === 'connected';
                      return (
                        <button
                          key={device}
                          id={`bt-dev-${device.replace(/\s+/g, '-')}`}
                          onClick={() => {
                            if (isPaired) {
                              disconnectBluetooth();
                            } else {
                              connectBluetooth(device);
                            }
                          }}
                          className={`w-full text-left p-1.5 rounded-lg border text-[10px] flex justify-between items-center transition-all cursor-pointer ${
                            isPaired 
                              ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300 font-bold' 
                              : 'bg-slate-900 border-slate-900 hover:bg-slate-850 text-slate-400'
                          }`}
                        >
                          <span>{device}</span>
                          <span className="text-[8px] uppercase font-mono px-1 bg-slate-950 border border-slate-900 rounded text-slate-500">
                            {isPaired ? 'Sincro' : 'Sincronizar'}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500 text-[11px] font-medium font-mono">
                  Bluetooth Desactivado
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Dynamic customize overlay config card */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-3.5" id="customization-card">
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 font-mono">Personalizar Interfaz</span>
          <h3 className="text-sm font-bold text-slate-100">Ajustes del Dashboard</h3>
          
          <div className="grid grid-cols-2 gap-3 text-xs">
            {/* Theme Toggle */}
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Tema de Pantalla</label>
              <div className="grid grid-cols-3 gap-1 bg-slate-50 dark:bg-slate-950 p-1 rounded-lg border border-slate-200 dark:border-slate-800">
                <button
                  id="theme-day-btn"
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'day' }))}
                  className={`p-1 rounded flex justify-center cursor-pointer ${preferences.theme === 'day' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Modo Día"
                >
                  <Sun className="w-3.5 h-3.5" />
                </button>
                <button
                  id="theme-night-btn"
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'night' }))}
                  className={`p-1 rounded flex justify-center cursor-pointer ${preferences.theme === 'night' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Modo Noche"
                >
                  <Moon className="w-3.5 h-3.5" />
                </button>
                <button
                  id="theme-auto-btn"
                  onClick={() => setPreferences(prev => ({ ...prev, theme: 'auto' }))}
                  className={`p-1 rounded flex justify-center text-[9px] font-bold cursor-pointer ${preferences.theme === 'auto' ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow' : 'text-slate-400 hover:text-slate-600'}`}
                  title="Automático Conducción Nocturna"
                >
                  AUTO
                </button>
              </div>
            </div>

            {/* Accent selection */}
            <div className="flex flex-col gap-1">
              <div className="flex justify-between items-center">
                <label className="text-[10px] text-slate-400 font-bold uppercase">Color de Acento (Vibrante)</label>
                <span className="text-[9px] font-black uppercase text-indigo-400">Colores Lindos</span>
              </div>
              <div className="flex flex-wrap gap-1 bg-slate-50 dark:bg-slate-950 p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 justify-around">
                {(['blue', 'amber', 'green', 'magenta', 'orange', 'coral', 'violet', 'teal', 'aurora'] as const).map((color) => {
                  const circleColors = {
                    blue: 'bg-blue-500',
                    amber: 'bg-amber-500',
                    green: 'bg-green-500',
                    magenta: 'bg-magenta-500',
                    orange: 'bg-orange-500',
                    coral: 'bg-rose-500',
                    violet: 'bg-violet-500',
                    teal: 'bg-teal-500',
                    aurora: 'bg-gradient-to-tr from-emerald-400 to-cyan-400'
                  };
                  return (
                    <button
                      key={color}
                      id={`accent-${color}`}
                      onClick={() => setPreferences(prev => ({ ...prev, colorAccent: color }))}
                      className={`w-5 h-5 rounded-full ${circleColors[color]} cursor-pointer ring-offset-2 transition-transform ${preferences.colorAccent === color ? 'ring-2 ring-indigo-500 scale-115' : 'hover:scale-110'}`}
                      title={color.toUpperCase()}
                    />
                  );
                })}
              </div>
            </div>
          </div>

          {/* Device shells selector */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Simulador de Sistemas & Dispositivos</label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              <button
                id="frame-none-btn"
                onClick={() => setDeviceFrame('none')}
                className={`py-1.5 px-1 rounded text-[9px] font-bold border transition-colors cursor-pointer text-center ${deviceFrame === 'none' ? 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
              >
                Web Completo
              </button>
              <button
                id="frame-android-btn"
                onClick={() => setDeviceFrame('android')}
                className={`py-1.5 px-1 rounded text-[9px] font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${deviceFrame === 'android' ? 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
              >
                <Smartphone className="w-2.5 h-2.5 text-green-500" />
                <span>Android</span>
              </button>
              <button
                id="frame-ios-btn"
                onClick={() => setDeviceFrame('ios')}
                className={`py-1.5 px-1 rounded text-[9px] font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${deviceFrame === 'ios' ? 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
              >
                <Smartphone className="w-2.5 h-2.5 text-sky-500" />
                <span>iOS / Móvil</span>
              </button>
              <button
                id="frame-watch-btn"
                onClick={() => setDeviceFrame('watch')}
                className={`py-1.5 px-1 rounded text-[9px] font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${deviceFrame === 'watch' ? 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
                title="Reloj Inteligente"
              >
                <Watch className="w-2.5 h-2.5 text-rose-400" />
                <span>Reloj</span>
              </button>
              <button
                id="frame-carplay-btn"
                onClick={() => setDeviceFrame('carplay')}
                className={`py-1.5 px-1 rounded text-[9px] font-bold border transition-colors cursor-pointer flex items-center justify-center gap-1 ${deviceFrame === 'carplay' ? 'bg-slate-100 dark:bg-slate-850 border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 shadow-sm' : 'border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600'}`}
                title="CarPlay Dashboard"
              >
                <Tablet className="w-2.5 h-2.5 text-amber-400" />
                <span>CarPlay</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Dynamic Screens & Widgets Tabs (7 cols) */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        
        {/* Real-time Push alert notifications feed */}
        <div className="bg-slate-900 border border-slate-800 p-4 rounded-2xl shadow-xl flex items-center gap-4 relative overflow-hidden shrink-0">
          <div className="p-2.5 rounded-full bg-slate-850 border border-slate-800 shrink-0 text-amber-400">
            <Bell className="w-5 h-5 animate-bounce" />
          </div>
          <div className="flex-1 overflow-hidden">
            <span className="block text-[9px] font-black text-amber-500 uppercase tracking-widest">Feed de Alertas Críticas (Voz Activa)</span>
            <div className="h-6 overflow-hidden mt-0.5">
              <p className="text-xs font-semibold text-slate-100 animate-fade-in truncate">
                {notifications[0] || "Escaneando estado de peajes, tráfico y radares de velocidad..."}
              </p>
            </div>
          </div>
          <span className="text-[9px] font-mono font-bold text-slate-500 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
            VIVO
          </span>
        </div>

        {/* Screen/View Widget selector tab bar */}
        <div className="bg-slate-900 border border-slate-800 p-1.5 rounded-2xl shadow-sm flex gap-1 justify-between select-none">
          <button
            id="tab-map-btn"
            onClick={() => setActiveTab('map')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'map' ? activeAccentBg : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Compass className="w-4 h-4" />
            <span>Mapa GPS</span>
          </button>
          
          <button
            id="tab-fuel-btn"
            onClick={() => setActiveTab('fuel')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'fuel' ? activeAccentBg : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Fuel className="w-4 h-4" />
            <span>Combustible</span>
          </button>

          <button
            id="tab-maintenance-btn"
            onClick={() => setActiveTab('maintenance')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'maintenance' ? activeAccentBg : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Wrench className="w-4 h-4" />
            <span>Mantenimiento</span>
          </button>

          <button
            id="tab-calendar-btn"
            onClick={() => setActiveTab('calendar')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'calendar' ? activeAccentBg : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'}`}
          >
            <Calendar className="w-4 h-4" />
            <span>Calendario</span>
          </button>

          <button
            id="tab-whatsapp-btn"
            onClick={() => setActiveTab('whatsapp')}
            className={`flex-1 py-2 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${activeTab === 'whatsapp' ? 'bg-emerald-600 text-white shadow-emerald-500/20' : 'text-slate-400 hover:text-emerald-400 hover:bg-slate-800'}`}
          >
            <MessageSquare className="w-4 h-4" />
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Primary Screen Render block */}
        <div className="flex-1 min-h-[380px]">
          {activeTab === 'map' && (
            <NavigationMap
              alerts={alerts}
              radars={radars}
              currentSpeed={currentSpeed}
              preferences={preferences}
              isDriving={isDriving}
              onSpeedChange={(s) => setCurrentSpeed(s)}
              onRadarTriggered={handleRadarTriggered}
              onAlertTriggered={handleAlertTriggered}
              isOffline={isOffline}
              origin={originInput}
              destination={destinationInput}
              originCoords={originCoords}
              destinationCoords={destinationCoords}
              transportMode={transportMode}
            />
          )}

          {activeTab === 'fuel' && (
            <FuelLogs
              logs={fuelLogs}
              onAddLog={handleAddFuelLog}
              preferences={preferences}
            />
          )}

          {activeTab === 'maintenance' && (
            <MaintenancePredictor
              currentMileage={currentMileage}
              onMileageChange={(m) => setCurrentMileage(m)}
              preferences={preferences}
            />
          )}



          {activeTab === 'whatsapp' && (
            <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white animate-fade-in" id="whatsapp-panel">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div>
                  <span className="text-[9px] uppercase font-black tracking-widest text-emerald-400 font-mono block">ASISTENTE CO-PILOTO MANOS LIBRES</span>
                  <h2 className="text-base font-black text-slate-100 flex items-center gap-1.5 mt-0.5">
                    <MessageSquare className="w-5 h-5 text-emerald-500 fill-emerald-500/20" />
                    WhatsApp Copilot Hub
                  </h2>
                </div>
                <div className="flex gap-2 w-full sm:w-auto">
                  <button
                    id="simulate-wa-msg"
                    onClick={simulateNewWhatsAppMessage}
                    className="w-full sm:w-auto px-3 py-1.5 text-xs font-bold rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>💬</span>
                    <span>Simular Mensaje Nuevo</span>
                  </button>
                </div>
              </div>

              {/* Bluetooth pairing status bar inside WhatsApp */}
              <div className={`p-3.5 rounded-xl border flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 transition-all ${
                bluetoothStatus === 'connected' 
                  ? 'bg-emerald-950/25 border-emerald-500/35 text-emerald-200 shadow-md shadow-emerald-500/5' 
                  : 'bg-slate-950 border-slate-900 text-slate-400'
              }`}>
                <div className="flex items-center gap-2.5">
                  <div className={`p-2 rounded-lg ${bluetoothStatus === 'connected' ? 'bg-emerald-500/15 text-emerald-400' : 'bg-slate-900 text-slate-500'}`}>
                    <Bluetooth className={`w-4 h-4 ${bluetoothStatus === 'connected' ? 'animate-pulse' : ''}`} />
                  </div>
                  <div className="text-left">
                    <span className="text-[10px] font-black uppercase font-mono block leading-none text-slate-500">CANAL DE AUDIO Y CHAT</span>
                    <span className="text-xs font-bold mt-1 block">
                      {bluetoothStatus === 'connected' 
                        ? `Sincronizado vía Bluetooth con "${pairedDevice}"` 
                        : bluetoothStatus === 'connecting'
                        ? 'Sincronizando dispositivo móvil...'
                        : 'Dispositivo desconectado (Mensajería en Espera)'}
                    </span>
                  </div>
                </div>
                {bluetoothStatus === 'connected' ? (
                  <button
                    onClick={disconnectBluetooth}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 transition-colors cursor-pointer"
                  >
                    Desconectar Teléfono
                  </button>
                ) : (
                  <button
                    onClick={() => connectBluetooth(bluetoothDevices[0])}
                    className="px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-emerald-600 hover:bg-emerald-700 text-slate-950 shadow transition-colors cursor-pointer"
                  >
                    Vincular Móvil
                  </button>
                )}
              </div>

              {/* Bluetooth Device Hub and WhatsApp Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
                
                {/* Left Side: Contacts & Bluetooth pairing list (5 cols) */}
                <div className="md:col-span-5 flex flex-col gap-4">
                  
                  {/* Bluetooth pairing selector */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col gap-2.5">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono block">Vínculos de Cabina (Bluetooth)</span>
                    <div className="flex flex-col gap-1.5">
                      {bluetoothDevices.map(device => {
                        const isThisDevice = pairedDevice === device;
                        const isConnectingThis = bluetoothStatus === 'connecting' && pairedDevice === device;
                        return (
                          <button
                            key={device}
                            onClick={() => isThisDevice ? disconnectBluetooth() : connectBluetooth(device)}
                            className={`w-full text-left p-2.5 rounded-xl border text-xs flex justify-between items-center transition-all cursor-pointer ${
                              isThisDevice 
                                ? 'bg-indigo-950/30 border-indigo-500/40 text-indigo-300 font-bold' 
                                : 'bg-slate-900/40 border-slate-900 hover:bg-slate-900 text-slate-400'
                            }`}
                          >
                            <span className="flex items-center gap-2">
                              <Bluetooth className={`w-4 h-4 ${isThisDevice ? 'text-indigo-400' : 'text-slate-600'}`} />
                              <span>{device}</span>
                            </span>
                            <span className="text-[9px] font-bold uppercase font-mono px-1.5 py-0.5 rounded bg-slate-950 border border-slate-905">
                              {isConnectingThis ? 'Conectando...' : isThisDevice ? 'Conectado' : 'Vincular'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Contacts List */}
                  <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex-1 flex flex-col gap-2.5 min-h-[220px]">
                    <span className="text-[9px] font-black uppercase text-slate-500 tracking-wider font-mono block">Bandeja de Chats Recientes</span>
                    <div className="flex flex-col gap-2 overflow-y-auto max-h-[250px] pr-1">
                      {whatsappMessages.map(msg => {
                        const isActive = activeWaChat === msg.id;
                        return (
                          <button
                            key={msg.id}
                            onClick={() => setActiveWaChat(msg.id)}
                            className={`w-full text-left p-3 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                              isActive
                                ? 'bg-slate-900 border-emerald-500/30 text-slate-100'
                                : 'bg-slate-900/20 border-slate-950 hover:bg-slate-900/60 text-slate-300'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 overflow-hidden">
                              <div className={`w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-xs font-black text-slate-950 ${msg.avatarColor}`}>
                                {msg.sender.charAt(0)}
                              </div>
                              <div className="overflow-hidden">
                                <span className="block text-xs font-bold truncate text-slate-200">{msg.sender}</span>
                                <span className="block text-[10px] text-slate-500 truncate mt-0.5 leading-tight">{msg.message}</span>
                              </div>
                            </div>
                            <div className="flex flex-col items-end shrink-0 pl-1.5">
                              <span className="text-[8px] text-slate-500 font-mono">{msg.time}</span>
                              {!msg.read && (
                                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 mt-1 animate-pulse" />
                              )}
                              {msg.replied && (
                                <span className="text-[10px] text-emerald-400 font-bold mt-1">✔✔</span>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                </div>

                {/* Right Side: Conversation Box (7 cols) */}
                <div className="md:col-span-7 bg-slate-950/50 rounded-xl border border-slate-900 p-4 flex flex-col justify-between min-h-[350px]">
                  {activeWaChat ? (() => {
                    const activeMsg = whatsappMessages.find(m => m.id === activeWaChat);
                    if (!activeMsg) return <p className="text-xs text-slate-500 text-center my-auto">Seleccione una conversación</p>;
                    return (
                      <div className="flex flex-col h-full justify-between gap-4">
                        
                        {/* Chat Header */}
                        <div className="flex justify-between items-center border-b border-slate-900 pb-2.5 shrink-0">
                          <div className="flex items-center gap-2.5">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-black text-slate-950 ${activeMsg.avatarColor}`}>
                              {activeMsg.sender.charAt(0)}
                            </div>
                            <div>
                              <span className="block text-xs font-black text-slate-100">{activeMsg.sender}</span>
                              <span className="block text-[9px] text-slate-500 uppercase font-mono font-bold">Vincular Celular • WhatsApp Activo</span>
                            </div>
                          </div>
                          <span className="text-[9px] text-slate-500 font-mono">{activeMsg.time}</span>
                        </div>

                        {/* Message Feed bubbles */}
                        <div className="flex-1 overflow-y-auto py-2 flex flex-col gap-3 min-h-[160px] max-h-[220px] pr-1">
                          {/* Received message bubble */}
                          <div className="self-start max-w-[85%] bg-slate-900 border border-slate-850 rounded-2xl p-3 text-xs leading-relaxed text-slate-200">
                            <p>{activeMsg.message}</p>
                            <div className="flex justify-end gap-1.5 items-center mt-3 border-t border-slate-800/40 pt-2">
                              <button
                                onClick={() => readMessageAloud(activeMsg)}
                                className="text-[10px] font-black uppercase text-emerald-400 hover:text-emerald-300 transition-colors flex items-center gap-1 cursor-pointer"
                              >
                                <span>🔊 Leer Mensaje por Voz</span>
                              </button>
                            </div>
                          </div>

                          {/* Reply bubble if already answered */}
                          {activeMsg.replied && (
                            <div className="self-end max-w-[85%] bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-3 text-xs text-emerald-100">
                              <span className="block text-[8px] font-black uppercase text-emerald-400 tracking-wider mb-1 font-mono">CONTESTADO POR VOZ (MANOS LIBRES)</span>
                              <p>{activeMsg.replyText}</p>
                              <div className="text-right text-[10px] text-emerald-400 mt-1.5 font-mono">
                                <span>Enviado ✔✔</span>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Interactive driving replies & text dictation */}
                        <div className="flex flex-col gap-2 border-t border-slate-900 pt-3 shrink-0">
                          <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 font-mono">Respuestas Rápidas Co-piloto (Seguro al Volante)</span>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                            {[
                              "Estoy manejando por Ruta 16, te aviso al parar 🚗",
                              "¡Sí! Ya pasé el peaje 👍",
                              "Hay niebla en el camino, voy despacio ⚠️",
                              "Entendido, muchas gracias. 🤝"
                            ].map(reply => (
                              <button
                                key={reply}
                                onClick={() => replyToMessage(activeMsg.id, reply)}
                                className="text-[10.5px] py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 transition-colors text-left cursor-pointer truncate"
                              >
                                {reply}
                              </button>
                            ))}
                          </div>

                          {/* Custom manual / dictation input */}
                          <form
                            onSubmit={(e) => {
                              e.preventDefault();
                              replyToMessage(activeMsg.id, newWaText);
                              setNewWaText('');
                            }}
                            className="flex gap-2 mt-2"
                          >
                            <input
                              type="text"
                              placeholder="Redactar o dictar respuesta personalizada..."
                              value={newWaText}
                              onChange={(e) => setNewWaText(e.target.value)}
                              className="flex-1 px-3 py-2 text-xs bg-slate-900 border border-slate-850 rounded-xl text-slate-200 placeholder-slate-500 focus:outline-none focus:border-emerald-500/40"
                            />
                            <button
                              type="submit"
                              className="px-3 bg-emerald-600 hover:bg-emerald-700 text-slate-950 rounded-xl transition-all flex items-center justify-center cursor-pointer font-bold shrink-0"
                              title="Enviar"
                            >
                              <Send className="w-4 h-4" />
                            </button>
                          </form>
                        </div>

                      </div>
                    );
                  })() : (
                    <div className="flex flex-col items-center justify-center gap-2 my-auto text-center py-6 text-slate-500">
                      <MessageSquare className="w-8 h-8 opacity-40 text-emerald-500" />
                      <p className="text-xs font-semibold">Seleccione un chat de la bandeja de entrada</p>
                    </div>
                  )}
                </div>

              </div>
            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm flex flex-col gap-4" id="calendar-panel">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 font-mono">Sincronización Inteligente de Agenda</span>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                    <Calendar className="w-5 h-5 text-indigo-500" />
                    Eventos y Rutas Frecuentes
                  </h2>
                </div>
              </div>

              {/* Sincronizador de Calendario Form */}
              <form onSubmit={handleAddCalendarEvent} className="bg-slate-50 dark:bg-slate-950 p-4 rounded-xl border border-slate-100 dark:border-slate-800 flex flex-col gap-3">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Sincronizar Nuevo Destino de Calendario</span>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="cal-title-input"
                    type="text"
                    placeholder="Título, Ej: Visita Parque Casablanca"
                    value={newCalTitle}
                    onChange={(e) => setNewCalTitle(e.target.value)}
                    className="p-1.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                    required
                  />
                  <input
                    id="cal-loc-input"
                    type="text"
                    placeholder="Dirección o Ciudad Destino"
                    value={newCalLoc}
                    onChange={(e) => setNewCalLoc(e.target.value)}
                    className="p-1.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    id="cal-time-input"
                    type="time"
                    value={newCalTime}
                    onChange={(e) => setNewCalTime(e.target.value)}
                    className="p-1.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                  />
                  <input
                    id="cal-date-input"
                    type="date"
                    value={newCalDate}
                    onChange={(e) => setNewCalDate(e.target.value)}
                    className="p-1.5 text-xs bg-white dark:bg-slate-900 rounded border border-slate-200 dark:border-slate-850 text-slate-800 dark:text-slate-200"
                  />
                </div>
                <button
                  id="add-cal-event-btn"
                  type="submit"
                  className={`py-1.5 text-xs font-bold rounded-lg text-white transition-all cursor-pointer ${activeAccentBg}`}
                >
                  Sincronizar con Calendario Habitual
                </button>
              </form>

              {/* Sincronizados list */}
              <div className="flex flex-col gap-2">
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Destinos Sincronizados en la Agenda</span>
                {calendarEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white dark:bg-slate-950 border border-slate-100 dark:border-slate-900 p-3 rounded-xl flex justify-between items-center hover:border-slate-200 dark:hover:border-slate-800 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{event.title}</span>
                        <span className="text-[8px] font-bold px-1.5 py-0.5 rounded bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 uppercase">
                          {event.syncStatus}
                        </span>
                      </div>
                      <div className="flex gap-2 text-[9px] text-slate-400 font-medium mt-0.5">
                        <span>{event.date} - {event.time}</span>
                        <span>•</span>
                        <span className="text-slate-500 dark:text-slate-400 font-semibold">{event.location}</span>
                      </div>
                    </div>

                    <button
                      id={`navigate-event-${event.id}`}
                      onClick={() => handleNavigateToEvent(event.location, event.title)}
                      className="px-2.5 py-1.5 text-[10px] font-bold border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-900 rounded-lg text-slate-700 dark:text-slate-300 transition-colors cursor-pointer"
                    >
                      Navegar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-950 transition-colors duration-500 font-sans text-slate-100" id="main-app-shell">
      
      {/* Dynamic Device Frame Wrapper if configured */}
      {deviceFrame === 'android' && (
        <div className="min-h-screen flex items-center justify-center py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-500 px-4">
          <div className="w-full max-w-[430px] rounded-[42px] border-[14px] border-slate-800 dark:border-slate-950 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 relative flex flex-col h-[880px]">
            {/* Status Bar */}
            <div className="bg-slate-900 text-slate-300 px-6 py-2.5 flex justify-between items-center text-[10px] font-bold tracking-tight select-none border-b border-slate-800 shrink-0">
              <span className="font-mono flex items-center gap-1">
                <Clock className="w-3 h-3 text-indigo-400 animate-pulse" />
                {formatTime(currentDateTime, false)} - {currentDateTime.toLocaleDateString('es-AR', {day: '2-digit', month: '2-digit', year: 'numeric'})}
              </span>
              <div className="flex items-center gap-1">
                <span>5G</span>
                <span className="w-4 h-2 bg-slate-300 rounded-sm inline-block" />
              </div>
            </div>
            
            {/* Phone Body Scrollable */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
              <div className="flex justify-between items-center shrink-0 border-b border-slate-100 dark:border-slate-900 pb-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-xl ${activeAccentBg}`}>
                    <Compass className="w-4 h-4" />
                  </div>
                  <h1 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-tight">Co-Piloto</h1>
                </div>
                <button 
                  id="reset-frame-android"
                  onClick={() => setDeviceFrame('none')}
                  className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded hover:bg-slate-300"
                >
                  Salir
                </button>
              </div>
              
              {/* Nested layout content optimized for phone stack */}
              <div className="flex flex-col gap-5">
                <div className="h-[280px]">
                  <NavigationMap
                    alerts={alerts}
                    radars={radars}
                    currentSpeed={currentSpeed}
                    preferences={preferences}
                    isDriving={isDriving}
                    onSpeedChange={(s) => setCurrentSpeed(s)}
                    onRadarTriggered={handleRadarTriggered}
                    onAlertTriggered={handleAlertTriggered}
                    isOffline={isOffline}
                    origin={originInput}
                    destination={destinationInput}
                  />
                </div>

                <div className="bg-slate-900 border border-slate-800 p-3 rounded-xl flex items-center gap-2 relative overflow-hidden shrink-0">
                  <Bell className="w-3.5 h-3.5 text-amber-500 animate-bounce" />
                  <p className="text-[10px] font-bold text-slate-100 truncate flex-1">
                    {notifications[0]}
                  </p>
                </div>

                <VoiceController
                  onVoiceCommand={(cmd) => handleAnalyzeRoute(cmd)}
                  copilotResponseText={copilotResponse}
                  isListeningExternal={isListening}
                  onListeningChange={(state) => setIsListening(state)}
                  preferences={preferences}
                />

                <MaintenancePredictor
                  currentMileage={currentMileage}
                  onMileageChange={(m) => setCurrentMileage(m)}
                  preferences={preferences}
                />
              </div>
            </div>
            {/* Soft home button bar */}
            <div className="bg-slate-900 py-3 flex justify-center border-t border-slate-800 shrink-0">
              <div className="w-24 h-1.5 bg-slate-600 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {deviceFrame === 'ios' && (
        <div className="min-h-screen flex items-center justify-center py-8 bg-slate-100 dark:bg-slate-900 transition-colors duration-500 px-4">
          <div className="w-full max-w-[430px] rounded-[50px] border-[14px] border-slate-950 dark:border-slate-900 shadow-2xl overflow-hidden bg-slate-50 dark:bg-slate-950 relative flex flex-col h-[880px]">
            {/* Dynamic Island style floating header */}
            <div className="bg-slate-950 text-slate-300 px-6 py-3.5 flex justify-between items-center text-[11px] font-black select-none shrink-0 relative">
              <span className="font-mono">{formatTime(currentDateTime, false)}</span>
              {/* Dynamic Island pill */}
              <div className="absolute left-1/2 -translate-x-1/2 bg-black w-24 h-5 rounded-full flex items-center justify-center gap-1.5 text-[8px] border border-slate-800">
                <div className="w-1.5 h-1.5 bg-sky-500 rounded-full animate-ping" />
                <span className="text-slate-400 font-bold">CO-PILOT ACTIVE</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>LTE</span>
                <span className="w-5 h-2.5 bg-white/90 rounded-sm inline-block" />
              </div>
            </div>
            
            {/* Scrollable iOS panel */}
            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-5">
              <div className="flex justify-between items-center shrink-0 border-b border-slate-100 dark:border-slate-900 pb-3">
                <span className="text-xs font-black tracking-tight text-slate-900 dark:text-white">CO-PILOTO DE RUTA</span>
                <button 
                  id="reset-frame-ios"
                  onClick={() => setDeviceFrame('none')}
                  className="text-[10px] bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400 px-2 py-0.5 rounded hover:bg-slate-300"
                >
                  Salir
                </button>
              </div>

              {/* iOS Stack */}
              <div className="flex flex-col gap-4">
                <div className="h-[260px]">
                  <NavigationMap
                    alerts={alerts}
                    radars={radars}
                    currentSpeed={currentSpeed}
                    preferences={preferences}
                    isDriving={isDriving}
                    onSpeedChange={(s) => setCurrentSpeed(s)}
                    onRadarTriggered={handleRadarTriggered}
                    onAlertTriggered={handleAlertTriggered}
                    isOffline={isOffline}
                    origin={originInput}
                    destination={destinationInput}
                  />
                </div>

                <VoiceController
                  onVoiceCommand={(cmd) => handleAnalyzeRoute(cmd)}
                  copilotResponseText={copilotResponse}
                  isListeningExternal={isListening}
                  onListeningChange={(state) => setIsListening(state)}
                  preferences={preferences}
                />


              </div>
            </div>
            {/* iPhone Home indicator */}
            <div className="bg-slate-950 py-3.5 flex justify-center shrink-0">
              <div className="w-32 h-1 bg-white/80 rounded-full" />
            </div>
          </div>
        </div>
      )}

      {deviceFrame === 'watch' && (
        <div className="min-h-screen flex items-center justify-center py-10 bg-slate-100 dark:bg-slate-950 transition-colors duration-500 px-4">
          <div className="flex flex-col items-center gap-5">
            {/* Watch shell container */}
            <div className="relative w-[310px] h-[370px] rounded-[60px] border-[10px] border-slate-900 dark:border-slate-800 bg-black shadow-2xl p-4 flex flex-col justify-between overflow-hidden text-white ring-8 ring-indigo-500/10">
              
              {/* Strap attachment effect (top & bottom) */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-slate-800 dark:bg-slate-900 rounded-t-lg" />
              <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-32 h-3.5 bg-slate-800 dark:bg-slate-900 rounded-b-lg" />
              
              {/* Dial button effect on right */}
              <div className="absolute right-[-4px] top-24 w-2 h-10 bg-slate-800 border border-slate-700 rounded-r-md cursor-pointer active:scale-95 transition-transform" />
              <div className="absolute right-[-4px] top-14 w-1.5 h-6 bg-slate-700 rounded-r-sm" />

              {/* Watch Screen Content */}
              <div className="flex-1 flex flex-col justify-between text-center select-none z-10 pt-1">
                
                {/* Watch Header */}
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-black px-2 shrink-0">
                  <span className="text-rose-400 font-black flex items-center gap-0.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                    GPS VIVO
                  </span>
                  <span className="font-mono">{formatTime(currentDateTime, false)}</span>
                  <button
                    onClick={() => setDeviceFrame('none')}
                    className="text-[9px] bg-slate-800 hover:bg-slate-700 text-slate-300 px-1.5 py-0.5 rounded-md font-bold"
                  >
                    X
                  </button>
                </div>

                {/* Main circular Speed dial with active accent colors */}
                <div className="flex flex-col items-center justify-center my-1 shrink-0">
                  <div className="relative w-28 h-28 rounded-full border-4 border-slate-900 flex flex-col items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 shadow-inner">
                    {/* Ring filled based on speed proportion */}
                    <svg className="absolute inset-0 w-full h-full -rotate-90">
                      <circle
                        cx="52"
                        cy="52"
                        r="48"
                        stroke={
                          preferences.colorAccent === 'aurora' ? '#10b981' : 
                          preferences.colorAccent === 'coral' ? '#f43f5e' :
                          preferences.colorAccent === 'violet' ? '#8b5cf6' :
                          preferences.colorAccent === 'teal' ? '#14b8a6' :
                          preferences.colorAccent === 'blue' ? '#3b82f6' :
                          preferences.colorAccent === 'green' ? '#10b981' :
                          preferences.colorAccent === 'magenta' ? '#ec4899' :
                          preferences.colorAccent === 'orange' ? '#f97316' : '#f59e0b'
                        }
                        strokeWidth="4"
                        fill="transparent"
                        strokeDasharray="301"
                        strokeDashoffset={301 - (301 * Math.min(currentSpeed, 140)) / 140}
                        className="transition-all duration-300"
                      />
                    </svg>
                    
                    <span className="text-3xl font-black tracking-tighter text-white mt-1">
                      {currentSpeed}
                    </span>
                    <span className="text-[8px] font-bold text-slate-400 uppercase tracking-widest -mt-1">
                      KM/H
                    </span>
                    
                    {/* Tiny speed limit alert badge */}
                    <div className={`mt-0.5 text-[8px] px-1.5 py-0.2 rounded-full font-black ${currentSpeed > 100 ? 'bg-rose-500 text-white animate-pulse' : 'bg-slate-800 text-slate-300'}`}>
                      {currentSpeed > 100 ? 'EXCESO' : 'LÍMITE OK'}
                    </div>
                  </div>
                </div>

                {/* Ultra-compact Co-pilot speech balloon */}
                <div className="bg-slate-900/95 border border-slate-800/80 rounded-xl p-2 mx-1 shadow-sm max-h-[66px] overflow-y-auto">
                  <div className="flex items-center gap-1 mb-0.5 justify-center">
                    <Sparkles className="w-2.5 h-2.5 text-indigo-400 animate-pulse" />
                    <span className="text-[8px] font-black tracking-widest text-indigo-300 uppercase">ASISTENTE DE RUTA</span>
                  </div>
                  <p className="text-[9px] font-bold leading-snug text-slate-100">
                    {copilotResponse}
                  </p>
                </div>

                {/* Watch Control Panel buttons */}
                <div className="grid grid-cols-3 gap-1 px-1 mt-1 shrink-0">
                  {/* Speech button */}
                  <button
                    onClick={() => {
                      setIsListening(true);
                      setTimeout(() => {
                        setIsListening(false);
                        const responses = [
                          "Ruta 68 despejada. Tránsito normal hacia tu destino.",
                          "¡Atención! Radar de velocidad cercano. Mantener bajo 100 km/h.",
                          "Desvío sugerido por congestión leve adelante.",
                          "Sincronizado: Clima óptimo en Viña del Mar."
                        ];
                        const randomMsg = responses[Math.floor(Math.random() * responses.length)];
                        setCopilotResponse(randomMsg);
                        speakAloud(randomMsg);
                        addNotification(`Reloj: ${randomMsg}`);
                      }, 1800);
                    }}
                    className={`py-1.5 rounded-lg font-black text-[9px] flex flex-col items-center justify-center transition-all cursor-pointer ${isListening ? 'bg-rose-600 animate-pulse text-white' : activeAccentBg}`}
                  >
                    <span>🎙️ Oír</span>
                  </button>

                  {/* Drive simulation state button */}
                  <button
                    onClick={() => {
                      setIsDriving(!isDriving);
                      addNotification(isDriving ? "Simulación de conducción pausada." : "Iniciando viaje en tiempo real.");
                      speakAloud(isDriving ? "Navegación en pausa." : "Iniciando guiado en tiempo real.");
                    }}
                    className={`py-1.5 rounded-lg font-black text-[9px] text-white transition-all cursor-pointer ${isDriving ? 'bg-emerald-600' : 'bg-slate-850 hover:bg-slate-800'}`}
                  >
                    <span>{isDriving ? '⏸️ Pausar' : '▶️ Conducir'}</span>
                  </button>

                  {/* Speed plus button */}
                  <button
                    onClick={() => {
                      const newSpeed = Math.min(currentSpeed + 15, 140);
                      setCurrentSpeed(newSpeed);
                      if (newSpeed > 100) {
                        const alertMsg = "Alerta de velocidad. Reduzca inmediatamente.";
                        setCopilotResponse(alertMsg);
                        speakAloud(alertMsg);
                      }
                    }}
                    className="py-1.5 rounded-lg font-black text-[9px] bg-slate-850 hover:bg-slate-800 text-slate-300 transition-all cursor-pointer"
                  >
                    <span>⚡ +15 Km</span>
                  </button>
                </div>

              </div>
            </div>

            {/* Smartwatch helper notice */}
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-center max-w-[280px]">
              Vista de Reloj Inteligente (Simulador de pantalla táctil y comando de voz sin manos)
            </span>
          </div>
        </div>
      )}

      {deviceFrame === 'carplay' && (
        <div className="min-h-screen flex items-center justify-center py-8 bg-slate-100 dark:bg-slate-950 transition-colors duration-500 px-4">
          <div className="w-full max-w-[1020px] rounded-[32px] border-[12px] border-slate-900 bg-slate-950 shadow-2xl overflow-hidden relative flex flex-col h-[530px]">
            
            {/* Top glassmorphic dashboard info bar */}
            <div className="bg-slate-900/95 border-b border-slate-850 px-6 py-3 flex justify-between items-center text-xs text-slate-300 select-none shrink-0">
              <div className="flex items-center gap-3">
                <span className="font-black text-slate-100 tracking-wider flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-indigo-400 animate-spin-slow" />
                  SISTEMA SMART CO-PILOT HUD
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-500/20">
                  MODO CONSOLA VEHICULAR ACTIVADO
                </span>
              </div>
              <div className="flex items-center gap-4 font-bold text-[11px]">
                <span className="text-slate-400">🌦️ {weather.temp}°C {destinationInput.split(',')[0]}</span>
                <span className="text-slate-500">|</span>
                <span className="flex items-center gap-1 text-slate-200">
                  <Wifi className="w-3.5 h-3.5 text-indigo-400" /> LTE
                </span>
                <span className="text-slate-500">|</span>
                <span className="text-slate-100 font-mono font-black flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
                  {formatTime(currentDateTime, false)} - {currentDateTime.toLocaleDateString('es-AR', {day: 'numeric', month: 'short', year: 'numeric'})}
                </span>
                <button 
                  onClick={() => setDeviceFrame('none')}
                  className="bg-slate-850 hover:bg-slate-800 text-slate-300 px-3 py-1 rounded text-[10px] uppercase font-black"
                >
                  Salir CarPlay
                </button>
              </div>
            </div>

            {/* Immersive horizontal split cockpit screen */}
            <div className="flex-1 flex overflow-hidden">
              
              {/* Left pane: Giant active navigation map */}
              <div className="flex-1 h-full relative">
                <NavigationMap
                  alerts={alerts}
                  radars={radars}
                  currentSpeed={currentSpeed}
                  preferences={preferences}
                  isDriving={isDriving}
                  onSpeedChange={(s) => setCurrentSpeed(s)}
                  onRadarTriggered={handleRadarTriggered}
                  onAlertTriggered={handleAlertTriggered}
                  isOffline={isOffline}
                  origin={originInput}
                  destination={destinationInput}
                  transportMode={transportMode}
                />
                
                {/* Float HUD speed over map */}
                <div className="absolute top-4 left-4 bg-slate-950/90 border border-slate-800 p-3 rounded-2xl flex items-center gap-3 shadow-xl backdrop-blur-md">
                  <div className="text-center">
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Velocidad</span>
                    <span className="text-3xl font-black text-white leading-none font-mono block mt-0.5">{currentSpeed}</span>
                    <span className="text-[8px] font-bold text-slate-500 uppercase">KM/H</span>
                  </div>
                  <div className="h-8 w-px bg-slate-800" />
                  <div>
                    <span className="block text-[8px] font-bold text-slate-400 uppercase tracking-widest">Ruta Activa</span>
                    <span className="text-xs font-black text-slate-200 block mt-0.5">{destinationInput}</span>
                    <span className="text-[9px] text-slate-400 font-semibold block">{originInput.split(',')[0]} ➔ {destinationInput.split(',')[0]}</span>
                  </div>
                </div>
              </div>

              {/* Right pane: Assistant, alerts, and music sidebar */}
              <div className="w-[340px] border-l border-slate-850 bg-slate-900/50 backdrop-blur-md p-4 flex flex-col justify-between overflow-y-auto gap-4 shrink-0">
                
                {/* CarPlay alert system banner */}
                <div className="bg-slate-950/80 border border-slate-850 p-3 rounded-xl">
                  <div className="flex items-center gap-1.5 mb-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping" />
                    <span className="text-[9px] font-black tracking-widest text-amber-500 uppercase">Alertas en Ruta</span>
                  </div>
                  <p className="text-[11px] font-semibold text-slate-100 truncate">
                    {notifications[0] || "No hay alertas activas en este sector."}
                  </p>
                </div>

                {/* CarPlay assistant panel */}
                <div className="bg-gradient-to-br from-slate-950 to-slate-900 border border-slate-800 p-3.5 rounded-xl flex flex-col gap-2 shadow-lg">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400">
                      <Sparkles className="w-3.5 h-3.5 animate-pulse" />
                    </div>
                    <span className="text-[10px] font-black tracking-widest text-indigo-300 uppercase">Copiloto Inteligente AI</span>
                  </div>
                  <p className="text-xs text-slate-200 leading-relaxed font-semibold">
                    "{copilotResponse}"
                  </p>
                  
                  {/* Micro voice buttons */}
                  <div className="flex gap-1.5 mt-1">
                    <button
                      onClick={() => {
                        setIsListening(true);
                        setTimeout(() => {
                          setIsListening(false);
                          const responses = [
                            "Reportando desvío en Peaje Casablanca por obras.",
                            "Tránsito fluido en Ruta 68. Mantenga velocidad crucero.",
                            "Radar habilitado en el kilómetro 65. Límite de 120 km/h."
                          ];
                          const randomMsg = responses[Math.floor(Math.random() * responses.length)];
                          setCopilotResponse(randomMsg);
                          speakAloud(randomMsg);
                          addNotification(`CarPlay HUD: ${randomMsg}`);
                        }, 2000);
                      }}
                      className={`flex-1 py-1.5 rounded-lg text-[10px] font-bold text-center flex items-center justify-center gap-1 cursor-pointer ${isListening ? 'bg-rose-650 animate-pulse text-white' : activeAccentBg}`}
                    >
                      <span>🎙️ Hablar al HUD</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDriving(!isDriving);
                        addNotification(isDriving ? "Navegación CarPlay pausada." : "Iniciando crucero CarPlay.");
                        speakAloud(isDriving ? "Navegación CarPlay pausada." : "Iniciando crucero CarPlay habitual.");
                      }}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold text-white cursor-pointer ${isDriving ? 'bg-rose-600' : 'bg-slate-800 hover:bg-slate-700'}`}
                    >
                      {isDriving ? '⏸️ Pausar' : '▶️ Viajar'}
                    </button>
                  </div>
                </div>

                {/* CarPlay trip tracker widget */}
                <div className="bg-slate-950/50 border border-slate-850 p-3 rounded-xl flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${activeAccentBg} flex items-center justify-center shrink-0 shadow`}>
                    <Compass className="w-5 h-5 text-white animate-pulse" />
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className="block text-[8px] font-bold text-slate-500 uppercase">SISTEMA GPS</span>
                    <span className="block text-xs font-bold text-slate-200 truncate">Ruta 16 Sincronizada</span>
                    <span className="block text-[9px] text-slate-400">Canal satelital activo</span>
                  </div>
                </div>

              </div>
            </div>

            {/* Bottom taskbar buttons for CarPlay */}
            <div className="bg-slate-900 border-t border-slate-850 py-2.5 px-6 flex justify-between items-center text-xs shrink-0 select-none">
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">HUD AUTOMOTRIZ DE ÚLTIMA GENERACIÓN</span>
              <div className="flex gap-4">
                <button onClick={() => setActiveTab('map')} className={`p-1 hover:text-white transition-colors cursor-pointer ${activeTab === 'map' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Mapas</button>
                <button onClick={() => setActiveTab('calendar')} className={`p-1 hover:text-white transition-colors cursor-pointer ${activeTab === 'calendar' ? 'text-indigo-400 font-bold' : 'text-slate-400'}`}>Viajes Sincronizados</button>
              </div>
            </div>

          </div>
        </div>
      )}

      {deviceFrame === 'none' && (
        <>
          {/* Main Desktop Header */}
          <header className="border-b border-slate-800 bg-slate-900/85 backdrop-blur-md sticky top-0 z-40 select-none">
            <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 h-12 sm:h-16 flex items-center justify-between">
              
              {/* Brand Logo design */}
              <div className="flex items-center gap-1.5 sm:gap-3">
                <div className={`p-1 sm:p-2.5 rounded-xl ${activeAccentBg}`}>
                  <Compass className="w-3.5 h-3.5 sm:w-5 sm:h-5 animate-spin-slow" />
                </div>
                <div>
                  <h1 className="text-xs sm:text-base font-black tracking-tight text-white flex items-center gap-1">
                    <span>Co-Piloto</span><span className="hidden xs:inline">Inteligente</span>
                    <span className="text-[8px] sm:text-[9px] font-bold px-1 sm:px-1.5 py-0.5 bg-indigo-500/10 text-indigo-400 rounded-full">Pro</span>
                  </h1>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
                    Asistente de Ruta, Radares y Alertas de Conducción en Tiempo Real
                  </span>
                </div>
              </div>

              {/* Status Header info */}
              <div className="flex items-center gap-1.5 sm:gap-5">
                {/* Botón Probar en Celular */}
                <button
                  id="share-mobile-btn"
                  onClick={() => {
                    setShowMobileModal(true);
                    speakAloud("Escanea el código QR en pantalla con la cámara de tu celular para abrir el copiloto de inmediato.");
                    addNotification("Abriendo panel de conexión para teléfonos celulares.");
                  }}
                  className="hidden md:flex px-4 py-2 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white text-xs font-bold rounded-xl items-center gap-2 shadow-lg shadow-indigo-500/20 transition-all active:scale-95 cursor-pointer"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Probar en Celular / QR</span>
                </button>

                {/* Real-time compact clock pill */}
                <div className="flex items-center gap-1 sm:gap-2.5 bg-slate-950/80 border border-slate-800/80 px-2 sm:px-4 py-1 rounded-xl text-right font-mono shadow-inner text-[10px] sm:text-xs">
                  <Clock className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-emerald-400 animate-pulse shrink-0" />
                  <span className="font-bold text-slate-100 block shrink-0 leading-none">
                    {formatTime(currentDateTime, false)}
                  </span>
                  <span className="text-slate-500 text-[9px] hidden sm:inline">|</span>
                  <span className="text-[9px] font-bold text-slate-400 hidden sm:inline leading-none">
                    {currentDateTime.toLocaleDateString('es-AR', {day: 'numeric', month: 'short'})}
                  </span>
                </div>

                <div className="hidden lg:flex flex-col items-end text-right">
                  <span className="text-[10px] font-bold text-slate-500 uppercase">Estado GPS Satelital</span>
                  <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    12 Satélites Conectados
                  </span>
                </div>
              </div>

            </div>
          </header>

          {/* Core Content Body */}
          <main className="py-8 px-4 sm:px-6 lg:px-8">
            {renderDashboardContent()}
          </main>

          {/* Bare Footer */}
          <footer className="border-t border-slate-800 py-8 bg-slate-950 text-center text-slate-500 text-xs select-none">
            <p className="max-w-xl mx-auto">
              Diseño táctil avanzado con compatibilidad híbrida Android & iOS. Seguridad vehicular con lector de alertas en voz alta en cumplimiento con leyes de tránsito sin manos.
            </p>
          </footer>
        </>
      )}

      {showMobileModal && (
        <div 
          className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-fade-in" 
          id="mobile-share-modal"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowMobileModal(false);
            }
          }}
        >
          <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 relative shadow-2xl flex flex-col gap-4.5 text-white animate-scale-up">
            
            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="text-[9px] uppercase font-black tracking-widest text-indigo-400 font-mono block">ENLACE SATORI DE RESPALDO</span>
                <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2 mt-0.5">
                  <span>📱</span> Probar en tu Celular
                </h3>
              </div>
              <button
                type="button"
                id="close-mobile-modal"
                onClick={() => setShowMobileModal(false)}
                className="text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-xl cursor-pointer transition-colors text-xs font-bold flex items-center gap-1"
                title="Cerrar ventana"
              >
                <X className="w-3.5 h-3.5" />
                <span>Cerrar</span>
              </button>
            </div>

            {/* Selector de Entorno/Modo */}
            <div className="flex bg-slate-950 p-1 rounded-xl border border-slate-850/80 w-full">
              <button
                type="button"
                onClick={() => {
                  setLinkType('dev');
                  speakAloud("Cargando enlace de pruebas activo.");
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  linkType === 'dev'
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                ⚡ Pruebas (Activo Ahora)
              </button>
              <button
                type="button"
                onClick={() => {
                  setLinkType('prod');
                  speakAloud("Cargando enlace de producción permanente.");
                }}
                className={`flex-1 py-1.5 text-center text-[10px] font-bold rounded-lg transition-all cursor-pointer ${
                  linkType === 'prod'
                    ? 'bg-indigo-600 text-white shadow shadow-indigo-500/20'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                🌍 Producción (Fijo)
              </button>
            </div>

            {/* Informative Label */}
            <p className="text-[10px] text-slate-400 leading-normal text-left">
              {linkType === 'dev' ? (
                <span className="text-emerald-400 font-medium font-sans">
                  🟢 <strong>Enlace de Pruebas:</strong> ¡Funciona de inmediato! Es el servidor que está corriendo en vivo en este momento en tu navegador.
                </span>
              ) : (
                <span className="text-amber-400 font-medium font-sans">
                  ⚠️ <strong>Enlace de Producción:</strong> Funcionará una vez que presiones el botón "Share" en la barra de arriba de AI Studio para publicarlo.
                </span>
              )}
            </p>

            {/* QR Code Container */}
            <div className="bg-white p-4.5 rounded-2xl flex flex-col items-center justify-center gap-2.5 self-center shadow-lg border border-slate-100">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(linkType === 'dev' ? (typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app') : 'https://ais-pre-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app')}`}
                alt="QR Code de la aplicación"
                className="w-44 h-44 select-none"
                referrerPolicy="no-referrer"
              />
              <span className="text-[10px] text-slate-600 font-bold tracking-tight font-sans text-center">
                📷 ESCANEA CON LA CÁMARA DE TU CELULAR
              </span>
            </div>

            {/* Direct Email Sender & Copy Link options */}
            <div className="flex flex-col gap-2 bg-slate-950/80 p-3.5 rounded-2xl border border-slate-850">
              <span className="text-[9px] uppercase font-black tracking-widest text-slate-500 font-mono block text-left">
                ¿Cómo quieres recibir el enlace?
              </span>
              
              {/* Opción 1: Enviar por Correo */}
              <a
                href={`mailto:gercresposp@gmail.com?subject=Enlace%20de%20mi%20Copiloto%20Inteligente%20Satori&body=Hola%20Ger%21%20Aqu%C3%AD%20tienes%20el%20enlace%20directo%20para%20probar%20y%20navegar%20con%20tu%20Copiloto%20desde%20tu%20celular%3A%0A%0A${encodeURIComponent(linkType === 'dev' ? (typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app') : 'https://ais-pre-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app')}%0A%0ARecuerda%20otorgar%20permisos%20de%20micr%C3%B3fono%20si%20quieres%20usar%20los%20comandos%20de%20voz%20activos.%20%C2%A1Buen%20viaje%21`}
                className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 text-xs transition-colors shadow-md shadow-indigo-600/10 cursor-pointer text-center"
                id="send-email-mailto"
                onClick={() => {
                  speakAloud("Abriendo tu cliente de correo para enviar el enlace.");
                  addNotification("Enviando enlace a gercresposp@gmail.com.");
                }}
              >
                <Mail className="w-4 h-4" />
                <span>Enviar directo a mi correo (gercresposp@gmail.com)</span>
              </a>

              <div className="h-[1px] bg-slate-800/60 my-1" />

              {/* Opción 2: Copiar Enlace */}
              <div className="flex gap-2 items-center justify-between bg-slate-900/60 p-2 rounded-xl border border-slate-800">
                <span className="text-[10px] font-mono text-slate-400 select-all truncate max-w-[200px]">
                  {linkType === 'dev' ? (typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app') : 'https://ais-pre-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app'}
                </span>
                <button
                  type="button"
                  id="copy-direct-link-btn"
                  onClick={() => {
                    const currentUrl = linkType === 'dev' ? (typeof window !== 'undefined' ? window.location.origin : 'https://ais-dev-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app') : 'https://ais-pre-2bbq7mxo7xd6h5fgekweva-31986486642.us-west2.run.app';
                    navigator.clipboard.writeText(currentUrl);
                    setLinkCopied(true);
                    speakAloud("Enlace copiado al portapapeles.");
                    setTimeout(() => setLinkCopied(false), 3000);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-[10px] font-bold flex items-center gap-1.5 cursor-pointer transition-all shrink-0 ${
                    linkCopied ? 'bg-emerald-600 text-white animate-pulse' : 'bg-slate-800 hover:bg-slate-750 text-slate-200'
                  }`}
                >
                  {linkCopied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{linkCopied ? 'Copiado' : 'Copiar'}</span>
                </button>
              </div>
            </div>

            {/* Quick Tips */}
            <div className="bg-slate-950/40 p-3 rounded-2xl border border-slate-850/50 text-[11px] text-slate-400 leading-relaxed">
              💡 <strong className="text-slate-300">Tip de prueba:</strong> Para probar el soporte de <strong className="text-slate-300">Comandos de Voz</strong> en el teléfono, asegúrate de presionar el icono de micrófono y permitir el acceso cuando el navegador móvil te lo solicite.
            </div>

            {/* Huge Obvious Close Button at the Bottom */}
            <button
              type="button"
              id="exit-modal-bottom-btn"
              onClick={() => setShowMobileModal(false)}
              className="w-full py-2.5 bg-slate-800 hover:bg-slate-750 text-slate-200 font-bold rounded-xl text-xs transition-colors border border-slate-700/60 cursor-pointer hover:text-white"
            >
              Cerrar y Volver al Mapa principal
            </button>

          </div>
        </div>
      )}

    </div>
  );
}
