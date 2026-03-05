import { Badge } from '../ui/badge';
import { Wifi, Battery, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ChickenListProps {
  chickens: any[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export const ChickenList = ({ chickens, selectedId, onSelect }: ChickenListProps) => {
  return (
    <div className="flex flex-col h-full bg-zinc-950 border border-zinc-800 rounded-lg overflow-hidden">
      {/* Header */}
      <div className="p-3 border-b border-zinc-800 bg-zinc-900/50 flex justify-between items-center shrink-0">
        <div>
          <h2 className="text-zinc-100 text-sm font-semibold tracking-wide">Active Detected Chickens</h2>
          <p className="text-[10px] text-zinc-500 font-mono mt-0.5">TOTAL COUNT: {chickens.length}</p>
        </div>
        <div className="flex gap-2">
           <Wifi className="w-3.5 h-3.5 text-green-500" />
           <Battery className="w-3.5 h-3.5 text-green-500" />
        </div>
      </div>

      {/* Column Titles */}
      <div className="grid grid-cols-4 px-3 py-1.5 bg-zinc-900/80 border-b border-zinc-800 text-[9px] uppercase tracking-wider text-zinc-500 font-semibold shrink-0">
        <div>ID Number</div>
        <div className="text-right">Weight (g)</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Status</div>
      </div>

      {/* Scrollable List Area */}
      <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar bg-zinc-950">
        <div className="flex flex-col">
          {chickens.length === 0 && (
             <div className="p-4 text-center text-zinc-500 text-xs">No objects detected in this session.</div>
          )}
          {chickens.map((chicken, i) => {
            const isSelected = chicken.track_id === selectedId;
            const weightGrams = chicken.estimated_weight ? (chicken.estimated_weight * 1000).toFixed(0) : "0";
            const isHealthy = chicken.estimated_weight >= 1.5; // Dummy logic
            
            return (
              <button 
                key={chicken.track_id}
                onClick={() => onSelect(chicken.track_id)}
                className={`grid grid-cols-4 px-3 py-1.5 border-b border-zinc-800/50 hover:bg-zinc-900/60 transition-colors items-center font-mono text-xs text-left w-full
                  ${isSelected ? 'bg-zinc-800/80 border-l-2 border-l-green-500' : (i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/20')}
                `}
                aria-selected={isSelected}
              >
                <div className={`font-bold ${isSelected ? 'text-green-400' : 'text-zinc-300'}`}>ID {chicken.track_id}</div> 
                <div className="text-right text-zinc-400">{weightGrams}</div>
                <div className="text-right text-zinc-500">~98%</div>
                <div className="flex justify-end">
                  {isHealthy ? (
                    <Badge variant="outline" className="bg-green-950/20 text-green-500 border-green-900 gap-1 rounded-sm text-[9px] px-1 py-0 h-4">
                      <CheckCircle2 className="w-2.5 h-2.5" /> OK
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-950/20 text-amber-500 border-amber-900 gap-1 rounded-sm text-[9px] px-1 py-0 h-4">
                      <AlertTriangle className="w-2.5 h-2.5" /> CHK
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  );
};