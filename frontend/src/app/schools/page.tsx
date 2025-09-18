'use client';

import { useState, useEffect } from 'react';
import { getLessons } from '@/lib/api';
import { SearchForm, type SearchFormValues } from '@/components/SearchForm';

export default function SchoolsPage() {
  const [lessons, setLessons] = useState<any[]>([]);
  const [filteredLessons, setFilteredLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  useEffect(() => {
    getLessons()
      .then((data) => {
        setLessons(data);
        setFilteredLessons(data);
      })
      .catch(() => {
        // Fallback mock data for demo
        const mockData = [
          { lessonId: '1', title: 'サッカー教室 大阪校', area: '大阪市', category: 'スポーツ', ratingAvg: 4.8, imageKey: 'soccer.jpg' },
          { lessonId: '2', title: 'ピアノレッスン 梅田', area: '大阪市', category: '音楽', ratingAvg: 4.6, imageKey: 'piano.jpg' },
          { lessonId: '3', title: '英会話スクール キッズ', area: '大阪市', category: '語学', ratingAvg: 4.7, imageKey: 'english.jpg' },
          { lessonId: '4', title: 'プログラミング教室', area: '京都市', category: 'プログラミング', ratingAvg: 4.9, imageKey: 'coding.jpg' },
          { lessonId: '5', title: '絵画教室', area: '神戸市', category: 'アート', ratingAvg: 4.5, imageKey: 'art.jpg' },
          { lessonId: '6', title: '数学塾', area: '大阪市', category: '学習塾', ratingAvg: 4.4, imageKey: 'math.jpg' },
        ];
        setLessons(mockData);
        setFilteredLessons(mockData);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleSearch = (values: SearchFormValues) => {
    let filtered = lessons;
    
    if (values.area) {
      filtered = filtered.filter(lesson => lesson.area?.includes(values.area));
    }
    
    if (values.category) {
      filtered = filtered.filter(lesson => lesson.category?.includes(values.category));
    }
    
    setFilteredLessons(filtered);
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredLessons.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLessons = filteredLessons.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            習い事を探す
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            お子さまにぴったりの習い事を見つけましょう。エリアやジャンルから絞り込んで検索できます。
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-12">
          <SearchForm onSubmit={handleSearch} />
        </div>

        {/* Results Summary */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <p className="text-gray-600">
              <span className="font-semibold text-gray-900">{filteredLessons.length}</span> 件の習い事が見つかりました
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select className="form-select" defaultValue="rating">
              <option value="rating">評価順</option>
              <option value="name">名前順</option>
              <option value="area">エリア順</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="text-center py-16">
            <div className="loading mx-auto mb-4"></div>
            <p className="text-gray-600">読み込み中...</p>
          </div>
        )}

        {/* Lessons Grid */}
        {!loading && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {currentLessons.map((lesson) => (
                <div key={lesson.lessonId || lesson.lessonsId} className="card group">
                  {/* Image Placeholder */}
                  <div className="h-48 bg-gradient-to-br from-purple-400 to-blue-500 relative overflow-hidden">
                    <div className="absolute inset-0 bg-black bg-opacity-20 group-hover:bg-opacity-10 transition-all duration-300"></div>
                    <div className="absolute bottom-4 left-4">
                      <span className="bg-white bg-opacity-90 text-gray-900 px-2 py-1 rounded text-xs font-medium">
                        {lesson.category}
                      </span>
                    </div>
                    {lesson.ratingAvg && (
                      <div className="absolute top-4 right-4 bg-white bg-opacity-90 rounded-full px-2 py-1 flex items-center gap-1">
                        <span className="text-yellow-500 text-sm">★</span>
                        <span className="text-sm font-medium">{lesson.ratingAvg}</span>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <h3 className="font-semibold text-gray-900 mb-2 group-hover:text-purple-600 transition-colors">
                      {lesson.title || lesson.lessonId}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4 flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      {lesson.area}
                    </p>
                    
                    <div className="flex justify-between items-center">
                      <a 
                        href={`/schools/${encodeURIComponent(lesson.lessonId || lesson.lessonsId)}`}
                        className="btn btn-primary btn-sm"
                      >
                        詳細を見る
                      </a>
                      <button className="text-gray-400 hover:text-red-500 transition-colors">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-2">
                <button
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  前へ
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`btn btn-sm ${page === currentPage ? 'btn-primary' : 'btn-secondary'}`}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="btn btn-secondary btn-sm disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  次へ
                </button>
              </div>
            )}

            {/* Empty State */}
            {filteredLessons.length === 0 && (
              <div className="text-center py-16">
                <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">習い事が見つかりませんでした</h3>
                <p className="text-gray-600 mb-6">検索条件を変更して再度お試しください。</p>
                <button 
                  onClick={() => {
                    setFilteredLessons(lessons);
                    setCurrentPage(1);
                  }}
                  className="btn btn-primary"
                >
                  すべての習い事を表示
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}


