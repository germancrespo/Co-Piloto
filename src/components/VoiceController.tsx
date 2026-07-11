import React, { useState, useEffect } from 'react';
import { Mic, MicOff, Volume2, ShieldAlert, Sparkles, AlertCircle, Play, Square } from 'lucide-react';
import { DashboardPreferences } from '../types';

interface VoiceControllerProps {
  onVoiceCommand: (command: string) => void;
  copilotResponseText: string;
  isListeningExternal: boolean;
  onListeningChange: (listening: boolean) => void;
  preferences: DashboardPreferences;
}

export default function VoiceController({
  onVoiceCommand,
  copilotResponseText,
  isListeningExternal,
  onListeningChange,
  preferences,
}: VoiceControllerProps) {
  const [transcription, setTranscription] = useState<string>("");
  const [recognition, setRecognition] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string>("");
  const [predefinedCommands] = useState<string[]>([
    "Consejos de seguridad moto",
    "Ruta segura en bicicleta",
    "Reportar peaje de ruta",
    "Ruta de música relajante",
    "Activar modo nocturno",
    "Ver estado del clima",
    "Sincronizar calendario"
  ]);

  // Accent mapping
  const borderAccents = {
    amber: 'border-amber-500/30 text-amber-400 focus:ring-amber-500',
    blue: 'border-blue-500/30 text-blue-400 focus:ring-blue-500',
    green: 'border-green-500/30 text-green-400 focus:ring-green-500',
    magenta: 'border-magenta-500/30 text-magenta-400 focus:ring-magenta-500',
    orange: 'border-orange-500/30 text-orange-400 focus:ring-orange-500'
  };

  const bgAccents = {
    amber: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20',
    blue: 'bg-blue-500 hover:bg-blue-600 shadow-blue-500/20',
    green: 'bg-green-500 hover:bg-green-600 shadow-green-500/20',
    magenta: 'bg-magenta-500 hover:bg-magenta-600 shadow-magenta-500/20',
    orange: 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/20'
  };

  const accentHex = {
    amber: '#f59e0b',
    blue: '#3b82f6',
    green: '#10b981',
    magenta: '#ec4899',
    orange: '#f97316'
  }[preferences.colorAccent];

  // Set up Speech Recognition on mount
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-ES';

      rec.onstart = () => {
        onListeningChange(true);
        setErrorMsg("");
        setTranscription("Escuchando comando de voz sin manos...");
      };

      rec.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        if (event.error === 'not-allowed') {
          setErrorMsg("Permiso de micrófono denegado. Haga clic para habilitar.");
        } else {
          setErrorMsg(`Error: ${event.error}`);
        }
        onListeningChange(false);
      };

      rec.onend = () => {
        onListeningChange(false);
      };

      rec.onresult = (event: any) => {
        const resultText = event.results[0][0].transcript;
        setTranscription(resultText);
        onVoiceCommand(resultText);
      };

      setRecognition(rec);
    } else {
      setErrorMsg("Reconocimiento de voz no soportado en este navegador.");
    }
  }, [onVoiceCommand, onListeningChange]);

  const toggleListening = () => {
    if (!recognition) {
      setErrorMsg("El reconocimiento de voz no está disponible en este navegador.");
      return;
    }

    if (isListeningExternal) {
      recognition.stop();
    } else {
      try {
        recognition.start();
      } catch (e) {
        recognition.stop();
      }
    }
  };

  const handleTestCommand = (cmd: string) => {
    setTranscription(cmd);
    onVoiceCommand(cmd);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 relative overflow-hidden text-white" id="voice-controller-panel">
      {/* Visual pulse glow when active */}
      {isListeningExternal && (
        <div className="absolute inset-0 bg-red-500/5 pointer-events-none animate-pulse" />
      )}

      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500">Módulo Manos Libres</span>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            Comandos de Voz
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-950 text-slate-400 border border-slate-900">
          ES-ES Activo
        </span>
      </div>

      <div className="flex flex-col items-center gap-4 py-3">
        {/* Glowing Tactile Mic Button */}
        <button
          id="toggle-speech-mic"
          onClick={toggleListening}
          className={`relative p-6 rounded-full text-white transition-all duration-300 transform active:scale-95 shadow-xl ${
            isListeningExternal 
              ? 'bg-rose-500 hover:bg-rose-600 animate-pulse scale-105 shadow-rose-500/30' 
              : bgAccents[preferences.colorAccent]
          }`}
        >
          {isListeningExternal ? (
            <Mic className="w-7 h-7" />
          ) : (
            <MicOff className="w-7 h-7" />
          )}

          {/* Animated radar circles when listening */}
          {isListeningExternal && (
            <>
              <span className="absolute -inset-1 rounded-full border border-rose-500/40 animate-ping" />
              <span className="absolute -inset-3 rounded-full border border-rose-500/20 animate-ping [animation-delay:0.3s]" />
            </>
          )}
        </button>

        {/* Text Area for transcripts & response */}
        <div className="w-full bg-slate-950/80 border border-slate-900 rounded-xl p-3.5 min-h-[90px] flex flex-col justify-between">
          <div>
            <span className="block text-[9px] font-semibold text-slate-500 uppercase">Orden Escuchada</span>
            <p className="text-sm font-semibold text-slate-200 mt-0.5">
              {transcription || "Pulse el micrófono y diga algo como 'cómo está la ruta' o 'reproducir música'."}
            </p>
          </div>

          {errorMsg && (
            <div className="mt-2 flex items-center gap-1 text-xs text-rose-500 bg-rose-950/20 px-2 py-1 rounded">
              <AlertCircle className="w-3.5 h-3.5 shrink-0" />
              <span className="font-medium">{errorMsg}</span>
            </div>
          )}
        </div>
      </div>

      {/* Voice Co-pilot Speech response read-aloud logs */}
      {copilotResponseText && (
        <div className="bg-indigo-950/20 border border-indigo-900 p-3 rounded-xl flex gap-3">
          <Volume2 className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5 animate-bounce" />
          <div>
            <span className="block text-[9px] font-black text-indigo-400 uppercase tracking-wider">Asistente por Voz (Voz Alta Activa)</span>
            <p className="text-xs font-medium text-slate-200 leading-relaxed mt-1">
              "{copilotResponseText}"
            </p>
          </div>
        </div>
      )}

      {/* Tactile Quick command chips */}
      <div>
        <span className="block text-[10px] text-slate-500 font-bold uppercase mb-2">Comandos Rápidos de Un Toque</span>
        <div className="flex flex-wrap gap-1.5 max-h-[110px] overflow-y-auto pr-1">
          {predefinedCommands.map((cmd, idx) => (
            <button
              key={idx}
              id={`quick-cmd-${idx}`}
              onClick={() => handleTestCommand(cmd)}
              className="text-[11px] font-semibold px-2.5 py-1.5 rounded-lg border border-slate-900 bg-slate-950 text-slate-300 hover:bg-slate-900 transition-colors shadow-sm cursor-pointer"
            >
              {cmd}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
