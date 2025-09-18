'use client';

import { useEffect, useState } from 'react';
import { clearTokens, exchangeCodeForTokens, readAndClearPkce, saveTokens } from '@/lib/auth';

export default function AuthCallbackPage() {
  const [message, setMessage] = useState('処理中...');

  useEffect(() => {
    const url = new URL(window.location.href);
    const code = url.searchParams.get('code');
    const returnedState = url.searchParams.get('state') || undefined;
    const { verifier, state } = readAndClearPkce();

    (async () => {
      if (!code) {
        setMessage('code が見つかりません。');
        return;
      }
      if (!verifier) {
        setMessage('PKCE verifier が見つかりません。ログインからやり直してください。');
        return;
      }
      if (!returnedState || !state || returnedState !== state) {
        setMessage('state が一致しません。');
        return;
      }
      try {
        const tokens = await exchangeCodeForTokens(code, verifier);
        saveTokens(tokens);
        setMessage('ログイン完了');
        setTimeout(() => { window.location.replace('/me'); }, 300);
      } catch (e: unknown) {
        clearTokens();
        const msg = e instanceof Error ? e.message : 'トークン交換に失敗しました';
        setMessage(msg);
      }
    })();
  }, []);

  return <p>{message}</p>;
}


