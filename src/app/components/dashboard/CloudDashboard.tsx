"use client"

import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, Calendar, Server, CheckCircle2, Cloud, Timer, Scale, CalendarDays } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GrowthChart } from './GrowthChart';

// =====================================================================
// DATASET KURVA PERTUMBUHAN (STANDAR CIOMAS LENGKAP)
// Digunakan sebagai otak Prediksi Panen AI (Pengganti scikit-learn Python)
// =====================================================================
const CIOMAS_STANDARD = [
  { day: 0, w: 0.042 }, { day: 1, w: 0.056 }, { day: 2, w: 0.073 }, { day: 3, w: 0.094 },
  { day: 4, w: 0.118 }, { day: 5, w: 0.145 }, { day: 6, w: 0.176 }, { day: 7, w: 0.210 },
  { day: 8, w: 0.247 }, { day: 9, w: 0.288 }, { day: 10, w: 0.332 }, { day: 11, w: 0.379 },
  { day: 12, w: 0.429 }, { day: 13, w: 0.483 }, { day: 14, w: 0.540 }, { day: 15, w: 0.600 },
  { day: 16, w: 0.663 }, { day: 17, w: 0.729 }, { day: 18, w: 0.798 }, { day: 19, w: 0.870 },
  { day: 20, w: 0.945 }, { day: 21, w: 1.024 }, { day: 22, w: 1.105 }, { day: 23, w: 1.189 },
  { day: 24, w: 1.276 }, { day: 25, w: 1.365 }, { day: 26, w: 1.457 }, { day: 27, w: 1.552 },
  { day: 28, w: 1.649 }, { day: 29, w: 1.747 }, { day: 30, w: 1.846 }, { day: 31, w: 1.945 },
  { day: 32, w: 2.045 }, { day: 33, w: 2.146 }, { day: 34, w: 2.247 }, { day: 35, w: 2.348 }
];

