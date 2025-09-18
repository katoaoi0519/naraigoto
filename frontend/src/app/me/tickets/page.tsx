'use client';

export default function MyTickets() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  if (!token) return <p>未ログインです。<a href="/auth/login">ログイン</a></p>;
  return (
    <div>
      <h1>チケット残高</h1>
    </div>
  );
}


