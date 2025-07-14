'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Block, BlockRenderer, DisplaySettings } from '@/app/components/BlockRenderer';

interface Memory {
  id: number;
  day_number: number;
  release_date: string;
  blocks: Block[];
  display_settings: DisplaySettings;
}

export default function PreviewPage() {
  const params = useParams();
  const day = params.day;
  const [memory, setMemory] = useState<Memory | null>(null);

  useEffect(() => {
    if (day) {
      fetch(`/api/memories/${day}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            console.error('API Error:', data.error);
            setMemory({ 
              id: 0, 
              day_number: parseInt(day as string), 
              release_date: '', 
              blocks: [], 
              display_settings: {} 
            });
          } else {
            setMemory(data);
          }
        })
        .catch((error) => {
          console.error('Fetch error:', error);
          setMemory({ 
            id: 0, 
            day_number: parseInt(day as string), 
            release_date: '', 
            blocks: [], 
            display_settings: {} 
          });
        });
    }
  }, [day]);

  if (!memory) return <div>Loading...</div>;

  return (
    <main className="flex min-h-screen flex-col items-center p-6 sm:p-12">
      <div className="w-full max-w-4xl bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 sm:p-10">
        <Link href="/admin" className="text-pink-500 hover:text-pink-700 transition-colors duration-300 font-semibold">
          &larr; Back to Editor
        </Link>
        <div className="mt-4">
          {memory.blocks.map(block => <BlockRenderer key={block.id} block={block} settings={memory.display_settings || {}} />)}
        </div>
      </div>
    </main>
  );
} 