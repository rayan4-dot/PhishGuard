import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export const geminiModel = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

export const phishingAnalysisPrompt = (emailContent: string, urlResults: string) => `
You are an expert cybersecurity analyst specializing in email phishing detection.
Analyze the following email content and the associated URL reputation data from VirusTotal.

EMAIL CONTENT:
""" 
${emailContent}
"""

VIRUSTOTAL URL RESULTS:
"""
${urlResults}
"""

Provide your analysis in a professional Cybersecurity Incident Report format (JSON):
{
  "threatScore": number (0-100),
  "verdict": "PHISHING" | "SUSPICIOUS" | "SAFE",
  "summary": "Executive summary for stakeholders",
  "technical_details": {
    "header_analysis": "Expert breakdown of SPF/DKIM/DMARC and relay chains",
    "attachment_risks": "Analysis of any identified attachments or payload delivery methods",
    "social_engineering": "Analysis of psychological triggers used"
  },
  "mitre_attack": [
    { "tactic": "Tactic Name", "technique": "Technique Name", "id": "T1234" }
  ],
  "indicators": [
    { "type": "IP" | "DOMAIN" | "URL" | "FILE", "value": "Value", "description": "Why this is an IOC" }
  ],
  "remediation": [
    "Immediate action step 1",
    "Policy recommendation 1"
  ],
  "confidence_score": number (0-100)
}

Be critical and look for subtle signs like slightly altered domains, suspicious attachments, and social engineering patterns.
`;
