import { ScrollArea } from '../ui/scroll-area';
import { Badge } from '../ui/badge';
import { Wifi, Battery, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Chicken } from '../../data';

interface ChickenListProps {
  chickens: Chicken[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export const ChickenList = ({ chickens, selectedId, onSelect }: ChickenListProps) => {
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

      <div className="grid grid-cols-4 px-3 py-2 bg-zinc-900/80 border-b border-zinc-800 text-[10px] uppercase tracking-wider text-zinc-500 font-semibold">
        <div>ID Number</div>
        <div className="text-right">Weight (g)</div>
        <div className="text-right">Conf.</div>
        <div className="text-right">Status</div>
      </div>

      <ScrollArea className="flex-1">
        <div className="flex flex-col">
          {chickens.map((chicken, i) => {
            const isSelected = chicken.id === selectedId;
            return (
              <button 
                key={chicken.id}
                onClick={() => onSelect(chicken.id)}
                className={`grid grid-cols-4 px-3 py-2 border-b border-zinc-800/50 hover:bg-zinc-900/60 transition-colors items-center font-mono text-xs sm:text-sm text-left w-full
                  ${isSelected ? 'bg-zinc-800/80 border-l-2 border-l-green-500' : (i % 2 === 0 ? 'bg-zinc-950' : 'bg-zinc-900/20')}
                `}
                aria-selected={isSelected}
              >
                <div className={`font-bold ${isSelected ? 'text-green-400' : 'text-zinc-300'}`}>{chicken.id}</div> 
                <div className="text-right text-zinc-400">{chicken.weight}</div>
                <div className="text-right text-zinc-500">{chicken.confidence}%</div>
                <div className="flex justify-end">
                  {chicken.status === 'healthy' ? (
                    <Badge variant="outline" className="bg-green-950/20 text-green-500 border-green-900 gap-1 rounded-sm text-[10px] px-1.5 py-0 h-5">
                      <CheckCircle2 className="w-3 h-3" /> OK
                    </Badge>
                  ) : (
                    <Badge variant="outline" className="bg-amber-950/20 text-amber-500 border-amber-900 gap-1 rounded-sm text-[10px] px-1.5 py-0 h-5">
                      <AlertTriangle className="w-3 h-3" /> CHK
                    </Badge>
                  )}
                </div>
              </button>
            )
          })}
        </div>
      </ScrollArea>
    </div>
  );
};
