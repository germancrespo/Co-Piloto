import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

const PORT = 3000;

// Lazy initialization of Gemini client
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("WARNING: GEMINI_API_KEY is not defined. AI Co-Pilot features will run in offline/simulation mode.");
      throw new Error("GEMINI_API_KEY is required for online AI Co-Pilot features.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

// Store some quick mock data that can be updated or populated dynamically
let speedRadars = [
  { id: "radar-1", route: "Ruta 5 Sur", km: 42, speedLimit: 120, type: "Fijo", active: true },
  { id: "radar-2", route: "Autopista Central", km: 12, speedLimit: 80, type: "Móvil", active: true },
  { id: "radar-3", route: "Costanera Norte", km: 28, speedLimit: 100, type: "Fijo", active: true }
];

let fuelConsumptionLogs = [
  { id: "log-1", date: "2026-07-05", trip: "Santiago -> Viña del Mar", distance: 120, fuelUsed: 9.6, cost: 12000, efficiency: 12.5 },
  { id: "log-2", date: "2026-07-07", trip: "Trabajo Diario (Ida/Vuelta)", distance: 45, fuelUsed: 3.8, cost: 4800, efficiency: 11.8 },
  { id: "log-3", date: "2026-07-08", trip: "Santiago -> Rancagua", distance: 85, fuelUsed: 6.5, cost: 8100, efficiency: 13.1 }
];

let calendarEvents = [
  { id: "cal-1", title: "Reunión de Negocios", location: "Av. Providencia 1200", time: "10:00", date: "2026-07-10", syncStatus: "Sincronizado" },
  { id: "cal-2", title: "Almuerzo con Cliente", location: "Costanera Center", time: "13:30", date: "2026-07-10", syncStatus: "Sincronizado" },
  { id: "cal-3", title: "Visita Técnica", location: "Parque Industrial Lampa", time: "16:00", date: "2026-07-11", syncStatus: "Pendiente" }
];

// Helper to generate dynamic road and traffic alerts
app.post("/api/copilot/analyze", async (req, res) => {
  const { currentRoute, origin, destination, voiceCommand, offlineMode, vehicleType } = req.body;

  // If in offline mode, do not call Gemini, use local deterministic feedback
  if (offlineMode) {
    const vehicleText = vehicleType === 'auto' ? 'Automóvil' :
                        vehicleType === 'moto' ? 'Motocicleta' :
                        vehicleType === 'bicicleta' ? 'Bicicleta' :
                        vehicleType === 'monopatin' ? 'Monopatín Eléctrico' :
                        vehicleType === 'camion' ? 'Camión Comercial' : 'Vehículo';

    return res.json({
      success: true,
      copilotSpeech: `Modo sin conexión activo para tu viaje en ${vehicleText}. Ruta local: ${origin || currentRoute || "origen"}. Monitoreo satelital activo mediante GPS celular de respaldo.`,
      action: "INFO",
      alerts: [
        { type: "traffic", severity: "medium", title: "Congestión moderada", desc: `Tránsito habitual para ${vehicleText}.` },
        { type: "radar", severity: "high", title: "Control de velocidad", desc: "Monitoree su velocidad crucero de seguridad." }
      ]
    });
  }

  try {
    const ai = getGeminiClient();
    const prompt = `Actúas como un Co-Piloto de Ruta Inteligente y copiloto de conducción en español.
El usuario está conduciendo o planea viajar.
Detalles del trayecto:
- Origen: ${origin || "Ubicación actual"}
- Destino: ${destination || "Desconocido"}
- Ruta actual: ${currentRoute || "Ruta frecuente habitual"}
- Medio de Transporte / Vehículo: ${vehicleType || "Automóvil"}
- Comando de voz recibido (si hay): "${voiceCommand || ""}"

Por favor analiza las condiciones de ruta y responde con un JSON que tenga exactamente la siguiente estructura:
{
  "copilotSpeech": "Un mensaje corto, claro, directo y amigable (máximo 2 líneas) para ser leído en VOZ ALTA al conductor. Debe advertir sobre condiciones del clima, cobro de peaje, estado de ruta cortada, radares, o responder al comando de voz si corresponde. Adapta el tono y advertencias al medio de transporte utilizado (por ejemplo, advertencias de casco/clima/vientos para motos, ciclovías/pendientes/cansancio para bicicletas, veredas/cruces para monopatines, altura de puentes/pesos/restricciones para camiones).",
  "action": "Navegar / Música / Radares / Clima / Configuración / Ninguna",
  "alerts": [
    {
      "type": "weather | traffic | toll | road_closed | radar",
      "severity": "high | medium | low",
      "title": "Título corto de la alerta",
      "desc": "Descripción breve en español adaptada al vehículo"
    }
  ],
  "routeConditions": {
    "weather": "Soleado / Lluvia Fuerte / Niebla / etc",
    "tollCost": "Precio aproximado del peaje, ej: $2.400 (indica si no aplica o es gratuito para bicicletas o si es tarifa especial para camiones/motos)",
    "roadStatus": "Despejada / Congestionada / Cortada",
    "congestionLevel": "Bajo / Medio / Alto / Crítico"
  }
}

Sé creativo y varía los incidentes del viaje para simular un ambiente dinámico y útil. Por ejemplo, incluye rutas cortadas por accidentes, cobros de peajes locales, zonas de niebla o lluvia repentina, radares de velocidad cercanos. Devuelve SOLO el JSON, sin formato markdown adicional que lo envuelva, para poder parsearlo directamente.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    const text = response.text || "{}";
    const data = JSON.parse(text);
    return res.json({ success: true, ...data });

  } catch (error: any) {
    console.error("Gemini API Error:", error.message);
    // Graceful fallback when API key is missing or call fails
    const vehicleTextFallback = vehicleType === 'auto' ? 'Automóvil' :
                                vehicleType === 'moto' ? 'Motocicleta' :
                                vehicleType === 'bicicleta' ? 'Bicicleta' :
                                vehicleType === 'monopatin' ? 'Monopatín' : 'Camión';
    return res.json({
      success: true,
      copilotSpeech: `Atención co-piloto local: Usando cobertura satelital de respaldo. Trayecto en ${vehicleTextFallback} hacia ${destination || "destino"} con buen tiempo y velocidad adaptada.`,
      action: "INFO",
      alerts: [
        { type: "weather", severity: "low", title: "Buen Clima", desc: "Condiciones de visibilidad favorables para este transporte." },
        { type: "toll", severity: "medium", title: "Estimación Costos", desc: vehicleType === 'bicicleta' || vehicleType === 'monopatin' ? 'Tránsito libre sin costo de peaje.' : 'Cobro de peaje estándar activo en autopista.' },
        { type: "radar", severity: "high", title: "Límites Vehículo", desc: `Recuerde respetar la velocidad recomendada para ${vehicleTextFallback}.` }
      ],
      routeConditions: {
        weather: "Despejado",
        tollCost: vehicleType === 'bicicleta' || vehicleType === 'monopatin' ? "Gratis" : "$1.800",
        roadStatus: "Despejada",
        congestionLevel: "Bajo"
      }
    });
  }
});

// Get Speed Radars
app.get("/api/radars", (req, res) => {
  res.json({ success: true, radars: speedRadars });
});

// Add New Radar
app.post("/api/radars", (req, res) => {
  const { route, km, speedLimit, type } = req.body;
  const newRadar = {
    id: `radar-${Date.now()}`,
    route: route || "Ruta Genérica",
    km: Number(km) || 0,
    speedLimit: Number(speedLimit) || 100,
    type: type || "Fijo",
    active: true
  };
  speedRadars.push(newRadar);
  res.json({ success: true, radar: newRadar });
});

// Get Fuel Consumption Logs
app.get("/api/fuel", (req, res) => {
  res.json({ success: true, logs: fuelConsumptionLogs });
});

// Add Fuel Log
app.post("/api/fuel", (req, res) => {
  const { trip, distance, fuelUsed, cost } = req.body;
  const d = Number(distance) || 1;
  const f = Number(fuelUsed) || 1;
  const efficiency = Number((d / f).toFixed(1));
  const newLog = {
    id: `log-${Date.now()}`,
    date: new Date().toISOString().split('T')[0],
    trip: trip || "Viaje No Registrado",
    distance: d,
    fuelUsed: f,
    cost: Number(cost) || 0,
    efficiency
  };
  fuelConsumptionLogs.unshift(newLog);
  res.json({ success: true, log: newLog });
});

// Get Calendar Events
app.get("/api/calendar", (req, res) => {
  res.json({ success: true, events: calendarEvents });
});

// Sync/Add Calendar Event
app.post("/api/calendar", (req, res) => {
  const { title, location, time, date } = req.body;
  const newEvent = {
    id: `cal-${Date.now()}`,
    title: title || "Nuevo Evento",
    location: location || "Sin ubicación",
    time: time || "12:00",
    date: date || new Date().toISOString().split('T')[0],
    syncStatus: "Sincronizado"
  };
  calendarEvents.push(newEvent);
  res.json({ success: true, event: newEvent });
});

// Vite server setup for development & static for production
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
