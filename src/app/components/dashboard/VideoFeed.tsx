import { motion } from 'motion/react';
import { Scan, Target, Activity } from 'lucide-react';
import { Badge } from '../ui/badge';

interface VideoFeedProps {
  title: string;
  src: string;
  type: 'top' | 'side';
  selectedId?: string;
}

export const VideoFeed = ({ title, src, type, selectedId }: VideoFeedProps) => {
  return (
    <div className="relative flex flex-col h-full overflow-hidden rounded-lg border border-zinc-800 bg-zinc-950">
      {/* Header */}
      <div className="flex items-center justify-between bg-zinc-900/80 px-4 py-2 backdrop-blur-sm border-b border-zinc-800 z-10">
        <h3 className="text-sm font-medium text-zinc-300 flex items-center gap-2">
          {type === 'top' ? <Scan className="w-4 h-4 text-green-400" /> : <Activity className="w-4 h-4 text-amber-400" />}
          {title}
        </h3>
        <Badge variant="outline" className="bg-red-950/30 text-red-500 border-red-900 animate-pulse text-[10px] px-1.5">
          ● LIVE
        </Badge>
      </div>

      {/* Video Area */}
      <div className="relative flex-1 bg-zinc-950 overflow-hidden group">
        <img 
          src={src} 
          alt={title} 
          className="w-full h-full object-cover opacity-60 grayscale-[30%] contrast-125 group-hover:opacity-80 transition-opacity duration-300"
        />
        
        {/* CRT Scanline Effect */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] z-10 bg-[length:100%_2px,3px_100%] pointer-events-none" />

        {/* HUD Overlay - Top View (Multiple Targets) */}
        {type === 'top' && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2, repeatType: 'reverse' }}
              className="absolute top-1/4 left-1/4 w-32 h-32 md:w-48 md:h-48 border-2 border-green-500/50 rounded-sm"
            >
              <div className="absolute -top-7 left-0 text-sm md:text-lg text-green-400 font-bold font-mono bg-zinc-950/90 px-2 py-0.5 border border-green-500/30 rounded-sm shadow-lg backdrop-blur-sm">
                ID:{selectedId || 'SCANNING...'}
              </div>
              <div className="absolute bottom-0 right-0 p-1 text-xs md:text-sm text-green-400 font-bold font-mono bg-zinc-950/50">
                CONF: 98%
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ repeat: Infinity, duration: 2.5, repeatType: 'reverse', delay: 0.5 }}
              className="absolute bottom-1/3 right-1/4 w-24 h-24 md:w-32 md:h-32 border-2 border-green-500/50 rounded-sm"
            >
              <div className="absolute -top-6 left-0 text-xs text-green-400 font-mono bg-zinc-950/80 px-1.5 py-0.5">ID:CK-901</div>
            </motion.div>
          </>
        )}


        {/* HUD Overlay - Side View (Biometrics Focus) */}
        {type === 'side' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div 
              className="w-1/2 h-2/3 border-2 border-amber-500/30 relative"
            >
               {/* Corner Brackets */}
               <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-amber-500" />
               <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-amber-500" />
               <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-amber-500" />
               <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-amber-500" />
               
               {/* Center Crosshair */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                 <Target className="w-16 h-16 text-amber-500/50" />
               </div>

               <div className="absolute -bottom-10 left-0 text-amber-400 font-mono text-sm md:text-base font-bold bg-zinc-950/80 px-2 py-1">
                  SUBJECT: {selectedId} | BIO-SCAN ACTIVE...
               </div>
            </motion.div>
          </div>
        )}

        {/* Tech Decorators */}
        <div className="absolute bottom-2 left-2 font-mono text-[10px] text-zinc-500">
          CAM-{type === 'top' ? '01' : '02'} // {type === 'top' ? 'POS_TRK' : 'BIO_MET'}
        </div>
      </div>
    </div>
  );
};
