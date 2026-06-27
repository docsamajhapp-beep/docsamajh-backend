import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'DocSamajh — India\'s AI Document Doctor',
  description: 'Upload medical prescriptions, lab reports, bank statements, insurance policies, or investment documents. DocSamajh translates complex documents into plain language instantly.',
  keywords: 'medical report analysis, prescription reader, lab report explain, insurance policy analysis, bank statement analysis, AI document reader India',
  openGraph: {
    title: 'DocSamajh — India\'s AI Document Doctor',
    description: 'Mujhe seedha batao, iska matlab kya hai aur mujhe kya karna chahiye?',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
