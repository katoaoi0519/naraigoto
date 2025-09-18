'use client';

import { useState } from 'react';

export default function NewReviewPage() {
  const token = typeof window !== 'undefined' ? localStorage.getItem('id_token') : null;
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(5);
  if (!token) return <p>未ログインです。<a href="/auth/login">ログイン</a></p>;
  return (
    <div>
      <h1>口コミ投稿</h1>
      <label>
        評価
        <input type="number" value={rating} onChange={(e) => setRating(Number(e.target.value))} min={1} max={5} />
      </label>
      <label>
        コメント
        <textarea value={comment} onChange={(e) => setComment(e.target.value)} />
      </label>
      <button disabled={!comment}>送信（モック）</button>
    </div>
  );
}


