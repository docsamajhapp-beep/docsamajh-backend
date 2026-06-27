import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface CustomAnalysisResult {
  docType: string;
  oneLiner: string;
  sections: { label: string; content: string }[];
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function analyzeWithCustomPrompt(
  systemPrompt: string,
  userText: string
): Promise<CustomAnalysisResult> {
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured');
  }

  const model = genAI.getGenerativeModel({
    model: 'gemini-2.0-flash',
    systemInstruction: `${systemPrompt}

CRITICAL INSTRUCTIONS:
1. You must respond with a JSON object that has exactly this schema:
{
  "docType": "string (clear descriptive name, e.g. 'Court Notice under Section 138')",
  "oneLiner": "string (a concise explanation of what this document is in one line)",
  "sections": [
    {
      "label": "string (section title, e.g. 'Prosecution Risk' or 'Hidden Fees')",
      "content": "string (detailed explanation for this section)"
    },
    ...
  ],
  "actions": ["string", "string", ... (a list of concrete action items for the user)],
  "riskLevel": "low" | "medium" | "high" (the risk level associated with the document)
}
2. Respond with ONLY the raw JSON object. Do not wrap it in markdown code blocks like \`\`\`json.
3. For Indian context: use ₹ for currency, reference Indian laws/acts, and Indian helpline/emergency details if relevant.`,
  });

  const responseResult = await model.generateContent(userText);
  const rawText = responseResult.response.text();

  // Strip markdown code fences if Gemini wraps in ```json ... ```
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}
