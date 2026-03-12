import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "../ui/card";
import { TrendingUp } from "lucide-react";

const API_BASE = `http://${window.location.hostname}:5000`;

export default function GrowthChart() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchChartData = () => {
    fetch(`${API_BASE}/growth_chart`)
      .then((res) => res.json())
      .then((result) => {
        if (result.status === "success") {
          setData(result.data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchChartData();
    // Refresh grafik setiap 15 detik untuk menangkap update dari Live Session
    const interval = setInterval(fetchChartData, 15000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card className="bg-zinc-950/50 border-zinc-800/50 h-full flex flex-col shadow-lg backdrop-blur-md">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-zinc-100 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
              Growth Curve (AI vs Ciomas)
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Perbandingan berat aktual AI dengan target standar industri
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 min-h-[250px]">
        {loading ? (
          <div className="h-full flex items-center justify-center text-zinc-500 animate-pulse">
            Memuat model AI...
          </div>
        ) : data.length === 0 ? (
          <div className="h-full flex items-center justify-center text-zinc-600 border border-dashed border-zinc-800 rounded-lg">
            Belum ada rekaman sesi hari ini
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis 
                dataKey="age_days" 
                stroke="#71717a" 
                tickFormatter={(val) => `H-${val}`}
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis 
                stroke="#71717a" 
                tickFormatter={(val) => `${val}kg`}
                tick={{ fill: '#71717a', fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#18181b', borderColor: '#27272a', borderRadius: '8px', color: '#f4f4f5' }}
                itemStyle={{ fontWeight: '600' }}
                labelFormatter={(label) => `Umur: ${label} Hari`}
              />
              <Legend wrapperStyle={{ paddingTop: '10px', fontSize: '12px', color: '#a1a1aa' }} />
              
              {/* Garis Target (Ciomas) */}
              <Line 
                type="monotone" 
                name="Standar Ciomas"
                dataKey="target_weight_kg" 
                stroke="#3b82f6" 
                strokeWidth={2}
                strokeDasharray="5 5" 
                dot={false}
                activeDot={{ r: 6, fill: '#3b82f6', stroke: '#18181b' }} 
              />
              
              {/* Garis Aktual (Kamera) */}
              <Line 
                type="monotone" 
                name="Aktual AI Kamera"
                dataKey="actual_weight_kg" 
                stroke="#10b981" 
                strokeWidth={3}
                dot={{ r: 4, strokeWidth: 2, fill: '#18181b', stroke: '#10b981' }} 
                activeDot={{ r: 8, fill: '#10b981', stroke: '#18181b' }} 
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}