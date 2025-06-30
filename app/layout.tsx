import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { SessionProvider } from '@/components/auth/session-provider';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { Toaster } from '@/components/ui/toaster';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'TrendWise - AI-Powered Blog Platform',
  description: 'Discover trending topics and AI-generated insights on technology, business, and innovation.',
  keywords: ['blog', 'trends', 'AI', 'technology', 'insights', 'articles'],
  authors: [{ name: 'TrendWise Team' }],
  creator: 'TrendWise',
  publisher: 'TrendWise',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://trendwise.com',
    siteName: 'TrendWise',
    title: 'TrendWise - AI-Powered Blog Platform',
    description: 'Discover trending topics and AI-generated insights on technology, business, and innovation.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'TrendWise - AI-Powered Blog Platform',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrendWise - AI-Powered Blog Platform',
    description: 'Discover trending topics and AI-generated insights on technology, business, and innovation.',
    images: ['/og-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem
            disableTransitionOnChange
          >
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}