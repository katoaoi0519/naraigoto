'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { 
  MagnifyingGlassIcon, 
  MapPinIcon, 
  TagIcon, 
  CalendarDaysIcon,
  FunnelIcon 
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

// バリデーションスキーマ
const searchSchema = z.object({
  keyword: z.string().optional(),
  area: z.string().optional(),
  category: z.string().optional(),
  date: z.string().optional(),
  age: z.string().optional(),
  priceRange: z.string().optional(),
});

export type SearchFormValues = z.infer<typeof searchSchema>;

interface SearchFormProps {
  onSubmit: (values: SearchFormValues) => void;
  loading?: boolean;
  variant?: 'default' | 'compact' | 'hero';
  showAdvanced?: boolean;
}

const areas = [
  { value: '', label: 'すべてのエリア' },
  { value: '大阪市中央区', label: '大阪市中央区' },
  { value: '大阪市北区', label: '大阪市北区' },
  { value: '大阪市西区', label: '大阪市西区' },
  { value: '京都市中京区', label: '京都市中京区' },
  { value: '神戸市中央区', label: '神戸市中央区' },
  { value: '奈良市', label: '奈良市' },
];

const categories = [
  { value: '', label: 'すべてのジャンル', icon: '🎯' },
  { value: 'スポーツ', label: 'スポーツ', icon: '⚽' },
  { value: '音楽', label: '音楽', icon: '🎵' },
  { value: '語学', label: '語学', icon: '🗣️' },
  { value: 'アート', label: 'アート・工作', icon: '🎨' },
  { value: 'プログラミング', label: 'プログラミング', icon: '💻' },
  { value: '学習塾', label: '学習塾', icon: '📚' },
  { value: 'ダンス', label: 'ダンス', icon: '💃' },
  { value: '武道', label: '武道', icon: '🥋' },
];

const ageRanges = [
  { value: '', label: 'すべての年齢' },
  { value: '3-5', label: '3-5歳' },
  { value: '6-8', label: '6-8歳' },
  { value: '9-12', label: '9-12歳' },
  { value: '13-15', label: '13-15歳' },
];

const priceRanges = [
  { value: '', label: 'すべての価格帯' },
  { value: '0-3000', label: '3,000円以下' },
  { value: '3000-5000', label: '3,000-5,000円' },
  { value: '5000-8000', label: '5,000-8,000円' },
  { value: '8000-', label: '8,000円以上' },
];

