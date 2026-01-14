import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const data = [
  { time: '00:00', weight: 2400, individual: 1600 },
  { time: '02:00', weight: 2410, individual: 1620 },
  { time: '04:00', weight: 2395, individual: 1615 },
  { time: '06:00', weight: 2420, individual: 1640 },
  { time: '08:00', weight: 2450, individual: 1680 },
  { time: '10:00', weight: 2480, individual: 1710 },
  { time: '12:00', weight: 2500, individual: 1750 },
  { time: '14:00', weight: 2510, individual: 1780 },
  { time: '16:00', weight: 2490, individual: 1795 },
  { time: '18:00', weight: 2505, individual: 1810 },
  { time: '20:00', weight: 2515, individual: 1830 },
  { time: '22:00', weight: 2520, individual: 1845 },
  { time: '24:00', weight: 2530, individual: 1850 },
];

export const WeightChart = () => {
  return (
    <div className="h-full w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-zinc-300 font-medium flex items-center gap-2">
             Global Flock Trends 
             <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-500 border border-zinc-800 uppercase tracking-wide">Live Data</span>
          </h3>
          <p className="text-zinc-500 text-xs font-mono mt-1">Comparing Average vs Selected Subject (ID #45)</p>
        </div>
        <div className="text-right flex gap-6">
           <div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Flock Avg</div>
               <div className="text-lg text-green-400 font-mono font-bold">2.53 kg</div>
           </div>
           <div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Selected</div>
               <div className="text-lg text-amber-400 font-mono font-bold">1.85 kg</div>
           </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 5, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorWeight" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#4ade80" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0}/>
              </linearGradient>
              <linearGradient id="colorInd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#fbbf24" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#fbbf24" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
            <XAxis 
              dataKey="time" 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              minTickGap={30}
            />
            <YAxis 
              stroke="#52525b" 
              fontSize={10} 
              tickLine={false}
              axisLine={false}
              domain={[1000, 3000]}
              tickFormatter={(value) => `${(value/1000).toFixed(1)}kg`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#09090b', 
                borderColor: '#27272a',
                color: '#e4e4e7',
                borderRadius: '6px',
                fontSize: '12px',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)'
              }}
            />
            <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px', color: '#a1a1aa' }}/>
            <Area 
              name="Flock Average"
              type="monotone" 
              dataKey="weight" 
              stroke="#4ade80" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorWeight)" 
            />
            <Area 
              name="Selected (ID #45)"
              type="monotone" 
              dataKey="individual" 
              stroke="#fbbf24" 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorInd)" 
              strokeDasharray="4 4"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
