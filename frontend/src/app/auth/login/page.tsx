"use client";

import { useCallback, useState } from 'react';
import { buildLoginUrl, generateCodeChallenge, generateCodeVerifier, generateState, storePkce } from '@/lib/auth';

export default function LoginPage() {
  const [error, setError] = useState<string | null>(null);

  const onLogin = useCallback(async () => {
    try {
      setError(null);
      const verifier = await generateCodeVerifier();
      const challenge = await generateCodeChallenge(verifier);
      const state = generateState();
      storePkce(verifier, state);
      const url = buildLoginUrl(challenge, state);
      window.location.assign(url);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'ログイン初期化に失敗しました');
    }
  }, []);

  return (
    <div>
      <h1>ログイン</h1>
      <button onClick={onLogin}>Cognito Hosted UI へ</button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}


