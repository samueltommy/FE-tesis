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
  // === STATE API BACKEND ===
  const [sessions, setSessions] = useState<string[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [chickenList, setChickenList] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [chickenDetails, setChickenDetails] = useState<any>(null);

  // States UI
  const [fullscreenOpen, setFullscreenOpen] = useState(false);
  const [yoloOpen, setYoloOpen] = useState(false);
  const [yoloActive, setYoloActive] = useState(false);

  const API_BASE = `http://${window.location.hostname}:5000`;

  // 1. Ambil daftar sesi saat halaman pertama kali dimuat
  useEffect(() => {
    fetch(`${API_BASE}/sessions`)
      .then(res => res.json())
      .then(data => {
        setSessions(data.sessions || []);
        if (data.current_active) {
          setCurrentSessionId(data.current_active);
        } else if (data.sessions && data.sessions.length > 0) {
          setCurrentSessionId(data.sessions[0]);
        }
      })
      .catch(err => console.error("Failed to load sessions", err));
  }, []);

  // 2. Fetch Data Tabel dan Detail Ayam (Dilengkapi Auto-Refresh saat YOLO aktif)
  useEffect(() => {
    if (!currentSessionId) return;

    const loadData = async () => {
      try {
        // Ambil Data Tabel
        const listRes = await fetch(`${API_BASE}/session_objects?session_id=${currentSessionId}`);
        const listData = await listRes.json();
        setChickenList(listData);

        let activeId = selectedId;
        
        // Auto-select ID terkecil jika belum ada yang terpilih
        if (listData.length > 0 && selectedId === null) {
          activeId = listData[0].track_id;
          setSelectedId(activeId);
        }

        // Ambil Detail Ayam yang Dipilih
        if (activeId !== null) {
          const detailRes = await fetch(`${API_BASE}/object_details?track_id=${activeId}&session_id=${currentSessionId}`);
          if (detailRes.ok) {
            const detailData = await detailRes.json();
            setChickenDetails(detailData);
          }
        }
      } catch (e) {
        console.error('Error fetching data:', e);
      }
    };

    loadData();

    // Jalankan Polling setiap 2 detik JIKA YOLO sedang aktif
    let interval: NodeJS.Timeout;
    if (yoloActive) {
      interval = setInterval(loadData, 2000);
    }
    return () => clearInterval(interval);
  }, [currentSessionId, selectedId, yoloActive]);

  // YOLO Timer UI
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
      const res = await fetch(`${API_BASE}/trigger`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ duration: 60 })
      });
      const data = await res.json();
      
      // Jika Backend memberikan Session ID baru, pindah ke sesi tersebut
      if (data.session_id) {
        setCurrentSessionId(data.session_id);
        setSelectedId(null); // Reset pilihan
        
        // Tambahkan sesi baru ke dropdown jika belum ada
        if (!sessions.includes(data.session_id)) {
           setSessions(prev => [data.session_id, ...prev]);
        }
      }
    } catch (e) {
      console.error('Trigger failed:', e);
    }
    setYoloOpen(true);
  };

  useEffect(() => {
    document.title = "FarmSense - Precision Livestock Dashboard";
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
      {/* Navbar */}
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-500/10 rounded-md flex items-center justify-center border border-green-500/20">
              <LayoutDashboard className="w-5 h-5 text-green-500" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100">
              FARM<span className="text-green-500">SENSE</span> 
              <span className="text-zinc-600 font-normal ml-2 text-xs border-l border-zinc-700 pl-2 hidden sm:inline-block">PRECISION LIVESTOCK TWIN v2.4</span>
            </h1>
          </div>
          
          {/* Dropdown Session Picker */}
          {sessions.length > 0 && (
            <select 
              className="bg-zinc-900 border border-zinc-700 text-xs text-zinc-300 rounded px-2 py-1 outline-none ml-2"
              value={currentSessionId || ''}
              onChange={(e) => {
                setCurrentSessionId(e.target.value);
                setSelectedId(null); 
              }}
            >
              {sessions.map(s => (
                <option key={s} value={s}>Session: {s}</option>
              ))}
            </select>
          )}
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
              <Button size="icon" className="bg-transparent text-white hover:bg-zinc-800/60">
                <Settings className="w-5 h-5" strokeWidth={2.2} color="white" />
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-zinc-950 border-zinc-800 text-zinc-100">
              <DialogHeader>
                <DialogTitle>Farm Configuration</DialogTitle>
                <DialogDescription className="text-zinc-400">
                  Set parameters for biological growth calculation.
                </DialogDescription>
              </DialogHeader>
              
              <form 
                className="flex flex-col gap-4 mt-4"
                onSubmit={async (e) => {
                  e.preventDefault();
                  const formData = new FormData(e.currentTarget);
                  
                  // Kirim data ke Backend
                  await fetch(`${API_BASE}/farm_settings`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                      chick_in_date: formData.get('chick_in_date') || null,
                      manual_age_override: formData.get('manual_age') ? parseInt(formData.get('manual_age') as string) : null
                    })
                  });
                  alert('Settings saved successfully!');
                }}
              >
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold">Chick-in Date (For Live Camera)</label>
                  <input 
                    name="chick_in_date" 
                    type="date" 
                    className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500" 
                  />
                  <span className="text-xs text-zinc-500">System will calculate age based on today's date.</span>
                </div>

                <div className="flex flex-col gap-1.5 mt-2 border-t border-zinc-800 pt-4">
                  <label className="text-sm font-semibold">Video Playback Age Override (Days)</label>
                  <input 
                    name="manual_age" 
                    type="number" 
                    placeholder="e.g. 35"
                    className="bg-zinc-900 border border-zinc-700 rounded-md px-3 py-2 text-sm outline-none focus:ring-1 focus:ring-green-500" 
                  />
                  <span className="text-xs text-zinc-500">Fill this ONLY if analyzing recorded video to override auto-calculation.</span>
                </div>

                <Button type="submit" className="mt-4 bg-green-600 hover:bg-green-500 text-white">
                  Save Settings
                </Button>
              </form>
            </DialogContent>
          </Dialog>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <img src="https://ui.shadcn.com/avatars/01.png" alt="User" />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6 bg-zinc-950 min-h-[calc(100vh-3.5rem)]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-1 lg:col-span-6 xl:col-span-4 h-[350px] xl:h-[500px] cursor-pointer hover:ring-2 hover:ring-zinc-700 transition-all rounded-lg" onClick={() => setFullscreenOpen(true)}>
            <VideoFeed title="TOP VIEW" type="top" selectedId={selectedId?.toString() || ''} enableYolo={yoloActive} />
          </div>
          <div className="col-span-1 lg:col-span-6 xl:col-span-4 h-[350px] xl:h-[500px] cursor-pointer hover:ring-2 hover:ring-zinc-700 transition-all rounded-lg" onClick={() => setFullscreenOpen(true)}>
            <VideoFeed title="SIDE VIEW" type="side" selectedId={selectedId?.toString() || ''} enableYolo={yoloActive} />
          </div>

           <div className="col-span-1 lg:col-span-12 xl:col-span-4 h-[400px] xl:h-[500px]">
             {/* Pass Data API ke Component BiometricCard */}
             <BiometricCard details={chickenDetails} />
           </div>
        </div>

        {/* FULLSCREEN VIDEO DIALOG */}
        <Dialog open={fullscreenOpen} onOpenChange={setFullscreenOpen}>
          <DialogContent className="max-w-[95vw] sm:max-w-[95vw] md:max-w-[95vw] w-full h-[95vh] bg-zinc-950 border border-zinc-800 p-0 flex flex-col rounded-xl overflow-hidden shadow-2xl [&>button]:hidden">
            <div className="flex items-center justify-between px-6 py-3 bg-zinc-900 border-b border-zinc-800 shrink-0">
              <DialogHeader className="p-0 m-0">
                <DialogTitle className="text-zinc-100 text-lg tracking-tight font-bold flex items-center gap-2">
                  <LayoutDashboard className="w-5 h-5 text-green-500" />
                  Live Surveillance Feed
                </DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3">
                <Button
                  className={`font-semibold shadow-sm border h-9 text-sm px-4 flex items-center gap-2 transition-all ${
                    yoloActive ? 'bg-zinc-800 hover:bg-zinc-800 border-zinc-700 text-green-400 cursor-default' : 'bg-green-600 hover:bg-green-500 border-green-700 text-white'
                  }`}
                  onClick={yoloActive ? undefined : handleRunYolo}
                >
                  {yoloActive && <Activity className="w-4 h-4 animate-pulse" />}
                  {yoloActive ? 'YOLO Running (60s)' : 'Run YOLO Process'}
                </Button>
                <Button variant="outline" className="h-9 px-4 bg-zinc-950 border-zinc-700 text-zinc-300 hover:text-white hover:bg-red-950 hover:border-red-900 transition-colors flex items-center gap-2" onClick={() => setFullscreenOpen(false)}>
                  <X className="w-4 h-4" /> Close Window
                </Button>
              </div>
            </div>
            <div className="flex-1 flex flex-col md:flex-row gap-4 w-full h-full min-h-0 p-4 bg-black">
              <div className="flex-1 w-full h-full min-h-0 rounded-lg border border-zinc-800/50 overflow-hidden relative">
                <VideoFeed title="TOP VIEW" type="top" selectedId={selectedId?.toString() || ''} enableYolo={yoloActive} />
              </div>
              <div className="flex-1 w-full h-full min-h-0 rounded-lg border border-zinc-800/50 overflow-hidden relative">
                <VideoFeed title="SIDE VIEW" type="side" selectedId={selectedId?.toString() || ''} enableYolo={yoloActive} />
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Bottom Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6">
          <div className="col-span-1 lg:col-span-4 xl:col-span-4 h-[400px] lg:h-[500px]">
             {/* Pass Data API ke Component List */}
             <ChickenList 
               chickens={chickenList} 
               selectedId={selectedId} 
               onSelect={setSelectedId} 
             />
          </div>

          <div className="col-span-1 lg:col-span-8 xl:col-span-8 h-[400px] lg:h-[500px]">
            <WeightChart 
              flockData={flockAverageHistory} 
              selectedChickenData={[]} // Biarkan array kosong untuk mockup
              selectedId={selectedId?.toString() || ''}
            />
          </div>
        </div>
      </main>
    </div>
  );
}