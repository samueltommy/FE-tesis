
export interface Chicken {
  id: string;
  weight: number; // current weight in grams
  confidence: number;
  status: 'healthy' | 'alert';
  age: number; // days
  weightHistory: { time: string; weight: number }[];
}

export const mockChickens: Chicken[] = [
  { 
    id: 'CK-892', 
    weight: 2450, 
    confidence: 98, 
    status: 'healthy',
    age: 42,
    weightHistory: [
      { time: '00:00', weight: 1600 }, { time: '04:00', weight: 1615 },
      { time: '08:00', weight: 1680 }, { time: '12:00', weight: 1750 },
      { time: '16:00', weight: 2450 }, { time: '20:00', weight: 2450 },
      { time: '24:00', weight: 2450 }
    ]
  },
  { 
    id: 'CK-901', 
    weight: 2310, 
    confidence: 95, 
    status: 'alert',
    age: 41,
    weightHistory: [
      { time: '00:00', weight: 1550 }, { time: '04:00', weight: 1580 },
      { time: '08:00', weight: 1620 }, { time: '12:00', weight: 1700 },
      { time: '16:00', weight: 2310 }, { time: '20:00', weight: 2310 },
      { time: '24:00', weight: 2310 }
    ]
  },
  { id: 'CK-893', weight: 2510, confidence: 99, status: 'healthy', age: 43, weightHistory: generateHistory(2510) },
  { id: 'CK-894', weight: 2480, confidence: 97, status: 'healthy', age: 42, weightHistory: generateHistory(2480) },
  { id: 'CK-895', weight: 2200, confidence: 89, status: 'alert', age: 40, weightHistory: generateHistory(2200) },
  { id: 'CK-896', weight: 2550, confidence: 98, status: 'healthy', age: 44, weightHistory: generateHistory(2550) },
  { id: 'CK-897', weight: 2490, confidence: 96, status: 'healthy', age: 42, weightHistory: generateHistory(2490) },
  { id: 'CK-898', weight: 2505, confidence: 98, status: 'healthy', age: 42, weightHistory: generateHistory(2505) },
  { id: 'CK-899', weight: 2420, confidence: 94, status: 'healthy', age: 41, weightHistory: generateHistory(2420) },
  { id: 'CK-900', weight: 2460, confidence: 97, status: 'healthy', age: 42, weightHistory: generateHistory(2460) },
  { id: 'CK-902', weight: 2380, confidence: 92, status: 'healthy', age: 41, weightHistory: generateHistory(2380) },
  { id: 'CK-903', weight: 2515, confidence: 98, status: 'healthy', age: 43, weightHistory: generateHistory(2515) },
];

function generateHistory(finalWeight: number) {
  // Simple linear growth for mock
  const startWeight = finalWeight * 0.6;
  const times = ['00:00', '02:00', '04:00', '06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00', '24:00'];
  return times.map((t, i) => ({
    time: t,
    weight: Math.round(startWeight + (finalWeight - startWeight) * (i / (times.length - 1)))
  }));
}

export const flockAverageHistory = [
  { time: '00:00', weight: 2400 },
  { time: '02:00', weight: 2410 },
  { time: '04:00', weight: 2395 },
  { time: '06:00', weight: 2420 },
  { time: '08:00', weight: 2450 },
  { time: '10:00', weight: 2480 },
  { time: '12:00', weight: 2500 },
  { time: '14:00', weight: 2510 },
  { time: '16:00', weight: 2490 },
  { time: '18:00', weight: 2505 },
  { time: '20:00', weight: 2515 },
  { time: '22:00', weight: 2520 },
  { time: '24:00', weight: 2530 },
];
