'use client';

export default function MyPoints() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  if (!token) return <p>未ログインです。<a href="/auth/login">ログイン</a></p>;
  return (
    <div>
      <h1>ポイント</h1>
    </div>
  );
}


