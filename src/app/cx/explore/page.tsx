import React from 'react';
import { CXJourneyTable } from '@/components/CXJourneyTable';
// GANTI ALAMAT IMPORT MENJADI SEPERTI INI:
import jsonData from '../../../../data/explore.json';

export default function ExplorePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <CXJourneyTable data={jsonData} />
    </main>
  );
}