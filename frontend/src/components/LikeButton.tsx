'use client';

import { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import { cn } from '@/lib/utils';
import { isAuthenticated } from '@/lib/auth';
import { schoolsApi } from '@/lib/api';
import { STORAGE_KEYS } from '@/lib/config';

interface LikeButtonProps {
  schoolId: string;
  initialLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'floating' | 'minimal';
  showCount?: boolean;
  likeCount?: number;
  onLikeChange?: (liked: boolean) => void;
  className?: string;
}

export default function LikeButton({
  schoolId,
  initialLiked = false,
  size = 'md',
  variant = 'default',
  showCount = false,
  likeCount = 0,
  onLikeChange,
  className,
}: LikeButtonProps) {
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [currentCount, setCurrentCount] = useState(likeCount);
  const [isLoading, setIsLoading] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // ユーザーがログインしているかチェック
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  
  useEffect(() => {
    setIsLoggedIn(isAuthenticated());
  }, []);

  const handleToggleLike = async () => {
    if (!isLoggedIn) {
      // ログインしていない場合はログインページにリダイレクト
      localStorage.setItem(STORAGE_KEYS.AUTH_RETURN_URL, window.location.pathname);
      window.location.href = '/auth/login';
      return;
    }

    if (isLoading) return;

    setIsLoading(true);
    setIsAnimating(true);

    try {
      // APIを呼び出し
      if (isLiked) {
        await schoolsApi.unlike(schoolId);
      } else {
        await schoolsApi.like(schoolId);
      }

      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      setCurrentCount(prev => newLikedState ? prev + 1 : Math.max(0, prev - 1));
      onLikeChange?.(newLikedState);
      setIsLoading(false);
      
      // アニメーション終了
      setTimeout(() => setIsAnimating(false), 300);

    } catch (error) {
      console.error('Like toggle error:', error);
      setIsLoading(false);
      setIsAnimating(false);
      // エラー通知を表示（実際のアプリではトーストなど）
      alert('いいね処理に失敗しました');
    }
  };

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const buttonSizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  };

  const getButtonClasses = () => {
    const baseClasses = `
      inline-flex items-center justify-center gap-2 rounded-full transition-all duration-200 
      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-pink/50
      ${buttonSizeClasses[size]}
    `;

    switch (variant) {
      case 'floating':
        return `${baseClasses} bg-white/90 backdrop-blur-sm shadow-lg hover:bg-white hover:shadow-xl`;
      case 'minimal':
        return `${baseClasses} hover:bg-gray-100`;
      default:
        return `${baseClasses} bg-white border border-gray-200 hover:bg-gray-50 hover:border-gray-300 shadow-sm hover:shadow-md`;
    }
  };

  const getIconClasses = () => {
    return cn(
      sizeClasses[size],
      'transition-all duration-200',
      isAnimating && 'animate-bounce',
      isLiked ? 'text-accent-pink' : 'text-gray-400 hover:text-accent-pink'
    );
  };

  const getCountClasses = () => {
    return cn(
      'text-sm font-medium transition-colors duration-200',
      isLiked ? 'text-accent-pink' : 'text-gray-600'
    );
  };

  return (
    <button
      onClick={handleToggleLike}
      disabled={isLoading}
      className={cn(getButtonClasses(), className)}
      title={isLoggedIn ? (isLiked ? 'いいねを取り消す' : 'いいねする') : 'ログインしていいねする'}
      aria-label={isLiked ? 'いいねを取り消す' : 'いいねする'}
    >
      {/* ローディング中のスピナー */}
      {isLoading ? (
        <div className={cn(sizeClasses[size], 'animate-spin')}>
          <svg className="w-full h-full" fill="none" viewBox="0 0 24 24">
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      ) : (
        /* ハートアイコン */
        <>
          {isLiked ? (
            <HeartSolidIcon className={getIconClasses()} />
          ) : (
            <HeartIcon className={getIconClasses()} />
          )}
          
          {/* カウント表示 */}
          {showCount && (
            <span className={getCountClasses()}>
              {currentCount}
            </span>
          )}
        </>
      )}
    </button>
  );
}