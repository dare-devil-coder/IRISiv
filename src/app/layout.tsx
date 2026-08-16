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
    <html lang="en" className={`${outfit.variable} ${jetbrainsMono.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
