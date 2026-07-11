import React, { useState, useEffect } from 'react';
import { FuelLog, DashboardPreferences } from '../types';
import { Fuel, TrendingUp, DollarSign, Plus, Eye, History, Trash, AlertCircle } from 'lucide-react';

interface FuelLogsProps {
  logs: FuelLog[];
  onAddLog: (newLog: { trip: string; distance: number; fuelUsed: number; cost: number }) => void;
  preferences: DashboardPreferences;
}

export default function FuelLogs({ logs, onAddLog, preferences }: FuelLogsProps) {
  const [trip, setTrip] = useState('');
  const [distance, setDistance] = useState('');
  const [fuelUsed, setFuelUsed] = useState('');
  const [cost, setCost] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Colors based on preference accent
  const textAccents = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    magenta: 'text-magenta-500',
    orange: 'text-orange-500'
  };

  const borderFocusAccents = {
    amber: 'focus:border-amber-500 focus:ring-amber-500',
    blue: 'focus:border-blue-500 focus:ring-blue-500',
    green: 'focus:border-green-500 focus:ring-green-500',
    magenta: 'focus:border-magenta-500 focus:ring-magenta-500',
    orange: 'focus:border-orange-500 focus:ring-orange-500'
  };

  const bgAccents = {
    amber: 'bg-amber-500 hover:bg-amber-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    magenta: 'bg-magenta-500 hover:bg-magenta-600',
    orange: 'bg-orange-500 hover:bg-orange-600'
  };

  const accentText = textAccents[preferences.colorAccent];
  const accentBorder = borderFocusAccents[preferences.colorAccent];
  const accentBg = bgAccents[preferences.colorAccent];

  // Calculate high-level stats
  const totalDistance = logs.reduce((acc, log) => acc + log.distance, 0);
  const totalFuel = logs.reduce((acc, log) => acc + log.fuelUsed, 0);
  const totalCost = logs.reduce((acc, log) => acc + log.cost, 0);
  const averageEfficiency = totalFuel > 0 ? (totalDistance / totalFuel).toFixed(1) : "0.0";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trip || !distance || !fuelUsed) {
      setErrorMsg('Por favor complete los campos obligatorios.');
      return;
    }

    const d = parseFloat(distance);
    const f = parseFloat(fuelUsed);
    const c = parseFloat(cost) || 0;

    if (isNaN(d) || d <= 0 || isNaN(f) || f <= 0) {
      setErrorMsg('Distancia y combustible deben ser números mayores a 0.');
      return;
    }

    onAddLog({
      trip,
      distance: d,
      fuelUsed: f,
      cost: c
    });

    // Reset Form
    setTrip('');
    setDistance('');
    setFuelUsed('');
    setCost('');
    setErrorMsg('');
    setShowAddForm(false);
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white font-sans" id="fuel-logs-panel">
      <div className="flex justify-between items-center">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 dark:text-slate-500 font-mono">Control de Gastos de Viaje</span>
          <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
            <Fuel className="w-5 h-5 text-emerald-500" />
            Consumo de Combustible
          </h2>
        </div>

        <button
          id="toggle-add-fuel-form"
          onClick={() => setShowAddForm(!showAddForm)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            showAddForm 
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300' 
              : `${accentBg} text-white shadow-md`
          }`}
        >
          <Plus className="w-4 h-4" />
          <span>{showAddForm ? 'Cerrar' : 'Nuevo Registro'}</span>
        </button>
      </div>

      {showAddForm ? (
        /* Form to Add New Fuel Log */
        <form onSubmit={handleSubmit} className="bg-slate-950/80 p-4 rounded-xl border border-slate-800 flex flex-col gap-3">
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Registrar Carga de Combustible</span>
          
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-slate-400 font-bold uppercase">Nombre del Viaje / Detalle</label>
            <input
              id="fuel-input-trip"
              type="text"
              placeholder="Ej: Santiago a Casablanca"
              value={trip}
              onChange={(e) => setTrip(e.target.value)}
              className={`w-full px-3 py-1.5 text-xs bg-slate-900 rounded-lg border border-slate-800 ${accentBorder} text-slate-200`}
              required
            />
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Distancia (KM)</label>
              <input
                id="fuel-input-distance"
                type="number"
                step="any"
                placeholder="KM"
                value={distance}
                onChange={(e) => setDistance(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs bg-slate-900 rounded-lg border border-slate-800 ${accentBorder} text-slate-200`}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Litros (L)</label>
              <input
                id="fuel-input-liters"
                type="number"
                step="any"
                placeholder="Litros"
                value={fuelUsed}
                onChange={(e) => setFuelUsed(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs bg-slate-900 rounded-lg border border-slate-800 ${accentBorder} text-slate-200`}
                required
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-[10px] text-slate-400 font-bold uppercase">Costo ($ CLP)</label>
              <input
                id="fuel-input-cost"
                type="number"
                placeholder="Pesos"
                value={cost}
                onChange={(e) => setCost(e.target.value)}
                className={`w-full px-3 py-1.5 text-xs bg-slate-900 rounded-lg border border-slate-800 ${accentBorder} text-slate-200`}
              />
            </div>
          </div>

          {errorMsg && (
            <div className="flex items-center gap-1 text-rose-500 text-xs font-semibold bg-rose-50 dark:bg-rose-950/20 p-2 rounded">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          <button
            id="submit-fuel-log"
            type="submit"
            className={`w-full py-2 text-xs font-bold text-white rounded-xl shadow-md transition-all ${accentBg}`}
          >
            Guardar Log de Consumo
          </button>
        </form>
      ) : (
        /* Summary Cards & Historic Logs */
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Eficiencia</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className={`text-lg font-black font-mono ${accentText}`}>{averageEfficiency}</span>
                <span className="text-[9px] text-slate-400 font-bold">KM/L</span>
              </div>
              <span className="text-[8px] text-slate-500 mt-0.5">Rendimiento Promedio</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Recorrido</span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-lg font-black font-mono text-slate-100">{totalDistance.toFixed(0)}</span>
                <span className="text-[9px] text-slate-400 font-bold">KM</span>
              </div>
              <span className="text-[8px] text-slate-500 mt-0.5">Kilómetros Totales</span>
            </div>

            <div className="bg-slate-950 p-2.5 rounded-xl border border-slate-900 flex flex-col justify-between">
              <span className="text-[9px] font-bold text-slate-500 uppercase">Costo Gasto</span>
              <div className="flex items-baseline gap-0.5 mt-1">
                <span className="text-lg font-black font-mono text-slate-100">${totalCost.toLocaleString('es-CL')}</span>
              </div>
              <span className="text-[8px] text-slate-500 mt-0.5">Dinero Invertido</span>
            </div>
          </div>

          {/* Simple Visual Pure-Tailwind Line Bar chart depicting fuel efficiency progress */}
          <div className="bg-slate-950 p-3 rounded-xl border border-slate-900">
            <span className="text-[9px] text-slate-400 font-bold uppercase block mb-2">Historial de Eficiencia de Carga (KM/L)</span>
            <div className="flex items-end justify-between h-20 px-2 mt-1 gap-1">
              {logs.slice().reverse().map((log, index) => {
                const heightPercent = Math.min(100, Math.max(20, (log.efficiency / 16) * 100));
                return (
                  <div key={log.id} className="flex-1 flex flex-col items-center gap-1 group relative">
                    <div className="w-full bg-slate-200 dark:bg-slate-800 rounded-t h-16 flex items-end">
                      <div
                        className={`w-full rounded-t transition-all duration-500 ${accentBg}`}
                        style={{ height: `${heightPercent}%` }}
                      />
                    </div>
                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-1 bg-slate-900 text-white text-[9px] font-bold px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                      {log.efficiency} KM/L - {log.distance}km
                    </div>
                    <span className="text-[8px] text-slate-400 dark:text-slate-500 truncate w-10 text-center font-mono">
                      {log.date.substring(5)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Historic list */}
          <div className="flex flex-col gap-1.5 max-h-[140px] overflow-y-auto pr-1">
            <span className="text-[9px] text-slate-500 font-bold uppercase">Registros Anteriores</span>
            {logs.map((log) => (
              <div
                key={log.id}
                className="bg-slate-950 border border-slate-900 p-2.5 rounded-xl flex justify-between items-center"
              >
                <div>
                  <span className="block text-xs font-bold text-slate-800 dark:text-slate-200">{log.trip}</span>
                  <div className="flex gap-2 text-[9px] text-slate-400 font-medium mt-0.5">
                    <span>{log.date}</span>
                    <span>•</span>
                    <span>{log.distance} KM recorridos</span>
                    <span>•</span>
                    <span>{log.fuelUsed} L cargados</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`block text-xs font-black font-mono ${accentText}`}>{log.efficiency} km/L</span>
                  <span className="block text-[9px] text-slate-400 font-bold">${log.cost ? log.cost.toLocaleString('es-CL') : '0'}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
