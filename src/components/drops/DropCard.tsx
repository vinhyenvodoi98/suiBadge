'use client';

import Image from 'next/image';
import { Drop } from '@/types/drop';
import { formatDistanceToNow } from 'date-fns';

interface DropCardProps {
  drop: Drop;
}

export default function DropCard({ drop }: DropCardProps) {
  return (
    <div className="glass-effect rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-48 w-full">
        <Image
          src={drop.imageUrl}
          alt={drop.name}
          fill
          className="object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className="bg-blue-600 bg-opacity-80 text-white px-3 py-1 rounded-full text-sm">
            {drop.claimedCount}/{drop.totalSupply}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{drop.name}</h3>
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{drop.description}</p>
        
        <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
          <span>Created {formatDistanceToNow(new Date(drop.createdAt), { addSuffix: true })}</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
            {drop.chain}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
            onClick={() => window.location.href = `/drops/${drop.id}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
            </svg>
            View Details
          </button>
          <button
            className="text-blue-600 hover:text-blue-700 transition-colors duration-200 flex items-center gap-2"
            onClick={() => window.location.href = `/drops/${drop.id}/claim`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
            </svg>
            Claim Badge
          </button>
        </div>
      </div>
    </div>
  );
} 