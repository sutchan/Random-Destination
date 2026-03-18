// app/layout.tsx v3.4.0
import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { ThemeProvider } from "@/components/theme-provider"
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: 'Random Destination Wheel v3.4.0 | 随机目的地大转盘',
  description: 'A customizable spinning wheel to pick a random travel destination with AI-powered insights, history, and favorites. Supports hierarchical spinning (Province > City > County).',
  keywords: ['travel', 'destination', 'wheel', 'random', 'AI', 'travel guide', 'budget', '旅游', '目的地', '转盘', '随机', '人工智能'],
  authors: [{ name: 'Sut' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dest. Wheel',
  },
  openGraph: {
    title: 'Random Destination Wheel',
    description: 'Pick your next travel destination with a spin!',
    type: 'website',
    locale: 'zh_CN',
  },
  other: {
    'geo.region': 'CN',
    'geo.placename': 'China',
    'geo.position': '35.86166;104.195397',
    'ICBM': '35.86166, 104.195397',
  }
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning className={cn("font-sans", geist.variable)}>
      <body suppressHydrationWarning id="root-body">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
