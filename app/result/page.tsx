'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import MedicalDisclaimer from '@/components/MedicalDisclaimer';

interface UnifiedAnalysisResult {
  documentType: string;
  summary: string;
  keyFindings: string[];
  importantDates: string[];
  riskLevel: 'low' | 'medium' | 'high';
  actionsRequired: string[];
}

interface StoredData {
  result: UnifiedAnalysisResult | null;
  fileName: string;
  docType: string;
  source?: 'gemini' | 'claude' | 'mock';
  model?: string;
  notice?: string;
}

export default function ResultPage() {
  const [data, setData] = useState<StoredData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const stored = sessionStorage.getItem('docsamajh_result');
    if (!stored) {
      router.push('/');
      return;
    }
    setData(JSON.parse(stored));
  }, [router]);

  if (!data) return null;

  const { result, fileName, docType, source, model, notice } = data;

  const getDocumentsMentioned = (docTypeStr: string, documentTypeTitle: string): string[] => {
    const lower = (docTypeStr + ' ' + documentTypeTitle).toLowerCase();
    if (lower.includes('court') || lower.includes('summon') || lower.includes('legal')) {
      return ['Negotiable Instruments Act (Section 138)', 'Civil Procedure Code (CPC) summons form', 'Civil Plaint Register', 'Written Statement Registry'];
    }
    if (lower.includes('presc') || lower.includes('medical') || lower.includes('lab') || lower.includes('blood') || lower.includes('radiology') || lower.includes('ultrasound') || lower.includes('discharge')) {
      return ['Medical Prescription Form', 'Doctor Consultation Slip', 'Laboratory reference range guide'];
    }
    if (lower.includes('bank') || lower.includes('loan') || lower.includes('statement')) {
      return ['Key Fact Statement (KFS)', 'Home Loan Agreement Ledger', 'SARFAESI Act 2002 Guidelines', 'CERSAI Registry Ledger'];
    }
    if (lower.includes('insur') || lower.includes('policy')) {
      return ['Policy Terms and Conditions Booklet', 'IRDAI Policy Guidelines', 'Cashless Empaneled Hospital Directory'];
    }
    if (lower.includes('yojana') || lower.includes('govt') || lower.includes('policy')) {
      return ['Aadhaar Card', 'Ration Card (NFSA)', 'PM Letter / Scheme Enrollment Guide', 'Socio-Economic Caste Census (SECC 2011) database'];
    }
    return ['General Document Guide', 'AI Analysis Reference Sheets'];
  };

  const isMedical = 
    docType === 'medical_report' || 
    docType === 'prescription' || 
    docType === 'lab_report' || 
    docType === 'radiology' || 
    docType === 'discharge_summary' ||
    (result && (
      result.documentType.toLowerCase().includes('medical') ||
      result.documentType.toLowerCase().includes('prescription') ||
      result.documentType.toLowerCase().includes('report') ||
      result.documentType.toLowerCase().includes('doctor')
    ));

  return (
    <main className="w-full min-h-screen bg-[#FAFAFA] text-gray-900 overflow-x-hidden flex flex-col">
      <Navbar />

      {/* Responsive Content Container */}
      <div className="responsive-container py-8 md:py-12 flex-grow space-y-8">
        
        {/* Document Header Panel */}
        <div className="flex flex-wrap items-center gap-3.5 mb-6">
          <Link href="/" className="text-gray-500 hover:text-gray-900 transition-colors text-sm font-bold flex items-center gap-1.5 cursor-pointer">
            &larr; Analyze Another
          </Link>
          <div className="h-4 w-px bg-gray-200" />
          <div className="flex items-center gap-1.5">
            <span className="text-gray-400 text-sm">📄</span>
            <span className="text-gray-700 text-xs md:text-sm font-bold truncate max-w-[200px]" title={fileName}>
              {fileName}
            </span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 sm:ml-auto">
            <span className="text-[10px] md:text-xs font-bold px-3 py-1 rounded-full bg-orange-50 text-[#FF5500] border border-orange-100 shadow-sm">
              {docType.replace('_', ' ').toUpperCase()}
            </span>
            {source && (
              <span className={`text-[10px] md:text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 shadow-sm ${
                source === 'gemini'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-100'
                  : 'bg-gray-100 text-gray-600 border border-gray-200'
              }`}>
                <span>
                  {source === 'gemini'
                    ? '✨ Powered by Gemini'
                    : '⚙️ Demo Mode'}
                </span>
                {model && <span className="opacity-60 text-[9px]">({model})</span>}
              </span>
            )}
          </div>
        </div>

        {/* Notice Banner */}
        {notice && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs md:text-sm flex items-start gap-3 shadow-sm">
            <span className="text-lg leading-none">⚠️</span>
            <div className="flex-1 font-semibold">
              <span className="block mb-0.5">Demo fallbacks active</span>
              <span className="text-gray-600 text-xs font-medium">{notice}</span>
            </div>
          </div>
        )}

        {/* Medical Disclaimer Banner */}
        {isMedical && (
          <div className="mb-6">
            <MedicalDisclaimer sticky />
          </div>
        )}

        {/* Standardized Responsive 6-Card Layout Grid */}
        {result ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
            
            {/* Card 1: Document Summary (col-span-2 on tablet/desktop) */}
            <div className="md:col-span-2 bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>💬</span> Document Summary
              </h3>
              <p className="text-gray-700 text-sm md:text-base leading-relaxed font-semibold">
                {result.summary}
              </p>
            </div>

            {/* Card 2: Risk & Alerts (col-span-1) */}
            <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>🚨</span> Risk Level &amp; Alerts
              </h3>
              <div className="flex flex-col items-center justify-center p-4 bg-gray-50 border border-gray-150 rounded-lg space-y-3">
                <span className="text-gray-400 font-bold uppercase text-[10px] tracking-wider">Overall Risk Assessment</span>
                <span className={`text-sm font-extrabold uppercase px-4 py-1.5 rounded-full border shadow-sm ${
                  result.riskLevel === 'high'
                    ? 'bg-red-50 border-red-200 text-red-600 animate-pulse'
                    : result.riskLevel === 'medium'
                    ? 'bg-amber-50 border-amber-200 text-amber-600'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-600'
                }`}>
                  {result.riskLevel === 'high' ? '🔴 High Risk' : result.riskLevel === 'medium' ? '🟡 Medium Risk' : '🟢 Low Risk'}
                </span>
                <p className="text-center text-xs text-gray-500 font-medium max-w-xs mt-1 leading-relaxed">
                  {result.riskLevel === 'high' 
                    ? 'This document contains critical terms, liabilities, or health indicators requiring immediate attention.'
                    : result.riskLevel === 'medium'
                    ? 'Standard risk terms detected. Review the highlighted clauses or findings carefully.'
                    : 'No significant risk factors or alarms were identified in this document.'}
                </p>
              </div>
            </div>

            {/* Card 3: Key Findings & Details (col-span-2 on tablet/desktop) */}
            <div className="md:col-span-2 bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>🔬</span> Key Findings &amp; Details
              </h3>
              {result.keyFindings && result.keyFindings.length > 0 ? (
                <ul className="space-y-3">
                  {result.keyFindings.map((finding, i) => (
                    <li key={i} className="flex items-start gap-3 text-xs md:text-sm bg-gray-50 p-3 rounded-lg border border-gray-150 font-semibold text-gray-700">
                      <span className="text-[#FF5500] mt-0.5">•</span>
                      <span>{finding}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs font-semibold">No key findings detected.</p>
              )}
            </div>

            {/* Card 4: Actions Required (col-span-1) */}
            <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>📋</span> Required Actions
              </h3>
              {result.actionsRequired && result.actionsRequired.length > 0 ? (
                <ul className="space-y-2.5 text-xs md:text-sm">
                  {result.actionsRequired.map((act, i) => (
                    <li key={i} className="flex items-start gap-2.5 leading-relaxed font-semibold text-gray-700">
                      <span className="w-5 h-5 rounded-full bg-orange-100 text-[#FF5500] flex items-center justify-center text-[10px] font-black flex-shrink-0 mt-0.5">✓</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-gray-400 text-xs font-semibold">No action required at this moment.</p>
              )}
            </div>

            {/* Card 5: Important Dates & Timelines (col-span-1) */}
            <div className="bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>📅</span> Important Dates &amp; Timelines
              </h3>
              {result.importantDates && result.importantDates.length > 0 ? (
                <div className="relative border-l border-orange-200 ml-2.5 space-y-3">
                  {result.importantDates.map((dateStr, i) => (
                    <div key={i} className="relative pl-5">
                      <div className="absolute -left-1 top-1.5 w-2 h-2 rounded-full bg-[#FF5500] border border-white" />
                      <p className="text-gray-800 text-xs md:text-sm font-bold">{dateStr}</p>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-400 text-xs font-semibold">No specified dates or timelines detected.</p>
              )}
            </div>

            {/* Card 6: Documents Mentioned (col-span-2 on tablet/desktop) */}
            <div className="md:col-span-2 bg-white border border-gray-250 rounded-xl p-5 shadow-sm space-y-4">
              <h3 className="text-gray-900 font-extrabold text-base flex items-center gap-2 border-b border-gray-100 pb-3">
                <span>📜</span> Referenced Documents &amp; Acts
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {getDocumentsMentioned(docType, result.documentType).map((docStr, i) => (
                  <div key={i} className="p-3 bg-gray-50 border border-gray-150 rounded-lg flex items-center gap-2 font-semibold text-gray-700">
                    <span className="text-[#FF5500]">📁</span>
                    <span>{docStr}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-xl p-12 text-center shadow-sm max-w-lg mx-auto">
            <div className="text-5xl mb-4">🤔</div>
            <h2 className="text-gray-900 text-xl font-bold mb-2">No Analysis Available</h2>
            <p className="text-gray-500 text-sm mb-6">Please upload or paste document text first.</p>
            <Link href="/" className="btn-primary">Go to Home</Link>
          </div>
        )}

        {/* Footer Actions */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
          <Link href="/" className="btn-primary flex-1 text-center py-3.5 font-extrabold text-sm shadow-sm">
            📄 Analyze Another Document
          </Link>
          <button
            onClick={() => window.print()}
            className="btn-secondary flex-1 py-3.5 font-extrabold text-sm cursor-pointer"
          >
            🖨️ Print / Save Report
          </button>
        </div>

        {/* Bottom disclaimer */}
        {isMedical && (
          <div className="mt-6">
            <MedicalDisclaimer />
          </div>
        )}

      </div>
    </main>
  );
}
