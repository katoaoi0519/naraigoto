/**
 * アプリケーション設定
 * 環境変数から設定値を取得し、型安全性を確保する
 */

// 必須環境変数の検証
const requiredEnvVars = {
  NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
  NEXT_PUBLIC_COGNITO_DOMAIN: process.env.NEXT_PUBLIC_COGNITO_DOMAIN,
  NEXT_PUBLIC_COGNITO_CLIENT_ID: process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID,
  NEXT_PUBLIC_COGNITO_REDIRECT_URI: process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI,
  NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT_URI: process.env.NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT_URI,
} as const;

// 環境変数の存在確認
const missingEnvVars = Object.entries(requiredEnvVars)
  .filter(([key, value]) => !value)
  .map(([key]) => key);

if (missingEnvVars.length > 0 && process.env.NODE_ENV !== 'development') {
  console.warn(`Missing environment variables: ${missingEnvVars.join(', ')}`);
}

/**
 * API設定
 */
export const API_CONFIG = {
  BASE_URL: requiredEnvVars.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:3001',
  TIMEOUT: 30000, // 30秒
} as const;

/**
 * Cognito設定
 */
export const COGNITO_CONFIG = {
  DOMAIN: requiredEnvVars.NEXT_PUBLIC_COGNITO_DOMAIN || 'naraigoto-prime.auth.ap-northeast-1.amazoncognito.com',
  CLIENT_ID: requiredEnvVars.NEXT_PUBLIC_COGNITO_CLIENT_ID || 'demo_client_id',
  REDIRECT_URI: requiredEnvVars.NEXT_PUBLIC_COGNITO_REDIRECT_URI || 'http://localhost:3000/auth/callback',
  LOGOUT_REDIRECT_URI: requiredEnvVars.NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT_URI || 'http://localhost:3000',
  SCOPES: ['email', 'openid', 'phone', 'profile'] as const,
} as const;

/**
 * アプリケーション設定
 */
export const APP_CONFIG = {
  NAME: '習い事Prime',
  DESCRIPTION: '親子で選ぶ新しい習い事プラットフォーム',
  VERSION: '1.0.0',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
  IS_DEVELOPMENT: process.env.NODE_ENV === 'development',
  IS_PRODUCTION: process.env.NODE_ENV === 'production',
} as const;

/**
 * ローカルストレージキー
 */
export const STORAGE_KEYS = {
  ID_TOKEN: 'id_token',
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER_ID: 'user_id',
  USER_NAME: 'user_name',
  USER_EMAIL: 'user_email',
  USER_TYPE: 'user_type',
  AUTH_RETURN_URL: 'auth_return_url',
} as const;

/**
 * API エンドポイント
 */
export const API_ENDPOINTS = {
  // 認証
  AUTH: {
    CALLBACK: '/api/auth/callback',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
  },
  // 教室
  SCHOOLS: {
    LIST: '/api/schools',
    DETAIL: (id: string) => `/api/schools/${id}`,
    REVIEWS: (id: string) => `/api/schools/${id}/reviews`,
    LIKE: (id: string) => `/api/schools/${id}/like`,
  },
  // 講師
  INSTRUCTORS: {
    LIST: '/api/instructors',
    DETAIL: (id: string) => `/api/instructors/${id}`,
  },
  // クラス・レッスン
  CLASSES: {
    LIST: '/api/classes',
    DETAIL: (id: string) => `/api/classes/${id}`,
  },
  LESSONS: {
    LIST: '/api/lessons',
    DETAIL: (id: string) => `/api/lessons/${id}`,
  },
  // 予約
  BOOKINGS: {
    LIST: '/api/bookings',
    CREATE: '/api/bookings',
    DETAIL: (id: string) => `/api/bookings/${id}`,
    CANCEL: (id: string) => `/api/bookings/${id}/cancel`,
  },
  // ユーザー
  USER: {
    PROFILE: '/api/me',
    BOOKINGS: '/api/me/bookings',
    LIKES: '/api/me/likes',
    TICKETS: '/api/me/tickets',
    POINTS: '/api/me/points',
    REVIEWS: '/api/me/reviews',
  },
  // 口コミ
  REVIEWS: {
    PARENT: '/api/reviews/parent',
    CHILD: '/api/reviews/child',
  },
  // いいね
  LIKES: {
    LIST: '/api/likes',
    FAMILY: (familyId: string) => `/api/families/${familyId}/likes`,
  },
  // 決済
  BILLING: {
    CHECKOUT_SESSION: '/api/billing/checkout-session',
    PORTAL_SESSION: '/api/billing/portal-session',
    WEBHOOK: '/api/webhooks/stripe',
  },
  // ポイント・紹介
  POINTS: {
    REDEEM: '/api/points/redeem',
  },
  REFERRALS: {
    CREATE: '/api/referrals',
    ACCEPT: '/api/referrals/accept',
    LIST: '/api/me/referrals',
  },
} as const;

/**
 * デフォルト値
 */
export const DEFAULTS = {
  PAGINATION: {
    PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100,
  },
  SEARCH: {
    DEBOUNCE_MS: 300,
    MIN_QUERY_LENGTH: 2,
  },
  CACHE: {
    TTL_MS: 5 * 60 * 1000, // 5分
  },
} as const;

/**
 * 設定の型定義
 */
export type ApiConfig = typeof API_CONFIG;
export type CognitoConfig = typeof COGNITO_CONFIG;
export type AppConfig = typeof APP_CONFIG;
export type StorageKeys = typeof STORAGE_KEYS;
export type ApiEndpoints = typeof API_ENDPOINTS;
