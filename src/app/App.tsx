import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Activity, TrendingUp, Calendar, CheckCircle2, Cloud, Server } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Badge } from './components/ui/badge';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

// Ganti dengan Kredensial Supabase Anda
const SUPABASE_URL = "https://ndnejpwvukyhklkbejbd.supabase.co/rest/v1";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5kbmVqcHd2dWt5aGtsa2JlamJkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQwOTQyODUsImV4cCI6MjA4OTY3MDI4NX0.UMf7OhSX0pbbfQ3fNAe1fPvsHKJZEIiC7b9xv31aZj4";

export default function App() {
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);
  
  const [stats, setStats] = useState({
    currentAge: 0,
    avgWeight: 0,
    totalChickens: 0,
    estimatedHarvest: ''
  });
  const [sessions, setSessions] = useState<any[]>([]);
  const [chartData, setChartData] = useState<any[]>([]);

  // Standar Ciomas untuk pembanding grafik
  const ciomasStandard = {
    1: 0.056, 2: 0.073, 3: 0.094, 4: 0.118, 5: 0.145, 6: 0.176, 7: 0.210,
    8: 0.247, 9: 0.288, 10: 0.332, 11: 0.379, 12: 0.429, 13: 0.483, 14: 0.540,
    15: 0.600, 16: 0.663, 17: 0.729, 18: 0.798, 19: 0.870, 20: 0.945,
    21: 1.024, 22: 1.105, 23: 1.189, 24: 1.276, 25: 1.365, 26: 1.457,
    27: 1.552, 28: 1.649, 29: 1.747, 30: 1.846, 31: 1.945, 32: 2.045,
    33: 2.146, 34: 2.247, 35: 2.348
  };

  useEffect(() => {
    const fetchCloudData = async () => {
      setLoading(true);
      try {
        // Ambil data dari Supabase (Urutkan dari yang terbaru, ambil 30 sesi terakhir)
        const res = await fetch(`${SUPABASE_URL}/session_stats?select=*&order=created_at.desc&limit=30`, {
          headers: { 
            'apikey': SUPABASE_KEY, 
            'Authorization': `Bearer ${SUPABASE_KEY}` 
          }
        });

        if (!res.ok) throw new Error("Gagal mengambil data dari Supabase");
        
        const data = await res.json();

        if (data && data.length > 0) {
          // JIKA DATA ASLI TERSEDIA
          setIsDummy(false);
          setSessions(data);

          const latest = data[0];
          setStats({
            currentAge: latest.age_days || 0,
            avgWeight: latest.average_weight_kg || 0,
            totalChickens: latest.chicken_count || 0,
            estimatedHarvest: calculateHarvest(latest.average_weight_kg || 0)
          });

          // Mengolah data Supabase menjadi format Chart
          // Balik urutan data agar dari hari terkecil ke terbesar di grafik
          const sortedData = [...data].reverse();
          
          // Kelompokkan rata-rata berdasarkan hari (jika ada beberapa sesi di hari yang sama)
          const mapByAge: any = {};
          sortedData.forEach(item => {
            if(item.age_days) {
              mapByAge[item.age_days] = item.average_weight_kg;
            }
          });

          const chartArr = Object.keys(ciomasStandard).map(day => {
            const d = parseInt(day);
            return {
              day: d,
              actual: mapByAge[d] !== undefined ? mapByAge[d] : null, // Gunakan null jika data belum ada
              target: ciomasStandard[d as keyof typeof ciomasStandard]
            };
          });
          
          setChartData(chartArr);

        } else {
          // JIKA DATA KOSONG, GUNAKAN DUMMY
          loadDummyData();
        }
      } catch (error) {
        console.error("Supabase Error:", error);
        loadDummyData();
      }
      setLoading(false);
    };

    fetchCloudData();
  }, []);

  const calculateHarvest = (currentWeight: number) => {
    const target = 2.0;
    if (currentWeight >= target) return "Siap Panen";
    if (currentWeight === 0) return "Menunggu Data";
    
    // Asumsi pertumbuhan 80 gram (0.08 kg) per hari
    const daysLeft = Math.ceil((target - currentWeight) / 0.08);
    return `${daysLeft} Hari Lagi`;
  };

  const loadDummyData = () => {
    setIsDummy(true);
    const mockSessions = [
      { id: '20260322_0800', created_at: '2026-03-22T08:00:00', age_days: 21, average_weight_kg: 1.05, chicken_count: 98 },
      { id: '20260321_0800', created_at: '2026-03-21T08:00:00', age_days: 20, average_weight_kg: 0.96, chicken_count: 100 },
      { id: '20260320_0800', created_at: '2026-03-20T08:00:00', age_days: 19, average_weight_kg: 0.88, chicken_count: 100 },
    ];

    // Buat data grafik berdasarkan standar Ciomas
    const mockChart = Object.keys(ciomasStandard).map(day => {
      const d = parseInt(day);
      const sessionData = mockSessions.find(s => s.age_days === d);
      return {
        day: d,
        actual: sessionData ? sessionData.average_weight_kg : null,
        target: ciomasStandard[d as keyof typeof ciomasStandard]
      };
    });

    setSessions(mockSessions);
    setChartData(mockChart);
    setStats({
      currentAge: mockSessions[0].age_days,
      avgWeight: mockSessions[0].average_weight_kg,
      totalChickens: mockSessions[0].chicken_count,
      estimatedHarvest: calculateHarvest(mockSessions[0].average_weight_kg)
    });
  };

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
          {isDummy && (
             <Badge variant="outline" className="bg-yellow-950/30 text-yellow-500 border-yellow-900 flex gap-2 py-1 px-3">
               Mode Simulasi (Data Kosong)
             </Badge>
          )}
          <Badge variant="outline" className="bg-green-950/30 text-green-400 border-green-900 flex gap-2 py-1 px-3">
            <Server className="w-3.5 h-3.5" /> Supabase Connected
          </Badge>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="p-4 md:p-6 lg:p-8 flex flex-col gap-6">
        
        {/* KPI CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Rata-rata Berat (Terbaru)</CardTitle>
              <Activity className="w-4 h-4 text-green-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">
                {stats.avgWeight.toFixed(2)} <span className="text-lg text-zinc-500">kg</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Populasi Terdeteksi</CardTitle>
              <LayoutDashboard className="w-4 h-4 text-blue-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">
                {stats.totalChickens} <span className="text-lg text-zinc-500">ekor</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Umur Siklus</CardTitle>
              <Calendar className="w-4 h-4 text-amber-400" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-zinc-100">
                {stats.currentAge} <span className="text-lg text-zinc-500">Hari</span>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardHeader className="pb-2 flex flex-row items-center justify-between">
              <CardTitle className="text-sm font-medium text-zinc-400">Prediksi Panen (2.0 kg)</CardTitle>
              <CheckCircle2 className="w-4 h-4 text-purple-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-300 mt-1">{stats.estimatedHarvest}</div>
            </CardContent>
          </Card>
        </div>

        {/* GRAFIK & TABEL */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* CHART AREA */}
          <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 flex flex-col h-[450px]">
            <CardHeader>
              <CardTitle className="text-lg text-zinc-200">Kurva Pertumbuhan vs Standar Ciomas</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 min-h-0">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="day" stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `Hari ${v}`} />
                  <YAxis stroke="#52525b" fontSize={12} tickLine={false} axisLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px' }}
                    itemStyle={{ color: '#e4e4e7' }}
                  />
                  <ReferenceLine y={2.0} label={{ position: 'top', value: 'Target Panen (2kg)', fill: '#a1a1aa', fontSize: 10 }} stroke="#a1a1aa" strokeDasharray="3 3" />
                  
                  <Line 
                    type="monotone" 
                    dataKey="actual" 
                    name="Berat Aktual AI (kg)" 
                    stroke="#22c55e" 
                    strokeWidth={3} 
                    dot={{ r: 4, fill: '#22c55e' }} 
                    activeDot={{ r: 6 }} 
                    connectNulls={true} // <-- Tambahkan ini
                  />
                  <Line type="monotone" dataKey="target" name="Standar Ciomas (kg)" stroke="#3b82f6" strokeWidth={2} strokeDasharray="5 5" dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          {/* TABLE LOGS AREA */}
          <Card className="bg-zinc-900 border-zinc-800 flex flex-col h-[450px]">
            <CardHeader className="pb-3 border-b border-zinc-800 shrink-0">
              <CardTitle className="text-lg text-zinc-200">Riwayat Telemetri (Cloud)</CardTitle>
            </CardHeader>
            <CardContent className="p-0 overflow-y-auto [&::-webkit-scrollbar]:w-1.5 [&::-webkit-scrollbar-track]:bg-zinc-900 [&::-webkit-scrollbar-thumb]:bg-zinc-700">
              <table className="w-full text-sm text-left text-zinc-400">
                <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 sticky top-0">
                  <tr>
                    <th className="px-4 py-3 font-medium">Waktu (Sesi)</th>
                    <th className="px-4 py-3 font-medium text-right">Berat Avg</th>
                    <th className="px-4 py-3 font-medium text-right">Ekor</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-zinc-800/50">
                  {sessions.map((session, idx) => (
                    <tr key={idx} className="hover:bg-zinc-800/30 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs">
                        {new Date(session.created_at).toLocaleString('id-ID', { dateStyle: 'short', timeStyle: 'short' })}
                      </td>
                      <td className="px-4 py-3 text-right font-medium text-green-400">
                        {(session.average_weight_kg || 0).toFixed(2)} kg
                      </td>
                      <td className="px-4 py-3 text-right">
                        {session.chicken_count || 0}
                      </td>
                    </tr>
                  ))}
                  {sessions.length === 0 && !loading && (
                    <tr>
                      <td colSpan={3} className="px-4 py-8 text-center text-zinc-600">
                        Belum ada data di Database Cloud.
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