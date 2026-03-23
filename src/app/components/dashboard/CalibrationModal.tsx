import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Crosshair, ScanLine, Save, CheckCircle2, AlertCircle, Loader2, Camera, Info, Ruler } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';

export const CalibrationModal = () => {
  const [open, setOpen] = useState(false);
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState(false);

  const API_BASE = `http://${window.location.hostname}:5000`;

  const handleCapture = async () => {
    setLoading(true);
    setError(false);
    setMessage('');
    try {
      const res = await fetch(`${API_BASE}/api/calibration/capture`, { method: 'POST' });
      const data = await res.json();
      
      setMessage(data.message);
      if (data.success) {
        setStep(2);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      setMessage('Gagal terhubung ke Edge Node.');
    }
    setLoading(false);
  };

  const handleSave = async () => {
    setLoading(true);
    setError(false);
    try {
      // PERBAIKAN: Tambahkan headers Content-Type dan body JSON
      const res = await fetch(`${API_BASE}/api/calibration/save`, { 
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name: 'Web Auto-Calib' })
      });
      const data = await res.json();
      
      setMessage(data.message);
      if (data.success) {
        setStep(3);
      } else {
        setError(true);
      }
    } catch (e) {
      setError(true);
      setMessage('Gagal menyimpan matriks kalibrasi.');
    }
    setLoading(false);
  };

  const resetModal = () => {
    setStep(1);
    setMessage('');
    setError(false);
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      setOpen(isOpen);
      if (!isOpen) resetModal();
    }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="bg-zinc-950 border-zinc-800 text-zinc-300 hover:text-green-400 hover:bg-zinc-900 transition-colors">
          <Crosshair className="w-5 h-5" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-zinc-950 border border-zinc-800 text-zinc-100 sm:max-w-5xl w-[95vw] max-h-[90vh] p-0 flex flex-col shadow-2xl overflow-hidden">
        
        <div className="flex flex-col md:flex-row flex-1 min-h-0">
          
          {/* ======================================================== */}
          {/* KOLOM KIRI: LIVE CAMERA (55% Lebar) */}
          {/* ======================================================== */}
          <div className="w-full md:w-[55%] bg-black p-4 flex flex-col gap-3 border-r border-zinc-800 relative min-h-[40vh] md:min-h-0 overflow-y-auto">
            <div className="absolute top-2 left-6 px-3 py-1 bg-green-900/80 text-green-300 text-xs font-mono rounded-full border border-green-700 z-10 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
              </span>
              OPTICAL TRACKING ACTIVE
            </div>

            <div className="flex-1 min-h-0 relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 group">
               <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-zinc-300 z-10 flex items-center gap-2">
                 <Camera className="w-3 h-3 text-emerald-400" /> TOP VIEW
               </div>
               {open ? (
                 <img 
                   src={`${API_BASE}/api/calibration/stream/0`} 
                   alt="Top Cam Calib" 
                   className="w-full h-full object-contain"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-600"><Loader2 className="animate-spin" /></div>
               )}
            </div>

            <div className="flex-1 min-h-0 relative bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 group">
               <div className="absolute top-2 left-2 bg-black/60 px-2 py-1 rounded text-[10px] font-bold tracking-wider text-zinc-300 z-10 flex items-center gap-2">
                 <Camera className="w-3 h-3 text-amber-400" /> SIDE VIEW
               </div>
               {open ? (
                 <img 
                   src={`${API_BASE}/api/calibration/stream/1`} 
                   alt="Side Cam Calib" 
                   className="w-full h-full object-contain"
                 />
               ) : (
                 <div className="w-full h-full flex items-center justify-center text-zinc-600"><Loader2 className="animate-spin" /></div>
               )}
            </div>
          </div>

          {/* ======================================================== */}
          {/* KOLOM KANAN: KONTROL (45% Lebar) */}
          {/* ======================================================== */}
          <div className="w-full md:w-[45%] bg-zinc-950 flex flex-col min-h-0">
            
            <div className="p-5 pb-4 border-b border-zinc-800 shrink-0">
              <h2 className="text-xl font-bold flex items-center gap-2 tracking-tight">
                <Crosshair className="text-green-500 w-6 h-6" />
                Kalibrasi Optik 2.5D
              </h2>
              <p className="text-xs text-zinc-400 mt-2 leading-relaxed">
                Sinkronisasi matriks fusi kamera dan perhitungan skala (cm²) menggunakan marker spasial ArUco.
              </p>
            </div>

            <div className="p-5 flex-1 overflow-y-auto min-h-0 [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-950 [&::-webkit-scrollbar-thumb]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:rounded-full">
              
              {message && (
                <Alert variant={error ? "destructive" : "default"} className={`mb-5 ${error ? 'bg-red-950/30 border-red-900 text-red-200' : 'bg-green-950/30 border-green-900 text-green-200'}`}>
                  {error ? <AlertCircle className="h-4 w-4" /> : <CheckCircle2 className="h-4 w-4" />}
                  <AlertTitle>{error ? 'Error' : 'Sukses'}</AlertTitle>
                  <AlertDescription className="text-xs mt-1 font-mono">
                    {message}
                  </AlertDescription>
                </Alert>
              )}

              <div className="flex flex-col gap-5 border-l-2 border-zinc-800 pl-5 ml-2 relative">
                
                {/* Step 1: Diperbarui dengan Instruksi Presisi */}
                <div className={`transition-all duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="absolute -left-[27px] bg-zinc-950 p-1.5">
                    <div className={`w-3 h-3 rounded-full ${step >= 1 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                  </div>
                  <h4 className="font-semibold text-sm flex items-center gap-2">
                    1. Pengukuran & Penempatan <Ruler className="w-3.5 h-3.5 text-blue-400" />
                  </h4>
                  <div className="bg-blue-950/20 border border-blue-900/50 p-3 rounded-md mt-2 flex gap-3 items-start">
                    <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                    <div className="text-xs text-zinc-300 leading-relaxed flex flex-col gap-1.5">
                      <p><strong className="text-red-400">PENTING:</strong> Kertas tidak boleh disebar sembarangan!</p>
                      <ul className="list-disc pl-4 space-y-1 text-zinc-400">
                        <li>Gunakan meteran, letakkan 4 ArUco membentuk persegi tepat berukuran <b>200 cm x 200 cm</b> di lantai kandang.</li>
                        <li>Pengukuran ditarik tepat dari <b>titik tengah</b> (silang) antar kertas.</li>
                        <li>Pastikan kotak penanda hijau muncul di layar kiri tanpa terganggu pantulan silau lampu.</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className={`transition-all duration-300 ${step >= 1 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="absolute -left-[27px] bg-zinc-950 p-1.5">
                    <div className={`w-3 h-3 rounded-full ${step >= 2 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                  </div>
                  <h4 className="font-semibold text-sm">2. Ekstraksi Koordinat</h4>
                  <p className="text-xs text-zinc-400 mt-1 mb-2">
                    Mengunci koordinat piksel (X, Y) dari semua marker yang terdeteksi untuk dikonversi ke dimensi sentimeter dunia nyata.
                  </p>
                  <Button 
                    onClick={handleCapture} 
                    disabled={loading || step === 3}
                    variant="outline" 
                    className="w-full bg-zinc-900 border-zinc-700 hover:bg-zinc-800 hover:text-green-400 text-zinc-200 flex gap-2 h-9 text-sm"
                  >
                    {loading && step === 1 ? <Loader2 className="w-4 h-4 animate-spin" /> : <ScanLine className="w-4 h-4" />}
                    Lock Koordinat (Capture)
                  </Button>
                </div>

                {/* Step 3 */}
                <div className={`transition-all duration-300 ${step >= 2 ? 'opacity-100' : 'opacity-40'}`}>
                  <div className="absolute -left-[27px] bg-zinc-950 p-1.5">
                    <div className={`w-3 h-3 rounded-full ${step === 3 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-zinc-700'}`} />
                  </div>
                  <h4 className="font-semibold text-sm">3. Kalkulasi Homografi</h4>
                  <p className="text-xs text-zinc-400 mt-1 mb-2">
                    Menciptakan Matriks Translasi (RANSAC) dan menyimpannya ke Database secara permanen.
                  </p>
                  <Button 
                    onClick={handleSave} 
                    disabled={loading || step !== 2}
                    className="w-full bg-green-600 hover:bg-green-500 text-white flex gap-2 h-9 text-sm shadow-lg shadow-green-900/20"
                  >
                    {loading && step === 2 ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    Simpan & Terapkan Matriks
                  </Button>
                </div>

              </div>
            </div>

          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};