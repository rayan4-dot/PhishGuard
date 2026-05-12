import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const scans = await prisma.scan.findMany({
      orderBy: { createdAt: 'desc' },
      take: 50
    });
    return NextResponse.json(scans);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
