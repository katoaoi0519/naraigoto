// Minimal Cognito Hosted UI + PKCE helpers for CSR pages
// For environments where node types are not picked up during lint
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare const process: any;

export type CognitoTokens = {
  id_token: string;
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
};

const COGNITO_DOMAIN = process.env.NEXT_PUBLIC_COGNITO_DOMAIN || '';
const COGNITO_CLIENT_ID = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID || '';
const COGNITO_REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_REDIRECT_URI || '';
const COGNITO_LOGOUT_REDIRECT_URI = process.env.NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT_URI || COGNITO_REDIRECT_URI || '';

const STORAGE_PKCE_VERIFIER = 'auth.pkce_verifier';
const STORAGE_AUTH_STATE = 'auth.state';

function toBase64Url(input: ArrayBuffer): string {
  const bytes = new Uint8Array(input);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) binary += String.fromCharCode(bytes[i]);
  if (typeof window === 'undefined' || typeof btoa === 'undefined') {
    throw new Error('Base64 encoding requires a browser environment.');
  }
  const base64 = btoa(binary);
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export async function generateCodeVerifier(): Promise<string> {
  const random = crypto.getRandomValues(new Uint8Array(32));
  return toBase64Url(random.buffer);
}

export async function generateCodeChallenge(codeVerifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(codeVerifier);
  const digest = await crypto.subtle.digest('SHA-256', data);
  return toBase64Url(digest);
}

export function generateState(): string {
  const random = crypto.getRandomValues(new Uint8Array(16));
  return toBase64Url(random.buffer);
}

export function storePkce(verifier: string, state: string) {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(STORAGE_PKCE_VERIFIER, verifier);
  sessionStorage.setItem(STORAGE_AUTH_STATE, state);
}

export function readAndClearPkce(): { verifier?: string; state?: string } {
  if (typeof window === 'undefined') return {};
  const verifier = sessionStorage.getItem(STORAGE_PKCE_VERIFIER) || undefined;
  const state = sessionStorage.getItem(STORAGE_AUTH_STATE) || undefined;
  sessionStorage.removeItem(STORAGE_PKCE_VERIFIER);
  sessionStorage.removeItem(STORAGE_AUTH_STATE);
  return { verifier, state };
}

export function buildLoginUrl(codeChallenge: string, state: string): string {
  const base = `${COGNITO_DOMAIN}/oauth2/authorize`;
  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    response_type: 'code',
    scope: 'openid email profile',
    redirect_uri: COGNITO_REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    state,
  });
  return `${base}?${params.toString()}`;
}

export function buildLogoutUrl(): string {
  const base = `${COGNITO_DOMAIN}/logout`;
  const params = new URLSearchParams({
    client_id: COGNITO_CLIENT_ID,
    logout_uri: COGNITO_LOGOUT_REDIRECT_URI,
    response_type: 'code',
  });
  return `${base}?${params.toString()}`;
}

export async function exchangeCodeForTokens(code: string, codeVerifier: string): Promise<CognitoTokens> {
  const tokenEndpoint = `${COGNITO_DOMAIN}/oauth2/token`;
  const body = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: COGNITO_CLIENT_ID,
    code,
    redirect_uri: COGNITO_REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const res = await fetch(tokenEndpoint, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: body.toString(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Token exchange failed: ${res.status} ${text}`);
  }
  return res.json();
}

export function saveTokens(tokens: CognitoTokens) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('id_token', tokens.id_token);
  localStorage.setItem('access_token', tokens.access_token);
  if (tokens.refresh_token) localStorage.setItem('refresh_token', tokens.refresh_token);
  localStorage.setItem('token_expires_at', String(Date.now() + tokens.expires_in * 1000));
}

export function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('id_token');
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('token_expires_at');
}


