import { NextRequest, NextResponse } from 'next/server';
import { analyzeWithGroq } from '@/lib/groq';
import jwt from 'jsonwebtoken';
import { findUserByEmail, incrementDocsUsed } from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback_jwt_secret_key_12345';

const categoryPrompts: Record<string, string> = {
  auto: `Detect the document type automatically. Then explain the entire document in simple, everyday language that a 15-year-old student can fully understand — no jargon allowed without a plain explanation.`,

  court_notice: `This is a legal/court document. Explain it like you are telling a friend who has NEVER been to court. 
  - Translate every legal term into plain words (e.g. "summons" = "a paper telling you to show up in court", "ex-parte" = "court decides without hearing your side").
  - Extract: who sent it, why, what happens if ignored, key dates, and exactly what the person must do next.
  - Make the danger/consequence crystal clear in simple words.`,

  bank_insurance: `This is a banking or insurance document. Explain it like talking to someone who just got their first bank account.
  - Translate every financial term (e.g. "EMI" = "the fixed amount you pay every month", "NPA" = "bank has marked your loan as a bad loan", "floating rate" = "interest rate that can go up or down").
  - Extract: exact amounts, hidden charges, what could go wrong, important dates, and what the person must do.`,

  medical_report: `This is a medical report, prescription, or health document. Explain it like a caring elder sibling talking to a younger one.
  - Translate EVERY medical term into simple body language (e.g. "haemorrhagic material" = "blood or blood clots found", "acanthosis" = "thickening/darkening of skin cells", "squamous epithelium" = "the flat skin-like cells that line body surfaces").
  - Explain what each finding means for the patient's health in everyday words.
  - Explain what each medicine does in simple words (e.g. "antibiotic = medicine that kills bacteria/infection").
  - What is normal vs abnormal? What does the patient need to do or watch out for?`,

  salary_offer: `This is a salary slip, offer letter, or HR document. Explain it like talking to a fresh graduate getting their first job.
  - Translate HR/finance terms (e.g. "CTC" = "total package the company pays for you per year", "variable component" = "extra pay you may or may not get based on performance", "notice period" = "how many days you must work before leaving").
  - Extract: actual take-home pay, hidden obligations, risks, and what the person should check before signing.`,

  govt_letter: `This is a government letter, scheme, or policy document. Explain it like telling a village elder in simple Hinglish.
  - Translate all government/bureaucratic terms into plain words.
  - Extract: what this scheme/letter gives, who is eligible, what the person must do to get the benefit, key deadlines, and which office/portal to visit.`,
};


