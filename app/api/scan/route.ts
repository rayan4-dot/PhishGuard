import { NextResponse } from "next/server";
import { geminiModel, phishingAnalysisPrompt } from "@/lib/gemini";
import { prisma } from "@/lib/prisma";
import axios from "axios";

const VT_API_KEY = process.env.VIRUSTOTAL_API_KEY;

// 🛡️ Expert Header Parser
function parseEmailHeaders(content: string) {
  const headers: any = {};
  const lines = content.split('\n');
  
  const headerPatterns = {
    spf: /spf=(pass|fail|softfail|neutral|none)/i,
    dkim: /dkim=(pass|fail)/i,
    dmarc: /dmarc=(pass|fail)/i,
    ip: /from\s+.*?\[(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})\]/i,
    returnPath: /^Return-Path:\s*<(.*?)>/im
  };

  headers.spf = content.match(headerPatterns.spf)?.[1]?.toUpperCase() || "UNKNOWN";
  headers.dkim = content.match(headerPatterns.dkim)?.[1]?.toUpperCase() || "UNKNOWN";
  headers.dmarc = content.match(headerPatterns.dmarc)?.[1]?.toUpperCase() || "UNKNOWN";
  headers.originatingIp = content.match(headerPatterns.ip)?.[1] || "Not found";
  headers.returnPath = content.match(headerPatterns.returnPath)?.[1] || "Not found";

  return headers;
}

// 🧪 Mock Sandbox Analysis
function runMockSandbox(content: string) {
  const sandboxResults = {
    attachments: [] as any[],
    entropyRating: "LOW",
    behavioralAnomalies: [] as string[]
  };

  // Detect suspicious file extensions in text
  const fileRegex = /([a-zA-Z0-9_-]+\.(exe|zip|iso|lnk|vbs|rar|docm))/gi;
  const files = content.match(fileRegex);
  
  if (files) {
    files.forEach(file => {
      sandboxResults.attachments.push({
        filename: file,
        type: file.split('.').pop()?.toUpperCase(),
        threat: file.endsWith('.exe') ? 'CRITICAL' : 'HIGH'
      });
    });
  }

  if (content.length > 5000) sandboxResults.entropyRating = "HIGH";
  if (content.includes("eval(") || content.includes("base64")) {
    sandboxResults.behavioralAnomalies.push("Encoded Payload Detected");
  }

  return sandboxResults;
}

async function checkUrlReputation(url: string) {
  if (!VT_API_KEY) return { url, status: "No API Key", positives: 0 };
  try {
    const urlId = Buffer.from(url).toString('base64').replace(/=/g, '');
    const response = await axios.get(
      `https://www.virustotal.com/api/v3/urls/${urlId}`,
      { headers: { "x-apikey": VT_API_KEY } }
    );
    const stats = response.data.data.attributes.last_analysis_stats;
    return { url, malicious: stats.malicious, suspicious: stats.suspicious, harmless: stats.harmless };
  } catch (error) {
    return { url, status: "Error or Not Found" };
  }
}

export async function POST(req: Request) {
  try {
    const { content } = await req.json();
    if (!content) return NextResponse.json({ error: "Content is required" }, { status: 400 });

    // 1. Technical Analysis
    const headers = parseEmailHeaders(content);
    const sandbox = runMockSandbox(content);
    
    // 2. URL Extraction & Reputation
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const urls = Array.from(new Set(content.match(urlRegex) || [])) as string[];
    const urlResults = await Promise.all(urls.map(url => checkUrlReputation(url)));

    // 3. Multi-Engine Consensus (Gemini + Local Rules)
    const prompt = phishingAnalysisPrompt(
      `[HEADERS]: ${JSON.stringify(headers)}\n[SANDBOX]: ${JSON.stringify(sandbox)}\n[CONTENT]: ${content}`,
      JSON.stringify(urlResults, null, 2)
    );

    const result = await geminiModel.generateContent(prompt);
    const text = result.response.text();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error("Invalid AI Response");
    
    const analysis = JSON.parse(jsonMatch[0]);

    // 4. Save to Database
    const shortId = Math.random().toString(36).substring(2, 10).toUpperCase();
    const scan = await (prisma.scan as any).create({
      data: {
        shortId,
        emailContent: content,
        threatScore: analysis.threatScore,
        aiAnalysis: JSON.stringify(analysis),
        urlReputation: urlResults as any,
        status: "COMPLETED",
      }
    });

    return NextResponse.json({ scan, analysis });
  } catch (error: any) {
    console.error("Scan Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
