// app/layout.tsx v3.5.0
import type {Metadata, Viewport} from 'next';
import './globals.css'; // Global styles
import { ThemeProvider } from "@/app/components/theme-provider"
import { Geist } from "next/font/google";
import { cn } from "@/app/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

// SEO/GEO: 站点基础 URL，部署时通过 NEXT_PUBLIC_SITE_URL 环境变量覆盖
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://sutchan.github.io';
const SITE_NAME = 'Random Destination Wheel | 随机目的地大转盘';
const SITE_DESCRIPTION = 'A customizable spinning wheel to pick a random travel destination with AI-powered insights, history, and favorites. Supports hierarchical spinning across China (Province > City > County). 一个可自定义的随机目的地转盘，集成 AI 旅行建议、历史记录与收藏，支持省市区三级联动抽签。';
const SITE_OG_IMAGE = '/screenshot-1080x1920.svg';

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#09090b' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  colorScheme: 'light dark',
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Random Destination Wheel | 随机目的地大转盘 - AI 旅行抽签',
    template: '%s | 随机目的地大转盘',
  },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  generator: 'Next.js',
  referrer: 'origin-when-cross-origin',
  keywords: [
    // English
    'travel', 'destination', 'wheel', 'random', 'AI', 'travel guide', 'budget travel',
    'spinning wheel', 'decision wheel', 'random picker', 'travel planner',
    'China travel', 'province city county', 'travel inspiration',
    // 中文
    '旅游', '目的地', '转盘', '随机', '人工智能', '旅行指南', '预算旅行',
    '抽签', '随机选择', '决策转盘', '旅行规划', '中国旅游', '省市县', '旅行灵感',
    '随机目的地', '大转盘', '旅行推荐',
  ],
  authors: [{ name: 'Sut', url: SITE_URL }],
  creator: 'Sut',
  publisher: 'Sut',
  category: 'travel',
  classification: 'Travel & Tourism Software',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Dest. Wheel',
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: '/',
    languages: {
      'zh-CN': '/',
      'en': '/',
      'x-default': '/',
    },
  },
  openGraph: {
    title: 'Random Destination Wheel | 随机目的地大转盘',
    description: 'Pick your next travel destination with a spin! AI-powered insights, favorites, and hierarchical spinning across China. 用转盘随机抽取下一个旅行目的地，AI 提供旅行建议。',
    url: SITE_URL,
    siteName: SITE_NAME,
    type: 'website',
    locale: 'zh_CN',
    alternateLocale: ['en_US'],
    images: [
      {
        url: SITE_OG_IMAGE,
        width: 1080,
        height: 1920,
        alt: 'Random Destination Wheel screenshot',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Random Destination Wheel | 随机目的地大转盘',
    description: 'Pick your next travel destination with a spin! AI-powered insights and hierarchical spinning across China.',
    images: [SITE_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      'max-snippet': -1,
      'max-image-preview': 'large',
      'max-video-preview': -1,
    },
  },
  icons: {
    icon: [
      { url: '/favicon.svg', type: 'image/svg+xml' },
      { url: '/icon-192x192.svg', type: 'image/svg+xml', sizes: '192x192' },
      { url: '/icon-512x512.svg', type: 'image/svg+xml', sizes: '512x512' },
    ],
    apple: [
      { url: '/icon-192x192.svg', sizes: '192x192' },
    ],
    shortcut: '/favicon.svg',
  },
  other: {
    // GEO meta tags: 中国地理中心坐标 (约经度 104°, 纬度 35°)
    'geo.region': 'CN',
    'geo.placename': 'China, 中国',
    'geo.position': '35.86166;104.195397',
    'ICBM': '35.86166, 104.195397',
    // 语言与受众
    'language': 'zh-CN, en',
    'coverage': 'Worldwide',
    'distribution': 'global',
    'rating': 'general',
    'revisit-after': '7 days',
  },
};

// JSON-LD 结构化数据：WebApplication + Organization + Place（强化 GEO）
const jsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'WebApplication',
      '@id': `${SITE_URL}/#webapp`,
      name: 'Random Destination Wheel',
      alternateName: '随机目的地大转盘',
      description: SITE_DESCRIPTION,
      url: SITE_URL,
      applicationCategory: 'TravelApplication',
      operatingSystem: 'Any (Web Browser)',
      browserRequirements: 'Requires JavaScript',
      inLanguage: ['zh-CN', 'en'],
      author: { '@id': `${SITE_URL}/#author` },
      publisher: { '@id': `${SITE_URL}/#author` },
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'CNY',
        availability: 'https://schema.org/InStock',
      },
      featureList: [
        'Hierarchical spinning across China (Province > City > County)',
        'AI-powered destination insights via Gemini',
        'Custom destination lists',
        'Favorites and spin history',
        'Dark mode and responsive design',
        'PWA offline support',
      ],
      // GEO: 服务覆盖区域
      areaServed: {
        '@type': 'Country',
        name: 'China',
        alternateName: '中国',
      },
      spatialCoverage: {
        '@type': 'Place',
        geo: {
          '@type': 'GeoCoordinates',
          latitude: 35.86166,
          longitude: 104.195397,
        },
        name: 'China, 中国',
      },
    },
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#author`,
      name: 'Sut',
      url: SITE_URL,
      logo: {
        '@type': 'ImageObject',
        url: `${SITE_URL}/icon-512x512.svg`,
      },
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      url: SITE_URL,
      name: SITE_NAME,
      inLanguage: ['zh-CN', 'en'],
      publisher: { '@id': `${SITE_URL}/#author` },
      potentialAction: {
        '@type': 'SearchAction',
        target: `${SITE_URL}/?q={search_term_string}`,
        'query-input': 'required name=search_term_string',
      },
    },
  ],
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
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