const mockResponses: Record<string, any> = {
  court_notice: {
    docType: "Cheque Bounce Notice Under Section 138",
    oneLiner: "A legal warning from Supreme Finance Corp for an unpaid cheque of ₹1,24,500 due to insufficient funds.",
    sections: [
      { label: "Case Details", content: "You issued a cheque bearing number 482012 dated 10th April 2026 for a sum of ₹1,24,500 drawn towards loan repayment, which bounced." },
      { label: "Prosecution Risk", content: "Under Indian law (Section 138 of the Negotiable Instruments Act), bouncing a cheque is a criminal offence. Failing to comply can lead to arrest warrants, jail up to 2 years, or double the fine." }
    ],
    actions: [
      "Pay the outstanding amount of ₹1,24,500 within 15 days.",
      "Reply to this notice through a lawyer to defend yourself."
    ],
    riskLevel: "high"
  },
  bank_insurance: {
    docType: "Home Loan Agreement (Apna Bank)",
    oneLiner: "A loan of ₹45,00,000 at 8.75% floating interest rate for 20 years.",
    sections: [
      { label: "Key Obligations", content: "EMI is ₹39,843/month for 240 months. Floating rate is linked to RBI repo rate, meaning EMIs can go up." },
      { label: "Hidden Charges", content: "Late penalty is 2% per month on overdue EMI. ECS bounce charge is ₹750 per bounce." }
    ],
    actions: [
      "Set up ECS auto-debit payments to avoid late fees.",
      "Maintain sufficient balance in your account 2 days before the due date."
    ],
    riskLevel: "medium"
  },
  medical_report: {
    docType: "Medical Prescription (Dr. Sharma)",
    oneLiner: "Prescription for a bacterial throat infection with antibiotic and supportive medicines.",
    sections: [
      { label: "Medicines Prescribed", content: "Tab. Azithral 500mg (OD x 3 days) - Antibiotic. Cap. Pan-D (OD before breakfast x 5 days) - Anti-acidity. Tab. Paracetamol 650mg (TDS as needed) - Fever/Pain." },
      { label: "Instructions", content: "Drink plenty of warm water. Avoid cold drinks. Complete the full 3-day antibiotic course even if you feel better." }
    ],
    actions: [
      "Complete the 3-day course of Tab. Azithral 500mg.",
      "Take Cap. Pan-D on an empty stomach in the morning."
    ],
    riskLevel: "low"
  },
  salary_offer: {
    docType: "Job Offer Letter (Tech Solutions)",
    oneLiner: "Employment offer for Software Engineer with ₹8,00,000 CTC and a 6-month probation.",
    sections: [
      { label: "Salary Details", content: "Fixed base salary is ₹6,50,000, variable component ₹1,50,000. Provident fund and health insurance are included." },
      { label: "Probation & Termination", content: "Probation period is 6 months. Termination notice period is 1 month during probation, and 3 months after confirmation." }
    ],
    actions: [
      "Confirm if variable salary depends on individual or company performance.",
      "Check non-compete clause restrictions before signing."
    ],
    riskLevel: "medium"
  },
  govt_letter: {
    docType: "Ayushman Bharat PM-JAY Guidelines",
    oneLiner: "Government scheme providing free annual health cover up to ₹5,00,000 for eligible families.",
    sections: [
      { label: "Benefits", content: "Cashless secondary and tertiary hospitalization cover. All pre-existing diseases covered from day 1." },
      { label: "Eligibility", content: "Low-income households listed under SECC-2011 database or holding RSBY cards." }
    ],
    actions: [
      "Check your eligibility on the PM-JAY portal using your Aadhaar or Ration card.",
      "Visit the nearest empaneled hospital to get your golden e-card generated."
    ],
    riskLevel: "low"
  },
  auto: {
    docType: "General Document Analysis",
    oneLiner: "Generic document content processed by DocSamajh AI.",
    sections: [
      { label: "Main Points", content: "No specific category was matched. The text has been analyzed for basic terms and conditions." }
    ],
    actions: [
      "Review the terms and conditions carefully.",
      "Consult a professional if the document involves legal or financial obligations."
    ],
    riskLevel: "low"
  }
};

function getMockResponse(category: string, text: string): any {
  if (category !== 'auto') {
    return mockResponses[category] || mockResponses.auto;
  }
  const lower = text.toLowerCase();
  if (lower.includes('versus') || lower.includes('section 138') || lower.includes('court') || lower.includes('summons')) {
    return mockResponses.court_notice;
  }
  if (lower.includes('loan') || lower.includes('bank') || lower.includes('emi')) {
    return mockResponses.bank_insurance;
  }
  if (lower.includes('prescription') || lower.includes('rx') || lower.includes('tab.') || lower.includes('blood')) {
    return mockResponses.medical_report;
  }
  if (lower.includes('salary') || lower.includes('offer') || lower.includes('probation')) {
    return mockResponses.salary_offer;
  }
  if (lower.includes('yojana') || lower.includes('pm-jay') || lower.includes('guidelines')) {
    return mockResponses.govt_letter;
  }
  return mockResponses.auto;
}

