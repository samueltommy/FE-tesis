import React, { useEffect, useState } from 'react';
import { Card, CardContent } from "../ui/card";
import { CalendarDays, Scale, Sparkles, Timer, CheckCircle2, Save, Loader2, TrendingUp } from "lucide-react";

const API_BASE = `http://${window.location.hostname}:5000`;

export default function HarvestPredictionCard() {
  const [prediction, setPrediction] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // State untuk input target dan modal
  const [targetInput, setTargetInput] = useState<string>("");
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const fetchPrediction = () => {
    fetch(`${API_BASE}/harvest_prediction`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setPrediction(result.prediction);
          // Set nilai input default saat data pertama kali dimuat
          setTargetInput((prev) => prev === "" ? result.prediction.target_weight_kg.toString() : prev);
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    fetchPrediction();
    const interval = setInterval(fetchPrediction, 10000); // Auto refresh tiap 10 detik
    return () => clearInterval(interval);
  }, []);

  // Fungsi untuk menyimpan target berat ke Backend
  const handleSaveTarget = async () => {
    if (!targetInput || isNaN(parseFloat(targetInput))) return;
    
    setIsSaving(true);
    try {
      const response = await fetch(`${API_BASE}/farm_settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target_harvest_weight_kg: parseFloat(targetInput) })
      });
      
      if (response.ok) {
        setShowSuccessModal(true);
        fetchPrediction();
        setTimeout(() => {
          setShowSuccessModal(false);
        }, 2500);
      }
    } catch (error) {
      console.error("Gagal menyimpan target", error);
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !prediction) return null;

  // Hitung persentase progres menuju target panen
  const progressPercent = Math.min(100, (prediction.current_weight_kg / prediction.target_weight_kg) * 100);

  return (
    <Card className="bg-zinc-950/50 border-zinc-800/50 overflow-hidden backdrop-blur-md relative h-full">
      {/* Aksen Glow Khas AI */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
      
      {/* Custom Success Modal */}
      {showSuccessModal && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-zinc-950/80 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-zinc-900 border border-emerald-500/30 rounded-xl p-5 flex flex-col items-center shadow-2xl shadow-emerald-900/20 animate-in zoom-in-95 duration-300">
            <div className="w-12 h-12 bg-emerald-500/20 rounded-full flex items-center justify-center mb-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            </div>
            <h3 className="text-zinc-100 font-bold mb-1 text-sm">Target Diperbarui!</h3>
            <p className="text-zinc-400 text-xs text-center leading-relaxed">
              Target panen telah disimpan.<br/>AI sedang menghitung ulang...
            </p>
          </div>
        </div>
      )}

      <CardContent className="p-5 flex flex-col justify-between h-full relative z-10">
        
        {/* Header Section */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2 text-zinc-100 font-semibold">
            <Sparkles className="w-5 h-5 text-indigo-400" />
            AI Harvest Predictor
          </div>
          
          {/* INPUT FORM TARGET BERAT */}
          <div className="flex items-center gap-2 bg-zinc-900/80 border border-zinc-700/80 rounded-md px-2 py-1 focus-within:border-emerald-500/50 focus-within:ring-1 focus-within:ring-emerald-500/50 transition-all">
            <span className="text-xs text-zinc-400 font-medium">Target:</span>
            <input 
              type="number"
              step="0.1"
              value={targetInput}
              onChange={(e) => setTargetInput(e.target.value)}
              className="w-12 bg-transparent text-xs text-zinc-100 font-bold outline-none text-right"
            />
            <span className="text-xs text-zinc-400 font-medium mr-1">kg</span>
            
            <button 
              onClick={handleSaveTarget}
              disabled={isSaving}
              className="ml-1 p-1 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded transition-colors disabled:opacity-50"
              title="Simpan Target"
            >
              {isSaving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* ========================================================= */}
        {/* INFO GRID SECTION (SEKARANG 3 KOLOM!) */}
        {/* ========================================================= */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          {/* 1. Umur Biologis */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 shadow-inner">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium whitespace-nowrap">
              <CalendarDays className="w-3.5 h-3.5 text-zinc-500" /> Umur Biologis
            </div>
            <div className="text-xl font-bold text-zinc-100 tracking-tight">
              {prediction.current_biological_age_days.toFixed(1)} <span className="text-sm font-normal text-zinc-500">Hari</span>
            </div>
          </div>
          
          {/* 2. Berat Hari Ini */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 shadow-inner">
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium whitespace-nowrap">
              <Scale className="w-3.5 h-3.5 text-zinc-500" /> Berat Hari Ini
            </div>
            <div className="text-xl font-bold text-zinc-100 tracking-tight">
              {prediction.current_weight_kg.toFixed(3)} <span className="text-sm font-normal text-zinc-500">kg</span>
            </div>
          </div>

          {/* 3. Estimasi Panen (PINDAH KE SINI) */}
          <div className="bg-zinc-900/80 border border-zinc-800/80 rounded-lg p-3 shadow-inner relative overflow-hidden">
            {/* Efek glow kecil jika siap panen */}
            {prediction.is_ready_to_harvest && <div className="absolute inset-0 bg-emerald-500/10" />}
            <div className="flex items-center gap-2 text-zinc-400 text-xs mb-1 font-medium whitespace-nowrap relative z-10">
              <Timer className={`w-3.5 h-3.5 ${prediction.is_ready_to_harvest ? 'text-emerald-400' : 'text-zinc-500'}`} /> Forecast
            </div>
            <div className={`text-xl font-bold tracking-tight relative z-10 ${prediction.is_ready_to_harvest ? 'text-emerald-400' : 'text-indigo-400'}`}>
              {prediction.is_ready_to_harvest ? '0.0' : prediction.estimated_days_remaining.toFixed(1)} <span className={`text-sm font-normal ${prediction.is_ready_to_harvest ? 'text-emerald-500/70' : 'text-zinc-500'}`}>Hari Lagi</span>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM PROGRESS SECTION */}
        {/* ========================================================= */}
        {prediction.is_ready_to_harvest ? (
          <div className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-2.5 rounded-lg flex items-center justify-center gap-2 font-bold animate-pulse shadow-[0_0_15px_rgba(16,185,129,0.1)]">
            <CheckCircle2 className="w-5 h-5" />
            AYAM SIAP PANEN HARI INI!
          </div>
        ) : (
          <div className="bg-zinc-900/50 border border-zinc-800/50 p-2.5 rounded-lg flex flex-col justify-center shadow-inner">
            <div className="flex justify-between items-center text-xs mb-1.5 font-medium">
              <span className="flex items-center gap-1.5 text-zinc-400"><TrendingUp className="w-3 h-3" /> Progress Pertumbuhan</span>
              <span className="text-indigo-400 font-mono">{progressPercent.toFixed(1)}%</span>
            </div>
            <div className="w-full bg-zinc-950 h-2 rounded-full overflow-hidden border border-zinc-800/80">
              <div 
                className="bg-indigo-500 h-full transition-all duration-1000 relative" 
                style={{ width: `${progressPercent}%` }} 
              >
                <div className="absolute inset-0 bg-white/20 w-full h-full animate-[shimmer_2s_infinite]" />
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}