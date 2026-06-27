import Groq from 'groq-sdk';
import { buildEnrichedSystemPrompt } from './dataset';
import { MEDICAL_PARAMETERS } from './medicalDataset';

export interface CustomAnalysisResult {
  docType: string;
  oneLiner: string;
  sections: { label: string; content: string }[];
  actions: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function analyzeWithGroq(
  systemPrompt: string,
  userText: string,
  category: string = 'auto'
): Promise<CustomAnalysisResult> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const client = new Groq({ apiKey });

  // Enrich system prompt with relevant dataset examples (few-shot learning)
  const enrichedPrompt = buildEnrichedSystemPrompt(systemPrompt, userText, category);

  // Format the medical parameters reference dataset if relevant
  let medicalReferenceText = '';
  if (category === 'medical_report' || category === 'auto') {
    medicalReferenceText = `
MEDICAL REFERENCE DATASET (Use this ONLY for reference, do not assume it applies directly to the patient's individual situation):
${MEDICAL_PARAMETERS.map(p => `
- Parameter: ${p.name}
  Category: ${p.category}
  Normal Range: ${p.normal_range}
  ${p.low_meaning ? `If Low: ${p.low_meaning} (Causes: ${p.low_causes}, Risks: ${p.low_risk}, General Fix: ${p.low_fix})` : ''}
  If High: ${p.high_meaning} (Causes: ${p.high_causes}, Risks: ${p.high_risk}, General Fix: ${p.high_fix})
  Disclaimer: ${p.disclaimer}
`).join('\n')}
`;
  }

  const fullSystem = `${enrichedPrompt}
${medicalReferenceText}

CRITICAL INSTRUCTIONS:
1. You must respond with a JSON object that has exactly this schema:
{
  "docType": "string (clear descriptive name, e.g. 'Court Notice under Section 138')",
  "oneLiner": "string (a concise explanation of what this document is in one line)",
  "sections": [
    {
      "label": "string (section title, e.g. 'Prosecution Risk' or 'Hidden Fees')",
      "content": "string (detailed explanation for this section)"
    }
  ],
  "actions": ["string", "string"],
  "riskLevel": "low" | "medium" | "high"
}
2. Respond with ONLY the raw JSON object. Do not wrap it in markdown code blocks.
3. For Indian context: use ₹ for currency, reference Indian laws/acts, and Indian helpline/emergency details if relevant.

LANGUAGE RULES — MOST IMPORTANT:
4. Write as if explaining to a 15-year-old student who has NEVER seen this type of document before.
5. NEVER use technical jargon without immediately explaining it in simple brackets.
   - BAD: "ectocervical squamous epithelium displaying acanthosis"
   - GOOD: "the outer lining of the cervix (opening of the uterus) showed thickening of skin cells"
   - BAD: "NPA under SARFAESI Act"
   - GOOD: "your loan is now marked as 'bad loan' by the bank (they think you won't pay back)"
   - BAD: "anticipatory bail under Section 438 CrPC"
   - GOOD: "a protection order from court so police cannot arrest you without going to court first"
6. Use simple everyday words. If a hard word is unavoidable, put the plain meaning right after in brackets.
7. Use short sentences. Maximum 2 lines per point.
8. Use real-life analogies when helpful (e.g. "think of it like a receipt", "imagine it like a warning letter").
9. For medical reports: explain every test/finding in plain body language a family member would understand.
10. For legal documents: explain every legal term like you are talking to someone who has never been to court.
11. For banking: explain financial terms like explaining to someone who just got their first bank account.
12. The "actions" array must be practical, clear steps in simple Hinglish — what exactly to do, where to go, what to say.
13. CLINICAL/DIAGNOSTIC LIMITATION AND DISCLAIMER RULES (CRITICAL):
    - Tone MUST NOT be a definitive clinical diagnosis (e.g. Do NOT say: "You have anemia" or "You have diabetes").
    - Instead, use a report-explainer tone: "Aapki report mein [Parameter Name] [low/high/normal] dikh raha hai, jiska aamtaur par matlab ye hota hai..." (Your report shows X is low/high, which generally means...).
    - You MUST include a strong, mandatory medical consult disclaimer at the end of the summary or in the actions/content: "Yeh sirf samajhne ke liye general information hai, koi medical advice nahi hai. Apni report ka sahi analysis aur treatment ke liye apne doctor se jaroor consult karein."
    - If any value is high-risk (e.g., severe anemia, Hb < 9 g/dL, blood sugar > 200 mg/dL or < 70 mg/dL, critical creatinine/liver values, platelets < 1.0 lakh/µL), you MUST:
      * Set "riskLevel" to "high" (which will trigger a red warning badge in the UI).
      * Explicitly list "Immediately consult a doctor / Urgent medical advice needed" as the primary action item.`;


  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: fullSystem },
      { role: 'user', content: userText },
    ],
    temperature: 0.3,
    max_tokens: 1500,
  });

  const rawText = completion.choices[0]?.message?.content || '';

  // Strip markdown code fences if model wraps in ```json ... ```
  const cleaned = rawText
    .replace(/^```json\s*/i, '')
    .replace(/^```\s*/i, '')
    .replace(/\s*```$/i, '')
    .trim();

  return JSON.parse(cleaned);
}

export async function extractTextWithGroq(documentText: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    throw new Error('GROQ_API_KEY is not configured');
  }

  const client = new Groq({ apiKey });

  const completion = await client.chat.completions.create({
    model: 'llama-3.3-70b-versatile',
    messages: [
      {
        role: 'system',
        content: 'You are a document text extractor. Return only the clean extracted text from the document, no commentary.',
      },
      { role: 'user', content: `Extract all text from this document:\n\n${documentText}` },
    ],
    temperature: 0,
    max_tokens: 2000,
  });

  return completion.choices[0]?.message?.content?.trim() || '';
}
