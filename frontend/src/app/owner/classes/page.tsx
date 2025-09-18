'use client';

export default function OwnerClasses() {
  const role = typeof window !== 'undefined' ? localStorage.getItem('role') : null;
  if (role !== 'owner') return <p>オーナー権限が必要です。</p>;
  return (
    <div>
      <h1>クラス管理</h1>
    </div>
  );
}


