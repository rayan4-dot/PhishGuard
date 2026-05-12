"use client";

import { useEffect, useState } from "react";
import { 
  Shield, ShieldAlert, ShieldCheck, Activity, 
  Search, Clock, Globe, MapPin, AlertTriangle,
  TrendingUp, BarChart3, Database
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [scans, setScans] = useState<any[]>([]);
  const [stats, setStats] = useState({ total: 0, threats: 0, safe: 0, suspicious: 0 });

  useEffect(() => {
    async function fetchData() {
      const res = await fetch("/api/scans"); // I'll need to create this endpoint
      if (res.ok) {
        const data = await res.json();
        setScans(data);
        const threats = data.filter((s: any) => s.threatScore > 70).length;
        const safe = data.filter((s: any) => s.threatScore < 30).length;
        setStats({
          total: data.length,
          threats,
          safe,
          suspicious: data.length - threats - safe
        });
      }
    }
    fetchData();
  }, []);

  return (
    <div className="container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.02em' }}>SOC Intelligence Center</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Enterprise Threat Monitoring & Incident Response</p>
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <div className="glass-card" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'var(--success)', boxShadow: '0 0 10px var(--success)' }}></div>
            <span style={{ fontSize: '0.875rem', fontWeight: 600 }}>SYSTEMS ONLINE</span>
          </div>
        </div>
      </div>

      {/* Hero Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1.5rem', marginBottom: '3rem' }}>
        {[
          { label: 'ACTIVE INCIDENTS', value: stats.threats, icon: ShieldAlert, color: 'var(--danger)' },
          { label: 'THREAT MITIGATED', value: stats.safe, icon: ShieldCheck, color: 'var(--success)' },
          { label: 'AVG. RISK SCORE', value: '42%', icon: Activity, color: 'var(--accent-cyan)' },
          { label: 'GLOBAL SCANS', value: stats.total, icon: Database, color: 'var(--accent-purple)' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass-card" 
            style={{ padding: '2rem', borderTop: `4px solid ${stat.color}` }}
          >
            <div style={{ color: 'var(--text-secondary)', fontSize: '0.75rem', fontWeight: 700, marginBottom: '1rem' }}>{stat.label}</div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
              <div style={{ fontSize: '2.5rem', fontWeight: 800 }}>{stat.value}</div>
              <stat.icon size={32} color={stat.color} style={{ opacity: 0.5 }} />
            </div>
          </motion.div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 400px', gap: '2rem' }}>
        {/* Real-time Feed */}
        <div className="glass-card" style={{ padding: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h2 style={{ fontSize: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Clock size={24} color="var(--accent-cyan)" />
              Security Event Log
            </h2>
            <div style={{ position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', opacity: 0.5 }} />
              <input type="text" placeholder="Search Indicators..." style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid var(--glass-border)', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: '10px', color: '#fff', width: '300px' }} />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {scans.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '4rem', opacity: 0.5 }}>No events detected in current session.</div>
            ) : (
              scans.map((scan, i) => (
                <Link key={i} href={`/scan/${scan.shortId}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                  <motion.div 
                    whileHover={{ x: 10, backgroundColor: 'rgba(255,255,255,0.03)' }}
                    style={{ padding: '1.25rem', borderBottom: '1px solid var(--glass-border)', display: 'flex', alignItems: 'center', gap: '1.5rem', cursor: 'pointer' }}
                  >
                    <div style={{ 
                      width: '40px', height: '40px', borderRadius: '10px', 
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      background: scan.threatScore > 70 ? 'rgba(239, 68, 68, 0.1)' : 'rgba(34, 211, 238, 0.1)',
                      color: scan.threatScore > 70 ? 'var(--danger)' : 'var(--accent-cyan)'
                    }}>
                      {scan.threatScore > 70 ? <AlertTriangle size={20} /> : <Shield size={20} />}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: '1rem' }}>Scan ID: {scan.shortId}</div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{new Date(scan.createdAt).toLocaleString()}</div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 800, color: scan.threatScore > 70 ? 'var(--danger)' : 'var(--success)' }}>{scan.threatScore}%</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.5 }}>RISK INDEX</div>
                    </div>
                  </motion.div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Intelligence Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Globe size={20} color="var(--accent-cyan)" />
              Attack Surface Map
            </h3>
            <div style={{ height: '200px', background: 'rgba(0,0,0,0.3)', borderRadius: '12px', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
               <div style={{ position: 'absolute', inset: 0, opacity: 0.1, background: 'radial-gradient(circle at 50% 50%, var(--accent-cyan) 0%, transparent 70%)' }}></div>
               <div style={{ textAlign: 'center', opacity: 0.5, position: 'relative' }}>
                 <motion.div 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0.2, 0.5] }} 
                   transition={{ duration: 2, repeat: Infinity }}
                   style={{ position: 'absolute', top: '50%', left: '50%', width: '100px', height: '100px', background: 'var(--accent-cyan)', borderRadius: '50%', transform: 'translate(-50%, -50%)', zIndex: -1 }}
                 />
                 <MapPin size={48} color="var(--accent-cyan)" />
                 <div style={{ fontSize: '0.85rem', marginTop: '0.5rem', fontWeight: 800, color: 'var(--accent-cyan)' }}>GEO-LOCATION MAPPING ACTIVE</div>
               </div>
            </div>
          </div>

          <div className="glass-card" style={{ padding: '2rem' }}>
            <h3 style={{ marginBottom: '1.5rem', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <TrendingUp size={20} color="var(--accent-purple)" />
              Threat Distribution
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {[
                { label: 'Phishing', val: 65, color: 'var(--danger)' },
                { label: 'Malware', val: 12, color: 'var(--warning)' },
                { label: 'Social Eng.', val: 23, color: 'var(--accent-cyan)' },
              ].map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                    <span>{item.label}</span>
                    <span>{item.val}%</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', overflow: 'hidden' }}>
                    <div style={{ width: `${item.val}%`, height: '100%', background: item.color }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
