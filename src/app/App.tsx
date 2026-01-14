import React from 'react';
import { VideoFeed } from './components/dashboard/VideoFeed';
import { ChickenList } from './components/dashboard/ChickenList';
import { WeightChart } from './components/dashboard/WeightChart';
import { BiometricCard } from './components/dashboard/BiometricCard';
import { LayoutDashboard, Settings, Bell } from 'lucide-react';
import { Button } from './components/ui/button';

export default function App() {
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
      <main className="p-4 h-[calc(100vh-3.5rem)] flex flex-col gap-4 overflow-hidden">
        
        {/* Top Section (3 Columns) */}
        <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-12 gap-4">
          
          {/* Column 1: Video Feeds (40% width approx on large screens -> 5 cols) */}
          <div className="lg:col-span-5 flex flex-col gap-4 min-h-0">
            <div className="flex-1 min-h-0">
              <VideoFeed 
                title="TOP VIEW (POSITION TRACKING)" 
                type="top"
                src="https://images.unsplash.com/photo-1504211521532-e461946e21b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwcG91bHRyeSUyMGZhcm0lMjB0b3AlMjB2aWV3fGVufDF8fHx8MTc2ODQwNTk0NXww&ixlib=rb-4.1.0&q=80&w=1080" 
              />
            </div>
            <div className="flex-1 min-h-0">
              <VideoFeed 
                title="SIDE VIEW (BIOMETRICS)" 
                type="side"
                src="https://images.unsplash.com/photo-1673446672646-74e63636db3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjaGlja2VuJTIwY2xvc2UlMjB1cCUyMHNpZGUlMjB2aWV3fGVufDF8fHx8MTc2ODQwNTk1NXww&ixlib=rb-4.1.0&q=80&w=1080"
              />
            </div>
          </div>

          {/* Column 2: Analytics List (30% -> 4 cols) */}
          <div className="lg:col-span-4 min-h-0">
             <ChickenList />
          </div>

          {/* Column 3: Biometric Card (30% -> 3 cols) */}
          <div className="lg:col-span-3 min-h-0">
             <BiometricCard id="#45" weight={1.85} age={32} stdDev={1} />
          </div>

        </div>

        {/* Bottom Section: Chart */}
        <div className="h-64 shrink-0">
          <WeightChart />
        </div>

      </main>
    </div>
  );
}
