"use client"

import { useMemo } from "react"
import { CartesianGrid, Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card"

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
    
    const sortedData = [...data].sort((a, b) => (a.corrected_age_days || a.age_days || 0) - (b.corrected_age_days || b.age_days || 0));

    sortedData.forEach((session) => {
      const age = session.corrected_age_days !== undefined ? session.corrected_age_days : session.age_days;
      const weight = session.ai_average_weight_kg || session.average_weight_kg;
      
      if (age !== undefined && weight !== undefined && weight > 0) {
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
    // PERBAIKAN: Mengganti bg-black menjadi bg-zinc-900 agar sama persis dengan card lain
    <Card className="bg-zinc-900 border-zinc-800 lg:col-span-2 shadow-sm flex flex-col h-[450px]">
      <CardHeader className="shrink-0">
        <CardTitle className="text-zinc-200">Kurva Pertumbuhan Rata-rata Harian vs Ciomas</CardTitle>
        <CardDescription className="text-zinc-500">
          Membandingkan rata-rata berat harian AI dengan target ideal 35 hari
        </CardDescription>
      </CardHeader>
      <CardContent className="w-full flex-1 min-h-0 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#27272a" />
            <XAxis 
              dataKey="dayLabel" 
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={25}
              style={{ fontSize: '11px', fill: '#71717a' }}
            />
            <YAxis 
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `${value} kg`}
              style={{ fontSize: '11px', fill: '#71717a' }}
            />
            <Tooltip 
              formatter={(value: any, name: any) => [
                `${value ? value : 0} kg`, 
                name === "target" ? "Target Ciomas" : "Berat Rata-rata Harian AI"
              ]}
              labelStyle={{ color: '#f1f5f9', fontWeight: 'bold', marginBottom: '4px' }}
              contentStyle={{ backgroundColor: '#09090b', borderColor: '#27272a', borderRadius: '8px', boxShadow: '0 4px 10px rgb(0 0 0 / 0.5)' }}
            />
            <Legend verticalAlign="top" height={30} wrapperStyle={{ paddingBottom: '10px', color: '#71717a', fontSize: '12px' }}/>
            
            <Line
              name="target"
              type="monotone"
              dataKey="target"
              stroke="#a1a1aa" 
              strokeWidth={2}
              strokeDasharray="5 5"
              dot={false}
              activeDot={false}
            />
            
            <Line
              name="actual"
              type="monotone"
              dataKey="actual"
              stroke="#22c55e"
              strokeWidth={3}
              dot={{ r: 5, fill: "#22c55e", strokeWidth: 2 }} 
              activeDot={{ r: 7, stroke: "#bef264", strokeWidth: 3 }}
              connectNulls={true} 
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}