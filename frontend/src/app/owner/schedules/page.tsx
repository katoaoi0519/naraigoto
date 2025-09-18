'use client';

export default function OwnerSchedules() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  if (role !== 'owner') return <p>オーナー権限が必要です。</p>;
  return (
    <div>
      <h1>開催枠管理</h1>
    </div>
  );
}


