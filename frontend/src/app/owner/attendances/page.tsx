'use client';

export default function OwnerAttendances() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  if (role !== 'owner') return <p>オーナー権限が必要です。</p>;
  return (
    <div>
      <h1>出欠確定</h1>
    </div>
  );
}


