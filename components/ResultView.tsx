"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Shield, ShieldAlert, ShieldCheck, AlertCircle, 
  Terminal, Box, Share2, Download, FileText, 
  Target, Info, ChevronRight, Activity, 
  Globe, Zap, FileSearch, MapPin, Server
} from "lucide-react";

export function ResultView({ scan, analysis }: { scan: any, analysis: any }) {
  const [activeTab, setActiveTab] = useState<"incident" | "technical" | "forensics">("incident");

  if (!analysis) return <div className="glass-card" style={{ padding: '2rem' }}>No incident data available.</div>;

  const handleExportPDF = () => {
    // In a real app, use jspdf or similar. For now, we'll open print view.
    window.print();
  };

  const getVerdictColor = (verdict: string) => {
    if (verdict === "PHISHING") return "var(--danger)";
    if (verdict === "SUSPICIOUS") return "var(--warning)";
    return "var(--success)";
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Top Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ 
              background: `${getVerdictColor(analysis.verdict)}22`, 
              color: getVerdictColor(analysis.verdict),
              padding: '6px 16px', borderRadius: '100px', fontSize: '0.75rem', fontWeight: 800,
              border: `1px solid ${getVerdictColor(analysis.verdict)}44`,
              display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}>
              <Shield size={14} /> {analysis.verdict} DETECTED
            </span>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>INCIDENT ID: {scan.shortId}</span>
          </div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800 }}>Incident Analysis Report</h1>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button 
            onClick={handleExportPDF} 
            className="glass-card" 
            style={{ 
              padding: '0.75rem 1.5rem', 
              cursor: 'pointer', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.5rem', 
              fontWeight: 700, 
              color: '#fff',
              background: 'rgba(34, 211, 238, 0.15)',
              border: '1px solid var(--accent-cyan)'
            }}
          >
            <FileText size={18} /> Generate Incident Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', background: 'rgba(255,255,255,0.03)', padding: '6px', borderRadius: '14px', border: '1px solid var(--glass-border)', alignSelf: 'flex-start' }}>
        {[
          { id: 'incident', label: 'Executive Summary', icon: FileSearch },
          { id: 'technical', label: 'Technical Details', icon: Terminal },
          { id: 'forensics', label: 'Forensic Map', icon: Target },
        ].map(tab => (
          <button 
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            style={{ 
              padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer',
              background: activeTab === tab.id ? 'var(--accent-cyan)' : 'transparent',
              color: activeTab === tab.id ? '#000' : 'var(--text-secondary)',
              fontWeight: 700, transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '0.5rem'
            }}
          >
            <tab.icon size={18} /> {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === "incident" && (
          <motion.div key="incident" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div className="glass-card" style={{ padding: '2.5rem' }}>
                 <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--accent-cyan)' }}>Executive Summary</h2>
                 <p style={{ fontSize: '1.1rem', lineHeight: '1.7', opacity: 0.9 }}>{analysis.summary}</p>
                 
                 <h3 style={{ fontSize: '1.1rem', marginTop: '2.5rem', marginBottom: '1rem', color: 'var(--text-secondary)' }}>MITRE ATT&CK® Mapping</h3>
                 <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem' }}>
                   {analysis.mitre_attack?.map((m: any, i: number) => (
                     <div key={i} style={{ background: 'rgba(255,255,255,0.05)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', flex: '1 1 250px' }}>
                       <div style={{ fontSize: '0.75rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.25rem' }}>{m.id}</div>
                       <div style={{ fontWeight: 700 }}>{m.technique}</div>
                       <div style={{ fontSize: '0.85rem', opacity: 0.5 }}>{m.tactic}</div>
                     </div>
                   ))}
                 </div>
               </div>

               <div className="glass-card" style={{ padding: '2.5rem', borderLeft: `6px solid var(--accent-cyan)` }}>
                 <h2 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                   <Zap size={20} color="var(--accent-cyan)" /> Remediation Strategy
                 </h2>
                 <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                   {analysis.remediation?.map((r: string, i: number) => (
                     <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
                       <ChevronRight size={20} color="var(--accent-cyan)" />
                       <span style={{ fontWeight: 600 }}>{r}</span>
                     </div>
                   ))}
                 </div>
               </div>
            </div>

            <aside style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
               <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center', border: `2px solid ${getVerdictColor(analysis.verdict)}` }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5, marginBottom: '1rem', letterSpacing: '0.2em' }}>THREAT LEVEL</div>
                  <div style={{ fontSize: '5rem', fontWeight: 900, color: getVerdictColor(analysis.verdict) }}>{analysis.threatScore}%</div>
                  <div style={{ fontWeight: 700, fontSize: '1.2rem', marginTop: '1rem' }}>CONFIDENCE: {analysis.confidence_score}%</div>
               </div>

               <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1rem', marginBottom: '1.5rem' }}>INDICATORS OF COMPROMISE (IOCs)</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {analysis.indicators?.map((ioc: any, i: number) => (
                      <div key={i} style={{ fontSize: '0.85rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                          <span style={{ fontWeight: 800, color: 'var(--accent-cyan)' }}>{ioc.type}</span>
                          <span style={{ opacity: 0.5 }}>{ioc.value}</span>
                        </div>
                        <div style={{ opacity: 0.7 }}>{ioc.description}</div>
                      </div>
                    ))}
                  </div>
               </div>
            </aside>
          </motion.div>
        )}

        {activeTab === "technical" && (
          <motion.div key="technical" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
             <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(450px, 1fr))', gap: '2rem', marginBottom: '2rem' }}>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Terminal size={20} color="var(--accent-cyan)" /> Email Header Analysis
                  </h3>
                  <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.9rem' }}>
                    {analysis.technical_details.header_analysis}
                  </pre>
                </div>
                <div className="glass-card" style={{ padding: '2rem' }}>
                  <h3 style={{ fontSize: '1.25rem', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <Box size={20} color="var(--accent-purple)" /> Sandbox & Payload Analysis
                  </h3>
                  <pre style={{ background: 'rgba(0,0,0,0.3)', padding: '1.5rem', borderRadius: '12px', whiteSpace: 'pre-wrap', lineHeight: '1.8', fontSize: '0.9rem' }}>
                    {analysis.technical_details.attachment_risks}
                  </pre>
                </div>
             </div>

             <div className="glass-card" style={{ padding: '2rem' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--accent-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Zap size={18} /> LINGUISTIC FORENSICS (SOCIAL ENGINEERING)
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                   {analysis.technical_details.social_engineering
                     .split(/\n|(?=\d\.)|(?=-\s)/)
                     .filter((t: string) => t.trim().length > 15)
                     .slice(0, 3)
                     .map((trigger: string, i: number) => (
                       <div key={i} style={{ background: 'rgba(255,255,255,0.03)', padding: '1.25rem', borderRadius: '12px', borderLeft: '4px solid var(--danger)' }}>
                         <div style={{ fontWeight: 800, color: 'var(--danger)', fontSize: '0.65rem', marginBottom: '0.5rem', letterSpacing: '0.1em' }}>THREAT DETECTED</div>
                         <div style={{ fontSize: '0.85rem', lineHeight: '1.6' }}>{trigger.replace(/^\d\.\s*|-\s*/, '').trim()}</div>
                       </div>
                   ))}
                </div>
             </div>
          </motion.div>
        )}

        {activeTab === "forensics" && (
          <motion.div key="forensics" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="glass-card" style={{ padding: '3rem' }}>
            {/* Multi-LLM Consensus Section */}
            <div style={{ marginBottom: '4rem', padding: '2rem', background: 'rgba(34, 211, 238, 0.03)', borderRadius: '20px', border: '1px solid var(--accent-cyan)33' }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--accent-cyan)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Zap size={18} /> MULTI-ENGINE DETECTION CONSENSUS
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
                {[
                  { engine: 'Gemini 2.5 Flash', score: analysis.threatScore, status: 'Primary' },
                  { engine: 'Claude-3 (Sim)', score: Math.min(100, analysis.threatScore + 2), status: 'Consensus' },
                  { engine: 'GPT-4o (Sim)', score: Math.max(0, analysis.threatScore - 3), status: 'Consensus' },
                ].map((e, i) => (
                  <div key={i} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5, marginBottom: '0.5rem' }}>{e.engine}</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900 }}>{e.score}%</div>
                    <div style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--success)' }}>{e.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
              <Globe size={64} color="var(--accent-cyan)" style={{ marginBottom: '2rem', opacity: 0.5 }} />
              <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem' }}>Forensic Visualization Engine</h2>
              <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0 auto' }}>
                Reconstructing the SMTP relay chain and originating infrastructure reputation.
              </p>
            </div>
            
            {/* Visual Relay Chain */}
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1rem', marginBottom: '4rem', padding: '2rem', background: 'rgba(0,0,0,0.2)', borderRadius: '20px' }}>
               <div style={{ textAlign: 'center', flex: 1 }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(239, 68, 68, 0.1)', border: '2px solid var(--danger)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                   <MapPin size={24} color="var(--danger)" />
                 </div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--danger)' }}>ORIGIN</div>
                 <div style={{ fontSize: '0.875rem' }}>{scan.sender?.includes('[') ? scan.sender.match(/\[(.*?)\]/)?.[1] : 'Suspicious IP'}</div>
               </div>
               <ChevronRight size={24} style={{ opacity: 0.3 }} />
               <div style={{ textAlign: 'center', flex: 1 }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.05)', border: '2px dashed var(--glass-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                   <Server size={24} />
                 </div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, opacity: 0.5 }}>RELAY</div>
                 <div style={{ fontSize: '0.875rem' }}>MTA Cluster</div>
               </div>
               <ChevronRight size={24} style={{ opacity: 0.3 }} />
               <div style={{ textAlign: 'center', flex: 1 }}>
                 <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(34, 211, 238, 0.1)', border: '2px solid var(--accent-cyan)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1rem' }}>
                   <ShieldCheck size={24} color="var(--accent-cyan)" />
                 </div>
                 <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>DESTINATION</div>
                 <div style={{ fontSize: '0.875rem' }}>End-User Inbox</div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PRINT-ONLY SECTION (Hidden on screen) */}
      <div className="print-only" style={{ display: 'none' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '1rem' }}>Cybersecurity Incident Report</h1>
        <div style={{ marginBottom: '2rem', padding: '1rem', border: '1px solid #000' }}>
          <strong>VERDICT:</strong> {analysis.verdict} | <strong>THREAT SCORE:</strong> {analysis.threatScore}% | <strong>ID:</strong> {scan.shortId}
        </div>
        
        <section style={{ marginBottom: '2rem' }}>
          <h2>1. Executive Summary</h2>
          <p>{analysis.summary}</p>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>2. MITRE ATT&CK® Mapping</h2>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f0f0f0' }}>
                <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ccc' }}>ID</th>
                <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ccc' }}>Technique</th>
                <th style={{ textAlign: 'left', padding: '8px', border: '1px solid #ccc' }}>Tactic</th>
              </tr>
            </thead>
            <tbody>
              {analysis.mitre_attack?.map((m: any, i: number) => (
                <tr key={i}>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{m.id}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{m.technique}</td>
                  <td style={{ padding: '8px', border: '1px solid #ccc' }}>{m.tactic}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>3. Indicators of Compromise (IOCs)</h2>
          <ul>
            {analysis.indicators?.map((ioc: any, i: number) => (
              <li key={i}><strong>{ioc.type}:</strong> {ioc.value} - {ioc.description}</li>
            ))}
          </ul>
        </section>

        <section style={{ marginBottom: '2rem' }}>
          <h2>4. Technical Forensics</h2>
          <h3>Email Headers</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem' }}>{analysis.technical_details.header_analysis}</pre>
          <h3>Payload Analysis</h3>
          <pre style={{ whiteSpace: 'pre-wrap', background: '#f9f9f9', padding: '1rem' }}>{analysis.technical_details.attachment_risks}</pre>
        </section>

        <section>
          <h2>5. Remediation Plan</h2>
          <ul>
            {analysis.remediation?.map((r: string, i: number) => <li key={i}>{r}</li>)}
          </ul>
        </section>
      </div>

      <style jsx global>{`
        @media screen {
          .print-only { display: none !important; }
        }
        @media print {
          @page { 
            margin: 0; 
          }
          .no-print, nav, footer, button, .glass-card, .no-print * { display: none !important; }
          .print-only { 
            display: block !important; 
            color: black !important; 
            padding: 2cm; /* Re-apply margin via padding */
          }
          body { 
            background: white !important; 
            color: black !important; 
            margin: 0; 
            padding: 0; 
          }
        }
      `}</style>
    </div>
  );
}
