'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  CalendarIcon,
  AcademicCapIcon,
  UserIcon,
  HeartIcon,
  ShareIcon,
  TicketIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface ClassDetail {
  id: string;
  title: string;
  description: string;
  longDescription: string;
  school: {
    id: string;
    name: string;
    area: string;
    address: string;
    rating: number;
    reviewCount: number;
  };
  instructor: {
    id: string;
    name: string;
    profile: string;
    experience: string;
    rating: number;
    reviewCount: number;
  };
  category: string;
  capacity: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageRange: string;
  rating: number;
  reviewCount: number;
  price: number;
  requirements: string[];
  whatYouLearn: string[];
  schedules: {
    id: string;
    startAt: string;
    endAt: string;
    availableSlots: number;
  }[];
  images: string[];
  isLiked: boolean;
}

interface Props {
  params: { id: string };
}

export default function ClassDetailPage({ params }: Props) {
  const classId = params.id;
  const [classDetail, setClassDetail] = useState<ClassDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSchedule, setSelectedSchedule] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    fetchClassDetail();
  }, [classId]);

  const fetchClassDetail = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch(`/api/classes/${classId}`);
      // const data = await response.json();
      
      // モックデータ
      const mockClassDetail: ClassDetail = {
        id: classId,
        title: 'Scratchで学ぶ初級プログラミング',
        description: 'Scratchを使って楽しくプログラミングの基礎を学びます。論理的思考力を育てながら、ゲームやアニメーションを作成します。',
        longDescription: 'このクラスでは、MIT開発の子ども向けプログラミング言語「Scratch」を使用して、プログラミングの基本概念を楽しく学習します。ブロックを組み合わせてプログラムを作成するため、タイピングが苦手なお子様でも安心して参加できます。\n\nレッスンでは、キャラクターを動かしたり、音を鳴らしたり、簡単なゲームを作成したりしながら、順次処理、条件分岐、繰り返し処理などのプログラミングの基本的な考え方を身につけます。',
        school: {
          id: 'school-1',
          name: 'テックキッズアカデミー渋谷校',
          area: '東京都23区',
          address: '東京都渋谷区渋谷1-1-1 テックビル3F',
          rating: 4.7,
          reviewCount: 156
        },
        instructor: {
          id: 'instructor-1',
          name: '山田太郎',
          profile: 'プログラミング教育歴8年。大学でコンピューターサイエンスを専攻後、IT企業でのエンジニア経験を経て、子どもたちにプログラミングの楽しさを伝える活動を開始。',
          experience: '8年',
          rating: 4.9,
          reviewCount: 89
        },
        category: 'プログラミング',
        capacity: 8,
        duration: 60,
        difficulty: 'beginner',
        ageRange: '6-12歳',
        rating: 4.8,
        reviewCount: 24,
        price: 3500,
        requirements: [
          'パソコンの基本操作ができること（マウスクリック、ドラッグ）',
          '筆記用具',
          '特別なソフトウェアのインストールは不要です'
        ],
        whatYouLearn: [
          'プログラミングの基本概念（順次処理、条件分岐、繰り返し）',
          'Scratchの基本操作方法',
          'キャラクターを動かすプログラムの作成',
          '簡単なゲームやアニメーションの制作',
          '論理的思考力と問題解決能力'
        ],
        schedules: [
          {
            id: 'schedule-1',
            startAt: '2024-01-25T10:00:00Z',
            endAt: '2024-01-25T11:00:00Z',
            availableSlots: 3
          },
          {
            id: 'schedule-2',
            startAt: '2024-01-27T14:00:00Z',
            endAt: '2024-01-27T15:00:00Z',
            availableSlots: 5
          },
          {
            id: 'schedule-3',
            startAt: '2024-01-30T10:00:00Z',
            endAt: '2024-01-30T11:00:00Z',
            availableSlots: 2
          }
        ],
        images: [],
        isLiked: false
      };
      
      setClassDetail(mockClassDetail);
      setIsLiked(mockClassDetail.isLiked);
    } catch (error) {
      console.error('クラス詳細の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    try {
      // 実際のAPIコールをここに実装
      setIsLiked(!isLiked);
    } catch (error) {
      console.error('いいねの更新に失敗:', error);
    }
  };

  const handleBooking = () => {
    if (!selectedSchedule) {
      alert('スケジュールを選択してください');
      return;
    }
    
    // 予約ページに遷移（実際の実装では予約フローを実装）
    alert('予約機能は実装中です');
  };

  const getDifficultyLabel = (difficulty: string) => {
    const difficultyMap = {
      beginner: '初心者向け',
      intermediate: '中級者向け',
      advanced: '上級者向け'
    };
    return difficultyMap[difficulty as keyof typeof difficultyMap] || difficulty;
  };

  const getDifficultyColor = (difficulty: string) => {
    const colorMap = {
      beginner: 'bg-green-100 text-green-800',
      intermediate: 'bg-yellow-100 text-yellow-800',
      advanced: 'bg-red-100 text-red-800'
    };
    return colorMap[difficulty as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!classDetail) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">クラスが見つかりません</h2>
          <Link href="/classes" className="text-purple-600 hover:text-purple-500">
            クラス一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* パンくずリスト */}
        <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-6">
          <Link href="/" className="hover:text-purple-600">ホーム</Link>
          <span>/</span>
          <Link href="/classes" className="hover:text-purple-600">クラス一覧</Link>
          <span>/</span>
          <span className="text-gray-900">{classDetail.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報 */}
          <div className="lg:col-span-2">
            {/* ヘッダー */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-3">
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
                      {classDetail.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(classDetail.difficulty)}`}>
                      {getDifficultyLabel(classDetail.difficulty)}
                    </span>
                  </div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{classDetail.title}</h1>
                  <p className="text-gray-600 mb-4">{classDetail.description}</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleLike}
                    className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                  >
                    {isLiked ? (
                      <HeartSolidIcon className="w-6 h-6 text-red-500" />
                    ) : (
                      <HeartIcon className="w-6 h-6" />
                    )}
                  </button>
                  <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                    <ShareIcon className="w-6 h-6" />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div className="flex items-center space-x-2">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">{classDetail.duration}分</span>
                </div>
                <div className="flex items-center space-x-2">
                  <UserGroupIcon className="w-5 h-5 text-gray-400" />
                  <span className="text-sm text-gray-600">定員{classDetail.capacity}名</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">対象年齢: {classDetail.ageRange}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                  <span className="text-sm font-medium">{classDetail.rating}</span>
                  <span className="text-sm text-gray-500">({classDetail.reviewCount}件)</span>
                </div>
              </div>
            </div>

            {/* 詳細説明 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">クラスについて</h2>
              <div className="prose prose-sm max-w-none">
                {classDetail.longDescription.split('\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-600 mb-4">{paragraph}</p>
                ))}
              </div>
            </div>

            {/* 学習内容 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">学習内容</h2>
              <ul className="space-y-2">
                {classDetail.whatYouLearn.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-purple-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 受講要件 */}
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">受講要件・持ち物</h2>
              <ul className="space-y-2">
                {classDetail.requirements.map((item, index) => (
                  <li key={index} className="flex items-start space-x-2">
                    <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-600">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* 教室・講師情報 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">教室情報</h3>
                <Link href={`/schools/${classDetail.school.id}`} className="block hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <h4 className="font-medium text-purple-600 hover:text-purple-700">{classDetail.school.name}</h4>
                  <div className="flex items-center space-x-2 mt-2 text-sm text-gray-600">
                    <MapPinIcon className="w-4 h-4" />
                    <span>{classDetail.school.address}</span>
                  </div>
                  <div className="flex items-center space-x-1 mt-2">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{classDetail.school.rating}</span>
                    <span className="text-sm text-gray-500">({classDetail.school.reviewCount}件)</span>
                  </div>
                </Link>
              </div>

              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">講師情報</h3>
                <Link href={`/instructors/${classDetail.instructor.id}`} className="block hover:bg-gray-50 p-2 rounded-md transition-colors">
                  <div className="flex items-center space-x-3 mb-2">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <UserIcon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-600 hover:text-purple-700">{classDetail.instructor.name}</h4>
                      <p className="text-sm text-gray-500">指導歴{classDetail.instructor.experience}</p>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">{classDetail.instructor.profile}</p>
                  <div className="flex items-center space-x-1">
                    <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{classDetail.instructor.rating}</span>
                    <span className="text-sm text-gray-500">({classDetail.instructor.reviewCount}件)</span>
                  </div>
                </Link>
              </div>
            </div>
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 予約カード */}
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <TicketIcon className="w-5 h-5 text-purple-600" />
                  <span className="text-lg font-semibold text-gray-900">チケット1枚</span>
                </div>
                <span className="text-sm text-gray-500">¥{classDetail.price.toLocaleString()}</span>
              </div>

              <div className="mb-6">
                <h3 className="text-sm font-medium text-gray-900 mb-3">スケジュールを選択</h3>
                <div className="space-y-2">
                  {classDetail.schedules.map((schedule) => (
                    <label
                      key={schedule.id}
                      className={`block p-3 border rounded-lg cursor-pointer transition-colors ${
                        selectedSchedule === schedule.id
                          ? 'border-purple-500 bg-purple-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <input
                        type="radio"
                        name="schedule"
                        value={schedule.id}
                        checked={selectedSchedule === schedule.id}
                        onChange={(e) => setSelectedSchedule(e.target.value)}
                        className="sr-only"
                      />
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center space-x-2 text-sm font-medium text-gray-900">
                            <CalendarIcon className="w-4 h-4" />
                            <span>
                              {new Date(schedule.startAt).toLocaleDateString('ja-JP', {
                                month: 'short',
                                day: 'numeric',
                                weekday: 'short'
                              })}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-gray-600 mt-1">
                            <ClockIcon className="w-4 h-4" />
                            <span>
                              {new Date(schedule.startAt).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })} - {new Date(schedule.endAt).toLocaleTimeString('ja-JP', {
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                          </div>
                        </div>
                        <span className={`text-xs px-2 py-1 rounded ${
                          schedule.availableSlots > 3
                            ? 'bg-green-100 text-green-800'
                            : schedule.availableSlots > 0
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        }`}>
                          残り{schedule.availableSlots}席
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              <button
                onClick={handleBooking}
                disabled={!selectedSchedule}
                className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-purple-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
              >
                体験レッスンを予約
              </button>

              <p className="text-xs text-gray-500 mt-2 text-center">
                ※ 予約にはログインが必要です
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}