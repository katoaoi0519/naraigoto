'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPinIcon,
  StarIcon,
  HeartIcon,
  FunnelIcon,
  ViewColumnsIcon,
  Bars3Icon,
  ChevronDownIcon,
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/solid';
import SearchForm, { SearchFormValues } from '@/components/SearchForm';
import { cn } from '@/lib/utils';

// サンプルデータ
const sampleSchools = [
  {
    id: '1',
    name: 'ピアノスクール ハーモニー',
    area: '大阪市中央区',
    category: '音楽',
    rating: 4.8,
    reviewCount: 127,
    parentReviewCount: 89,
    childReviewCount: 38,
    image: '/images/piano-school.jpg',
    price: '月額3,500円〜',
    distance: '1.2km',
    tags: ['初心者歓迎', '個人レッスン', '発表会あり'],
    description: '音楽の基礎から応用まで、お子様のペースに合わせて丁寧に指導いたします。',
    isLiked: false,
    instructorCount: 5,
    availableSlots: 12,
  },
  {
    id: '2',
    name: 'キッズサッカークラブ FC大阪',
    area: '大阪市北区',
    category: 'スポーツ',
    rating: 4.6,
    reviewCount: 89,
    parentReviewCount: 62,
    childReviewCount: 27,
    image: '/images/soccer-club.jpg',
    price: '月額4,000円〜',
    distance: '2.1km',
    tags: ['チームプレイ', '体力向上', 'コーチ経験豊富'],
    description: 'サッカーを通じて体力向上とチームワークを育みます。',
    isLiked: true,
    instructorCount: 8,
    availableSlots: 8,
  },
  {
    id: '3',
    name: 'プログラミング道場 梅田校',
    area: '大阪市北区',
    category: 'プログラミング',
    rating: 4.9,
    reviewCount: 156,
    parentReviewCount: 98,
    childReviewCount: 58,
    image: '/images/programming-school.jpg',
    price: '月額5,500円〜',
    distance: '0.8km',
    tags: ['Scratch', 'Python', '作品制作'],
    description: 'プログラミングの楽しさを体験しながら論理的思考力を育てます。',
    isLiked: false,
    instructorCount: 12,
    availableSlots: 15,
  },
  {
    id: '4',
    name: 'アトリエ キッズアート',
    area: '大阪市中央区',
    category: 'アート',
    rating: 4.7,
    reviewCount: 73,
    parentReviewCount: 45,
    childReviewCount: 28,
    image: '/images/art-studio.jpg',
    price: '月額3,800円〜',
    distance: '1.5km',
    tags: ['創造性', '個性重視', '作品展示'],
    description: '自由な発想でアート作品を制作し、創造性を伸ばします。',
    isLiked: false,
    instructorCount: 4,
    availableSlots: 6,
  },
  {
    id: '5',
    name: 'English Kids Academy',
    area: '大阪市西区',
    category: '語学',
    rating: 4.5,
    reviewCount: 92,
    parentReviewCount: 61,
    childReviewCount: 31,
    image: '/images/english-school.jpg',
    price: '月額4,200円〜',
    distance: '2.3km',
    tags: ['ネイティブ講師', '少人数制', '楽しい授業'],
    description: 'ネイティブ講師と楽しく英語を学び、国際感覚を身につけます。',
    isLiked: true,
    instructorCount: 6,
    availableSlots: 10,
  },
  {
    id: '6',
    name: 'ダンススタジオ Rhythm',
    area: '大阪市北区',
    category: 'ダンス',
    rating: 4.8,
    reviewCount: 134,
    parentReviewCount: 78,
    childReviewCount: 56,
    image: '/images/dance-studio.jpg',
    price: '月額4,500円〜',
    distance: '1.8km',
    tags: ['ヒップホップ', 'バレエ', '発表会'],
    description: '様々なジャンルのダンスを通じて表現力とリズム感を育てます。',
    isLiked: false,
    instructorCount: 9,
    availableSlots: 18,
  },
];

