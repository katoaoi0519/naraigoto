'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Bars3Icon, XMarkIcon, HeartIcon, TicketIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { getCurrentUser, isAuthenticated, logout } from '@/lib/auth';
import { STORAGE_KEYS } from '@/lib/config';

interface User {
  id: string;
  name: string;
  type: 'parent' | 'child';
  avatar?: string;
}

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [ticketBalance, setTicketBalance] = useState(0);

  useEffect(() => {
    // 認証状態とチケット残高を確認
    const checkAuthStatus = () => {
      if (isAuthenticated()) {
        const currentUser = getCurrentUser();
        if (currentUser) {
          const userData = {
            id: currentUser.id,
            name: currentUser.name,
            type: currentUser.type as 'parent' | 'child',
          };
          setUser(userData);
          setTicketBalance(3); // デモ用 - 実際はAPIから取得
        }
      }
    };

    checkAuthStatus();
    
    // ストレージの変更を監視
    const handleStorageChange = () => checkAuthStatus();
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      // エラーが発生してもローカル状態はクリア
      setUser(null);
      setTicketBalance(0);
    }
  };

  const navigation = [
    { name: '教室を探す', href: '/schools' },
    { name: 'クラス', href: '/classes' },
    { name: '料金プラン', href: '/pricing' },
    { name: 'よくある質問', href: '/faq' },
    { name: 'サービスについて', href: '/about' },
  ];

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* ロゴ */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 gradient-primary rounded-xl flex items-center justify-center shadow-sm">
                <span className="text-white font-bold text-lg">習</span>
              </div>
              <div className="hidden sm:block">
                <span className="text-2xl font-bold text-gradient-primary">
                  習い事Prime
                </span>
              </div>
            </Link>
          </div>

          {/* デスクトップナビゲーション */}
          <nav className="hidden lg:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200 relative group"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary-600 transition-all duration-200 group-hover:w-full"></span>
              </Link>
            ))}
          </nav>

          {/* ユーザーアクション */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                {/* チケット残高 */}
                <div className="hidden md:flex items-center space-x-2 bg-primary-50 px-3 py-1.5 rounded-full">
                  <TicketIcon className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">
                    {ticketBalance}枚
                  </span>
                </div>

                {/* いいねボタン */}
                <Link
                  href="/me/likes"
                  className="p-2 text-gray-400 hover:text-accent-pink transition-colors duration-200 relative group"
                  title="お気に入り"
                >
                  <HeartIcon className="w-6 h-6 group-hover:hidden" />
                  <HeartSolidIcon className="w-6 h-6 hidden group-hover:block text-accent-pink" />
                </Link>

                {/* ユーザーメニュー */}
                <div className="relative group">
                  <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {user.name.charAt(0)}
                      </span>
                    </div>
                    <span className="hidden md:block text-sm font-medium text-gray-700">
                      {user.name}
                    </span>
                  </button>

                  {/* ドロップダウンメニュー */}
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                    <Link
                      href="/me"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      マイページ
                    </Link>
                    <Link
                      href="/me/bookings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      予約管理
                    </Link>
                    <Link
                      href="/conversations"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      メッセージ
                    </Link>
                    <Link
                      href="/me/tickets"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      チケット
                    </Link>
                    <Link
                      href="/me/points"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ポイント
                    </Link>
                    <Link
                      href="/me/referrals"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      お友達紹介
                    </Link>
                    <hr className="my-2" />
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      ログアウト
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link href="/auth/login" className="btn btn-ghost btn-sm">
                  ログイン
                </Link>
                <Link href="/auth/login" className="btn btn-primary btn-sm">
                  無料で始める
                </Link>
              </div>
            )}

            {/* モバイルメニューボタン */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 text-gray-400 hover:text-gray-500 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <XMarkIcon className="w-6 h-6" />
              ) : (
                <Bars3Icon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* モバイルメニュー */}
      <div
        className={cn(
          'lg:hidden transition-all duration-300 ease-in-out overflow-hidden',
          isMenuOpen ? 'max-h-screen opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="border-t border-gray-200 bg-gray-50 px-4 py-6 space-y-4">
          {/* モバイルナビゲーション */}
          <nav className="space-y-4">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="block text-gray-600 hover:text-primary-600 font-medium transition-colors duration-200"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* モバイル用ユーザー情報 */}
          {user && (
            <div className="pt-4 border-t border-gray-200 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-accent-pink rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">
                      {user.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{user.name}</p>
                    <p className="text-sm text-gray-500">
                      {user.type === 'parent' ? '保護者' : 'お子様'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2 bg-primary-50 px-3 py-1.5 rounded-full">
                  <TicketIcon className="w-4 h-4 text-primary-600" />
                  <span className="text-sm font-medium text-primary-700">
                    {ticketBalance}枚
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Link
                  href="/me"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  マイページ
                </Link>
                <Link
                  href="/me/likes"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  お気に入り
                </Link>
                <Link
                  href="/me/bookings"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  予約管理
                </Link>
                <Link
                  href="/conversations"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  メッセージ
                </Link>
                <Link
                  href="/me/points"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  ポイント
                </Link>
                <Link
                  href="/me/referrals"
                  className="btn btn-ghost btn-sm justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  紹介
                </Link>
              </div>

              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="w-full btn btn-outline btn-sm"
              >
                ログアウト
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}