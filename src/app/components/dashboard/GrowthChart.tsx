"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
// PERBAIKAN 1: Menggunakan Relative Path agar TypeScript pasti menemukannya
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

// Standar Pertumbuhan Ciomas (0 - 35 Hari)
const CIOMAS_STANDARD = [
  { day: 0, target_weight: 0.042 }, { day: 1, target_weight: 0.056 }, { day: 2, target_weight: 0.073 },
  { day: 3, target_weight: 0.094 }, { day: 4, target_weight: 0.118 }, { day: 5, target_weight: 0.145 },
  { day: 6, target_weight: 0.176 }, { day: 7, target_weight: 0.210 }, { day: 8, target_weight: 0.247 },
  { day: 9, target_weight: 0.288 }, { day: 10, target_weight: 0.332 }, { day: 11, target_weight: 0.379 },
  { day: 12, target_weight: 0.429 }, { day: 13, target_weight: 0.483 }, { day: 14, target_weight: 0.540 },
  { day: 15, target_weight: 0.600 }, { day: 16, target_weight: 0.663 }, { day: 17, target_weight: 0.729 },
  { day: 18, target_weight: 0.798 }, { day: 19, target_weight: 0.870 }, { day: 20, target_weight: 0.945 },
  { day: 21, target_weight: 1.024 }, { day: 22, target_weight: 1.105 }, { day: 23, target_weight: 1.189 },
  { day: 24, target_weight: 1.276 }, { day: 25, target_weight: 1.365 }, { day: 26, target_weight: 1.457 },
  { day: 27, target_weight: 1.552 }, { day: 28, target_weight: 1.649 }, { day: 29, target_weight: 1.747 },
  { day: 30, target_weight: 1.846 }, { day: 31, target_weight: 1.945 }, { day: 32, target_weight: 2.045 },
  { day: 33, target_weight: 2.146 }, { day: 34, target_weight: 2.247 }, { day: 35, target_weight: 2.348 }
]

interface GrowthChartProps {
  data: any[] 
}

export function GrowthChart({ data }: GrowthChartProps) {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return CIOMAS_STANDARD.map(item => ({
        dayLabel: `Hari ${item.day}`,
        target: item.target_weight,
        actual: null 
      }))
    }

    const aggregatedByAge: Record<number, { totalWeight: number; count: number }> = {}
    
    // PERBAIKAN: Urutkan data berdasarkan umur (dari hari 0 ke 35) agar Recharts tidak bingung
    const sortedData = [...data].sort((a, b) => (a.age_days || 0) - (b.age_days || 0));

    sortedData.forEach((session) => {
      const age = session.age_days
      const weight = session.average_weight_kg || session.ai_average_weight_kg
      
      if (age !== undefined && weight !== undefined) {
        if (!aggregatedByAge[age]) {
          aggregatedByAge[age] = { totalWeight: 0, count: 0 }
        }
        aggregatedByAge[age].totalWeight += weight
        aggregatedByAge[age].count += 1
      }
    })

    return CIOMAS_STANDARD.map((ciomasPoint) => {
      const actualData = aggregatedByAge[ciomasPoint.day]
      let actualAvg = null

      if (actualData && actualData.count > 0) {
        actualAvg = Number((actualData.totalWeight / actualData.count).toFixed(3))
      }

      return {
        dayLabel: `Hari ${ciomasPoint.day}`,
        target: ciomasPoint.target_weight,
        actual: actualAvg
      }
    })
  }, [data])

  return (
    <Card className="col-span-1 lg:col-span-2 shadow-sm">
      <CardHeader>
        <CardTitle>Kurva Pertumbuhan vs Standar Ciomas</CardTitle>
        <CardDescription>
          Membandingkan berat aktual deteksi AI dengan target ideal 35 hari
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full h-[380px] pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
            <XAxis 
              dataKey="dayLabel" 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={25}
              style={{ fontSize: '12px', fill: '#64748b' }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
              style={{ fontSize: '12px', fill: '#64748b' }}
            />
            <Tooltip 
              // PERBAIKAN 2: Menggunakan tipe 'any' untuk menghindari error strictness dari Recharts
              formatter={(value: any, name: any) => [
                `${value ? value : 0} kg`, 
                name === "target" ? "Target Ciomas" : "Berat Aktual AI"
              ]}
              labelStyle={{ color: '#0f172a', fontWeight: 'bold', marginBottom: '4px' }}
              contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Legend verticalAlign="top" height={36} wrapperStyle={{ paddingBottom: '10px' }}/>
            
            <Line
              name="target"
              type="monotone"
              dataKey="target"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            
            <Line
              name="actual"
              type="monotone"
              dataKey="actual"
              stroke="#2563eb"
              strokeWidth={3}
              dot={{ r: 4, fill: "#2563eb", strokeWidth: 2 }}
              activeDot={{ r: 6, stroke: "#bfdbfe", strokeWidth: 4 }}
              connectNulls={true} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}