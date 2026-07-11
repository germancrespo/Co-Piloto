import React, { useState } from 'react';
import { MaintenanceItem, DashboardPreferences } from '../types';
import { Wrench, ShieldAlert, Sparkles, CheckCircle2, AlertTriangle, Plus, ChevronRight } from 'lucide-react';

interface MaintenancePredictorProps {
  currentMileage: number;
  onMileageChange: (mileage: number) => void;
  preferences: DashboardPreferences;
}

export default function MaintenancePredictor({
  currentMileage,
  onMileageChange,
  preferences,
}: MaintenancePredictorProps) {
  const [maintenanceItems, setMaintenanceItems] = useState<MaintenanceItem[]>([
    {
      id: 'm-1',
      name: 'Cambio de Aceite de Motor',
      intervalKm: 10000,
      lastChangedKm: 80000,
      nextDueKm: 90000,
      desc: 'Lubrica el motor y evita desgaste térmico acelerado.',
      category: 'motor'
    },
    {
      id: 'm-2',
      name: 'Inspección de Frenos / Pastillas',
      intervalKm: 20000,
      lastChangedKm: 70000,
      nextDueKm: 90000,
      desc: 'Garantiza frenado seguro y óptima respuesta en emergencias.',
      category: 'frenos'
    },
    {
      id: 'm-3',
      name: 'Rotación y Balanceo de Neumáticos',
      intervalKm: 15000,
      lastChangedKm: 82000,
      nextDueKm: 97000,
      desc: 'Evita desgaste irregular y mejora agarre en curvas.',
      category: 'neumaticos'
    },
    {
      id: 'm-4',
      name: 'Cambio de Correa de Distribución',
      intervalKm: 80000,
      lastChangedKm: 10000,
      nextDueKm: 90000,
      desc: 'Componente crítico. Una rotura puede causar daños irreparables en válvulas.',
      category: 'general'
    }
  ]);

  // Colors based on preference accent
  const bgAccents = {
    amber: 'bg-amber-500 hover:bg-amber-600',
    blue: 'bg-blue-500 hover:bg-blue-600',
    green: 'bg-green-500 hover:bg-green-600',
    magenta: 'bg-magenta-500 hover:bg-magenta-600',
    orange: 'bg-orange-500 hover:bg-orange-600'
  };

  const textAccents = {
    amber: 'text-amber-500',
    blue: 'text-blue-500',
    green: 'text-green-500',
    magenta: 'text-magenta-500',
    orange: 'text-orange-500'
  };

  const accentText = textAccents[preferences.colorAccent];
  const accentBg = bgAccents[preferences.colorAccent];

  // Helper to complete a maintenance and reset it based on current mileage
  const handlePerformMaintenance = (id: string) => {
    setMaintenanceItems(prev => prev.map(item => {
      if (item.id === id) {
        return {
          ...item,
          lastChangedKm: currentMileage,
          nextDueKm: currentMileage + item.intervalKm
        };
      }
      return item;
    }));
  };

  return (
    <div className="bg-[#0b0f19] border border-slate-800/80 rounded-2xl p-5 shadow-2xl flex flex-col gap-4 text-white" id="maintenance-panel">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-[10px] uppercase font-black tracking-wider text-slate-500 font-mono">Monitoreo Predictivo Inteligente</span>
          <h2 className="text-lg font-black text-slate-100 flex items-center gap-1.5 mt-0.5">
            <Wrench className="w-5 h-5 text-indigo-400" />
            Mantenimiento Preventivo
          </h2>
        </div>
        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-indigo-950/40 text-indigo-400 border border-indigo-500/20">
          IA ACTIVA
        </span>
      </div>

      {/* Interactive Mileage Controller */}
      <div className="bg-slate-950 p-4 rounded-xl border border-slate-900 flex flex-col gap-3">
        <div className="flex justify-between items-center">
          <span className="text-xs font-bold text-slate-300">Kilometraje Actual del Auto</span>
          <span className={`text-xl font-black font-mono ${accentText}`}>{currentMileage.toLocaleString('es-CL')} KM</span>
        </div>

        {/* Tactical increments buttons */}
        <div className="grid grid-cols-4 gap-1.5">
          <button
            id="add-km-100"
            onClick={() => onMileageChange(currentMileage + 100)}
            className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            +100 KM
          </button>
          <button
            id="add-km-500"
            onClick={() => onMileageChange(currentMileage + 500)}
            className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            +500 KM
          </button>
          <button
            id="add-km-1000"
            onClick={() => onMileageChange(currentMileage + 1000)}
            className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            +1.000 KM
          </button>
          <button
            id="add-km-5000"
            onClick={() => onMileageChange(currentMileage + 5000)}
            className="py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-[10px] font-bold rounded-lg text-slate-300 transition-colors cursor-pointer"
          >
            +5.000 KM
          </button>
        </div>

        {/* Progress Mileage slide */}
        <input
          id="mileage-slider"
          type="range"
          min="80000"
          max="120000"
          value={currentMileage}
          onChange={(e) => onMileageChange(Number(e.target.value))}
          className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[8px] text-slate-400 font-mono">
          <span>80.000 KM</span>
          <span>100.000 KM</span>
          <span>120.000 KM</span>
        </div>
      </div>

      {/* Maintenance alerts list based on current Mileage */}
      <div className="flex flex-col gap-2.5">
        <span className="text-[10px] text-slate-400 font-bold uppercase block">Predicciones de Vida Útil</span>
        
        {maintenanceItems.map((item) => {
          const remainingKm = item.nextDueKm - currentMileage;
          const totalLife = item.intervalKm;
          const lifeUsed = currentMileage - item.lastChangedKm;
          const healthPercent = Math.max(0, Math.min(100, ((totalLife - lifeUsed) / totalLife) * 100));

          // Set warning severity states
          let statusColor = 'bg-green-500';
          let textColor = 'text-green-500';
          let borderColor = 'border-slate-900 bg-slate-950/40';
          let stateLabel = 'Óptimo';

          if (remainingKm <= 0) {
            statusColor = 'bg-rose-500 animate-pulse';
            textColor = 'text-rose-500 font-black animate-pulse';
            borderColor = 'border-rose-950 bg-rose-950/10';
            stateLabel = 'CRÍTICO / CAMBIAR YA';
          } else if (remainingKm < 2000) {
            statusColor = 'bg-amber-500';
            textColor = 'text-amber-500 font-bold';
            borderColor = 'border-amber-900 bg-amber-950/15';
            stateLabel = 'CAMBIO PRÓXIMO';
          }

          return (
            <div
              key={item.id}
              className={`p-3 rounded-xl border flex flex-col gap-2.5 transition-all ${borderColor}`}
            >
              <div className="flex justify-between items-start gap-2">
                <div className="overflow-hidden">
                  <h4 className="text-xs font-bold text-slate-100 truncate">{item.name}</h4>
                  <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{item.desc}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full whitespace-nowrap bg-slate-950 ${textColor}`}>
                  {stateLabel}
                </span>
              </div>

              {/* Progress Bar of Component Wear */}
              <div className="flex flex-col gap-1">
                <div className="flex justify-between items-center text-[9px] text-slate-400">
                  <span>Vida útil restante: {remainingKm > 0 ? `${remainingKm.toLocaleString('es-CL')} KM` : `EXPIRADO por ${(Math.abs(remainingKm)).toLocaleString('es-CL')} KM`}</span>
                  <span className="font-mono font-semibold">{healthPercent.toFixed(0)}%</span>
                </div>
                <div className="w-full h-1.5 bg-slate-900 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${statusColor}`}
                    style={{ width: `${healthPercent}%` }}
                  />
                </div>
              </div>

              {/* Quick Reset Tactile Button */}
              {remainingKm <= 2000 && (
                <button
                  id={`action-maintenance-${item.id}`}
                  onClick={() => handlePerformMaintenance(item.id)}
                  className="w-full py-1 text-[10px] font-bold text-center border border-indigo-900 hover:bg-indigo-950/30 text-indigo-400 rounded-lg transition-colors cursor-pointer"
                >
                  Registrar Servicio Realizado (Reiniciar Predictivo)
                </button>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
