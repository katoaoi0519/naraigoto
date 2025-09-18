'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  CalendarDaysIcon,
  HeartIcon,
  TicketIcon,
  ChatBubbleLeftRightIcon,
  StarIcon,
  ArrowRightIcon,
  CheckIcon,
  UsersIcon,
  AcademicCapIcon,
  TrophyIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import SearchForm, { SearchFormValues } from '@/components/SearchForm';
import { cn } from '@/lib/utils';

// サンプルデータ
const sampleSearchResults = [
  {
    id: '1',
    name: 'ピアノスクール ハーモニー',
    area: '大阪市中央区',
    category: '音楽',
    rating: 4.8,
    reviewCount: 127,
    image: '/images/piano-school.jpg',
    price: '月額3,500円〜',
    tags: ['初心者歓迎', '個人レッスン', '発表会あり'],
  },
  {
    id: '2',
    name: 'キッズサッカークラブ FC大阪',
    area: '大阪市北区',
    category: 'スポーツ',
    rating: 4.6,
    reviewCount: 89,
    image: '/images/soccer-club.jpg',
    price: '月額4,000円〜',
    tags: ['チームプレイ', '体力向上', 'コーチ経験豊富'],
  },
  {
    id: '3',
    name: 'プログラミング道場 梅田校',
    area: '大阪市北区',
    category: 'プログラミング',
    rating: 4.9,
    reviewCount: 156,
    image: '/images/programming-school.jpg',
    price: '月額5,500円〜',
    tags: ['Scratch', 'Python', '作品制作'],
  },
];

const features = [
  {
    icon: TicketIcon,
    title: '月額チケット制',
    description: '毎月付与されるチケットで様々なジャンルを横断して体験可能。お子様の興味に合わせて自由に選択できます。',
    color: 'from-primary-500 to-secondary-500',
  },
  {
    icon: UsersIcon,
    title: '親子別口コミ機能',
    description: '保護者と子どもの両方の視点から評価を投稿・閲覧。多角的な情報で安心して教室選びができます。',
    color: 'from-accent-pink to-accent-yellow',
  },
  {
    icon: AcademicCapIcon,
    title: '統一プラットフォーム',
    description: '検索・予約・受講確認・口コミまで統合。忙しい保護者の方も効率的に習い事管理ができます。',
    color: 'from-accent-green to-secondary-500',
  },
];

const testimonials = [
  {
    id: 1,
    parentName: '田中 美香',
    parentAge: '42歳',
    childName: '田中 陽太',
    childAge: '10歳',
    parentComment: 'チケット制なので、これまで躊躇していたプログラミングやダンスなども気軽に体験させられました。特に、息子自身の「楽しかった！」という口コミを見て、彼が本当に好きなことを見つけられたと実感しています。',
    childComment: 'お料理も空手もアートも、全部ちがう楽しさがあって、やってみたら「ぼくは作るのが好きなんだ」ってわかった。絵もお菓子も、自分だけの形や色で作れるのがうれしい！',
    location: '埼玉県',
    avatar: '/images/testimonial-1.jpg',
  },
  {
    id: 2,
    parentName: '佐藤 健一',
    parentAge: '38歳',
    childName: '佐藤 花音',
    childAge: '8歳',
    parentComment: '共働きで忙しい中、オンラインで予約から管理まで完結できるのが本当に助かります。娘と一緒に口コミを見ながら次の習い事を選ぶのが楽しい時間になっています。',
    childComment: 'ダンスの先生がとってもやさしくて、お友達もできた！今度はピアノもやってみたいな。ママと一緒に選ぶのが楽しい♪',
    location: '東京都',
    avatar: '/images/testimonial-2.jpg',
  },
];

