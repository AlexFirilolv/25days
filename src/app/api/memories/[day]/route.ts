import { NextResponse } from 'next/server';
import mysql, { RowDataPacket } from 'mysql2/promise';

interface MemoryRow extends RowDataPacket {
    day_number: number;
    release_date: string;
    block_type: 'title' | 'paragraph' | 'image' | 'quote' | 'highlight';
    content: string;
    formatting: string;
    sort_order: number;
}

export async function GET(request: Request, { params }: { params: { day: string } }) {
  try {
    const day = params.day;
    const url = new URL(request.url);
    const isPreview = url.searchParams.get('preview') === 'true';
    
    const connection = await mysql.createConnection(process.env.DATABASE_URL!);
    const [rows] = await connection.execute<MemoryRow[]>(
      `SELECT m.day_number, m.release_date, m.display_settings, mb.block_type, mb.content, mb.formatting, mb.sort_order
       FROM memories m
       LEFT JOIN memory_blocks mb ON m.id = mb.memory_id
       WHERE m.day_number = ?
       ORDER BY mb.sort_order ASC`,
      [day]
    );
    await connection.end();

    if (Array.isArray(rows) && rows.length > 0) {
      // Check if memory is unlocked (unless it's a preview request)
      if (!isPreview) {
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Reset time to beginning of day for fair comparison
        const releaseDate = new Date(rows[0].release_date);
        releaseDate.setHours(0, 0, 0, 0);
        
        if (releaseDate > today) {
          return NextResponse.json({ error: 'Memory not yet unlocked' }, { status: 403 });
        }
      }
      let display_settings = rows[0].display_settings;
      if (display_settings && typeof display_settings === 'string') {
        try {
          display_settings = JSON.parse(display_settings);
        } catch (e) {
          // If parsing fails, keep it as a string or handle error
        }
      }

      const memory = {
        day_number: rows[0].day_number,
        release_date: rows[0].release_date,
        display_settings: display_settings,
        blocks: rows.map(row => {
          let formatting = {};
          try {
            if (row.formatting) {
              // Check if it's already an object or a string
              if (typeof row.formatting === 'string') {
                formatting = JSON.parse(row.formatting);
              } else {
                formatting = row.formatting;
              }
            }
          } catch (error) {
            console.error('Error parsing formatting JSON:', error, 'Raw formatting:', row.formatting);
            formatting = {};
          }
          return {
            id: row.id || Math.random().toString(36).substr(2, 9),
            block_type: row.block_type,
            content: row.content,
            formatting,
            sort_order: row.sort_order
          };
        }).filter(block => block.block_type) // Filter out potential null blocks if no blocks exist
      };
      return NextResponse.json(memory);
    } else {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }
  } catch (error) {
    let errorMessage = 'An unexpected error occurred';
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
