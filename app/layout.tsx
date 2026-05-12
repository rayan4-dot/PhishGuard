import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { ShieldAlert } from "lucide-react";

export const metadata: Metadata = {
  title: "PhishGuard AI | Advanced Email Protection",
  description: "AI-powered phishing detection and threat intelligence.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <nav className="nav-container">
          <Link href="/" className="logo">
            <ShieldAlert size={32} color="#22d3ee" />
            <span>PHISHGUARD AI</span>
          </Link>
          <div style={{ display: 'flex', gap: '2rem' }}>
            <Link href="/" style={{ color: 'var(--text-secondary)' }}>Scanner</Link>
            <Link href="/dashboard" style={{ color: 'var(--text-secondary)' }}>History</Link>
          </div>
        </nav>
        <main>{children}</main>
        <footer style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-secondary)', opacity: 0.5 }}>
          <p>&copy; 2026 PhishGuard AI. Advanced Threat Intelligence.</p>
        </footer>
      </body>
    </html>
  );
}
