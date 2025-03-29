'use client';

import { useEffect, useState } from 'react';
import DropCard from '@/components/drops/DropCard';
import { Drop } from '@/types/drop';

export default function DropsList() {
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrops = async () => {
      try {
        const response = await fetch('/api/drops');
        const data = await response.json();
        setDrops(data);
      } catch (error) {
        console.error('Error fetching drops:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDrops();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[200px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (drops.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No drops available yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {drops.map((drop) => (
        <DropCard key={drop.id} drop={drop} />
      ))}
    </div>
  );
}
