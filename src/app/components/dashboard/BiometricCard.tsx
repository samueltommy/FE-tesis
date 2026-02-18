import React from 'react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Activity, Scale, Clock, Ruler } from 'lucide-react';
import { Chicken } from '../../data';

interface BiometricCardProps {
  chicken: Chicken;
}

export const BiometricCard = ({ chicken }: BiometricCardProps) => {
  const weightKg = (chicken.weight / 1000).toFixed(2);
  const isHarvestReady = chicken.weight >= 2000;
  const statusColor = isHarvestReady ? "text-green-500" : "text-amber-500";
  const gaugeColor = isHarvestReady ? "#22c55e" : "#f59e0b";
  const percent = Math.min((chicken.weight / 2500) * 100, 100);

  return (
    <Card className="flex flex-col h-full w-full bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden shadow-xl">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
          <span className="font-mono text-sm font-bold tracking-tight">ID {chicken.id}</span>
        </div>
        <Badge variant="outline" className="text-[9px] bg-zinc-900 text-zinc-400 border-zinc-700 font-mono px-1.5 py-0">
          TRACKING ACTIVE
        </Badge>
      </div>

      {/* Main Content - Simplified to fit without scrolling */}
      <div className="flex-1 flex flex-col justify-between p-3" aria-live="polite">
        
        {/* Visual Proof Section */}
        <div>
          <h4 className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
            <Ruler className="w-3 h-3" /> Visual Metrics
          </h4>
          <div className="grid grid-cols-2 gap-2">
             <div className="relative h-16 rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
               <div className="absolute top-0.5 left-0.5 z-10 bg-black/60 px-1 py-0.5 text-[7px] font-mono text-zinc-300 rounded-sm">TOP</div>
               <img src="https://images.unsplash.com/photo-1504211521532-e461946e21b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" alt="Top" className="w-full h-full object-cover opacity-70" />
             </div>
             <div className="relative h-16 rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900">
                <div className="absolute top-0.5 left-0.5 z-10 bg-black/60 px-1 py-0.5 text-[7px] font-mono text-zinc-300 rounded-sm">SIDE</div>
               <img src="https://images.unsplash.com/photo-1673446672646-74e63636db3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200" alt="Side" className="w-full h-full object-cover opacity-70" />
             </div>
          </div>
        </div>

        {/* Weight Section */}
        <div>
           <h4 className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
            <Scale className="w-3 h-3" /> Real-time Mass
          </h4>
          <div className="flex items-center gap-3 bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50">
            <div className="relative w-16 h-16 shrink-0 flex items-center justify-center">
              {/* Added viewBox to SVG to make it auto-scale perfectly */}
              <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90">
                <circle cx="48" cy="48" r="42" className="fill-none stroke-zinc-800" strokeWidth="8" />
                <circle
                  cx="48" cy="48" r="42" strokeWidth="8"
                  className="fill-none transition-all duration-1000 ease-out"
                  stroke={gaugeColor} strokeLinecap="round"
                  strokeDasharray={263.89} strokeDashoffset={263.89 * (1 - percent / 100)}
                />
              </svg>
              <div className="absolute flex flex-col items-center">
                 <span className={`text-lg font-bold font-mono ${statusColor}`}>{weightKg}</span>
              </div>
            </div>
            
            <div className="flex flex-col justify-center flex-1">
               <span className="text-zinc-400 text-[10px] font-medium">Target: 2.50 kg</span>
               <div className="h-1.5 w-full bg-zinc-800 rounded-full mt-1 overflow-hidden">
                  <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${percent}%` }} />
               </div>
               <span className="text-[9px] text-zinc-500 mt-1 font-mono">{percent.toFixed(0)}% Reached</span>
            </div>
          </div>
        </div>

        {/* Age Section */}
        <div>
           <h4 className="text-[9px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
            <Clock className="w-3 h-3" /> Growth Timeline
          </h4>
          <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50 flex justify-between items-center">
             <div>
                <div className="text-xl font-bold text-zinc-200 leading-none">{chicken.age} <span className="text-xs font-normal text-zinc-500">Days</span></div>
             </div>
             <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[9px] text-zinc-400">
                <Activity className="w-2.5 h-2.5 text-zinc-500" />
                Dev: ±1 Day
             </div>
          </div>
        </div>

      </div>

      {/* Footer Action */}
      <div className={`p-3 border-t border-zinc-800 shrink-0 ${isHarvestReady ? 'bg-green-950/20' : 'bg-zinc-900/30'}`}>
         {isHarvestReady ? (
             <Badge className="bg-green-500 hover:bg-green-600 text-zinc-950 font-bold tracking-wide w-full justify-center py-1.5 text-xs rounded-md">
               HARVEST READY
             </Badge>
         ) : (
            <div className="flex flex-col gap-1.5">
               <div className="flex justify-between text-[9px] uppercase font-bold text-zinc-500">
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