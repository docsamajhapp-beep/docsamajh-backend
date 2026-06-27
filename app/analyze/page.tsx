'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AnalyzePage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/');
  }, [router]);

  return (
    <div className="min-h-screen bg-[#FAFAFA] flex items-center justify-center">
      <div className="animate-pulse font-bold text-gray-500">Redirecting to home...</div>
    </div>
  );
}