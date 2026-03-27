"use client" // Tambahkan ini jika menggunakan Next.js App Router

import React from 'react';
import CloudDashboard from './components/dashboard/CloudDashboard';

export default function App() {
  return (
    <main>
      {/* Memanggil komponen CloudDashboard yang sudah kita buat terpisah */}
      <CloudDashboard />
    </main>
  );
}