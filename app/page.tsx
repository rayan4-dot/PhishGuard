"use client";

import { useState } from "react";
import { Shield, Upload, Search, AlertTriangle, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

import { ResultView } from "@/components/ResultView";

export default function Home() {
  const [content, setContent] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleScan = async () => {
    if (!content) return;
    setIsScanning(true);
    setResult(null);

    try {
      const response = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || "Scan failed. Please check your API keys.");
        return;
      }
      
      setResult(data);
    } catch (error) {
      console.error("Scan failed:", error);
    } finally {
      setIsScanning(false);
    }
  };

  if (result && result.analysis) {
    return (
      <div className="container" style={{ maxWidth: '1000px', margin: '0 auto', padding: '2rem' }}>
        <button 
          onClick={() => setResult(null)}
          style={{ marginBottom: '2rem', background: 'none', border: 'none', color: 'var(--accent-cyan)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          &larr; Scan another email
        </button>

        <ResultView scan={result.scan} analysis={result.analysis} />
      </div>
    );
  }

  return (
    <div className="container" style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem' }}>
      <section style={{ textAlign: 'center', marginBottom: '4rem' }} className="animate-fade">
        <motion.div 
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          style={{ display: 'inline-flex', padding: '1rem', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)', marginBottom: '1.5rem' }}
        >
          <Shield size={48} color="#22d3ee" />
        </motion.div>
        <h1 style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>
          Stop Phishing in <span style={{ color: 'var(--accent-cyan)' }}>Real-Time</span>
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.25rem', lineHeight: '1.6' }}>
          Upload or paste suspicious emails. Our AI analyzes tactics, scans URLs, 
          and provides a comprehensive threat score instantly.
        </p>
      </section>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="glass-card"
        style={{ padding: '2.5rem' }}
      >
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', marginBottom: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            PASTE EMAIL CONTENT OR HEADERS
          </label>
          <textarea 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Paste the full email text here..."
            style={{ 
              width: '100%', 
              height: '300px', 
              background: 'rgba(0,0,0,0.3)', 
              border: '1px solid var(--glass-border)',
              borderRadius: '16px',
              padding: '1.5rem',
              color: 'var(--text-primary)',
              fontFamily: 'JetBrains Mono, monospace',
              fontSize: '0.9rem',
              resize: 'none',
              outline: 'none',
              transition: 'border-color 0.3s'
            }}
            onFocus={(e) => e.currentTarget.style.borderColor = 'var(--accent-cyan)'}
            onBlur={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <button 
            className="btn-primary" 
            onClick={handleScan}
            disabled={isScanning || !content}
            style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            {isScanning ? (
              <>Scanning...</>
            ) : (
              <>
                <Search size={20} />
                Analyze Threat
              </>
            )}
          </button>
          
          <button 
            onClick={() => document.getElementById('file-upload')?.click()}
            style={{ 
              background: 'rgba(255,255,255,0.05)', 
              border: '1px solid var(--glass-border)', 
              padding: '12px', 
              borderRadius: '12px',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.2s'
            }}
            title="Upload .eml or .txt file"
            onMouseOver={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseOut={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
          >
            <Upload size={20} />
          </button>
          <input 
            id="file-upload"
            type="file" 
            accept=".eml,.txt,.msg"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                  const text = event.target?.result as string;
                  setContent(text);
                };
                reader.readAsText(file);
              }
            }}
          />
        </div>
      </motion.div>

      <div style={{ marginTop: '3rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
        {[
          { icon: <Shield size={24} color="#22d3ee" />, title: "AI Analysis", desc: "Powered by Gemini Pro" },
          { icon: <Search size={24} color="#818cf8" />, title: "URL Reputation", desc: "VirusTotal Integration" },
          { icon: <CheckCircle2 size={24} color="#10b981" />, title: "Secure History", desc: "Stored in PostgreSQL" }
        ].map((feat, i) => (
          <div key={i} className="glass-card" style={{ padding: '1.5rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1rem' }}>{feat.icon}</div>
            <h4 style={{ marginBottom: '0.5rem' }}>{feat.title}</h4>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{feat.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