export default function SearchForm({ 
  onSubmit, 
  loading = false, 
  variant = 'default',
  showAdvanced = false 
}: SearchFormProps) {
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(showAdvanced);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SearchFormValues>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keyword: '',
      area: '',
      category: '',
      date: '',
      age: '',
      priceRange: '',
    },
  });

  const handleFormSubmit = (data: SearchFormValues) => {
    onSubmit(data);
  };

  const handleReset = () => {
    reset();
    setIsAdvancedOpen(false);
  };

  if (variant === 'compact') {
    return (
      <form onSubmit={handleSubmit(handleFormSubmit)} className="flex items-center space-x-2">
        <div className="flex-1 relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            {...register('keyword')}
            type="text"
            placeholder="教室名・エリア・ジャンルで検索"
            className="form-input pl-10 pr-4 py-2 w-full"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary btn-md"
        >
          {loading ? (
            <div className="loading w-4 h-4" />
          ) : (
            <MagnifyingGlassIcon className="h-4 w-4" />
          )}
        </button>
      </form>
    );
  }

  return (
    <div className={cn(
      "bg-white rounded-2xl shadow-xl border border-gray-100",
      variant === 'hero' ? 'p-8' : 'p-6'
    )}>
      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
        {/* 基本検索フィールド */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* キーワード検索 */}
          <div className="lg:col-span-2">
            <label className="form-label flex items-center">
              <MagnifyingGlassIcon className="w-4 h-4 mr-2 text-gray-500" />
              キーワード
            </label>
            <input
              {...register('keyword')}
              type="text"
              placeholder="教室名・先生名で検索"
              className="form-input"
            />
            {errors.keyword && (
              <p className="form-error">{errors.keyword.message}</p>
            )}
          </div>

          {/* エリア */}
          <div>
            <label className="form-label flex items-center">
              <MapPinIcon className="w-4 h-4 mr-2 text-gray-500" />
              エリア
            </label>
            <select {...register('area')} className="form-select">
              {areas.map((area) => (
                <option key={area.value} value={area.value}>
                  {area.label}
                </option>
              ))}
            </select>
            {errors.area && (
              <p className="form-error">{errors.area.message}</p>
            )}
          </div>

          {/* 日付 */}
          <div>
            <label className="form-label flex items-center">
              <CalendarDaysIcon className="w-4 h-4 mr-2 text-gray-500" />
              希望日
            </label>
            <input
              {...register('date')}
              type="date"
              min={new Date().toISOString().split('T')[0]}
              className="form-input"
            />
            {errors.date && (
              <p className="form-error">{errors.date.message}</p>
            )}
          </div>
        </div>

        {/* ジャンル選択（カード形式） */}
        <div>
          <label className="form-label flex items-center">
            <TagIcon className="w-4 h-4 mr-2 text-gray-500" />
            ジャンル
          </label>
          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {categories.map((category) => (
              <label
                key={category.value}
                className="relative cursor-pointer group"
              >
                <input
                  {...register('category')}
                  type="radio"
                  value={category.value}
                  className="sr-only peer"
                />
                <div className="p-3 border-2 border-gray-200 rounded-lg text-center transition-all duration-200 peer-checked:border-primary-500 peer-checked:bg-primary-50 group-hover:border-primary-300">
                  <div className="text-2xl mb-1">{category.icon}</div>
                  <div className="text-xs font-medium text-gray-700 peer-checked:text-primary-700">
                    {category.label}
                  </div>
                </div>
              </label>
            ))}
          </div>
          {errors.category && (
            <p className="form-error">{errors.category.message}</p>
          )}
        </div>

        {/* 詳細検索オプション */}
        <div>
          <button
            type="button"
            onClick={() => setIsAdvancedOpen(!isAdvancedOpen)}
            className="flex items-center text-sm text-gray-600 hover:text-primary-600 transition-colors duration-200"
          >
            <FunnelIcon className="w-4 h-4 mr-1" />
            詳細検索
            <svg
              className={cn(
                "w-4 h-4 ml-1 transition-transform duration-200",
                isAdvancedOpen ? "rotate-180" : ""
              )}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <div className={cn(
            "overflow-hidden transition-all duration-300",
            isAdvancedOpen ? "max-h-96 opacity-100 mt-4" : "max-h-0 opacity-0"
          )}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              {/* 対象年齢 */}
              <div>
                <label className="form-label">対象年齢</label>
                <select {...register('age')} className="form-select">
                  {ageRanges.map((age) => (
                    <option key={age.value} value={age.value}>
                      {age.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* 価格帯 */}
              <div>
                <label className="form-label">価格帯</label>
                <select {...register('priceRange')} className="form-select">
                  {priceRanges.map((price) => (
                    <option key={price.value} value={price.value}>
                      {price.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* アクションボタン */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <button
            type="submit"
            disabled={loading}
            className={cn(
              "btn btn-primary",
              variant === 'hero' ? 'btn-xl' : 'btn-lg'
            )}
          >
            {loading ? (
              <>
                <div className="loading w-5 h-5 mr-2" />
                検索中...
              </>
            ) : (
              <>
                <MagnifyingGlassIcon className="w-5 h-5 mr-2" />
                習い事を検索
              </>
            )}
          </button>
          
          <button
            type="button"
            onClick={handleReset}
            className={cn(
              "btn btn-ghost",
              variant === 'hero' ? 'btn-xl' : 'btn-lg'
            )}
          >
            リセット
          </button>
        </div>
      </form>

      {/* 人気の検索キーワード */}
      {variant === 'hero' && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-3">人気の検索キーワード:</p>
          <div className="flex flex-wrap gap-2">
            {['ピアノ', 'サッカー', '英語', 'プログラミング', 'ダンス', '書道'].map((keyword) => (
              <button
                key={keyword}
                type="button"
                onClick={() => {
                  reset({ keyword });
                  handleFormSubmit({ keyword, area: '', category: '', date: '', age: '', priceRange: '' });
                }}
                className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded-full hover:bg-primary-100 hover:text-primary-700 transition-colors duration-200"
              >
                #{keyword}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}