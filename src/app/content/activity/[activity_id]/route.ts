// app/api/image/[filename]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { join } from 'path';
import { statSync, createReadStream, existsSync } from 'fs';

const IMAGE_DIR = join(process.cwd(), 'src/app/content/activity');

export async function GET(
  req: NextRequest,
  { params }: { params: { activity_id: string } }
) {
  const { activity_id } = params;

  const filePath = join(IMAGE_DIR, activity_id, "1000x600.jpg");

  console.log("Looking for", filePath);

  if (!existsSync(filePath)) {
    console.error("Not Found!");
    return new NextResponse('Not found', { status: 404 });
  }

  console.log("Found");

  const fileStat = statSync(filePath);
  const stream = createReadStream(filePath);

  return new NextResponse(stream as any, {
    headers: {
      'Content-Type': 'image/jpeg', // or infer based on extension
      'Content-Length': fileStat.size.toString(),
      'Cache-Control': 'public, max-age=86400',
    },
  });
}
