'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { 
  CheckCircleIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
} from '@heroicons/react/24/outline';
import { exchangeCodeForTokens, storeTokens } from '@/lib/auth';
import { STORAGE_KEYS } from '@/lib/config';

export default function AuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const handleCallback = async () => {
      try {
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        if (error) {
          setStatus('error');
          setMessage(errorDescription || 'ログインに失敗しました');
          return;
        }

        if (!code) {
          setStatus('error');
          setMessage('認証コードが見つかりません');
          return;
        }

        // Cognitoトークンエンドポイントでコードをトークンに交換
        const tokenData = await exchangeCodeForTokens(code);
        
        // トークンを安全に保存
        storeTokens(tokenData);

        setStatus('success');
        setMessage('ログインに成功しました');

        // 3秒後にリダイレクト
        setTimeout(() => {
          const returnUrl = localStorage.getItem(STORAGE_KEYS.AUTH_RETURN_URL) || '/';
          localStorage.removeItem(STORAGE_KEYS.AUTH_RETURN_URL);
          router.push(returnUrl);
        }, 3000);

      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(error instanceof Error ? error.message : 'ログイン処理中にエラーが発生しました');
      }
    };

    // デモ用の処理（実際のアプリでは上記のhandleCallbackを使用）
    const demoCallback = () => {
      setTimeout(() => {
        // デモ用のトークン設定
        localStorage.setItem('id_token', 'demo_token');
        localStorage.setItem('user_name', '田中 美香');
        localStorage.setItem('user_email', 'demo@example.com');
        
        setStatus('success');
        setMessage('ログインに成功しました');

        setTimeout(() => {
          router.push('/');
        }, 2000);
      }, 2000);
    };

    // 実際のアプリではhandleCallback()を呼び出し
    demoCallback();
  }, [searchParams, router]);

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
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
          <div className="text-center">
            {status === 'loading' && (
              <>
                <div className="flex justify-center mb-6">
                  <ArrowPathIcon className="w-16 h-16 text-primary-600 animate-spin" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  認証処理中...
                </h2>
                <p className="text-gray-600">
                  しばらくお待ちください
                </p>
              </>
            )}

            {status === 'success' && (
              <>
                <div className="flex justify-center mb-6">
                  <CheckCircleIcon className="w-16 h-16 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ログイン成功！
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="bg-green-50 rounded-lg p-4">
                  <p className="text-sm text-green-800">
                    自動的にホームページにリダイレクトします...
                  </p>
                </div>
              </>
            )}

            {status === 'error' && (
              <>
                <div className="flex justify-center mb-6">
                  <ExclamationCircleIcon className="w-16 h-16 text-red-500" />
                </div>
                <h2 className="text-2xl font-bold text-gray-900 mb-4">
                  ログインエラー
                </h2>
                <p className="text-gray-600 mb-6">
                  {message}
                </p>
                <div className="bg-red-50 rounded-lg p-4 mb-6">
                  <p className="text-sm text-red-800">
                    もう一度ログインをお試しください
                  </p>
                </div>
                <div className="space-y-3">
                  <Link 
                    href="/auth/login"
                    className="w-full btn btn-primary"
                  >
                    ログインページに戻る
                  </Link>
                  <Link 
                    href="/"
                    className="w-full btn btn-ghost"
                  >
                    ホームページに戻る
                  </Link>
                </div>
              </>
            )}
          </div>
        </div>

        {/* サポート情報 */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            ログインでお困りの場合は{' '}
            <Link href="/help" className="text-primary-600 hover:underline">
              ヘルプセンター
            </Link>
            {' '}をご確認ください
          </p>
        </div>
      </div>
    </div>
  );
}