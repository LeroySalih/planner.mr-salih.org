// src/app/api/[activity_id]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { statSync, createReadStream, existsSync } from 'fs';
import { Readable } from 'stream';

const IMAGE_DIR = join(process.cwd(), 'src/app/content/activity');

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ activity_id: string }> }
) {
  const { activity_id } = await params
  const filePath = join(IMAGE_DIR, activity_id, '1000x600.jpg');

  console.log('Looking for', filePath);

  if (!existsSync(filePath)) {
    console.error('Not Found!');
    return new NextResponse('Not found', { status: 404 });
  }

  console.log('Found');

  const fileStat = statSync(filePath);
  const fileStream = createReadStream(filePath) as unknown as ReadableStream<Uint8Array>;

  return new NextResponse(fileStream, {
    headers: {
      'Content-Type': 'image/jpeg',
      'Content-Length': fileStat.size.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
