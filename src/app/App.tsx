import React, { useState, useEffect } from 'react';
import { VideoFeed } from './components/dashboard/VideoFeed';
import { ChickenList } from './components/dashboard/ChickenList';
import { WeightChart } from './components/dashboard/WeightChart';
import { BiometricCard } from './components/dashboard/BiometricCard';
import { LayoutDashboard, Settings, Bell } from 'lucide-react';
import { Button } from './components/ui/button';
import { mockChickens, flockAverageHistory } from './data';

export default function App() {
  const [selectedChickenId, setSelectedChickenId] = useState<string>(mockChickens[0].id);
  const selectedChicken = mockChickens.find(c => c.id === selectedChickenId) || mockChickens[0];

  useEffect(() => {
    document.title = "FarmSense - Precision Livestock Dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
      {/* Navbar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500/10 rounded-md flex items-center justify-center border border-green-500/20">
            <LayoutDashboard className="w-5 h-5 text-green-500" />
          </div>
          <h1 className="text-lg font-bold tracking-tight text-zinc-100">
            FARM<span className="text-green-500">SENSE</span> 
            <span className="text-zinc-600 font-normal ml-2 text-xs border-l border-zinc-700 pl-2">PRECISION LIVESTOCK TWIN v2.4</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900 rounded-full border border-zinc-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-xs text-zinc-400 font-mono">SYSTEM ONLINE</span>
          </div>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Bell className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-zinc-400 hover:text-white hover:bg-zinc-800">
            <Settings className="w-5 h-5" />
          </Button>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <img src="https://ui.shadcn.com/avatars/01.png" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
        
        {/* Top Section: Monitoring & Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-4 lg:gap-6">
          {/* Column 1: Top View - Stack on mobile, side-by-side on tablet, 1/4 on desktop */}
          <div className="col-span-1 xl:col-span-3 h-[300px] sm:h-[350px] xl:h-[450px]">
            <VideoFeed 
              title="TOP VIEW" 
              type="top"
              src="https://images.unsplash.com/photo-1504211521532-e461946e21b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcG91bHRyeSUyMGZhcm0lMjB0b3AlMjB2aWV3fGVufDF8fHx8MTc2ODQwNTk0NXww&ixlib=rb-4.1.0&q=80&w=1080" 
              selectedId={selectedChickenId}
            />
          </div>

          {/* Column 2: Side View - Stack on mobile, side-by-side on tablet, 1/4 on desktop */}
          <div className="col-span-1 xl:col-span-3 h-[300px] sm:h-[350px] xl:h-[450px]">
            <VideoFeed 
              title="SIDE VIEW" 
              type="side"
              src="https://images.unsplash.com/photo-1673446672646-74e63636db3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY2xvc2UlMjB1cCUyMHNpZGUlMjB2aWV3fGVufDF8fHx8MTc2ODQwNTk1NXww&ixlib=rb-4.1.0&q=80&w=1080"
              selectedId={selectedChickenId}
            />
          </div>

          {/* Column 3: Chicken List - Full width on tablet, 1/2 on desktop */}
          <div className="col-span-1 md:col-span-2 xl:col-span-6 h-[400px] xl:h-[450px]">
             <ChickenList 
               chickens={mockChickens} 
               selectedId={selectedChickenId} 
               onSelect={setSelectedChickenId} 
             />
          </div>
        </div>

        {/* Bottom Section: Analysis */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-4 lg:gap-6">
          
          {/* Column 1: Detailed Biometrics */}
          <div className="col-span-1 xl:col-span-4 h-[500px] lg:h-[600px]">
             <BiometricCard chicken={selectedChicken} />
          </div>

          {/* Column 2: Growth Chart */}
          <div className="col-span-1 xl:col-span-8 h-[350px] lg:h-[600px]">
            <WeightChart 
              flockData={flockAverageHistory} 
              selectedChickenData={selectedChicken.weightHistory} 
              selectedId={selectedChickenId}
            />
          </div>

        </div>

      </main>
    </div>
  );
}
