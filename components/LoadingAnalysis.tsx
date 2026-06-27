'use client';
import { useEffect, useState } from 'react';

const steps = [
  { icon: '📄', text: 'Reading document...', detail: 'Extracting text and structure' },
  { icon: '🔍', text: 'Running OCR...', detail: 'Recognizing handwriting and printed text' },
  { icon: '🧠', text: 'Classifying document...', detail: 'Identifying document type and module' },
  { icon: '⚕️', text: 'Analyzing content...', detail: 'Extracting key information and values' },
  { icon: '🚨', text: 'Checking red flags...', detail: 'Scanning for critical alerts' },
  { icon: '✅', text: 'Generating explanation...', detail: 'Translating to plain language' },
];

export default function LoadingAnalysis() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep((prev) => {
        const next = prev + 1;
        if (next >= steps.length) {
          clearInterval(interval);
          return prev;
        }
        return next;
      });
    }, 700);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = ((currentStep + 1) / steps.length) * 100;
    const timer = setTimeout(() => setProgress(target), 100);
    return () => clearTimeout(timer);
  }, [currentStep]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-8 bg-[#FAFAFA]">
      {/* Animated orbs */}
      <div className="relative w-40 h-40 mb-8">
        <div className="absolute inset-0 rounded-full animate-spin-slow" style={{ background: 'conic-gradient(from 0deg, #FF5500, #FFAA00, #FFCC00, #FF5500)', padding: '2.5px' }}>
          <div className="w-full h-full rounded-full bg-white" />
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-5xl">{steps[currentStep]?.icon}</span>
        </div>
        <div className="absolute -inset-4 rounded-full opacity-10 animate-pulse" style={{ background: 'radial-gradient(circle, #FF5500, transparent)' }} />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">{steps[currentStep]?.text}</h2>
      <p className="text-gray-500 text-sm mb-8">{steps[currentStep]?.detail}</p>

      {/* Progress bar */}
      <div className="w-full max-w-md">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden mb-3">
          <div
            className="h-full loading-bar rounded-full transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-400 font-bold">
          <span>Processing...</span>
          <span>{Math.round(progress)}%</span>
        </div>
      </div>

      {/* Steps */}
      <div className="mt-8 grid grid-cols-3 gap-3 w-full max-w-md">
        {steps.map((step, i) => (
          <div
            key={i}
            className={`flex flex-col items-center gap-1.5 p-2.5 rounded-lg transition-all duration-300 ${
              i <= currentStep
                ? 'opacity-100 bg-white shadow-sm border border-gray-150'
                : 'opacity-30'
            }`}
          >
            <span className={`text-base transition-all ${
              i < currentStep ? 'text-[#FF5500]' : i === currentStep ? 'text-gray-900 scale-110 font-bold' : 'text-gray-400'
            }`}>{step.icon}</span>
            <span className="text-[10px] text-gray-500 text-center font-bold leading-tight">{step.text.replace('...', '')}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
