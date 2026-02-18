import React, { useState, useEffect } from 'react';
import { VideoFeed } from './components/dashboard/VideoFeed';
import { ChickenList } from './components/dashboard/ChickenList';
import { WeightChart } from './components/dashboard/WeightChart';
import { BiometricCard } from './components/dashboard/BiometricCard';
import { LayoutDashboard, Settings, X, Activity } from 'lucide-react'; 
import { Button } from './components/ui/button';
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription } from './components/ui/dialog';
import { mockChickens, flockAverageHistory } from './data';
import { YOLOProcessingModal } from './components/dashboard/YOLOProcessingModal';

export default function App() {
  const [selectedChickenId, setSelectedChickenId] = useState<string>(mockChickens[0].id);
  const selectedChicken = mockChickens.find(c => c.id === selectedChickenId) || mockChickens[0];
  
  // States
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [yoloOpen, setYoloOpen] = useState(false);
  const [yoloActive, setYoloActive] = useState(false);

  // Automatically turn off the YOLO UI after 60 seconds to perfectly match your backend process!
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    if (yoloActive) {
      timeout = setTimeout(() => {
        setYoloActive(false);
      }, 60000); // 60 seconds
    }
    return () => clearTimeout(timeout);
  }, [yoloActive]);

  const handleRunYolo = async () => {
    try {
      // Trigger the backend to run for 60 seconds
      await fetch('http://127.0.0.1:5000/trigger', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 60 })
      });
    } catch (e) {
      console.error('Trigger failed:', e);
    }
    setYoloOpen(true); // Open the loading modal
  };

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
            <span className="text-zinc-600 font-normal ml-2 text-xs border-l border-zinc-700 pl-2 hidden sm:inline-block">PRECISION LIVESTOCK TWIN v2.4</span>
          </h1>
        </div>
        
        <div className="flex items-center gap-4">
          <Button
            className={`font-semibold shadow-sm border flex items-center gap-2 transition-all ${
              yoloActive 
                ? 'bg-zinc-800 hover:bg-zinc-800 border-zinc-700 text-green-400 cursor-default' 
                : 'bg-green-600 hover:bg-green-500 border-green-700 text-white'
            }`}
            size="sm"
            onClick={yoloActive ? undefined : handleRunYolo}
          >
            {yoloActive && <Activity className="w-3.5 h-3.5 animate-pulse" />}
            {yoloActive ? 'YOLO Running' : 'Run YOLO'}
          </Button>

          {/* YOLO Modal triggers yoloActive=true when it finishes */}
          <YOLOProcessingModal
            open={yoloOpen}
            onClose={() => {
              setYoloOpen(false);
              setYoloActive(true);
            }}
            duration={2000}
          />
          <Dialog>
            <DialogTrigger asChild>
              <Button
                size="icon"
                className="bg-transparent text-white hover:bg-zinc-800/60"
                aria-label="Account Settings"
              >
                <Settings className="w-5 h-5" strokeWidth={2.2} color="white" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Account Settings</DialogTitle>
                <DialogDescription>
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-sm">User: <span className="font-mono">admin</span></div>
                    <div className="text-sm">Email: <span className="font-mono">admin@example.com</span></div>
                    <Button className="mt-2 w-fit" variant="secondary">Change Password</Button>
                  </div>
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <img src="https://ui.shadcn.com/avatars/01.png" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
        
        {/* Top Section: Video Monitoring & Selected Chicken Data */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">

          {/* Top View Camera */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-4 h-[350px] xl:h-[500px] cursor-pointer hover:ring-2 hover:ring-zinc-700 transition-all rounded-lg" onClick={() => setFullscreenOpen(true)}>
            <VideoFeed 
              title="TOP VIEW" 
              type="top"
              selectedId={selectedChickenId}
              enableYolo={yoloActive}
            />
          </div>

          {/* Side View Camera */}
          <div className="col-span-1 lg:col-span-6 xl:col-span-4 h-[350px] xl:h-[500px] cursor-pointer hover:ring-2 hover:ring-zinc-700 transition-all rounded-lg" onClick={() => setFullscreenOpen(true)}>
            <VideoFeed 
              title="SIDE VIEW" 
              type="side"
              selectedId={selectedChickenId}
              enableYolo={yoloActive}
            />
          </div>

           {/* Detailed Biometrics */}
           <div className="col-span-1 lg:col-span-12 xl:col-span-4 h-[400px] xl:h-[500px]">
             <BiometricCard chicken={selectedChicken} />
           </div>

        </div>

        {/* FULLSCREEN VIDEO DIALOG */}
        <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
          {/* [&>button]:hidden removes the tiny default shadcn close button so we can use our custom top bar instead */}
          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] w-full h-[95vh] bg-zinc-950 border border-zinc-800 p-0 flex flex-col rounded-xl overflow-hidden shadow-2xl [&>button]:hidden">
            
            {/* Custom Interactive Top Bar */}
            <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <DialogHeader className="p-0 m-0">
                <DialogTitle className="text-zinc-100 text-lg tracking-tight font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-green-500" />
                  Live Surveillance Feed
                </DialogTitle>
              </DialogHeader>
              
              <div className="flex items-center gap-3">
                
                {/* YOLO Indicator inside the Popup */}
                <Button
                  className={`font-semibold shadow-sm border h-9 text-sm px-4 flex items-center gap-2 transition-all ${
                    yoloActive 
                      ? 'bg-zinc-800 hover:bg-zinc-800 border-zinc-700 text-green-400 cursor-default' 
                      : 'bg-green-600 hover:bg-green-500 border-green-700 text-white'
                  }`}
                  onClick={yoloActive ? undefined : handleRunYolo}
                >
                  {yoloActive && <Activity className="w-4 h-4 animate-pulse" />}
                  {yoloActive ? 'YOLO Running (60s)' : 'Run YOLO Process'}
                </Button>
                
                {/* Big, Clear Close Button with hover effects */}
                <Button
                  variant="outline"
                  className="h-9 px-4 bg-zinc-950 border-zinc-700 text-zinc-300 hover:text-white hover:bg-red-950 hover:border-red-900 transition-colors flex items-center gap-2"
                  onClick={() => setFullscreenOpen(false)}
                >
                  <X className="w-4 h-4" />
                  Close Window
                </Button>

              </div>
            </div>
            
            {/* Video Container Area */}
            <div className="flex-1 flex flex-col md:flex-row gap-4 w-full h-full min-h-0 p-4 bg-black">
              <div className="flex-1 w-full h-full min-h-0 rounded-lg border border-zinc-800/50 overflow-hidden relative">
                <VideoFeed title="TOP VIEW" type="top" selectedId={selectedChickenId} enableYolo={yoloActive} />
              </div>
              <div className="flex-1 w-full h-full min-h-0 rounded-lg border border-zinc-800/50 overflow-hidden relative">
                <VideoFeed title="SIDE VIEW" type="side" selectedId={selectedChickenId} enableYolo={yoloActive} />
              </div>
            </div>
            
          </DialogContent>
        </Dialog>

        {/* Bottom Section: Flock List & Weight Analysis */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          
          <div className="col-span-1 lg:col-span-4 xl:col-span-4 h-[400px] lg:h-[500px]">
             <ChickenList 
               chickens={mockChickens} 
               selectedId={selectedChickenId} 
               onSelect={setSelectedChickenId} 
             />
          </div>

          <div className="col-span-1 lg:col-span-8 xl:col-span-8 h-[400px] lg:h-[500px]">
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