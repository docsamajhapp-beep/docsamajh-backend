import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';

// ─── PDF TEXT EXTRACTION ────────────────────────────────────────────────────
async function extractFromPdf(base64Data: string): Promise<string> {
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const pdfParse = require('pdf-parse');
    const buffer = Buffer.from(base64Data, 'base64');
    const result = await pdfParse(buffer);
    const text = result.text?.trim();
    if (text && text.length > 20) {
      return text;
    }
    return 'NO_TEXT_FOUND';
  } catch (err) {
    console.error('PDF parse error:', err);
    return 'NO_TEXT_FOUND';
  }
}

// ─── IMAGE / SCANNED-PDF OCR VIA GROQ VISION ────────────────────────────────
async function extractFromImageWithGroq(base64Data: string, mimeType: string): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey || apiKey.length < 10) {
    return 'NO_TEXT_FOUND';
  }

  // Groq Vision only accepts image mimetypes — if PDF, tell it to treat as image
  const groqMime = mimeType === 'application/pdf' ? 'image/jpeg' : mimeType;

  try {
    const client = new Groq({ apiKey });

    const response = await client.chat.completions.create({
      model: 'meta-llama/llama-4-scout-17b-16e-instruct',
      messages: [
        {
          role: 'user',
          content: [
            {
              type: 'image_url',
              image_url: {
                url: `data:${groqMime};base64,${base64Data}`,
              },
            },
            {
              type: 'text',
              text: 'Extract ALL readable text from this document image. Output only the extracted plain text exactly as it appears — preserve all names, numbers, dates, amounts, section headings, and medical/legal/financial terms precisely. Do not summarize, do not add commentary. If no readable text is found, output exactly: NO_TEXT_FOUND',
            },
          ],
        },
      ],
      temperature: 0,
      max_tokens: 4000,
    });

    const extracted = response.choices[0]?.message?.content?.trim() || '';
    if (extracted === 'NO_TEXT_FOUND' || extracted.length < 10) return 'NO_TEXT_FOUND';
    return extracted;
  } catch (err: any) {
    console.error('[OCR] Groq Vision error:', err?.message || err);
    return 'NO_TEXT_FOUND';
  }
}


// ─── ROUTE HANDLER ───────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { fileBase64, mimeType, fileName } = await req.json();

    if (!fileBase64) {
      return NextResponse.json({ error: 'No file content provided' }, { status: 400 });
    }

    let extractedText = 'NO_TEXT_FOUND';
    let method = '';

    // ── Strategy 1: PDF → try pdf-parse first (works for text-based PDFs) ────
    if (mimeType === 'application/pdf') {
      console.log(`[OCR] PDF detected: "${fileName}" — trying pdf-parse first`);
      extractedText = await extractFromPdf(fileBase64);

      // If pdf-parse got no text → it's a scanned PDF (image inside PDF)
      // Fall back to Groq Vision which can read images
      if (extractedText === 'NO_TEXT_FOUND') {
        console.log(`[OCR] "${fileName}" is a scanned PDF — falling back to Groq Vision`);
        method = 'groq-vision-pdf';
        // Send as PDF data URL to Groq Vision (llama-4-scout supports PDF as image)
        extractedText = await extractFromImageWithGroq(fileBase64, 'image/jpeg');

        // If that also fails, try sending as PDF mime type directly
        if (extractedText === 'NO_TEXT_FOUND') {
          console.log(`[OCR] Trying Groq Vision with application/pdf mime type`);
          extractedText = await extractFromImageWithGroq(fileBase64, 'application/pdf');
        }
      } else {
        method = 'pdf-parse';
      }
    }

    // ── Strategy 2: Image → use Groq Vision (llama-4-scout) ──────────────────
    else if (mimeType.startsWith('image/')) {
      console.log(`[OCR] Image detected: "${fileName}" — using Groq Vision`);
      method = 'groq-vision-image';
      extractedText = await extractFromImageWithGroq(fileBase64, mimeType);
    }

    // ── Strategy 3: Unknown file type ─────────────────────────────────────────
    else {
      console.warn(`[OCR] Unsupported file type: ${mimeType}`);
      return NextResponse.json(
        { error: 'Unsupported file type. Please upload a PDF or image (JPG/PNG/WEBP).' },
        { status: 400 }
      );
    }

    if (extractedText === 'NO_TEXT_FOUND' || extractedText.length < 20) {
      console.warn(`[OCR] All methods failed for "${fileName}"`);
      return NextResponse.json({
        text: '',
        warning: 'Is PDF mein text directly nahi mila (shayad yeh scan kiya hua hai). Please document ki photo (JPG/PNG) upload karein ya text manually paste karein.',
      });
    }

    console.log(`[OCR] ✅ Success via ${method}: extracted ${extractedText.length} chars from "${fileName}"`);
    return NextResponse.json({ text: extractedText });

  } catch (error: any) {
    console.error('OCR API error:', error);
    return NextResponse.json(
      { error: 'OCR failed. Please try pasting the text manually.' },
      { status: 500 }
    );
  }
}

