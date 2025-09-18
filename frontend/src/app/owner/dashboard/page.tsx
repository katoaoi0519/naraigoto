'use client';

export default function OwnerDashboard() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  if (role !== 'owner') {
    return <p>オーナー権限が必要です。</p>;
  }
  return (
    <div>
      <h1>オーナーダッシュボード</h1>
    </div>
  );
}


