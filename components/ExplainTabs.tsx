'use client';
import { useState } from 'react';

interface ExplainTabsProps {
  technical: string;
  plain: string;
  eli15: string;
}

export default function ExplainTabs({ technical, plain, eli15 }: ExplainTabsProps) {
  const [active, setActive] = useState<'technical' | 'plain' | 'eli15'>('plain');

  const tabs = [
    { key: 'technical' as const, label: '🔬 Technical' },
    { key: 'plain' as const, label: '💬 Plain English' },
    { key: 'eli15' as const, label: "⭐ Like I'm 15" },
  ];

  const content = { technical, plain, eli15 };

  return (
    <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
      <div className="border-b border-gray-150 flex bg-gray-50 p-1 gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActive(tab.key)}
            className={`flex-1 py-2 px-3 text-xs md:text-sm font-bold rounded-lg transition-all cursor-pointer ${
              active === tab.key
                ? 'bg-[#FF5500] text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="p-5">
        <p className="text-gray-700 leading-relaxed text-sm md:text-base font-medium whitespace-pre-line animate-fadeIn">
          {content[active]}
        </p>
      </div>
    </div>
  );
}
