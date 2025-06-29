import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toast';
import { TooltipProvider } from '@/components/ui/tooltip'

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'StackNote - 협업 문서 플랫폼',
  description: '팀과 함께 만드는 지식 베이스',
  keywords: ['노션', '협업', '문서', '노트', '워크스페이스'],
  authors: [{ name: 'StackNote Team' }],
  creator: 'StackNote',
  publisher: 'StackNote',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
  ),
  openGraph: {
    title: 'StackNote - 협업 문서 플랫폼',
    description: '팀과 함께 만드는 지식 베이스',
    url: '/',
    siteName: 'StackNote',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'StackNote - 협업 문서 플랫폼',
    description: '팀과 함께 만드는 지식 베이스',
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
    google: process.env.GOOGLE_SITE_VERIFICATION,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='ko' suppressHydrationWarning>
      <head>
        <link rel='icon' href='/favicon.ico' />
        <link
          rel='apple-touch-icon'
          sizes='180x180'
          href='/apple-touch-icon.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='32x32'
          href='/favicon-32x32.png'
        />
        <link
          rel='icon'
          type='image/png'
          sizes='16x16'
          href='/favicon-16x16.png'
        />
        <link rel='manifest' href='/site.webmanifest' />
        <meta name='theme-color' content='#ffffff' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
      </head>
      <body
        className={`${inter.className} bg-background min-h-screen font-sans antialiased`}
      >
        <TooltipProvider>
          <div className='relative flex min-h-screen flex-col'>
            <div className='flex-1'>{children}</div>
          </div>
          <Toaster />
        </TooltipProvider>
      </body>
    </html>
  );
}
