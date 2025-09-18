import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: '習い事Prime - 親子の学びを応援するプラットフォーム',
  description: '習い事の検索から予約まで。親子で一緒に成長できる最高の習い事を見つけよう。',
  keywords: '習い事, 子ども, 親子, 学習, スクール, レッスン, 予約',
  openGraph: {
    title: '習い事Prime',
    description: '親子の学びを応援するプラットフォーム',
    type: 'website',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}


