'use client';

import { useState } from 'react';

export interface SearchFormValues {
  area: string;
  category: string;
  date: string;
}

export function SearchForm(props: { onSubmit: (values: SearchFormValues) => void }) {
  const [area, setArea] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        props.onSubmit({ area, category, date });
      }}
      className="space-y-6"
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="form-group">
          <label className="form-label">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            エリア
          </label>
          <select 
            value={area} 
            onChange={(e) => setArea(e.target.value)}
            className="form-select"
          >
            <option value="">すべてのエリア</option>
            <option value="大阪市">大阪市</option>
            <option value="京都市">京都市</option>
            <option value="神戸市">神戸市</option>
            <option value="奈良市">奈良市</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            ジャンル
          </label>
          <select 
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="form-select"
          >
            <option value="">すべてのジャンル</option>
            <option value="スポーツ">スポーツ</option>
            <option value="音楽">音楽</option>
            <option value="語学">語学</option>
            <option value="アート">アート</option>
            <option value="プログラミング">プログラミング</option>
            <option value="学習塾">学習塾</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">
            <svg className="w-4 h-4 inline mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            希望日
          </label>
          <input 
            type="date" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            className="form-input"
            min={new Date().toISOString().split('T')[0]}
          />
        </div>
      </div>

      <div className="flex justify-center">
        <button type="submit" className="btn btn-primary btn-lg">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          習い事を検索
        </button>
      </div>
    </form>
  );
}


