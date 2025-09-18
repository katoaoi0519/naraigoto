'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  EnvelopeIcon,
  LockClosedIcon,
  EyeIcon,
  EyeSlashIcon,
  UserIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { buildLoginUrl } from '@/lib/auth';
import { STORAGE_KEYS } from '@/lib/config';

export default function LoginPage() {
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // 実際のアプリではCognito Hosted UIにリダイレクト
    setTimeout(() => {
      // デモ用のログイン処理
      localStorage.setItem('id_token', 'demo_token');
      localStorage.setItem('user_name', userType === 'parent' ? '田中 美香' : '田中 陽太');
      window.location.href = '/';
    }, 2000);
  };

  const handleCognitoLogin = () => {
    // 戻り先URLを保存
    const returnUrl = new URLSearchParams(window.location.search).get('returnUrl') || '/';
    localStorage.setItem(STORAGE_KEYS.AUTH_RETURN_URL, returnUrl);
    
    // Cognito Hosted UIにリダイレクト
    const loginUrl = buildLoginUrl(userType);
    window.location.href = loginUrl;
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* ロゴ */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">習</span>
          </div>
          <span className="text-3xl font-bold text-gradient-primary">
            習い事Prime
          </span>
        </Link>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900">
            アカウントにログイン
          </h2>
          <p className="mt-2 text-gray-600">
            親子で一緒に習い事を見つけましょう
          </p>
        </div>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
          {/* ユーザータイプ選択 */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-3">
              ログインするアカウント
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setUserType('parent')}
                className={cn(
                  "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200",
                  userType === 'parent'
                    ? "border-primary-500 bg-primary-50 text-primary-700"
                    : "border-gray-300 text-gray-700 hover:border-primary-300 hover:bg-gray-50"
                )}
              >
                <UserIcon className="w-5 h-5 mr-2" />
                保護者
              </button>
              <button
                type="button"
                onClick={() => setUserType('child')}
                className={cn(
                  "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200",
                  userType === 'child'
                    ? "border-accent-yellow bg-yellow-50 text-yellow-700"
                    : "border-gray-300 text-gray-700 hover:border-yellow-300 hover:bg-gray-50"
                )}
              >
                <HeartIcon className="w-5 h-5 mr-2" />
                子ども
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* メールアドレス */}
            <div>
              <label className="form-label">
                メールアドレス
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                  className="form-input pl-10"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* パスワード */}
            <div>
              <label className="form-label">
                パスワード
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <LockClosedIcon className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                  className="form-input pl-10 pr-10"
                  placeholder="パスワードを入力"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                  )}
                </button>
              </div>
            </div>

            {/* ログインボタン */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn btn-primary btn-lg"
            >
              {isLoading ? (
                <>
                  <div className="loading w-5 h-5 mr-2" />
                  ログイン中...
                </>
              ) : (
                'ログイン'
              )}
            </button>
          </form>

          {/* 区切り線 */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">または</span>
              </div>
            </div>
          </div>

          {/* Cognito Hosted UIでログイン */}
          <button
            type="button"
            onClick={handleCognitoLogin}
            className="w-full mt-6 btn btn-outline btn-lg"
          >
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0zm0 22C6.48 22 2 17.52 2 12S6.48 2 12 2s10 4.48 10 10-4.48 10-10 10z"/>
              <path d="M12 6c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6-2.69-6-6-6zm0 10c-2.21 0-4-1.79-4-4s1.79-4 4-4 4 1.79 4 4-1.79 4-4 4z"/>
            </svg>
            Amazon Cognitoでログイン
          </button>

          {/* フッターリンク */}
          <div className="mt-6 space-y-4">
            <div className="text-center">
              <Link href="/auth/forgot-password" className="text-sm text-primary-600 hover:text-primary-700">
                パスワードを忘れた方
              </Link>
            </div>
            
            <div className="text-center">
              <span className="text-sm text-gray-600">
                アカウントをお持ちでない方は{' '}
              </span>
              <Link href="/auth/register" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                新規登録
              </Link>
            </div>
          </div>
        </div>

        {/* 特徴説明 */}
        <div className="mt-8 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-primary-500 rounded-full"></div>
              月額チケット制
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent-pink rounded-full"></div>
              親子別口コミ
            </div>
            <div className="flex items-center justify-center gap-2">
              <div className="w-2 h-2 bg-accent-green rounded-full"></div>
              安心・安全
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}