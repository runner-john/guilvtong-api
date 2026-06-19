import { NextResponse } from 'next/server';
import { DOUBAO_API_KEY, DOUBAO_MODEL } from '@/lib/doubao';

export async function GET() {
  return NextResponse.json({
    success: true,
    api_configured: !!DOUBAO_API_KEY,
    model: DOUBAO_MODEL,
    timestamp: new Date().toISOString(),
  });
}
