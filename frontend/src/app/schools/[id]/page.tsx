'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MapPinIcon,
  StarIcon,
  HeartIcon,
  ClockIcon,
  UserGroupIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  ShareIcon,
  PhoneIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import { 
  StarIcon as StarSolidIcon,
  HeartIcon as HeartSolidIcon 
} from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';

// サンプルデータ
const sampleSchool = {
  id: '1',
  name: 'ピアノスクール ハーモニー',
  area: '大阪市中央区',
  address: '大阪市中央区心斎橋1-1-1 ハーモニービル3F',
  category: '音楽',
  rating: 4.8,
  reviewCount: 127,
  parentReviewCount: 89,
  childReviewCount: 38,
  images: [
    '/images/piano-school-1.jpg',
    '/images/piano-school-2.jpg',
    '/images/piano-school-3.jpg',
  ],
  price: '月額3,500円〜',
  priceRange: '3,500円 - 8,000円',
  distance: '1.2km',
  description: '音楽の基礎から応用まで、お子様のペースに合わせて丁寧に指導いたします。個人レッスンを中心に、グループレッスンも選択可能です。年2回の発表会では、お子様の成長を実感していただけます。',
  features: [
    '個人レッスン対応',
    '発表会年2回開催',
    '初心者大歓迎',
    '楽器レンタル可能',
    '駐車場完備',
    '土日開講',
  ],
  isLiked: false,
  phone: '06-1234-5678',
  email: 'info@harmony-piano.com',
  website: 'https://harmony-piano.com',
  openHours: {
    weekday: '10:00-20:00',
    saturday: '9:00-18:00',
    sunday: '9:00-17:00',
  },
  accessInfo: '地下鉄心斎橋駅より徒歩3分',
  parkingInfo: '専用駐車場5台完備（無料）',
  ageRange: '4歳〜15歳',
  capacity: 8,
  duration: 45,
};

const sampleInstructors = [
  {
    id: '1',
    name: '田中 美和',
    profile: '音楽大学ピアノ科卒業。指導歴15年のベテラン講師です。',
    specialties: ['クラシック', 'ポップス', '初心者指導'],
    rating: 4.9,
    reviewCount: 45,
    image: '/images/instructor-1.jpg',
    experience: '15年',
  },
  {
    id: '2',
    name: '佐藤 健太',
    profile: 'ジャズピアニストとしても活動。楽しいレッスンが評判です。',
    specialties: ['ジャズ', 'ポップス', '作曲'],
    rating: 4.7,
    reviewCount: 32,
    image: '/images/instructor-2.jpg',
    experience: '8年',
  },
];

const sampleClasses = [
  {
    id: '1',
    title: '初心者ピアノコース',
    description: 'ピアノを初めて習うお子様向けのコースです。',
    duration: 45,
    capacity: 1,
    price: 3500,
    ageRange: '4歳〜12歳',
    level: '初心者',
  },
  {
    id: '2',
    title: '上級ピアノコース',
    description: '基礎をマスターしたお子様向けの応用コースです。',
    duration: 60,
    capacity: 1,
    price: 5500,
    ageRange: '8歳〜15歳',
    level: '中級〜上級',
  },
  {
    id: '3',
    title: 'グループレッスン',
    description: 'お友達と一緒に楽しく学べるグループレッスンです。',
    duration: 60,
    capacity: 4,
    price: 2800,
    ageRange: '6歳〜12歳',
    level: '初心者〜中級',
  },
];

const sampleReviews = [
  {
    id: '1',
    type: 'parent' as const,
    rating: 5,
    comment: '先生がとても優しく、子どもの個性を大切にして指導してくださいます。発表会では大きな成長を感じることができました。',
    reviewerName: '田中 美香',
    reviewerAge: '42歳',
    childAge: '10歳',
    date: '2024-01-15',
    targetType: 'school' as const,
    helpful: 12,
  },
  {
    id: '2',
    type: 'child' as const,
    rating: 5,
    comment: '先生がやさしくて、ピアノがとても楽しいです！発表会でみんなの前で弾けて嬉しかったです。',
    reviewerName: '田中 陽太',
    reviewerAge: '10歳',
    date: '2024-01-15',
    targetType: 'school' as const,
    helpful: 8,
  },
  {
    id: '3',
    type: 'parent' as const,
    rating: 4,
    comment: '施設が綺麗で、レッスン料も良心的です。駐車場があるのも助かります。',
    reviewerName: '佐藤 健一',
    reviewerAge: '38歳',
    childAge: '8歳',
    date: '2024-01-10',
    targetType: 'school' as const,
    helpful: 6,
  },
];

