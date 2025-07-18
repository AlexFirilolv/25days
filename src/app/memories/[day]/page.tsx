'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Block, BlockRenderer, DisplaySettings } from '@/app/components/BlockRenderer';

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  blocks: Block[];
  display_settings: DisplaySettings;
}

export default function MemoryPage() {
  const params = useParams();
  const router = useRouter();
  const day = params.day;
  const [memory, setMemory] = useState<Memory | null>(null);
  const [isLocked, setIsLocked] = useState(false);

  useEffect(() => {
    if (day) {
      fetch(`/api/memories/${day}`)
        .then((res) => {
          if (res.status === 403) {
            setIsLocked(true);
            return null;
          }
          return res.json();
        })
        .then((data) => {
          if (data && !data.error) {
            setMemory(data);
          }
        })
        .catch(() => {
          setIsLocked(true);
        });
    }
  }, [day]);

  if (isLocked) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10 text-center">
          <div className="mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-500 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-700 mb-2">Memory Locked</h1>
            <p className="text-gray-600">This memory isn't unlocked yet. Come back when it's time!</p>
          </div>
          <Link href="/" className="inline-block bg-primary-500 hover:bg-primary-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-300">
            &larr; Back to Calendar
          </Link>
        </div>
      </main>
    );
  }

  if (!memory || !memory.blocks) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10">
                    <Link href="/" className="text-primary-500 hover:text-primary-700 transition-colors duration-300 font-semibold">
          &larr; Back to Calendar
        </Link>
        
        {memory.blocks.map(block => <BlockRenderer key={block.id} block={block} settings={memory.display_settings || {}} />)}

      </div>
    </main>
  );
}