export default function CloudDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentAge: 0,
    bioAge: 0,
    avgWeight: 0,
    totalChickens: 0,
    estimatedHarvest: '',
    isReady: false
  });
  const [sessions, setSessions] = useState<any[]>([]);

  // Kredensial Supabase Anda
  const SUPABASE_URL = "https://ndnejpwvukyhklkbejbd.supabase.co/rest/v1";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmVqcHd2dWt5aGtsa2JlamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTQyODUsImV4cCI6MjA4OTY3MDI4NX0.UMf7OhSX0pbbfQ3fNAe1fPvsHKJZEIiC7b9xv31aZj4"; 

  const getRealDate = (sessionId: string, fallbackDate: string): Date => {
    if (!sessionId) return new Date(fallbackDate);
    const match = sessionId.match(/(\d{4})(\d{2})(\d{2})_(\d{2})(\d{2})(\d{2})/);
    if (match) {
      const [_, year, month, day, hour, min, sec] = match;
      return new Date(`${year}-${month}-${day}T${hour}:${min}:${sec}`);
    }
    return new Date(fallbackDate);
  };

  // Fungsi Cerdas Pengganti Model ML (Menghitung Umur Biologis dari Berat)
  const getBiologicalAge = (weightKg: number): number => {
    if (weightKg <= CIOMAS_STANDARD[0].w) return 0;
    
    // Ekstrapolasi jika ayam lebih besar dari umur 35 hari
    if (weightKg >= CIOMAS_STANDARD[35].w) {
      const lastDiff = CIOMAS_STANDARD[35].w - CIOMAS_STANDARD[34].w;
      const extraWeight = weightKg - CIOMAS_STANDARD[35].w;
      return 35 + (extraWeight / lastDiff);
    }
    
    // Interpolasi Presisi (Mencari titik potong kurva-S)
    for (let i = 0; i < CIOMAS_STANDARD.length - 1; i++) {
      if (weightKg >= CIOMAS_STANDARD[i].w && weightKg <= CIOMAS_STANDARD[i+1].w) {
        const w1 = CIOMAS_STANDARD[i].w;
        const w2 = CIOMAS_STANDARD[i+1].w;
        const fraction = (weightKg - w1) / (w2 - w1);
        return CIOMAS_STANDARD[i].day + fraction;
      }
    }
    return 0;
  };

  useEffect(() => {
    const fetchCloudData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${SUPABASE_URL}/session_stats?select=*&limit=500`, {
          headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
        });
        
        if (res.ok) {
            const data = await res.json();
            
            // 1. Urutkan Descending
            const sortedRawData = data.sort((a: any, b: any) => {
                const dateA = getRealDate(a.session_id, a.created_at).getTime();
                const dateB = getRealDate(b.session_id, b.created_at).getTime();
                return dateB - dateA; 
            });

            if(sortedRawData.length > 0) {
                // 2. Koreksi Umur Keseluruhan (Agar grafik fix ada 3 hari)
                const oldestSession = sortedRawData[sortedRawData.length - 1];
                const baseDate = getRealDate(oldestSession.session_id, oldestSession.created_at);
                const baseDateOnly = new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate());
                const baseAge = oldestSession.age_days || 1;

                const correctedSessions = sortedRawData.map((session: any) => {
                    const sessionDate = getRealDate(session.session_id, session.created_at);
                    const sessionDateOnly = new Date(sessionDate.getFullYear(), sessionDate.getMonth(), sessionDate.getDate());
                    const diffTime = Math.abs(sessionDateOnly.getTime() - baseDateOnly.getTime());
                    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
                    return { ...session, corrected_age_days: baseAge + diffDays };
                });

                setSessions(correctedSessions);

                // 3. Rata-rata Harian Terbaru
                const latestSession = correctedSessions[0];
                const latestDate = getRealDate(latestSession.session_id, latestSession.created_at);
                const latestDateOnly = new Date(latestDate.getFullYear(), latestDate.getMonth(), latestDate.getDate()).getTime();

                const latestDaySessions = correctedSessions.filter((s: any) => {
                    const sDate = getRealDate(s.session_id, s.created_at);
                    return new Date(sDate.getFullYear(), sDate.getMonth(), sDate.getDate()).getTime() === latestDateOnly;
                });

                let totalWeight = 0, validWeightCount = 0;
                let totalPopulations = 0, validPopCount = 0;

                latestDaySessions.forEach((s: any) => {
                    const weight = s.ai_average_weight_kg || s.average_weight_kg;
                    const count = s.valid_chickens_used || s.chicken_count;
                    if (weight > 0) { totalWeight += weight; validWeightCount += 1; }
                    if (count > 0) { totalPopulations += count; validPopCount += 1; }
                });

                const dailyAvgWeight = validWeightCount > 0 ? (totalWeight / validWeightCount) : 0;
                const dailyAvgPop = validPopCount > 0 ? (totalPopulations / validPopCount) : 0;
                const currentAge = latestDaySessions[0].corrected_age_days;

                // ========================================================
                // 4. PREDIKSI PANEN AI (PERSIS SEPERTI growth_predictor.py)
                // ========================================================
                let harvestText = "Menghitung...";
                let bioAge = 0;
                let isReady = false;

                if (dailyAvgWeight > 0) {
                    // Prediksi Umur Biologis dari Berat Saat Ini
                    bioAge = getBiologicalAge(dailyAvgWeight);
                    
                    // Prediksi Umur Target (Default Target 2.0 kg)
                    const targetBioAge = getBiologicalAge(2.0); 
                    
                    // Hitung Sisa Waktu
                    const remainingDays = Math.max(0, targetBioAge - bioAge);

                    if (remainingDays <= 0.5) {
                        harvestText = "Siap Panen!";
                        isReady = true;
                    } else {
                        harvestText = `${remainingDays.toFixed(1)}`;
                    }
                }

                setStats({
                  currentAge: currentAge,
                  bioAge: bioAge,
                  avgWeight: dailyAvgWeight,
                  totalChickens: Math.round(dailyAvgPop),
                  estimatedHarvest: harvestText,
                  isReady: isReady
                });
            } else {
                setSessions([]);
            }
        }
      } catch (error) {
        console.error("Gagal mengambil data dari Cloud", error);
      }
      setLoading(false);
    };

    fetchCloudData();
  }, []);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-sans selection:bg-green-500/30">
      <header className="h-14 border-b border-zinc-800 bg-zinc-950 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-500/10 rounded-md flex items-center justify-center border border-blue-500/20">
              <Cloud className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-lg font-bold tracking-tight text-zinc-100">
              FARM<span className="text-blue-400">CLOUD</span> 
              <span className="text-zinc-600 font-normal ml-2 text-xs border-l border-zinc-700 pl-2 hidden sm:inline-block">CENTRAL TELEMETRY DASHBOARD</span>
            </h1>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900 flex gap-2 py-1 px-3">
            <Server className="w-3.5 h-3.5" /> Edge Node: ONLINE
          </Badge>
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700 overflow-hidden">
             <img src="https://ui.shadcn.com/avatars/01.png" alt="User" />
          </div>
        </div>
      </header>

      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        {/* KPI CARDS (Disesuaikan dengan format Tesis) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <Card className="bg-zinc-900 border-zinc-800 shadow-sm relative overflow-hidden">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Berat Rata-rata AI</CardTitle>
              <Scale className="w-4 h-4 text-emerald-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats.avgWeight ? stats.avgWeight.toFixed(3) : '0.000'} <span className="text-lg text-zinc-500">kg</span></div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">Agregasi Harian Terbaru</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Estimasi Populasi</CardTitle>
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats.totalChickens || 0} <span className="text-lg text-zinc-500">ekor</span></div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">Hitungan Kamera Kandang</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-sm">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Umur Analitik</CardTitle>
              <CalendarDays className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="flex gap-4 items-baseline">
                <div>
                  <div className="text-2xl font-bold text-zinc-100">{stats.currentAge || 0} <span className="text-sm text-zinc-500 font-normal">Hari Kalender</span></div>
                </div>
              </div>
              <p className="text-xs text-amber-500/80 mt-1 font-medium flex items-center gap-1">Umur Biologis (AI): {stats.bioAge.toFixed(1)} Hari</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 shadow-sm relative overflow-hidden">
            {stats.isReady && <div className="absolute inset-0 bg-emerald-500/10 animate-pulse" />}
            <CardHeader className="pb-2 flex flex-row items-center justify-between relative z-10">
              <CardTitle className="text-sm font-medium text-zinc-400">Prediksi Panen</CardTitle>
              <Timer className={`w-4 h-4 ${stats.isReady ? 'text-emerald-400' : 'text-purple-400'}`} />
            </CardHeader>
            <CardContent className="relative z-10">
              <div className={`text-2xl font-bold tracking-tight mt-1 ${stats.isReady ? 'text-emerald-400' : 'text-purple-300'}`}>
                {stats.estimatedHarvest} {stats.isReady ? '' : <span className="text-sm font-normal text-zinc-500">Hari Lagi</span>}
              </div>
              <p className="text-xs text-zinc-500 mt-1 flex items-center gap-1">Target berat: 2.0 kg</p>
            </CardContent>
          </Card>

        </div>

        {/* GRAFIK & TABEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <GrowthChart data={sessions} />

          <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-[450px] shadow-sm">
            <CardHeader className="pb-3 border-b border-zinc-800 shrink-0">
              <CardTitle className="text-lg text-zinc-200">Riwayat Sinkronisasi Mentah</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-700">
              <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Waktu Asli (Kamera)</th>
                    <th className="px-4 py-3 font-medium text-right">Berat Sesi</th>
                    <th className="px-4 py-3 font-medium text-right">Populasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {sessions.map((session, idx) => {
                    const realDate = getRealDate(session.session_id, session.created_at);
                    const weight = session.ai_average_weight_kg || session.average_weight_kg || 0;
                    const count = session.valid_chickens_used || session.chicken_count || 0;

                    return (
                      <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs whitespace-nowrap text-zinc-300">
                          {realDate.toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'medium' })}
                        </td>
                        <td className="px-4 py-3 text-right font-medium text-emerald-400">
                          {weight.toFixed(3)} kg
                        </td>
                        <td className="px-4 py-3 text-right text-zinc-300">
                          {count}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}