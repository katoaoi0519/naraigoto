import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: {
    default: '習い事Prime - 親子で選ぶ新しい習い事プラットフォーム',
    template: '%s | 習い事Prime',
  },
  description: '月額定額チケット制で、子どもの「やってみたい！」を最大限に引き出す。保護者と子どもの"ダブル口コミ"で、本当に合う教室がきっと見つかる。',
  keywords: [
    '習い事',
    '子ども',
    '親子',
    '学習',
    'スクール',
    'レッスン',
    '予約',
    'チケット制',
    '口コミ',
    '体験',
    'プログラミング',
    'スポーツ',
    '音楽',
    'アート',
    'ダンス',
  ],
  authors: [{ name: 'グループ15' }],
  creator: 'グループ15',
  publisher: '習い事Prime',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://naraigotoprime.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'ja_JP',
    url: 'https://naraigotoprime.com',
    title: '習い事Prime - 親子で選ぶ新しい習い事プラットフォーム',
    description: '月額定額チケット制で、子どもの「やってみたい！」を最大限に引き出す。保護者と子どもの"ダブル口コミ"で、本当に合う教室がきっと見つかる。',
    siteName: '習い事Prime',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: '習い事Prime - 親子で選ぶ新しい習い事プラットフォーム',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: '習い事Prime - 親子で選ぶ新しい習い事プラットフォーム',
    description: '月額定額チケット制で、子どもの「やってみたい！」を最大限に引き出す。',
    images: ['/og-image.jpg'],
    creator: '@naraigotoprime',
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
    <html lang="ja" className="h-full">
      <body className="h-full flex flex-col antialiased">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}