import React, { useState } from 'react';
import { Badge } from '../ui/badge';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Activity, Scale, Clock, Ruler, X, CheckCircle2, Maximize2 } from 'lucide-react';
import { Chicken } from '../../data';

interface BiometricCardProps {
  details: any; // Menerima JSON dari API Backend
}

export const BiometricCard = ({ details }: BiometricCardProps) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!details) {
    return (
      <Card className="flex items-center justify-center h-full w-full bg-zinc-950 border-zinc-800 text-zinc-500 font-mono text-sm">
        [ NO DATA SELECTED ]
      </Card>
    );
  }

  // Menggabungkan data Backend dengan layout Dummy lama
  const weightKg = details.estimated_weight ? details.estimated_weight.toFixed(3) : "0.000";
  const weightGrams = details.estimated_weight ? (details.estimated_weight * 1000).toFixed(0) : "0";
  const isHarvestReady = details.estimated_weight >= 2.0; // Target 2kg
  const statusColor = isHarvestReady ? "text-green-500" : "text-amber-500";
  const gaugeColor = isHarvestReady ? "#22c55e" : "#f59e0b";
  const percent = Math.min(((details.estimated_weight || 0) / 2.5) * 100, 100);

  // Fallback untuk variabel lama yang ada di file mock (Jangan dihilangkan)
  const displayAge = details.age || 42; 
  const displayConfidence = details.confidence || 98.5;

  // Gambar
  const placeholderImg = "https://images.unsplash.com/photo-1504211521532-e461946e21b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=200";
  const topImgUrl = details.image_url_top || placeholderImg;
  const sideImgUrl = details.image_url_side || placeholderImg;

  return (
    <>
      {/* SMALL COMPACT CARD (Clickable) */}
      <Card 
        onClick={() => setIsModalOpen(true)}
        className="flex flex-col h-full w-full bg-zinc-950 border-zinc-800 text-zinc-100 overflow-hidden shadow-sm hover:ring-2 hover:ring-zinc-600 transition-all cursor-pointer group"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-3 py-2 bg-zinc-900/50 border-b border-zinc-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
            <span className="font-mono text-sm font-bold tracking-tight">ID {details.track_id}</span>
            {details.is_fused && (
              <Badge variant="outline" className="bg-blue-900/30 text-blue-400 border-blue-800 text-[9px] px-1 py-0 h-4 ml-1">3D FUSED</Badge>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-[10px] bg-zinc-900 text-zinc-400 border-zinc-700 font-mono px-1.5 py-0 h-5 flex items-center">
              TRACKING
            </Badge>
            <Maximize2 className="w-3.5 h-3.5 text-zinc-500 group-hover:text-zinc-300 transition-colors" />
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 min-h-0 flex flex-col gap-3 p-3 overflow-hidden" aria-live="polite">
          
          {/* Top Half: Split Visuals and Mass */}
          <div className="flex-1 flex gap-3 min-h-0">
             
             {/* Left: Visual Metrics */}
             <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 shrink-0">
                  <Ruler className="w-3 h-3" /> Visuals
                </h4>
                <div className="flex-1 grid grid-rows-2 gap-1.5 min-h-0">
                   <div className="relative rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                     <div className="absolute top-1 left-1 z-10 bg-black/60 px-1 py-0.5 text-[8px] font-mono text-zinc-300 rounded-sm">TOP</div>
                     <img src={topImgUrl} alt="Top" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                   </div>
                   <div className="relative rounded-sm overflow-hidden border border-zinc-800 bg-zinc-900 flex items-center justify-center">
                      <div className="absolute top-1 left-1 z-10 bg-black/60 px-1 py-0.5 text-[8px] font-mono text-zinc-300 rounded-sm">SIDE</div>
                     <img src={sideImgUrl} alt="Side" className="absolute inset-0 w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
                   </div>
                </div>
             </div>

             {/* Right: Mass & Gauge */}
             <div className="flex-1 flex flex-col gap-1.5 min-h-0">
                <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 shrink-0">
                  <Scale className="w-3 h-3" /> Mass
                </h4>
                <div className="flex-1 flex flex-col items-center justify-center bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50 min-h-0 relative">
                  <div className="flex-1 w-full min-h-0 flex items-center justify-center relative">
                    <svg viewBox="0 0 96 96" className="h-full w-auto max-w-full -rotate-90 drop-shadow-md">
                      <circle cx="48" cy="48" r="42" className="fill-none stroke-zinc-800" strokeWidth="8" />
                      <circle cx="48" cy="48" r="42" strokeWidth="8" className="fill-none transition-all duration-1000 ease-out" stroke={gaugeColor} strokeLinecap="round" strokeDasharray={263.89} strokeDashoffset={263.89 * (1 - percent / 100)} />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                       <span className={`text-lg lg:text-xl font-bold font-mono ${statusColor} leading-none`}>{weightKg}</span>
                    </div>
                  </div>
                  <div className="w-full shrink-0 mt-2">
                     <div className="flex justify-between items-baseline mb-1">
                        <span className="text-zinc-400 text-[10px] font-medium leading-tight">Target 2.5kg</span>
                        <span className="text-[10px] text-zinc-500 font-mono">{percent.toFixed(0)}%</span>
                     </div>
                     <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-zinc-600 rounded-full" style={{ width: `${percent}%` }} />
                     </div>
                  </div>
                </div>
             </div>
          </div>

          {/* Bottom Half: Age & Timeline */}
          <div className="shrink-0">
             <h4 className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold flex items-center gap-1.5 mb-1.5">
              <Clock className="w-3 h-3" /> Timeline
            </h4>
            <div className="bg-zinc-900/30 p-2 rounded-lg border border-zinc-800/50 flex justify-between items-center">
               <div>
                  <div className="text-lg font-bold text-zinc-200 leading-none">{displayAge} <span className="text-[10px] font-normal text-zinc-500">Days</span></div>
               </div>
               <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-[10px] text-zinc-400">
                  <Activity className="w-3 h-3 text-zinc-500" />
                  ±1 Day
               </div>
            </div>
          </div>
        </div>

        {/* Footer Action */}
        <div className={`p-2.5 border-t border-zinc-800 shrink-0 ${isHarvestReady ? 'bg-green-950/20' : 'bg-zinc-900/30'}`}>
           {isHarvestReady ? (
               <Badge className="bg-green-500 hover:bg-green-600 text-zinc-950 font-bold tracking-wide w-full justify-center py-1 text-xs rounded-md h-auto">
                 HARVEST READY
               </Badge>
           ) : (
              <div className="flex flex-col gap-1.5">
                 <div className="flex justify-between text-[10px] uppercase font-bold text-zinc-500">
                    <span>Forecast</span>
                    <span className="text-blue-400">~3 Days Remaining</span>
                 </div>
                 <div className="w-full bg-zinc-800 h-1.5 rounded-full overflow-hidden">
                    <div className="bg-blue-500 h-full w-[85%]" />
                 </div>
              </div>
           )}
        </div>
      </Card>

      {/* DETAILED MODAL POPUP */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-5xl sm:max-w-5xl w-[95vw] bg-zinc-950 border border-zinc-800 p-0 flex flex-col rounded-xl overflow-hidden shadow-2xl [&>button]:hidden text-zinc-100">
          
          <div className="flex items-center justify-between px-6 py-4 bg-zinc-900 border-b border-zinc-800 shrink-0">
            <DialogHeader className="p-0 m-0">
              <DialogTitle className="text-zinc-100 text-xl tracking-tight font-bold flex items-center gap-3">
                <Activity className="w-6 h-6 text-blue-500" />
                Detailed Biometric Analysis - ID: {details.track_id}
              </DialogTitle>
            </DialogHeader>
            <Button
              variant="outline"
              className="h-10 px-5 bg-zinc-950 border-zinc-700 text-zinc-300 hover:text-white hover:bg-red-950 hover:border-red-900 transition-colors flex items-center gap-2"
              onClick={() => setIsModalOpen(false)}
            >
              <X className="w-4 h-4" />
              Close Report
            </Button>
          </div>

          <div className="p-6 grid grid-cols-1 lg:grid-cols-2 gap-8 bg-black overflow-y-auto max-h-[80vh]">
            
            {/* LEFT: Large High-Res Visuals */}
            <div className="space-y-4">
               <h3 className="text-zinc-400 font-bold tracking-widest uppercase flex items-center gap-2 text-sm border-b border-zinc-800 pb-2">
                 <Ruler className="w-5 h-5 text-zinc-300" /> 
                 Captured Source Visuals
               </h3>
               <div className="flex flex-col gap-4">
                 <div className="relative rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900 h-64 shadow-inner flex items-center justify-center">
                   <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 text-xs font-mono text-green-400 border border-green-500/30 rounded z-10 font-bold">TOP CAMERA FEED</div>
                   <img src={topImgUrl} className="w-full h-full object-contain opacity-90" alt="Top Camera" />
                 </div>
                 <div className="relative rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900 h-64 shadow-inner flex items-center justify-center">
                   <div className="absolute top-3 left-3 bg-black/80 px-3 py-1 text-xs font-mono text-amber-400 border border-amber-500/30 rounded z-10 font-bold">SIDE CAMERA FEED</div>
                   <img src={sideImgUrl} className="w-full h-full object-contain opacity-90" alt="Side Camera" />
                 </div>
               </div>
            </div>

            {/* RIGHT: Detailed Biometric Data */}
            <div className="flex flex-col gap-6">
               <h3 className="text-zinc-400 font-bold tracking-widest uppercase flex items-center gap-2 text-sm border-b border-zinc-800 pb-2">
                 <Scale className="w-5 h-5 text-zinc-300" /> 
                 Precision Analysis Data
               </h3>

               {/* Giant Gauge Card */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex items-center gap-8 shadow-md">
                  <div className="w-40 h-40 relative shrink-0">
                     <svg viewBox="0 0 96 96" className="w-full h-full -rotate-90 drop-shadow-lg">
                        <circle cx="48" cy="48" r="42" className="fill-none stroke-zinc-950" strokeWidth="8" />
                        <circle cx="48" cy="48" r="42" strokeWidth="8" className="fill-none transition-all duration-1000 ease-out" stroke={gaugeColor} strokeLinecap="round" strokeDasharray={263.89} strokeDashoffset={263.89 * (1 - percent / 100)} />
                     </svg>
                     <div className="absolute inset-0 flex flex-col items-center justify-center pt-2">
                       <span className={`text-4xl font-bold font-mono ${statusColor}`}>{weightKg}</span>
                       <span className="text-zinc-500 text-sm font-semibold tracking-widest mt-1">KG MASS</span>
                     </div>
                  </div>

                  <div className="flex-1 space-y-4">
                     <div>
                        <div className="flex justify-between text-sm mb-1 text-zinc-300 font-semibold">
                          <span>Target Weight: 2.50 kg</span>
                          <span className="font-mono text-blue-400">{percent.toFixed(1)}%</span>
                        </div>
                        <div className="h-2 w-full bg-zinc-950 rounded-full overflow-hidden border border-zinc-800">
                           <div className="h-full bg-blue-500 rounded-full" style={{ width: `${percent}%` }} />
                        </div>
                     </div>
                     <div className="grid grid-cols-2 gap-4 pt-2">
                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                           <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Flock Age</div>
                           <div className="text-2xl font-bold text-zinc-100 mt-1">{displayAge} <span className="text-sm font-normal text-zinc-500">Days</span></div>
                        </div>
                        <div className="bg-zinc-950 border border-zinc-800 rounded-lg p-3">
                           <div className="text-xs text-zinc-500 font-bold uppercase tracking-wider">Classification</div>
                           <div className={`text-lg font-bold mt-1 tracking-wide ${isHarvestReady ? 'text-green-500' : 'text-blue-500'}`}>
                             {isHarvestReady ? 'HARVEST READY' : 'GROWING'}
                           </div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Extended Info Panel */}
               <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 flex-1 flex flex-col justify-center shadow-md">
                  <div className="space-y-6">
                     <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                        <span className="text-zinc-400 font-medium">Tracking Confidence Algorithm</span>
                        <span className="font-mono text-green-400 font-bold text-lg">{displayConfidence}% ACC</span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                        <span className="text-zinc-400 font-medium">Calculation Algorithm</span>
                        <span className="font-mono text-blue-400 font-bold text-sm">
                          {details.is_fused ? '3D VOLUME FUSION' : '2D AREA ESTIMATION'}
                        </span>
                     </div>
                     <div className="flex justify-between items-center pb-4 border-b border-zinc-800/80">
                        <span className="text-zinc-400 font-medium">Estimated AI Forecast</span>
                        <span className="font-mono text-zinc-100 font-semibold text-right">
                          {isHarvestReady ? 'Target Reached.' : '~3 Days Remaining'}
                        </span>
                     </div>
                     <div className="flex justify-between items-center">
                        <span className="text-zinc-400 font-medium">Biological Health Status</span>
                        <Badge variant="outline" className="bg-green-950/40 text-green-500 border-green-900 flex items-center gap-2 py-1 px-3">
                          <CheckCircle2 className="w-4 h-4" /> NO ANOMALIES DETECTED
                        </Badge>
                     </div>
                  </div>
               </div>

            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};