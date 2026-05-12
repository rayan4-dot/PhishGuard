"use client";

import { Shield, Lock, Terminal, Globe, Zap, Server, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function ApiDocs() {
  const endpoints = [
    {
      method: "POST",
      path: "/api/scan",
      desc: "Analyze email content for phishing indicators, headers, and malicious payloads.",
      body: { content: "string" },
      res: { scan: { id: "string", shortId: "string" }, analysis: { threatScore: 98, verdict: "PHISHING" } }
    },
    {
      method: "GET",
      path: "/api/scans",
      desc: "Retrieve historical security events and incident logs (SOC view).",
      body: null,
      res: "[ { id: '...', threatScore: 42 }, ... ]"
    }
  ];

  return (
    <div className="container" style={{ maxWidth: '1000px', margin: '4rem auto', padding: '0 2rem' }}>
      <header style={{ marginBottom: '4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', color: 'var(--accent-cyan)', marginBottom: '1rem' }}>
          <Terminal size={24} />
          <span style={{ fontWeight: 800, letterSpacing: '0.1em', fontSize: '0.875rem' }}>DEVELOPER DOCUMENTATION</span>
        </div>
        <h1 style={{ fontSize: '3rem', fontWeight: 800 }}>PhishGuard API v1.0</h1>
        <p style={{ fontSize: '1.25rem', color: 'var(--text-secondary)', marginTop: '1rem' }}>
          Programmatic access to enterprise-grade phishing intelligence and AI forensic analysis.
        </p>
      </header>

      <section style={{ marginBottom: '4rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Server size={24} color="var(--accent-cyan)" /> Authentication
        </h2>
        <div className="glass-card" style={{ padding: '2rem' }}>
          <p style={{ lineHeight: '1.7', marginBottom: '1.5rem' }}>
            The PhishGuard API uses <strong>Bearer Token Authentication</strong>. All requests must include the <code>Authorization</code> header.
          </p>
          <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', color: 'var(--accent-cyan)' }}>
            Authorization: Bearer YOUR_API_KEY
          </pre>
        </div>
      </section>

      <section>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Zap size={24} color="var(--accent-purple)" /> Endpoints
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {endpoints.map((ep, i) => (
            <div key={i} className="glass-card" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
                <span style={{ background: ep.method === 'POST' ? 'var(--accent-cyan)' : 'var(--accent-purple)', color: '#000', padding: '4px 12px', borderRadius: '6px', fontWeight: 800, fontSize: '0.75rem' }}>{ep.method}</span>
                <code style={{ fontSize: '1.1rem', fontWeight: 700 }}>{ep.path}</code>
              </div>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>{ep.desc}</p>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>REQUEST BODY</div>
                  <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    {JSON.stringify(ep.body, null, 2)}
                  </pre>
                </div>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>RESPONSE (200 OK)</div>
                  <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1rem', borderRadius: '8px', fontSize: '0.8rem' }}>
                    {typeof ep.res === 'string' ? ep.res : JSON.stringify(ep.res, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer style={{ marginTop: '6rem', paddingTop: '4rem', borderTop: '1px solid var(--glass-border)', textAlign: 'center' }}>
        <p style={{ color: 'var(--text-secondary)' }}>
          Powered by PhishGuard AI Threat Intelligence. &copy; 2026.
        </p>
      </footer>
    </div>
  );
}
