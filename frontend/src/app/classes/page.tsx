'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  ClockIcon,
  UserGroupIcon,
  MapPinIcon,
  StarIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';

interface ClassItem {
  id: string;
  title: string;
  school: {
    id: string;
    name: string;
    area: string;
  };
  instructor: {
    id: string;
    name: string;
  };
  category: string;
  description: string;
  capacity: number;
  duration: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  ageRange: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  price: number;
  nextSchedule?: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<ClassItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'プログラミング', '音楽', 'スポーツ', 'アート・絵画', 
    'ダンス', '学習塾', '料理・お菓子作り', '英会話',
    '書道・習字', '空手・武道', 'バレエ', 'ロボット教室'
  ];

  const areas = [
    '東京都23区', '東京都多摩地区', '神奈川県', '埼玉県', 
    '千葉県', '大阪府', '愛知県', 'その他'
  ];

  const difficulties = [
    { value: 'beginner', label: '初心者向け' },
    { value: 'intermediate', label: '中級者向け' },
    { value: 'advanced', label: '上級者向け' }
  ];

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch('/api/classes');
      // const data = await response.json();
      
      // モックデータ
      const mockClasses: ClassItem[] = [
        {
          id: '1',
          title: 'Scratchで学ぶ初級プログラミング',
          school: {
            id: 'school-1',
            name: 'テックキッズアカデミー渋谷校',
            area: '東京都23区'
          },
          instructor: {
            id: 'instructor-1',
            name: '山田太郎'
          },
          category: 'プログラミング',
          description: 'Scratchを使って楽しくプログラミングの基礎を学びます。論理的思考力を育てながら、ゲームやアニメーションを作成します。',
          capacity: 8,
          duration: 60,
          difficulty: 'beginner',
          ageRange: '6-12歳',
          rating: 4.8,
          reviewCount: 24,
          imageUrl: '/images/programming-class.jpg',
          price: 3500,
          nextSchedule: '2024-01-25T10:00:00Z'
        },
        {
          id: '2',
          title: 'ピアノ個人レッスン（初級）',
          school: {
            id: 'school-2',
            name: 'ミュージックスクール新宿',
            area: '東京都23区'
          },
          instructor: {
            id: 'instructor-2',
            name: '佐藤花子'
          },
          category: '音楽',
          description: '一人ひとりのペースに合わせたピアノの個人レッスンです。基礎から丁寧に指導いたします。',
          capacity: 1,
          duration: 45,
          difficulty: 'beginner',
          ageRange: '4-15歳',
          rating: 4.9,
          reviewCount: 18,
          imageUrl: '/images/piano-class.jpg',
          price: 4000,
          nextSchedule: '2024-01-24T14:00:00Z'
        },
        {
          id: '3',
          title: 'キッズサッカー体験クラス',
          school: {
            id: 'school-3',
            name: 'スポーツクラブ池袋',
            area: '東京都23区'
          },
          instructor: {
            id: 'instructor-3',
            name: '鈴木一郎'
          },
          category: 'スポーツ',
          description: 'サッカーの基本技術を楽しく学びながら、チームワークと運動能力を向上させます。',
          capacity: 12,
          duration: 90,
          difficulty: 'beginner',
          ageRange: '5-12歳',
          rating: 4.7,
          reviewCount: 32,
          imageUrl: '/images/soccer-class.jpg',
          price: 2500,
          nextSchedule: '2024-01-26T16:00:00Z'
        },
        {
          id: '4',
          title: '水彩画アート教室',
          school: {
            id: 'school-4',
            name: 'アートスタジオ青山',
            area: '東京都23区'
          },
          instructor: {
            id: 'instructor-4',
            name: '田中美咲'
          },
          category: 'アート・絵画',
          description: '水彩画の技法を学びながら、自由な発想で作品を制作します。創造力と表現力を育てます。',
          capacity: 6,
          duration: 75,
          difficulty: 'beginner',
          ageRange: '6-15歳',
          rating: 4.6,
          reviewCount: 15,
          imageUrl: '/images/art-class.jpg',
          price: 3000,
          nextSchedule: '2024-01-27T13:00:00Z'
        }
      ];
      
      setClasses(mockClasses);
    } catch (error) {
      console.error('クラス一覧の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredClasses = classes.filter(classItem => {
    const matchesSearch = searchTerm === '' || 
      classItem.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      classItem.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || classItem.category === selectedCategory;
    const matchesArea = selectedArea === '' || classItem.school.area === selectedArea;
    const matchesDifficulty = selectedDifficulty === '' || classItem.difficulty === selectedDifficulty;
    
    return matchesSearch && matchesCategory && matchesArea && matchesDifficulty;
  });

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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">クラス検索</h1>
          <p className="text-gray-600">
            様々な教室で開催されている講座を検索できます。興味のあるクラスを見つけて体験してみましょう！
          </p>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="クラス名、教室名、カテゴリで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <FunnelIcon className="w-4 h-4" />
              <span>フィルター</span>
            </button>
          </div>

          {/* フィルターオプション */}
          {showFilters && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">カテゴリ</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">すべて</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">地域</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">すべて</option>
                  {areas.map(area => (
                    <option key={area} value={area}>{area}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">難易度</label>
                <select
                  value={selectedDifficulty}
                  onChange={(e) => setSelectedDifficulty(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="">すべて</option>
                  {difficulties.map(diff => (
                    <option key={diff.value} value={diff.value}>{diff.label}</option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>

        {/* 検索結果 */}
        <div className="mb-6">
          <p className="text-gray-600">
            {filteredClasses.length}件のクラスが見つかりました
          </p>
        </div>

        {/* クラス一覧 */}
        {filteredClasses.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <AcademicCapIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">クラスが見つかりません</h3>
            <p className="text-gray-500">
              検索条件を変更して再度お試しください。
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((classItem) => (
              <Link
                key={classItem.id}
                href={`/classes/${classItem.id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden"
              >
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <AcademicCapIcon className="w-16 h-16 text-purple-400" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                      {classItem.category}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${getDifficultyColor(classItem.difficulty)}`}>
                      {getDifficultyLabel(classItem.difficulty)}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">
                    {classItem.title}
                  </h3>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {classItem.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span>{classItem.school.name}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm text-gray-600">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-4 h-4" />
                          <span>{classItem.duration}分</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-4 h-4" />
                          <span>定員{classItem.capacity}名</span>
                        </div>
                      </div>
                      <span className="text-sm text-gray-500">{classItem.ageRange}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                      <span className="text-sm font-medium">{classItem.rating}</span>
                      <span className="text-sm text-gray-500">({classItem.reviewCount})</span>
                    </div>
                    
                    {classItem.nextSchedule && (
                      <div className="text-sm text-gray-600">
                        次回: {new Date(classItem.nextSchedule).toLocaleDateString('ja-JP', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}