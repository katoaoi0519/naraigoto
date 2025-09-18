'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  HeartIcon,
  MapPinIcon,
  StarIcon,
  ClockIcon,
  UserGroupIcon,
  MagnifyingGlassIcon,
  AcademicCapIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';

interface LikedSchool {
  id: string;
  name: string;
  category: string;
  area: string;
  address: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  description: string;
  likedAt: string;
  nextAvailableClass?: {
    id: string;
    title: string;
    startAt: string;
    duration: number;
    capacity: number;
  };
}

export default function MyLikesPage() {
  const [likedSchools, setLikedSchools] = useState<LikedSchool[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  // 認証チェック
  const token = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  
  useEffect(() => {
    if (token) {
      fetchLikedSchools();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchLikedSchools = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch('/api/me/likes');
      // const data = await response.json();
      
      // モックデータ
      const mockLikedSchools: LikedSchool[] = [
        {
          id: '1',
          name: 'テックキッズアカデミー渋谷校',
          category: 'プログラミング',
          area: '東京都23区',
          address: '東京都渋谷区渋谷1-1-1 テックビル3F',
          rating: 4.8,
          reviewCount: 24,
          imageUrl: '/images/tech-kids-academy.jpg',
          description: 'Scratchを使った楽しいプログラミング教室です。初心者のお子様でも安心してご参加いただけます。',
          likedAt: '2024-01-20T10:00:00Z',
          nextAvailableClass: {
            id: 'class-1',
            title: 'Scratchで学ぶ初級プログラミング',
            startAt: '2024-01-25T10:00:00Z',
            duration: 60,
            capacity: 8
          }
        },
        {
          id: '2',
          name: 'ミュージックスクール新宿',
          category: '音楽',
          area: '東京都23区',
          address: '東京都新宿区新宿2-2-2 ミュージックビル2F',
          rating: 4.9,
          reviewCount: 18,
          imageUrl: '/images/music-school.jpg',
          description: '一人ひとりのペースに合わせたピアノの個人レッスンです。基礎から丁寧に指導いたします。',
          likedAt: '2024-01-18T15:30:00Z',
          nextAvailableClass: {
            id: 'class-2',
            title: 'ピアノ個人レッスン（初級）',
            startAt: '2024-01-24T14:00:00Z',
            duration: 45,
            capacity: 1
          }
        },
        {
          id: '3',
          name: 'アートスタジオ青山',
          category: 'アート・絵画',
          area: '東京都23区',
          address: '東京都港区青山3-3-3 アートビル1F',
          rating: 4.6,
          reviewCount: 15,
          imageUrl: '/images/art-studio.jpg',
          description: '水彩画の技法を学びながら、自由な発想で作品を制作します。創造力と表現力を育てます。',
          likedAt: '2024-01-15T09:45:00Z'
        }
      ];
      
      setLikedSchools(mockLikedSchools);
    } catch (error) {
      console.error('いいねした教室の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (schoolId: string) => {
    try {
      // 実際のAPIコールをここに実装
      // await fetch(`/api/schools/${schoolId}/like`, { method: 'DELETE' });
      
      setLikedSchools(prev => prev.filter(school => school.id !== schoolId));
    } catch (error) {
      console.error('いいねの削除に失敗:', error);
    }
  };

  const filteredSchools = likedSchools.filter(school =>
    searchTerm === '' ||
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!token) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">ログインが必要です</h2>
          <p className="text-gray-600 mb-6">お気に入りの教室を確認するにはログインしてください。</p>
          <Link href="/auth/login" className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors">
            ログイン
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">お気に入りの教室</h1>
              <p className="text-gray-600 mt-2">
                いいねした教室一覧です。気になる教室をブックマークして、後で詳細を確認できます。
              </p>
            </div>
            <div className="flex items-center space-x-2 text-purple-600">
              <HeartSolidIcon className="w-6 h-6" />
              <span className="text-lg font-medium">{likedSchools.length}件</span>
            </div>
          </div>
        </div>

        {/* 検索バー */}
        {likedSchools.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
            <div className="relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="教室名やカテゴリで検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
          </div>
        )}

        {/* 教室一覧 */}
        {filteredSchools.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <HeartIcon className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? '検索結果が見つかりません' : 'まだお気に入りの教室がありません'}
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm 
                ? '検索条件を変更して再度お試しください。'
                : '教室を探して、気になる教室に「いいね」してみましょう！'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools"
                className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
              >
                教室を探す
              </Link>
              <Link
                href="/classes"
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
              >
                クラスを探す
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSchools.map((school) => (
              <div key={school.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 overflow-hidden">
                <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                  <div className="w-full h-48 bg-gradient-to-br from-purple-100 to-blue-100 flex items-center justify-center">
                    <AcademicCapIcon className="w-16 h-16 text-purple-400" />
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className="text-sm font-medium text-purple-600 bg-purple-50 px-2 py-1 rounded">
                          {school.category}
                        </span>
                      </div>
                      <Link 
                        href={`/schools/${school.id}`}
                        className="text-lg font-semibold text-gray-900 hover:text-purple-600 transition-colors line-clamp-2"
                      >
                        {school.name}
                      </Link>
                    </div>
                    <button
                      onClick={() => handleUnlike(school.id)}
                      className="p-1 text-red-500 hover:text-red-600 transition-colors"
                      title="いいねを削除"
                    >
                      <HeartSolidIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {school.description}
                  </p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPinIcon className="w-4 h-4" />
                      <span className="truncate">{school.address}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-1">
                        <StarIcon className="w-4 h-4 text-yellow-400 fill-current" />
                        <span className="text-sm font-medium">{school.rating}</span>
                        <span className="text-sm text-gray-500">({school.reviewCount}件)</span>
                      </div>
                      
                      <span className="text-xs text-gray-500">
                        {new Date(school.likedAt).toLocaleDateString('ja-JP')}にいいね
                      </span>
                    </div>
                  </div>

                  {/* 次回開催クラス情報 */}
                  {school.nextAvailableClass && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-4">
                      <p className="text-sm font-medium text-gray-900 mb-1">次回開催クラス</p>
                      <Link 
                        href={`/classes/${school.nextAvailableClass.id}`}
                        className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                      >
                        {school.nextAvailableClass.title}
                      </Link>
                      <div className="flex items-center space-x-4 mt-1 text-xs text-gray-600">
                        <div className="flex items-center space-x-1">
                          <ClockIcon className="w-3 h-3" />
                          <span>
                            {new Date(school.nextAvailableClass.startAt).toLocaleDateString('ja-JP', {
                              month: 'short',
                              day: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <UserGroupIcon className="w-3 h-3" />
                          <span>定員{school.nextAvailableClass.capacity}名</span>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Link
                      href={`/schools/${school.id}`}
                      className="flex-1 bg-purple-600 text-white text-center py-2 px-4 rounded-md hover:bg-purple-700 transition-colors text-sm font-medium"
                    >
                      詳細を見る
                    </Link>
                    {school.nextAvailableClass && (
                      <Link
                        href={`/classes/${school.nextAvailableClass.id}`}
                        className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition-colors text-sm"
                        title="クラスを予約"
                      >
                        予約
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 関連リンク */}
        {likedSchools.length > 0 && (
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mt-12 text-center">
            <h2 className="text-2xl font-bold text-white mb-4">
              新しい習い事を探してみませんか？
            </h2>
            <p className="text-purple-100 mb-6">
              お子様の興味や才能を広げる新たな教室を発見しましょう。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/schools"
                className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
              >
                教室を探す
              </Link>
              <Link
                href="/classes"
                className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-400 transition-colors"
              >
                クラスを探す
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}