export async function POST(req: NextRequest) {
  try {
    const { text, category, language } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No document text provided' }, { status: 400 });
    }

    // ── Authentication & Credit Limits ──
    const authHeader = req.headers.get('Authorization');
    let userEmail: string | null = null;
    let userPlan: 'free' | 'pro' | 'max' = 'free';
    let userDocsUsed = 0;
    let userBonusDocs = 0;

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      try {
        const decoded = jwt.verify(token, JWT_SECRET) as { email: string };
        const user = await findUserByEmail(decoded.email);
        if (user) {
          userEmail = user.email;
          userPlan = user.plan;
          userDocsUsed = user.docsUsed;
          userBonusDocs = user.bonusDocs;

          // Enforce 3-doc limit for free users
          if (userPlan === 'free') {
            const totalAllowed = 3 + userBonusDocs;
            if (userDocsUsed >= totalAllowed) {
              return NextResponse.json(
                {
                  error: 'Credit Limit Reached',
                  docsUsed: userDocsUsed,
                  bonusDocs: userBonusDocs,
                  limitHit: true,
                },
                { status: 403 }
              );
            }
          }
        }
      } catch (err) {
        console.error('Invalid token in request:', err);
      }
    }

    const selectedCategory = category || 'auto';
    const selectedLanguage = language || 'both';

    let systemPrompt = categoryPrompts[selectedCategory] || categoryPrompts.auto;

    if (selectedLanguage === 'hindi') {
      systemPrompt += `
LANGUAGE: Respond completely in simple, everyday Hindi using Devanagari script (हिंदी).
- Use conversational Hindi that anyone in a village or small town can understand — NOT formal or Sanskrit-heavy Hindi.
- BAD: "रक्तस्रावी सामग्री दृष्टिगोचर हुई" — TOO FORMAL
- GOOD: "खून के धब्बे या थक्के मिले" — SIMPLE
- Every medical/legal/banking term must be explained in simple Hindi words right after.
- Write like you are explaining to your dadi/nani or a younger sibling in Hindi.
- Use short sentences. Keep it warm, clear, and caring in tone.`;

    } else if (selectedLanguage === 'english') {
      systemPrompt += `
LANGUAGE: Respond completely in simple, plain English.
- Use everyday English that a 15-year-old student in India can easily read and understand.
- Absolutely NO complex medical, legal, or financial jargon without a plain explanation.
- BAD: "The specimen exhibited acanthosis with haemorrhagic infiltrates" — TOO COMPLEX
- GOOD: "The sample showed thickened skin cells and signs of bleeding inside" — SIMPLE
- Use short sentences. If a hard word is needed, explain it in brackets right after.
- Write like a friendly, knowledgeable older sibling explaining to a younger one.`;

    } else {
      systemPrompt += `
LANGUAGE: Respond in Hinglish — a natural mix of simple Hindi and simple English, written in Roman script (Latin letters, not Devanagari).
- Use the way people actually talk in Indian cities — mixing both languages naturally.
- Keep BOTH the Hindi and English parts simple and easy to understand.
- BAD: "Specimen non-representative tha, isliye repeat sampling ki salah di gayi hai" — JARGON IN BOTH
- GOOD: "Jo sample liya gaya tha woh sahi jagah se nahi tha — matlab result accurate nahi ho sakta. Doctor ko dobara test karne bolna chahiye." — SIMPLE
- Every hard medical/legal/banking word must be explained simply, whether in Hindi or English.
- Tone: warm, friendly, like a helpful dost explaining to you over chai.`;
    }


    const hasGroqKey =
      process.env.GROQ_API_KEY &&
      process.env.GROQ_API_KEY !== 'your_groq_api_key_here' &&
      process.env.GROQ_API_KEY.length > 10;

    if (hasGroqKey) {
      try {
        const groqData = await analyzeWithGroq(systemPrompt, text, selectedCategory);
        if (userEmail) {
          await incrementDocsUsed(userEmail);
        }
        return NextResponse.json({
          source: 'groq',
          model: 'llama-3.3-70b-versatile',
          result: groqData,
        });
      } catch (groqError: any) {
        console.error('Groq API error, falling back to mock:', groqError);
        const errMsg = groqError?.message || '';
        const isQuota = groqError?.status === 429;

        const fallbackNotice = isQuota
          ? 'Groq API rate limit reached. Showing demo results. Please try again in a minute.'
          : `Groq API error (${errMsg.substring(0, 120)}) — showing demo results.`;

        if (userEmail) {
          await incrementDocsUsed(userEmail);
        }
        return NextResponse.json({
          source: 'mock',
          model: 'DocSamajh Demo Engine',
          result: getMockResponse(selectedCategory, text),
          notice: fallbackNotice,
          isError: true,
          errorType: isQuota ? 'rate_limit' : 'api_error'
        });
      }
    }

    // ── Mock AI fallback path ─────────────────────────────────────────────
    const unifiedResult = getMockResponse(selectedCategory, text);
    if (userEmail) {
      await incrementDocsUsed(userEmail);
    }

    return NextResponse.json({
      source: 'mock',
      model: 'DocSamajh Demo Engine',
      result: unifiedResult,
      notice: 'Add GROQ_API_KEY to .env.local for real AI analysis. Get a free key at console.groq.com',
    });
  } catch (error) {
    console.error('Analyze API error:', error);
    return NextResponse.json(
      { error: 'Analysis failed. Please try again.' },
      { status: 500 }
    );
  }
}
