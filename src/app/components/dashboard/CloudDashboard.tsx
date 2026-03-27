import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, TrendingUp, Calendar, AlertCircle, Server, CheckCircle2, Cloud } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { GrowthChart } from './GrowthChart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

export default function CloudDashboard() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    currentAge: 0,
    avgWeight: 0,
    totalChickens: 0,
    estimatedHarvest: ''
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Ganti dengan Kredensial Supabase Anda
  const SUPABASE_URL = "https://ndnejpwvukyhklkbejbd.supabase.co/rest/v1";
  const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmVqcHd2dWt5aGtsa2JlamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTQyODUsImV4cCI6MjA4OTY3MDI4NX0.UMf7OhSX0pbbfQ3fNAe1fPvsHKJZEIiC7b9xv31aZj4"; 

  useEffect(() => {
    // Simulasi Fetching Data dari Supabase Cloud
    const fetchCloudData = async () => {
      setLoading(true);
      try {
        /* CONTOH CARA FETCH ASLI KE SUPABASE (Uncomment saat deploy):
          const res = await fetch(`${SUPABASE_URL}/session_stats?select=*&order=created_at.desc&limit=10`, {
            headers: { 'apikey': SUPABASE_KEY, 'Authorization': `Bearer ${SUPABASE_KEY}` }
          });
          const data = await res.json();
        */

        // Data Simulasi (Hapus jika sudah konek Supabase)
        const mockSessions = [
          { 
            id: '1', 
            created_at: '2026-03-25T08:00:00', 
            age_days: 14, 
            average_weight_kg: 0.450, 
            chicken_count: 85 
          },
          { 
            id: '2', 
            created_at: '2026-03-26T08:00:00', 
            age_days: 15, 
            average_weight_kg: 0.569, 
            chicken_count: 91 
          },
          { 
            id: '3', 
            created_at: '2026-03-27T08:00:00', 
            age_days: 16, 
            average_weight_kg: 0.680, 
            chicken_count: 88 
          },
        ];
        
        setSessions(mockSessions);

        const mockChart = [
          { day: 15, actual: 0.61, target: 0.60 },
          { day: 16, actual: 0.65, target: 0.66 },
          { day: 17, actual: 0.74, target: 0.73 },
          { day: 18, actual: 0.81, target: 0.80 },
          { day: 19, actual: 0.88, target: 0.87 },
          { day: 20, actual: 0.96, target: 0.94 },
          { day: 21, actual: 1.05, target: 1.02 },
        ];

        setSessions(mockSessions);
        setChartData(mockChart);
        
        if(mockSessions.length > 0) {
          setStats({
            currentAge: mockSessions[0].age_days,
            avgWeight: mockSessions[0].average_weight_kg,
            totalChickens: mockSessions[0].chicken_count,
            estimatedHarvest: '14 Hari Lagi' // Ini bisa dihitung dari fungsi ML
          });
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
      {/* HEADER CLOUD */}
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

      {/* MAIN CONTENT */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Rata-rata Berat (Terakhir)</CardTitle>
              <Activity className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats.avgWeight.toFixed(2)} <span className="text-lg text-zinc-500">kg</span></div>
              <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" /> +0.09 kg dari kemarin
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Estimasi Populasi</CardTitle>
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats.totalChickens} <span className="text-lg text-zinc-500">ekor</span></div>
              <p className="text-xs text-zinc-500 mt-1">Sesi terakhir: {new Date().toLocaleTimeString()}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Umur Siklus</CardTitle>
              <Calendar className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">{stats.currentAge} <span className="text-lg text-zinc-500">Hari</span></div>
              <p className="text-xs text-zinc-500 mt-1">Fase Pertumbuhan Grower</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Prediksi Panen (AI)</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-300 mt-1">{stats.estimatedHarvest}</div>
              <p className="text-xs text-zinc-500 mt-1">Target berat: 2.0 kg</p>
            </CardContent>
          </Card>
        </div>

        {/* GRAFIK & TABEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CHART AREA */}
          <GrowthChart data={sessions} />

          {/* TABLE LOGS AREA */}
          <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-[450px]">
            <CardHeader className="pb-3 border-b border-zinc-800 shrink-0">
              <CardTitle className="text-lg text-zinc-200">Riwayat Sinkronisasi Edge</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-700">
              <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Waktu (Sesi)</th>
                    <th className="px-4 py-3 font-medium text-right">Berat (Avg)</th>
                    <th className="px-4 py-3 font-medium text-right">Populasi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {sessions.map((session, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">
                        {new Date(session.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-400">
                        {session.average_weight_kg.toFixed(2)} kg
                      </td>
                      <td className="px-4 py-3 text-right">
                        {session.chicken_count}
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-zinc-600">
                        Belum ada data masuk dari Kandang.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

        </div>
      </main>
    </div>
  );
}