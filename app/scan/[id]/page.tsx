import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Search, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { ResultView } from "@/components/ResultView";

export default async function ScanDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const scan = await (prisma.scan as any).findUnique({
    where: { shortId: id },
  });

  if (!scan) {
    notFound();
  }

  const analysis = scan.aiAnalysis ? JSON.parse(scan.aiAnalysis) : null;

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
      <Link 
        href="/dashboard"
        className="no-print"
        style={{ marginBottom: '2rem', textDecoration: 'none', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
      >
        <ChevronLeft size={20} />
        Back to Dashboard
      </Link>

      <ResultView scan={scan} analysis={analysis} />
    </div>
  );
}
