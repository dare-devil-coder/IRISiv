import type { Metadata } from 'next';
import { Outfit, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'IRISiv — AI-Assisted Verified CSR Platform',
  description: 'AI-assisted CSR execution, verification, trust, transparency, and impact platform connecting NGOs, Corporates, and Businesses into ONE lifecycle.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-slate-950 text-slate-100 antialiased selection:bg-brand-500 selection:text-white font-sans">
        {children}
      </body>
    </html>
  );
}
