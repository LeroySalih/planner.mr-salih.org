import { NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ activity_id: string }> }
) {

    return new Response("Hello from the API route!", {
        status: 200,
        headers: {
            'Content-Type': 'text/plain',
        },
    }); 
}