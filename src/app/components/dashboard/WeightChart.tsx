import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

interface WeightChartProps {
  flockData: { time: string; weight: number }[];
  selectedChickenData: { time: string; weight: number }[];
  selectedId: string;
}

export const WeightChart = ({ flockData, selectedChickenData, selectedId }: WeightChartProps) => {
  
  const chartData = useMemo(() => {
    return flockData.map((item, index) => {
      const individualItem = selectedChickenData[index] || { weight: 0 };
      return {
        time: item.time,
        weight: item.weight,
        individual: individualItem.weight
      };
    });
  }, [flockData, selectedChickenData]);

  const currentFlockAvg = flockData[flockData.length - 1]?.weight || 0;
  const currentIndividual = selectedChickenData[selectedChickenData.length - 1]?.weight || 0;

  return (
    <div className="h-full w-full bg-zinc-950 border border-zinc-800 rounded-lg p-4 flex flex-col">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-zinc-300 font-medium flex items-center gap-2">
             Global Flock Trends 
             <span className="px-2 py-0.5 rounded bg-zinc-900 text-[10px] text-zinc-500 border border-zinc-800 uppercase tracking-wide">Live Data</span>
          </h3>
          <p className="text-zinc-500 text-xs font-mono mt-1">Comparing Average vs Selected Subject (ID {selectedId})</p>
        </div>
        <div className="text-right flex gap-6">
           <div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Flock Avg</div>
               <div className="text-lg text-green-400 font-mono font-bold">{(currentFlockAvg / 1000).toFixed(2)} kg</div>
           </div>
           <div>
               <div className="text-xs text-zinc-500 uppercase tracking-wider mb-0.5">Selected</div>
               <div className="text-lg text-amber-400 font-mono font-bold">{(currentIndividual / 1000).toFixed(2)} kg</div>
           </div>
        </div>
      </div>
      
      <div className="flex-1 w-full min-h-[200px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={chartData}
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
              name={`Selected (${selectedId})`}
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