const stats = [
  { label: '提携教室数', value: '1,200+', suffix: '校' },
  { label: '累計利用者数', value: '15,000+', suffix: '人' },
  { label: '満足度', value: '96', suffix: '%' },
  { label: '平均評価', value: '4.7', suffix: '⭐' },
];

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<typeof sampleSearchResults>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (values: SearchFormValues) => {
    setIsSearching(true);
    
    // 実際のAPIコールをシミュレート
    setTimeout(() => {
      setSearchResults(sampleSearchResults);
      setIsSearching(false);
    }, 1500);
  };

  return (
    <div className="overflow-hidden">
      {/* ヒーローセクション */}
      <section className="relative gradient-primary text-white overflow-hidden">
        {/* 背景装飾 */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container py-20 lg:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="animate-fade-in">
              <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
                親子で選ぶ新しい<br />
                <span className="text-accent-yellow animate-bounce-gentle inline-block">
                  習い事プラットフォーム
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl lg:text-3xl mb-8 text-blue-100 leading-relaxed max-w-3xl mx-auto">
                月額定額チケット制で、子どもの<br className="hidden md:block" />
                「<span className="text-accent-yellow font-semibold">やってみたい！</span>」を最大限に引き出す
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                <Link href="/auth/login" className="btn btn-xl bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
                  <TicketIcon className="w-6 h-6 mr-2" />
                  無料で始める
                </Link>
                <Link href="#features" className="btn btn-xl btn-outline border-white text-white hover:bg-white hover:text-primary-600 shadow-lg">
                  <MagnifyingGlassIcon className="w-6 h-6 mr-2" />
                  サービスを見る
                </Link>
              </div>
            </div>
            
            {/* 統計情報 */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16">
              {stats.map((stat, index) => (
                <div key={stat.label} className="text-center animate-slide-up" style={{ animationDelay: `${index * 100}ms` }}>
                  <div className="text-3xl md:text-4xl font-bold text-white mb-1">
                    {stat.value}<span className="text-accent-yellow">{stat.suffix}</span>
                  </div>
                  <div className="text-blue-200 text-sm md:text-base">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 検索セクション */}
      <section className="py-16 lg:py-24 bg-white relative">
        <div className="absolute inset-0 bg-gradient-to-b from-gray-50 to-white"></div>
        <div className="relative container">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                習い事を検索してみよう
              </h2>
              <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
                エリア・ジャンル・日付から、お子様にぴったりの習い事を見つけましょう
              </p>
            </div>

            <SearchForm onSubmit={handleSearch} loading={isSearching} variant="hero" />
            
            {/* 検索結果 */}
            {isSearching && (
              <div className="text-center py-12">
                <div className="loading w-8 h-8 mx-auto mb-4"></div>
                <p className="text-gray-600 text-lg">最適な習い事を検索中...</p>
              </div>
            )}

            {searchResults.length > 0 && (
              <div className="mt-12 animate-fade-in">
                <h3 className="text-2xl font-bold text-gray-900 mb-6">検索結果</h3>
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                  {searchResults.map((result) => (
                    <div key={result.id} className="card group hover:shadow-xl transition-all duration-300">
                      <div className="aspect-w-16 aspect-h-9 bg-gray-200 rounded-t-xl overflow-hidden">
                        <div className="w-full h-48 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
                          <span className="text-4xl">{result.category === '音楽' ? '🎵' : result.category === 'スポーツ' ? '⚽' : '💻'}</span>
                        </div>
                      </div>
                      
                      <div className="card-body">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-bold text-gray-900 group-hover:text-primary-600 transition-colors">
                              {result.name}
                            </h4>
                            <p className="text-gray-600 text-sm">{result.area}</p>
                          </div>
                          <div className="flex items-center gap-1">
                            <StarSolidIcon className="w-4 h-4 text-yellow-400" />
                            <span className="font-semibold text-gray-900">{result.rating}</span>
                            <span className="text-gray-500 text-sm">({result.reviewCount})</span>
                          </div>
                        </div>
                        
                        <div className="flex flex-wrap gap-2 mb-4">
                          {result.tags.map((tag) => (
                            <span key={tag} className="badge badge-primary text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                        
                        <div className="flex justify-between items-center">
                          <span className="font-semibold text-primary-600">{result.price}</span>
                          <Link 
                            href={`/schools/${result.id}`}
                            className="btn btn-primary btn-sm group-hover:shadow-md transition-all duration-200"
                          >
                            詳細を見る
                            <ArrowRightIcon className="w-4 h-4 ml-1" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="text-center mt-8">
                  <Link href="/schools" className="btn btn-outline btn-lg">
                    すべての教室を見る
                    <ArrowRightIcon className="w-5 h-5 ml-2" />
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 特徴セクション */}
      <section id="features" className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              習い事Primeの特徴
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              親子の学びを全力でサポートする、これまでにない習い事プラットフォーム
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div 
                key={feature.title} 
                className="card text-center group hover:shadow-xl transition-all duration-300 animate-slide-up"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <div className="card-body">
                  <div className={cn(
                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-6 bg-gradient-to-br",
                    feature.color
                  )}>
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-4">
                    {feature.title}
                  </h3>
                  
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 利用の流れセクション */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              利用の流れ
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              簡単4ステップで、お子様にぴったりの習い事が見つかります
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  step: '01',
                  title: '月額プランに加入',
                  description: 'お子様の年齢や興味に合わせてプランを選択',
                  icon: TicketIcon,
                  color: 'bg-primary-500',
                },
                {
                  step: '02',
                  title: '教室を検索・予約',
                  description: 'チケットを使って体験レッスンを予約',
                  icon: CalendarDaysIcon,
                  color: 'bg-secondary-500',
                },
                {
                  step: '03',
                  title: '親子で体験',
                  description: '実際にレッスンを受けて相性を確認',
                  icon: HeartIcon,
                  color: 'bg-accent-pink',
                },
                {
                  step: '04',
                  title: '口コミを投稿',
                  description: '親子それぞれの視点から評価を共有',
                  icon: ChatBubbleLeftRightIcon,
                  color: 'bg-accent-green',
                },
              ].map((flow, index) => (
                <div key={flow.step} className="text-center group">
                  <div className="relative mb-6">
                    <div className={cn(
                      "w-16 h-16 rounded-full flex items-center justify-center mx-auto text-white shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110",
                      flow.color
                    )}>
                      <flow.icon className="w-8 h-8" />
                    </div>
                    <div className="absolute -top-2 -right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-600 shadow-md">
                      {flow.step}
                    </div>
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2">
                    {flow.title}
                  </h3>
                  
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {flow.description}
                  </p>
                  
                  {index < 3 && (
                    <div className="hidden lg:block absolute top-8 left-full w-8 text-center">
                      <ArrowRightIcon className="w-5 h-5 text-gray-300 mx-auto" />
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 顧客の声セクション */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="container">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              利用者の声
            </h2>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              実際にご利用いただいている親子の声をお聞きください
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {testimonials.map((testimonial) => (
              <div key={testimonial.id} className="card">
                <div className="card-body">
                  {/* 親の口コミ */}
                  <div className="mb-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">保</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.parentName}（{testimonial.parentAge}）
                        </h4>
                        <p className="text-gray-600 text-sm">{testimonial.location}</p>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 leading-relaxed italic">
                      "{testimonial.parentComment}"
                    </blockquote>
                  </div>

                  <hr className="border-gray-200" />

                  {/* 子どもの口コミ */}
                  <div className="mt-6">
                    <div className="flex items-center mb-4">
                      <div className="w-12 h-12 bg-gradient-to-br from-accent-yellow to-accent-green rounded-full flex items-center justify-center mr-4">
                        <span className="text-white font-bold">子</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-900">
                          {testimonial.childName}（{testimonial.childAge}）
                        </h4>
                      </div>
                    </div>
                    <blockquote className="text-gray-700 leading-relaxed italic">
                      "{testimonial.childComment}"
                    </blockquote>
                  </div>

                  {/* 評価 */}
                  <div className="flex justify-center mt-6">
                    <div className="rating">
                      {[...Array(5)].map((_, i) => (
                        <StarSolidIcon key={i} className="rating-star rating-star-full" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTAセクション */}
      <section className="py-16 lg:py-24 gradient-primary text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 right-0 w-72 h-72 bg-white/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl transform -translate-x-1/2 translate-y-1/2"></div>
        </div>
        
        <div className="relative container text-center">
          <h2 className="text-3xl md:text-5xl font-bold mb-6">
            お子様の可能性を<br />
            <span className="text-accent-yellow">今すぐ</span>広げてみませんか？
          </h2>
          
          <p className="text-xl md:text-2xl mb-8 text-blue-100 max-w-3xl mx-auto leading-relaxed">
            無料でアカウント作成。最初の1ヶ月は特別価格でお試しいただけます。
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link href="/auth/login" className="btn btn-xl bg-white text-primary-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200">
              <CheckIcon className="w-6 h-6 mr-2" />
              無料で始める
            </Link>
            <Link href="/pricing" className="btn btn-xl btn-outline border-white text-white hover:bg-white hover:text-primary-600 shadow-lg">
              <TrophyIcon className="w-6 h-6 mr-2" />
              料金プランを見る
            </Link>
          </div>
          
          <p className="text-blue-200 text-sm">
            ※クレジットカード登録不要で始められます
          </p>
        </div>
      </section>
    </div>
  );
}