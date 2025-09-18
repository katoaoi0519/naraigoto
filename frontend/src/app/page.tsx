'use client';

import { useState } from 'react';
import { SearchForm, type SearchFormValues } from '@/components/SearchForm';

export default function HomePage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (values: SearchFormValues) => {
    setIsSearching(true);
    // Simulate API call
    setTimeout(() => {
      setSearchResults([
        { id: '1', title: 'サッカー教室 大阪校', area: '大阪市', category: 'スポーツ', rating: 4.8 },
        { id: '2', title: 'ピアノレッスン 梅田', area: '大阪市', category: '音楽', rating: 4.6 },
        { id: '3', title: '英会話スクール キッズ', area: '大阪市', category: '語学', rating: 4.7 },
      ]);
      setIsSearching(false);
    }, 1000);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 text-white">
        <div className="container py-20">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              親子で一緒に成長できる<br />
              <span className="text-yellow-300">最高の習い事</span>を見つけよう
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              習い事の検索から予約まで。お子さまの可能性を広げる学びの場がここにあります。
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/schools" className="btn btn-lg bg-white text-purple-600 hover:bg-gray-100">
                教室を探す
              </a>
              <a href="/about" className="btn btn-lg btn-outline text-white border-white hover:bg-white hover:text-purple-600">
                サービス紹介
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Search Section */}
      <section className="py-16 bg-white">
        <div className="container">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">
                習い事を検索
              </h2>
              <p className="text-lg text-gray-600">
                エリア・ジャンル・日付から、お子さまにぴったりの習い事を見つけましょう
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <SearchForm onSubmit={handleSearch} />
              
              {isSearching && (
                <div className="text-center py-8">
                  <div className="loading mx-auto mb-4"></div>
                  <p className="text-gray-600">検索中...</p>
                </div>
              )}

              {searchResults.length > 0 && (
                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">検索結果</h3>
                  <div className="grid gap-4">
                    {searchResults.map((result) => (
                      <div key={result.id} className="card">
                        <div className="card-body">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-semibold text-gray-900">{result.title}</h4>
                              <p className="text-gray-600">{result.area} • {result.category}</p>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-yellow-500">★</span>
                              <span className="font-medium">{result.rating}</span>
                            </div>
                          </div>
                          <div className="mt-4">
                            <a href={`/schools/${result.id}`} className="btn btn-primary btn-sm">
                              詳細を見る
                            </a>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              習い事Primeの特徴
            </h2>
            <p className="text-lg text-gray-600">
              親子の学びを全力でサポートします
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">簡単検索</h3>
              <p className="text-gray-600">
                エリア・ジャンル・日時から、お子さまにぴったりの習い事を簡単に見つけられます。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">オンライン予約</h3>
              <p className="text-gray-600">
                24時間いつでもオンラインで予約・キャンセルが可能。忙しい親御さんも安心です。
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-4">親子で安心</h3>
              <p className="text-gray-600">
                保護者と子どもの両方の視点からレビューを確認。安心して習い事を選べます。
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="container text-center">
          <h2 className="text-3xl font-bold mb-4">
            今すぐ始めましょう
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            無料でアカウント作成。お子さまの新しい可能性を発見しませんか？
          </p>
          <a href="/auth/login" className="btn btn-lg bg-white text-purple-600 hover:bg-gray-100">
            無料で始める
          </a>
        </div>
      </section>
    </div>
  );
}


