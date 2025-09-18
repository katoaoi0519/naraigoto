'use client';

import { useEffect, useState } from 'react';

export default function MeDashboard() {
  const [authenticated, setAuthenticated] = useState<boolean | null>(null);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('id_token');
    setAuthenticated(!!token);
    if (token) {
      setUserName(localStorage.getItem('user_name') || 'ユーザー様');
    }
  }, []);

  if (authenticated === null) {
    return (
      <div className="py-16">
        <div className="container text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-gray-600">認証状態を確認中...</p>
        </div>
      </div>
    );
  }

  if (!authenticated) {
    return (
      <div className="py-16">
        <div className="container text-center max-w-md mx-auto">
          <div className="card">
            <div className="card-body">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">ログインが必要です</h2>
              <p className="text-gray-600 mb-6">マイページをご利用いただくには、ログインしてください。</p>
              <a href="/auth/login" className="btn btn-primary">
                ログイン
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            マイページ
          </h1>
          <p className="text-gray-600">
            こんにちは、{userName}さん
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-purple-600 mb-2">3</div>
              <p className="text-gray-600">予約中のレッスン</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-blue-600 mb-2">12</div>
              <p className="text-gray-600">残りチケット</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-green-600 mb-2">150</div>
              <p className="text-gray-600">ポイント</p>
            </div>
          </div>
          <div className="card">
            <div className="card-body text-center">
              <div className="text-2xl font-bold text-yellow-600 mb-2">5</div>
              <p className="text-gray-600">お気に入り</p>
            </div>
          </div>
        </div>

        {/* Main Navigation */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <a href="/me/bookings" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-purple-600 transition-colors">予約管理</h3>
                  <p className="text-gray-600 text-sm">レッスンの予約・キャンセル</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/me/tickets" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 11-4 0V7a2 2 0 00-2-2H5z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">チケット残高</h3>
                  <p className="text-gray-600 text-sm">残りチケット数の確認</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/me/likes" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-red-600 transition-colors">お気に入り</h3>
                  <p className="text-gray-600 text-sm">気になる習い事をチェック</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/me/reviews/new" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-yellow-600 transition-colors">レビュー投稿</h3>
                  <p className="text-gray-600 text-sm">受講した感想をシェア</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/me/points" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-green-600 transition-colors">ポイント</h3>
                  <p className="text-gray-600 text-sm">ポイントの確認・利用</p>
                </div>
              </div>
            </div>
          </a>

          <a href="/me/referrals" className="card group hover:shadow-lg transition-all duration-200">
            <div className="card-body">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors">友達紹介</h3>
                  <p className="text-gray-600 text-sm">友達を紹介してポイント獲得</p>
                </div>
              </div>
            </div>
          </a>
        </div>
      </div>
    </div>
  );
}