const categories = [
  { value: '', label: 'すべて', count: 6 },
  { value: 'スポーツ', label: 'スポーツ', count: 1 },
  { value: '音楽', label: '音楽', count: 1 },
  { value: 'プログラミング', label: 'プログラミング', count: 1 },
  { value: 'アート', label: 'アート', count: 1 },
  { value: '語学', label: '語学', count: 1 },
  { value: 'ダンス', label: 'ダンス', count: 1 },
];

const sortOptions = [
  { value: 'recommended', label: 'おすすめ順' },
  { value: 'rating', label: '評価の高い順' },
  { value: 'distance', label: '近い順' },
  { value: 'price_low', label: '料金の安い順' },
  { value: 'reviews', label: '口コミの多い順' },
];

export default function SchoolsPage() {
  const [schools, setSchools] = useState(sampleSchools);
  const [filteredSchools, setFilteredSchools] = useState(sampleSchools);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // フィルタリング処理
  useEffect(() => {
    let filtered = schools;
    
    if (selectedCategory) {
      filtered = filtered.filter(school => school.category === selectedCategory);
    }
    
    // ソート処理
    switch (sortBy) {
      case 'rating':
        filtered = [...filtered].sort((a, b) => b.rating - a.rating);
        break;
      case 'distance':
        filtered = [...filtered].sort((a, b) => parseFloat(a.distance) - parseFloat(b.distance));
        break;
      case 'price_low':
        filtered = [...filtered].sort((a, b) => {
          const priceA = parseInt(a.price.match(/\d+/)?.[0] || '0');
          const priceB = parseInt(b.price.match(/\d+/)?.[0] || '0');
          return priceA - priceB;
        });
        break;
      case 'reviews':
        filtered = [...filtered].sort((a, b) => b.reviewCount - a.reviewCount);
        break;
      default:
        // recommended - 評価とレビュー数を組み合わせたスコア
        filtered = [...filtered].sort((a, b) => {
          const scoreA = a.rating * Math.log(a.reviewCount + 1);
          const scoreB = b.rating * Math.log(b.reviewCount + 1);
          return scoreB - scoreA;
        });
    }
    
    setFilteredSchools(filtered);
  }, [schools, selectedCategory, sortBy]);

  const handleSearch = async (values: SearchFormValues) => {
    setLoading(true);
    
    // 実際のAPIコールをシミュレート
    setTimeout(() => {
      let filtered = sampleSchools;
      
      if (values.area) {
        filtered = filtered.filter(school => 
          school.area.includes(values.area!)
        );
      }
      
      if (values.category) {
        filtered = filtered.filter(school => 
          school.category === values.category
        );
        setSelectedCategory(values.category);
      }
      
      if (values.keyword) {
        filtered = filtered.filter(school =>
          school.name.toLowerCase().includes(values.keyword!.toLowerCase()) ||
          school.description.toLowerCase().includes(values.keyword!.toLowerCase())
        );
      }
      
      setSchools(filtered);
      setLoading(false);
    }, 1000);
  };

  const toggleLike = (schoolId: string) => {
    setSchools(schools.map(school =>
      school.id === schoolId
        ? { ...school, isLiked: !school.isLiked }
        : school
    ));
  };

  const SchoolCard = ({ school, isListView = false }: { school: typeof sampleSchools[0], isListView?: boolean }) => (
    <div className={cn(
      "card group hover:shadow-xl transition-all duration-300",
      isListView && "flex-row"
    )}>
      {/* 画像 */}
      <div className={cn(
        "relative overflow-hidden bg-gray-200",
        isListView ? "w-48 flex-shrink-0" : "aspect-w-16 aspect-h-9"
      )}>
        <div className={cn(
          "w-full bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center",
          isListView ? "h-full" : "h-48"
        )}>
          <span className="text-4xl">
            {school.category === '音楽' ? '🎵' : 
             school.category === 'スポーツ' ? '⚽' : 
             school.category === 'プログラミング' ? '💻' :
             school.category === 'アート' ? '🎨' :
             school.category === '語学' ? '🗣️' :
             school.category === 'ダンス' ? '💃' : '🎯'}
          </span>
        </div>
        
        {/* いいねボタン */}
        <button
          onClick={() => toggleLike(school.id)}
          className="absolute top-3 right-3 p-2 bg-white/90 rounded-full shadow-sm hover:bg-white transition-colors"
        >
          {school.isLiked ? (
            <HeartSolidIcon className="w-5 h-5 text-accent-pink" />
          ) : (
            <HeartIcon className="w-5 h-5 text-gray-400 hover:text-accent-pink" />
          )}
        </button>

        {/* 空き状況バッジ */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2 py-1 text-xs font-medium rounded-full",
            school.availableSlots > 10 ? "bg-green-100 text-green-800" :
            school.availableSlots > 5 ? "bg-yellow-100 text-yellow-800" :
            "bg-red-100 text-red-800"
          )}>
            残り{school.availableSlots}枠
          </span>
        </div>
      </div>
      
      <div className={cn("card-body", isListView && "flex-1")}>
        {/* ヘッダー情報 */}
        <div className="flex justify-between items-start mb-3">
          <div className="flex-1">
            <h3 className="font-bold text-lg text-gray-900 group-hover:text-primary-600 transition-colors mb-1">
              <Link href={`/schools/${school.id}`}>
                {school.name}
              </Link>
            </h3>
            <div className="flex items-center text-sm text-gray-600 mb-2">
              <MapPinIcon className="w-4 h-4 mr-1" />
              {school.area} • {school.distance}
            </div>
          </div>
          
          <div className="text-right">
            <div className="flex items-center gap-1 mb-1">
              <StarSolidIcon className="w-4 h-4 text-yellow-400" />
              <span className="font-semibold text-gray-900">{school.rating}</span>
            </div>
            <div className="text-xs text-gray-500">
              ({school.reviewCount}件)
            </div>
          </div>
        </div>

        {/* 口コミ統計 */}
        <div className="flex items-center gap-4 text-xs text-gray-600 mb-3">
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
            保護者 {school.parentReviewCount}件
          </div>
          <div className="flex items-center gap-1">
            <span className="w-3 h-3 bg-accent-yellow rounded-full"></span>
            子ども {school.childReviewCount}件
          </div>
        </div>
        
        {/* 説明文 */}
        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {school.description}
        </p>
        
        {/* タグ */}
        <div className="flex flex-wrap gap-2 mb-4">
          {school.tags.map((tag) => (
            <span key={tag} className="badge badge-primary text-xs">
              {tag}
            </span>
          ))}
        </div>
        
        {/* フッター情報 */}
        <div className="flex justify-between items-center pt-3 border-t border-gray-200">
          <div>
            <span className="font-semibold text-primary-600">{school.price}</span>
            <div className="text-xs text-gray-500">
              講師{school.instructorCount}名
            </div>
          </div>
          <Link 
            href={`/schools/${school.id}`}
            className="btn btn-primary btn-sm group-hover:shadow-md transition-all duration-200"
          >
            詳細を見る
          </Link>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダーセクション */}
      <section className="bg-white border-b border-gray-200">
        <div className="container py-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              教室を探す
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              お子様にぴったりの習い事を見つけましょう
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <SearchForm onSubmit={handleSearch} loading={loading} variant="compact" />
          </div>
        </div>
      </section>

      <div className="container py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* サイドバー（フィルター） */}
          <aside className="lg:w-64 flex-shrink-0">
            <div className="sticky top-24">
              {/* モバイル用フィルターボタン */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="lg:hidden w-full btn btn-outline mb-4"
              >
                <FunnelIcon className="w-4 h-4 mr-2" />
                フィルター
                <ChevronDownIcon className={cn(
                  "w-4 h-4 ml-auto transition-transform",
                  isFilterOpen && "rotate-180"
                )} />
              </button>

              <div className={cn(
                "space-y-6",
                "lg:block",
                isFilterOpen ? "block" : "hidden"
              )}>
                {/* カテゴリーフィルター */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">ジャンル</h3>
                  <div className="space-y-2">
                    {categories.map((category) => (
                      <label key={category.value} className="flex items-center cursor-pointer group">
                        <input
                          type="radio"
                          name="category"
                          value={category.value}
                          checked={selectedCategory === category.value}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="sr-only"
                        />
                        <div className={cn(
                          "w-4 h-4 rounded-full border-2 mr-3 transition-colors",
                          selectedCategory === category.value
                            ? "border-primary-500 bg-primary-500"
                            : "border-gray-300 group-hover:border-primary-400"
                        )}>
                          {selectedCategory === category.value && (
                            <div className="w-2 h-2 bg-white rounded-full mx-auto mt-0.5"></div>
                          )}
                        </div>
                        <span className="flex-1 text-gray-700 group-hover:text-gray-900">
                          {category.label}
                        </span>
                        <span className="text-sm text-gray-500">
                          ({category.count})
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* その他のフィルター */}
                <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                  <h3 className="font-semibold text-gray-900 mb-4">その他</h3>
                  <div className="space-y-3">
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-primary-600" />
                      <span className="ml-2 text-gray-700">体験レッスンあり</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-primary-600" />
                      <span className="ml-2 text-gray-700">駐車場あり</span>
                    </label>
                    <label className="flex items-center cursor-pointer">
                      <input type="checkbox" className="form-checkbox text-primary-600" />
                      <span className="ml-2 text-gray-700">土日開講</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          {/* メインコンテンツ */}
          <main className="flex-1">
            {/* 検索結果ヘッダー */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  検索結果 {filteredSchools.length}件
                </h2>
                {selectedCategory && (
                  <p className="text-gray-600 text-sm mt-1">
                    「{categories.find(c => c.value === selectedCategory)?.label}」で絞り込み中
                  </p>
                )}
              </div>
              
              <div className="flex items-center gap-4">
                {/* ソート */}
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="form-select text-sm"
                >
                  {sortOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                
                {/* 表示切り替え */}
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setViewMode('grid')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'grid' ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <ViewColumnsIcon className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={cn(
                      "p-2 rounded-md transition-colors",
                      viewMode === 'list' ? "bg-white shadow-sm text-primary-600" : "text-gray-600 hover:text-gray-900"
                    )}
                  >
                    <Bars3Icon className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* ローディング状態 */}
            {loading && (
              <div className="text-center py-12">
                <div className="loading w-8 h-8 mx-auto mb-4"></div>
                <p className="text-gray-600">教室を検索中...</p>
              </div>
            )}

            {/* 検索結果 */}
            {!loading && (
              <div className={cn(
                "gap-6",
                viewMode === 'grid' ? "grid md:grid-cols-2" : "space-y-6"
              )}>
                {filteredSchools.map((school) => (
                  <SchoolCard 
                    key={school.id} 
                    school={school} 
                    isListView={viewMode === 'list'} 
                  />
                ))}
              </div>
            )}

            {/* 結果なし */}
            {!loading && filteredSchools.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  条件に合う教室が見つかりませんでした
                </h3>
                <p className="text-gray-600 mb-6">
                  検索条件を変更してもう一度お試しください
                </p>
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setSortBy('recommended');
                    setSchools(sampleSchools);
                  }}
                  className="btn btn-primary"
                >
                  条件をリセット
                </button>
              </div>
            )}

            {/* ページネーション */}
            {!loading && filteredSchools.length > 0 && (
              <div className="flex justify-center mt-12">
                <nav className="flex space-x-2">
                  <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    前へ
                  </button>
                  <button className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg">
                    1
                  </button>
                  <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    2
                  </button>
                  <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    3
                  </button>
                  <button className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                    次へ
                  </button>
                </nav>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}