const sampleSchedules = [
  {
    id: '1',
    classId: '1',
    instructorId: '1',
    date: '2024-02-01',
    startTime: '10:00',
    endTime: '10:45',
    availableSlots: 1,
    totalSlots: 1,
  },
  {
    id: '2',
    classId: '1',
    instructorId: '1',
    date: '2024-02-01',
    startTime: '11:00',
    endTime: '11:45',
    availableSlots: 0,
    totalSlots: 1,
  },
  {
    id: '3',
    classId: '3',
    instructorId: '2',
    date: '2024-02-02',
    startTime: '14:00',
    endTime: '15:00',
    availableSlots: 2,
    totalSlots: 4,
  },
];


export default function SchoolDetailPage({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState(sampleSchool);
  const [activeTab, setActiveTab] = useState<'overview' | 'instructors' | 'classes' | 'reviews' | 'schedule'>('overview');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<typeof sampleSchedules[0] | null>(null);

  const toggleLike = () => {
    setSchool(prev => ({ ...prev, isLiked: !prev.isLiked }));
  };

  const handleBooking = (schedule: typeof sampleSchedules[0]) => {
    setSelectedSchedule(schedule);
    setIsBookingModalOpen(true);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <StarSolidIcon
        key={i}
        className={cn(
          "w-4 h-4",
          i < Math.floor(rating) ? "text-yellow-400" : "text-gray-300"
        )}
      />
    ));
  };

  const tabs = [
    { key: 'overview', label: '概要', icon: '📋' },
    { key: 'instructors', label: '講師紹介', icon: '👨‍🏫' },
    { key: 'classes', label: 'クラス', icon: '📚' },
    { key: 'reviews', label: '口コミ', icon: '💬' },
    { key: 'schedule', label: '予約', icon: '📅' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダー画像セクション */}
      <section className="relative">
        <div className="h-64 md:h-80 bg-gradient-to-br from-primary-100 to-secondary-100 flex items-center justify-center">
          <span className="text-8xl">🎵</span>
        </div>
        
        {/* フローティング情報カード */}
        <div className="absolute -bottom-16 left-0 right-0">
          <div className="container">
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-4">
                    <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                      {school.name}
                    </h1>
                    <button
                      onClick={toggleLike}
                      className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                    >
                      {school.isLiked ? (
                        <HeartSolidIcon className="w-6 h-6 text-accent-pink" />
                      ) : (
                        <HeartIcon className="w-6 h-6 text-gray-400 hover:text-accent-pink" />
                      )}
                    </button>
                  </div>
                  
                  <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                    <div className="flex items-center gap-1">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{school.area}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <ClockIcon className="w-4 h-4" />
                      <span>{school.duration}分/回</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <UserGroupIcon className="w-4 h-4" />
                      <span>{school.ageRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <div className="flex">
                        {renderStars(school.rating)}
                      </div>
                      <span className="font-semibold text-gray-900">{school.rating}</span>
                      <span className="text-gray-500">({school.reviewCount}件)</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-primary-500 rounded-full"></span>
                        保護者 {school.parentReviewCount}件
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="w-3 h-3 bg-accent-yellow rounded-full"></span>
                        子ども {school.childReviewCount}件
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary-600 mb-2">
                    {school.price}
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    料金範囲: {school.priceRange}
                  </div>
                  <div className="flex gap-2">
                    <button className="btn btn-outline btn-sm">
                      <ShareIcon className="w-4 h-4 mr-1" />
                      シェア
                    </button>
                    <Link href="#schedule" className="btn btn-primary btn-sm">
                      <CalendarDaysIcon className="w-4 h-4 mr-1" />
                      予約する
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* メインコンテンツ */}
      <div className="container pt-24 pb-16">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* メインコンテンツ */}
          <main className="flex-1">
            {/* タブナビゲーション */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
              <nav className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as any)}
                    className={cn(
                      "flex items-center gap-2 px-6 py-4 text-sm font-medium whitespace-nowrap border-b-2 transition-colors",
                      activeTab === tab.key
                        ? "border-primary-500 text-primary-600 bg-primary-50"
                        : "border-transparent text-gray-600 hover:text-gray-900 hover:border-gray-300"
                    )}
                  >
                    <span>{tab.icon}</span>
                    {tab.label}
                  </button>
                ))}
              </nav>
            </div>

            {/* タブコンテンツ */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 md:p-8">
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* 教室説明 */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">教室について</h2>
                    <p className="text-gray-700 leading-relaxed mb-6">
                      {school.description}
                    </p>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {school.features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckIcon className="w-4 h-4 text-green-500 flex-shrink-0" />
                          {feature}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* アクセス情報 */}
                  <div>
                    <h2 className="text-xl font-bold text-gray-900 mb-4">アクセス・基本情報</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">住所</h3>
                        <p className="text-gray-700">{school.address}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">アクセス</h3>
                        <p className="text-gray-700">{school.accessInfo}</p>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">営業時間</h3>
                        <div className="text-gray-700 text-sm space-y-1">
                          <div>平日: {school.openHours.weekday}</div>
                          <div>土曜: {school.openHours.saturday}</div>
                          <div>日曜: {school.openHours.sunday}</div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">駐車場</h3>
                        <p className="text-gray-700">{school.parkingInfo}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'instructors' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">講師紹介</h2>
                  <div className="grid gap-6 md:grid-cols-2">
                    {sampleInstructors.map((instructor) => (
                      <div key={instructor.id} className="card">
                        <div className="card-body">
                          <div className="flex items-start gap-4 mb-4">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-100 to-secondary-100 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-2xl">👨‍🏫</span>
                            </div>
                            <div className="flex-1">
                              <h3 className="font-bold text-gray-900 mb-1">{instructor.name}</h3>
                              <div className="flex items-center gap-2 mb-2">
                                <div className="flex">
                                  {renderStars(instructor.rating)}
                                </div>
                                <span className="text-sm text-gray-600">
                                  {instructor.rating} ({instructor.reviewCount}件)
                                </span>
                              </div>
                              <div className="text-sm text-gray-600">
                                指導歴 {instructor.experience}
                              </div>
                            </div>
                          </div>
                          
                          <p className="text-gray-700 mb-4">{instructor.profile}</p>
                          
                          <div className="flex flex-wrap gap-2">
                            {instructor.specialties.map((specialty) => (
                              <span key={specialty} className="badge badge-secondary text-xs">
                                {specialty}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'classes' && (
                <div className="space-y-6">
                  <h2 className="text-xl font-bold text-gray-900">クラス・コース</h2>
                  <div className="space-y-4">
                    {sampleClasses.map((classItem) => (
                      <div key={classItem.id} className="card">
                        <div className="card-body">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <h3 className="font-bold text-gray-900 mb-2">{classItem.title}</h3>
                              <p className="text-gray-700 mb-3">{classItem.description}</p>
                              
                              <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                                <div className="flex items-center gap-1">
                                  <ClockIcon className="w-4 h-4" />
                                  {classItem.duration}分
                                </div>
                                <div className="flex items-center gap-1">
                                  <UserGroupIcon className="w-4 h-4" />
                                  定員{classItem.capacity}名
                                </div>
                                <div>対象: {classItem.ageRange}</div>
                                <div>レベル: {classItem.level}</div>
                              </div>
                            </div>
                            
                            <div className="text-right">
                              <div className="text-xl font-bold text-primary-600 mb-2">
                                {classItem.price.toLocaleString()}円
                              </div>
                              <button className="btn btn-primary btn-sm">
                                このクラスを予約
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-6">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold text-gray-900">口コミ・評価</h2>
                    <button className="btn btn-outline btn-sm">
                      <ChatBubbleLeftRightIcon className="w-4 h-4 mr-1" />
                      口コミを書く
                    </button>
                  </div>
                  
                  {/* 口コミ統計 */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 bg-gray-50 rounded-lg">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">{school.rating}</div>
                      <div className="flex justify-center mb-1">
                        {renderStars(school.rating)}
                      </div>
                      <div className="text-sm text-gray-600">総合評価</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-primary-600 mb-1">{school.parentReviewCount}</div>
                      <div className="text-sm text-gray-600">保護者の口コミ</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-accent-yellow mb-1">{school.childReviewCount}</div>
                      <div className="text-sm text-gray-600">子どもの口コミ</div>
                    </div>
                  </div>
                  
                  {/* 口コミ一覧 */}
                  <div className="space-y-6">
                    {sampleReviews.map((review) => (
                      <div key={review.id} className="border border-gray-200 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center gap-3">
                            <div className={cn(
                              "w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold",
                              review.type === 'parent' ? "bg-primary-500" : "bg-accent-yellow"
                            )}>
                              {review.type === 'parent' ? '保' : '子'}
                            </div>
                            <div>
                              <div className="font-semibold text-gray-900">
                                {review.reviewerName}（{review.reviewerAge}）
                              </div>
                              <div className="text-sm text-gray-600">
                                {review.date} • {review.type === 'parent' ? '保護者' : 'お子様'}
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <div className="flex">
                              {renderStars(review.rating)}
                            </div>
                          </div>
                        </div>
                        
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {review.comment}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <button className="text-sm text-gray-600 hover:text-primary-600 transition-colors">
                            👍 参考になった ({review.helpful})
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'schedule' && (
                <div className="space-y-6" id="schedule">
                  <h2 className="text-xl font-bold text-gray-900">レッスン予約</h2>
                  
                  {/* カレンダー（簡易版） */}
                  <div className="grid gap-4">
                    {sampleSchedules.map((schedule) => {
                      const classInfo = sampleClasses.find(c => c.id === schedule.classId);
                      const instructorInfo = sampleInstructors.find(i => i.id === schedule.instructorId);
                      
                      return (
                        <div key={schedule.id} className="card">
                          <div className="card-body">
                            <div className="flex justify-between items-start">
                              <div>
                                <h3 className="font-bold text-gray-900 mb-2">
                                  {classInfo?.title}
                                </h3>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div>講師: {instructorInfo?.name}</div>
                                  <div>日時: {schedule.date} {schedule.startTime}-{schedule.endTime}</div>
                                  <div>料金: {classInfo?.price.toLocaleString()}円</div>
                                  <div className={cn(
                                    "inline-block px-2 py-1 rounded-full text-xs font-medium",
                                    schedule.availableSlots > 0 
                                      ? "bg-green-100 text-green-800" 
                                      : "bg-red-100 text-red-800"
                                  )}>
                                    {schedule.availableSlots > 0 
                                      ? `残り${schedule.availableSlots}枠` 
                                      : '満席'}
                                  </div>
                                </div>
                              </div>
                              
                              <button
                                onClick={() => handleBooking(schedule)}
                                disabled={schedule.availableSlots === 0}
                                className={cn(
                                  "btn btn-sm",
                                  schedule.availableSlots > 0 
                                    ? "btn-primary" 
                                    : "btn-secondary opacity-50 cursor-not-allowed"
                                )}
                              >
                                {schedule.availableSlots > 0 ? 'チケットで予約' : '満席'}
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </main>

          {/* サイドバー */}
          <aside className="lg:w-80 space-y-6">
            {/* 連絡先情報 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">お問い合わせ</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <PhoneIcon className="w-4 h-4 text-gray-500" />
                  <a href={`tel:${school.phone}`} className="text-primary-600 hover:underline">
                    {school.phone}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <EnvelopeIcon className="w-4 h-4 text-gray-500" />
                  <a href={`mailto:${school.email}`} className="text-primary-600 hover:underline">
                    {school.email}
                  </a>
                </div>
                <div className="flex items-center gap-3">
                  <GlobeAltIcon className="w-4 h-4 text-gray-500" />
                  <a href={school.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                    公式サイト
                  </a>
                </div>
              </div>
            </div>

            {/* 関連教室 */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="font-bold text-gray-900 mb-4">近くの類似教室</h3>
              <div className="space-y-4">
                {[1, 2].map((i) => (
                  <div key={i} className="flex gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-secondary-100 to-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-xl">🎵</span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 text-sm mb-1">
                        ミュージックスクール {i}
                      </h4>
                      <div className="text-xs text-gray-600 mb-1">大阪市北区 • 2.{i}km</div>
                      <div className="flex items-center gap-1">
                        <StarSolidIcon className="w-3 h-3 text-yellow-400" />
                        <span className="text-xs text-gray-600">4.{5 + i}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>

      {/* 予約モーダル */}
      {isBookingModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">レッスン予約</h3>
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
            
            <div className="space-y-4 mb-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-2">
                  {sampleClasses.find(c => c.id === selectedSchedule.classId)?.title}
                </h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>日時: {selectedSchedule.date} {selectedSchedule.startTime}-{selectedSchedule.endTime}</div>
                  <div>講師: {sampleInstructors.find(i => i.id === selectedSchedule.instructorId)?.name}</div>
                  <div>料金: {sampleClasses.find(c => c.id === selectedSchedule.classId)?.price.toLocaleString()}円</div>
                </div>
              </div>
              
              <div className="p-4 border border-primary-200 bg-primary-50 rounded-lg">
                <div className="flex items-center gap-2 text-primary-700">
                  <CheckIcon className="w-4 h-4" />
                  <span className="font-medium">チケット1枚を使用します</span>
                </div>
                <div className="text-sm text-primary-600 mt-1">
                  残りチケット: 2枚 → 1枚
                </div>
              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setIsBookingModalOpen(false)}
                className="flex-1 btn btn-ghost"
              >
                キャンセル
              </button>
              <button className="flex-1 btn btn-primary">
                予約を確定
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}