import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ 
    status: 'operational', 
    timestamp: new Date().toISOString(),
    service: 'PhishGuard AI SOC'
  });
}
