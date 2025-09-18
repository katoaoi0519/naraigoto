'use client';

import { useEffect, useState } from 'react';
import { buildLogoutUrl, clearTokens } from '@/lib/auth';

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('id_token');
    if (token) {
      setIsLoggedIn(true);
      // In a real app, decode JWT to get user info
      setUserName(localStorage.getItem('user_name') || 'ユーザー');
    }
  }, []);

  const handleLogout = () => {
    clearTokens();
    localStorage.removeItem('user_id');
    localStorage.removeItem('user_name');
    const logoutUrl = buildLogoutUrl();
    window.location.href = logoutUrl;
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="container">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <div className="flex items-center gap-8">
            <a href="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">習</span>
              </div>
              <span className="text-xl font-bold text-gray-900">習い事Prime</span>
            </a>

            {/* Navigation */}
            <nav className="hidden md:flex items-center gap-6">
              <a href="/schools" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                教室を探す
              </a>
              <a href="/classes" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                クラス
              </a>
              <a href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                料金プラン
              </a>
              <a href="/faq" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                よくある質問
              </a>
              <a href="/about" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                サービスについて
              </a>
            </nav>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-4">
            {isLoggedIn ? (
              <div className="flex items-center gap-4">
                <a href="/me" className="text-gray-600 hover:text-gray-900 font-medium transition-colors">
                  マイページ
                </a>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-medium">
                      {userName.charAt(0)}
                    </span>
                  </div>
                  <span className="text-sm text-gray-700">{userName}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="btn btn-outline btn-sm"
                >
                  ログアウト
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <a href="/auth/login" className="btn btn-outline">
                  ログイン
                </a>
                <a href="/auth/login" className="btn btn-primary">
                  無料で始める
                </a>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden border-t border-gray-200 bg-gray-50">
        <div className="container py-3">
          <nav className="flex items-center justify-between text-sm">
            <a href="/schools" className="text-gray-600 hover:text-gray-900 font-medium">教室を探す</a>
            <a href="/classes" className="text-gray-600 hover:text-gray-900 font-medium">クラス</a>
            <a href="/pricing" className="text-gray-600 hover:text-gray-900 font-medium">料金</a>
            <a href="/faq" className="text-gray-600 hover:text-gray-900 font-medium">FAQ</a>
          </nav>
        </div>
      </div>
    </header>
  );
}
