'use client';

interface MedicalDisclaimerProps {
  compact?: boolean;
  sticky?: boolean;
}

export default function MedicalDisclaimer({ compact = false, sticky = false }: MedicalDisclaimerProps) {
  return (
    <div
      className={`medical-disclaimer ${
        sticky ? 'disclaimer-sticky shadow-sm bg-amber-50/95 border-b border-amber-100' : ''
      } ${compact ? 'py-3 px-4' : 'py-4 px-5'}`}
      role="alert"
      aria-label="Medical Disclaimer"
    >
      <div className="flex gap-3 items-start">
        <span className="text-2xl flex-shrink-0" aria-hidden="true">⚕️</span>
        <div>
          {!compact && (
            <p className="font-bold text-amber-800 text-sm uppercase tracking-wider mb-1">
              ⚠️ Medical Disclaimer
            </p>
          )}
          <p className="text-amber-950 text-xs md:text-sm leading-relaxed font-medium">
            <span className="font-bold">DocSamajh is an AI-powered document reader, NOT a medical professional.</span>{' '}
            This analysis is for informational purposes only and does <span className="font-bold">NOT</span> constitute
            medical advice, diagnosis, or treatment. Always consult a qualified doctor before making any health decisions.
          </p>
          {!compact && (
            <p className="text-red-700 text-xs mt-1.5 font-bold">
              🚨 In case of emergency, call <span className="font-extrabold">112</span> or visit the nearest hospital immediately.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
