import React from 'react';
import { Badge } from '@/app/components/ui/badge';
import { Card } from '@/app/components/ui/card';
import { Activity, Scale, Clock, Ruler } from 'lucide-react';

interface BiometricCardProps {
  id: string;
  weight: number; // in kg
  age: number; // in days
  stdDev: number;
}

export const BiometricCard = ({ id = "#45", weight = 1.85, age = 32, stdDev = 1 }: BiometricCardProps) => {
  const isHarvestReady = weight >= 2.0;
  const statusColor = isHarvestReady ? "text-green-500" : "text-amber-500";
  const gaugeColor = isHarvestReady ? "#22c55e" : "#f59e0b";
  const percent = Math.min((weight / 2.5) * 100, 100);

  return (
    <Card className="flex flex-col h-full w-full bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="font-mono font-bold tracking-tight">ID {id}</span>
        </div>
        <Badge variant="outline" className="text-[10px] bg-zinc-900 text-zinc-400 border-zinc-700 font-mono">
          TRACKING ACTIVE
        </Badge>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-6">
        
        {/* Visual Proof Section */}
        <div className="space-y-3">
          <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
            <Ruler className="w-3 h-3" /> Visual Metrics
          </h4>
          <div className="grid grid-cols-2 gap-3">
             {/* Top View Thumbnail */}
             <div className="relative aspect-square rounded-sm overflow-hidden border border-zinc-800 group bg-zinc-900">
               <div className="absolute top-1 left-1 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono text-zinc-300 border border-zinc-800 rounded-sm">TOP</div>
               <img 
                  src="https://images.unsplash.com/photo-1504211521532-e461946e21b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" 
                  alt="Top View" 
                  className="w-full h-full object-cover opacity-70 grayscale group-hover:opacity-100 transition-all duration-500"
               />
               <div className="absolute inset-0 border border-green-500/20 m-1 rounded-sm" />
             </div>

             {/* Side View Thumbnail */}
             <div className="relative aspect-square rounded-sm overflow-hidden border border-zinc-800 group bg-zinc-900">
                <div className="absolute top-1 left-1 z-10 bg-black/60 backdrop-blur-md px-1.5 py-0.5 text-[8px] font-mono text-zinc-300 border border-zinc-800 rounded-sm">SIDE</div>
               <img 
                  src="https://images.unsplash.com/photo-1673446672646-74e63636db3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" 
                  alt="Side Profile" 
                  className="w-full h-full object-cover opacity-70 grayscale group-hover:opacity-100 transition-all duration-500"
               />
               <div className="absolute inset-x-0 top-1/2 border-t border-amber-500/30 border-dashed" />
             </div>
          </div>
        </div>

        {/* Weight Section */}
        <div className="space-y-3">
           <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
            <Scale className="w-3 h-3" /> Real-time Mass
          </h4>
          <div className="flex items-center gap-4 bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
             {/* Radial Gauge */}
            <div className="relative w-20 h-20 shrink-0 flex items-center justify-center">
              <svg className="w-full h-full -rotate-90">
                <circle cx="40" cy="40" r="36" className="fill-none stroke-zinc-800" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="36"
                  className="fill-none transition-all duration-1000 ease-out"
                  strokeWidth="6"
                  stroke={gaugeColor}
                  strokeDasharray={2 * Math.PI * 36}
                  strokeDashoffset={2 * Math.PI * 36 * (1 - percent / 100)}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className={`text-xl font-bold font-mono ${statusColor}`}>{weight}</span>
                 <span className="text-[9px] text-zinc-500 uppercase">kg</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center">
               <span className="text-zinc-400 text-xs">Target: 2.50 kg</span>
               <div className="h-1.5 w-24 bg-zinc-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-zinc-600 rounded-full" style={{ width: '74%' }} />
               </div>
               <span className="text-[10px] text-zinc-500 mt-1">74% of target reached</span>
            </div>
          </div>
        </div>

        {/* Age Section */}
        <div className="space-y-3">
           <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-2">
            <Clock className="w-3 h-3" /> Growth Timeline
          </h4>
          <div className="bg-zinc-900/30 p-3 rounded-lg border border-zinc-800/50">
             <div className="flex justify-between items-end mb-1">
                <span className="text-2xl font-bold text-zinc-200">{age} <span className="text-sm font-normal text-zinc-500">Days</span></span>
                <span className="text-[10px] text-zinc-500 mb-1">Est. Age</span>
             </div>
             <div className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400">
                <Activity className="w-3 h-3 text-zinc-500" />
                Standard Deviation: ±{stdDev} Day
             </div>
          </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className={`p-4 border-t border-zinc-800 shrink-0 ${isHarvestReady ? 'bg-green-950/20' : 'bg-zinc-900/30'}`}>
         {isHarvestReady ? (
             <Badge className="bg-green-500 hover:bg-green-600 text-zinc-950 font-bold tracking-wide w-full justify-center py-2 text-sm rounded-md">
               HARVEST READY
             </Badge>
         ) : (
            <div className="flex flex-col gap-2">
               <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                  <span>Forecast</span>
                  <span className="text-blue-400">~3 Days Remaining</span>
               </div>
               <div className="w-full bg-zinc-800 h-1 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full w-[85%]" />
               </div>
            </div>
         )}
      </div>
    </Card>
  );
};
