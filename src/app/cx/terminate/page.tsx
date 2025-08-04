import React from 'react';
import { CXJourneyTable } from '@/components/CXJourneyTable';
import jsonData from '../../../../data/terminate.json';

export default function TerminatePage() {
  return (
    <main className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <CXJourneyTable data={jsonData} />
    </main>
  );
} 