'use client';

import { useEffect, useState } from 'react';
import { getMyBookings, cancelBooking } from '@/lib/api';

export default function MyBookings() {
  const [userId, setUserId] = useState<string | null>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const uid = localStorage.getItem('user_id') || 'demo-user';
    setUserId(uid);
    getMyBookings(uid)
      .then((res) => setBookings(res.bookings || []))
      .catch(() => setBookings([]))
      .finally(() => setLoading(false));
  }, []);

  if (!userId) return <p>未ログインです。<a href="/auth/login">ログイン</a></p>;
  if (loading) return <p>読み込み中...</p>;

  return (
    <div>
      <h1>予約一覧</h1>
      <ul>
        {bookings.map((b) => (
          <li key={b.bookingId}>
            {b.lessonId} / {b.status}
            {b.status === 'reserved' && (
              <button style={{ marginLeft: 8 }} onClick={async () => {
                await cancelBooking(b.bookingId).catch(() => {});
                const res = await getMyBookings(userId);
                setBookings(res.bookings || []);
              }}>キャンセル</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}


