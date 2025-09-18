import { COGNITO_CONFIG, STORAGE_KEYS, API_CONFIG, API_ENDPOINTS } from './config';
import { getLocalStorageItem, setLocalStorageItem } from './utils';

/**
 * Cognito認証ユーティリティ
 */

/**
 * Cognito Hosted UI のログインURLを生成
 */
export function buildLoginUrl(userType?: 'parent' | 'child'): string {
  const params = new URLSearchParams({
    client_id: COGNITO_CONFIG.CLIENT_ID,
    response_type: 'code',
    scope: COGNITO_CONFIG.SCOPES.join(' '),
    redirect_uri: COGNITO_CONFIG.REDIRECT_URI,
  });

  // ユーザータイプを状態として渡す
  if (userType) {
    params.append('state', JSON.stringify({ userType }));
  }

  return `https://${COGNITO_CONFIG.DOMAIN}/login?${params.toString()}`;
}

/**
 * Cognito Hosted UI のログアウトURLを生成
 */
export function buildLogoutUrl(): string {
  const params = new URLSearchParams({
    client_id: COGNITO_CONFIG.CLIENT_ID,
    logout_uri: COGNITO_CONFIG.LOGOUT_REDIRECT_URI,
  });

  return `https://${COGNITO_CONFIG.DOMAIN}/logout?${params.toString()}`;
}

/**
 * 認証コードをトークンに交換
 */
export async function exchangeCodeForTokens(code: string): Promise<{
  id_token: string;
  access_token: string;
  refresh_token: string;
}> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.CALLBACK}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      code,
      client_id: COGNITO_CONFIG.CLIENT_ID,
      redirect_uri: COGNITO_CONFIG.REDIRECT_URI,
    }),
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Token exchange failed' }));
    throw new Error(error.message || 'トークン交換に失敗しました');
  }

  return response.json();
}

/**
 * リフレッシュトークンを使用してアクセストークンを更新
 */
export async function refreshAccessToken(refreshToken: string): Promise<{
  id_token: string;
  access_token: string;
}> {
  const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.REFRESH}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      client_id: COGNITO_CONFIG.CLIENT_ID,
    }),
  });

  if (!response.ok) {
    throw new Error('トークンの更新に失敗しました');
  }

  return response.json();
}

/**
 * JWTトークンをデコード（簡易版）
 */
export function decodeJWT(token: string): any {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('JWT decode error:', error);
    return null;
  }
}

/**
 * トークンの有効性をチェック
 */
export function isTokenValid(token: string): boolean {
  try {
    const decoded = decodeJWT(token);
    if (!decoded || !decoded.exp) return false;
    
    const currentTime = Math.floor(Date.now() / 1000);
    return decoded.exp > currentTime;
  } catch {
    return false;
  }
}

/**
 * ローカルストレージからトークンを取得
 */
export function getStoredTokens(): {
  idToken: string | null;
  accessToken: string | null;
  refreshToken: string | null;
} {
  return {
    idToken: getLocalStorageItem(STORAGE_KEYS.ID_TOKEN),
    accessToken: getLocalStorageItem(STORAGE_KEYS.ACCESS_TOKEN),
    refreshToken: getLocalStorageItem(STORAGE_KEYS.REFRESH_TOKEN),
  };
}

/**
 * トークンをローカルストレージに保存
 */
export function storeTokens(tokens: {
  id_token: string;
  access_token: string;
  refresh_token?: string;
}): void {
  setLocalStorageItem(STORAGE_KEYS.ID_TOKEN, tokens.id_token);
  setLocalStorageItem(STORAGE_KEYS.ACCESS_TOKEN, tokens.access_token);
  
  if (tokens.refresh_token) {
    setLocalStorageItem(STORAGE_KEYS.REFRESH_TOKEN, tokens.refresh_token);
  }

  // ユーザー情報をJWTから抽出して保存
  const userInfo = decodeJWT(tokens.id_token);
  if (userInfo) {
    setLocalStorageItem(STORAGE_KEYS.USER_ID, userInfo.sub || '');
    setLocalStorageItem(STORAGE_KEYS.USER_NAME, userInfo.name || '');
    setLocalStorageItem(STORAGE_KEYS.USER_EMAIL, userInfo.email || '');
    
    // カスタムクレームからユーザータイプを取得
    if (userInfo['custom:user_type']) {
      setLocalStorageItem(STORAGE_KEYS.USER_TYPE, userInfo['custom:user_type']);
    }
  }
}

/**
 * 全てのトークンをクリア
 */
export function clearTokens(): void {
  const keysToRemove = [
    STORAGE_KEYS.ID_TOKEN,
    STORAGE_KEYS.ACCESS_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.USER_ID,
    STORAGE_KEYS.USER_NAME,
    STORAGE_KEYS.USER_EMAIL,
    STORAGE_KEYS.USER_TYPE,
  ];

  keysToRemove.forEach(key => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    }
  });
}

/**
 * 現在のユーザー情報を取得
 */
export function getCurrentUser(): {
  id: string;
  name: string;
  email: string;
  type: string;
} | null {
  const userId = getLocalStorageItem(STORAGE_KEYS.USER_ID);
  const userName = getLocalStorageItem(STORAGE_KEYS.USER_NAME);
  const userEmail = getLocalStorageItem(STORAGE_KEYS.USER_EMAIL);
  const userType = getLocalStorageItem(STORAGE_KEYS.USER_TYPE);

  if (!userId || !userName) {
    return null;
  }

  return {
    id: userId,
    name: userName,
    email: userEmail,
    type: userType || 'parent',
  };
}

/**
 * ログイン状態をチェック
 */
export function isAuthenticated(): boolean {
  const { idToken } = getStoredTokens();
  return idToken ? isTokenValid(idToken) : false;
}

/**
 * 認証が必要なAPIリクエスト用のヘッダーを生成
 */
export function getAuthHeaders(): HeadersInit {
  const { accessToken } = getStoredTokens();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (accessToken && isTokenValid(accessToken)) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  return headers;
}

/**
 * 自動的にトークンを更新するAPIリクエスト関数
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const { accessToken, refreshToken } = getStoredTokens();

  // アクセストークンが有効な場合はそのまま使用
  if (accessToken && isTokenValid(accessToken)) {
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        ...getAuthHeaders(),
      },
    });
  }

  // リフレッシュトークンがある場合は更新を試行
  if (refreshToken && isTokenValid(refreshToken)) {
    try {
      const newTokens = await refreshAccessToken(refreshToken);
      storeTokens({
        id_token: newTokens.id_token,
        access_token: newTokens.access_token,
      });

      return fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${newTokens.access_token}`,
          'Content-Type': 'application/json',
        },
      });
    } catch (error) {
      console.error('Token refresh failed:', error);
      clearTokens();
      throw new Error('認証が必要です。再度ログインしてください。');
    }
  }

  throw new Error('認証が必要です。ログインしてください。');
}

/**
 * ログアウト処理
 */
export async function logout(): Promise<void> {
  try {
    // サーバーサイドでのログアウト処理
    await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
      headers: getAuthHeaders(),
    });
  } catch (error) {
    console.error('Server logout failed:', error);
  } finally {
    // ローカルのトークンをクリア
    clearTokens();
    
    // Cognito Hosted UIのログアウトページにリダイレクト
    window.location.href = buildLogoutUrl();
  }
}