import React from 'react';
import { ScrollArea } from '@/app/components/ui/scroll-area';
import { Badge } from '@/app/components/ui/badge';
import { Wifi, Battery, AlertTriangle, CheckCircle2 } from 'lucide-react';

const chickens = [
  { id: 'CK-892', weight: 2450, confidence: 98, status: 'healthy' },
  { id: 'CK-901', weight: 2310, confidence: 95, status: 'alert' },
  { id: 'CK-893', weight: 2510, confidence: 99, status: 'healthy' },
  { id: 'CK-894', weight: 2480, confidence: 97, status: 'healthy' },
  { id: 'CK-895', weight: 2200, confidence: 89, status: 'alert' },
  { id: 'CK-896', weight: 2550, confidence: 98, status: 'healthy' },
  { id: 'CK-897', weight: 2490, confidence: 96, status: 'healthy' },
  { id: 'CK-898', weight: 2505, confidence: 98, status: 'healthy' },
  { id: 'CK-899', weight: 2420, confidence: 94, status: 'healthy' },
  { id: 'CK-900', weight: 2460, confidence: 97, status: 'healthy' },
  { id: 'CK-902', weight: 2380, confidence: 92, status: 'healthy' },
  { id: 'CK-903', weight: 2515, confidence: 98, status: 'healthy' },
];

export const ChickenList = () => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      <div className="p-4 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center">
        <div>
          <h2 className="text-zinc-100 font-semibold tracking-wide">Active Detected Chickens</h2>
          <p className="text-xs text-zinc-500 font-mono mt-1">TOTAL COUNT: {chickens.length}</p>
        </div>
        <div className="flex gap-2">
           <Wifi className="w-4 h-4 text-green-500" />
           <Battery className="w-4 h-4 text-green-500" />
        </div>
      </div>

      <div className="grid grid-cols-4 px-4 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
        <div>ID Number</div>
        <div className="text-right">Weight (g)</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Status</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {chickens.map((chicken, i) => (
            <div 
              key={chicken.id}
              className={`grid grid-cols-4 px-4 py-3 border-b border-zinc-800/50 hover:bg-zinc-900/40 transition-colors items-center font-mono text-sm ${i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/20'}`}
            >
              <div className="text-zinc-300 font-bold">{chicken.id}</div>
              <div className="text-right text-zinc-400">{chicken.weight}</div>
              <div className="text-right text-zinc-500">{chicken.confidence}%</div>
              <div className="flex justify-end">
                {chicken.status === 'healthy' ? (
                  <Badge variant="outline" className="bg-green-950/20 text-green-500 border-green-900 gap-1 rounded-sm text-[10px] px-2 h-5">
                    <CheckCircle2 className="w-3 h-3" /> OK
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-amber-950/20 text-amber-500 border-amber-900 gap-1 rounded-sm text-[10px] px-2 h-5">
                    <AlertTriangle className="w-3 h-3" /> CHK
                  </Badge>
                )}
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
