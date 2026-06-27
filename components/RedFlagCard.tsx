import { RedFlag } from '@/lib/types';

export default function RedFlagCard({ flag }: { flag: RedFlag }) {
  return (
    <div className={flag.severity === 'danger' ? 'red-flag-danger' : 'red-flag-warning'}>
      <div className="flex gap-3 items-start">
        <span className="text-xl flex-shrink-0">{flag.icon}</span>
        <div>
          <p className={`font-bold text-sm mb-1 ${
            flag.severity === 'danger' ? 'text-red-800' : 'text-amber-800'
          }`}>
            {flag.title}
          </p>
          <p className={`text-sm leading-relaxed ${
            flag.severity === 'danger' ? 'text-red-950' : 'text-amber-950'
          }`}>{flag.description}</p>
        </div>
      </div>
    </div>
  );
}
