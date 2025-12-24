import type { Metadata } from 'next';
import { Geist } from 'next/font/google';
import { QueryProvider } from '@/lib/query-client';
import './globals.css';

const geist = Geist({
  subsets: ['latin'],
  variable: '--font-geist',
});

export const metadata: Metadata = {
  title: 'NestJS Zod Prisma Demo',
  description: 'Full-stack TypeScript application with auto-generated API client',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} antialiased`}>
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}

