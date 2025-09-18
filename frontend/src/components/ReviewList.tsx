'use client';

import { useState } from 'react';
import { 
  StarIcon,
  HandThumbUpIcon,
  FunnelIcon,
  ChevronDownIcon,
  UserIcon,
  HeartIcon,
} from '@heroicons/react/24/outline';
import { StarIcon as StarSolidIcon } from '@heroicons/react/24/solid';
import { cn, formatDate, generateStarArray } from '@/lib/utils';

interface Review {
  id: string;
  type: 'parent' | 'child';
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerAge: string;
  childAge?: string;
  date: string;
  targetType: 'school' | 'instructor';
  targetName?: string;
  helpful: number;
  isHelpful?: boolean;
  images?: string[];
}

interface ReviewListProps {
  reviews: Review[];
  showFilters?: boolean;
  showPagination?: boolean;
  pageSize?: number;
  className?: string;
}

const filterOptions = [
  { value: 'all', label: 'すべて' },
  { value: 'parent', label: '保護者のみ' },
  { value: 'child', label: '子どものみ' },
  { value: 'rating_5', label: '★5のみ' },
  { value: 'rating_4_plus', label: '★4以上' },
  { value: 'recent', label: '最新順' },
  { value: 'helpful', label: '参考になった順' },
];

const sortOptions = [
  { value: 'newest', label: '新しい順' },
  { value: 'oldest', label: '古い順' },
  { value: 'rating_high', label: '評価の高い順' },
  { value: 'rating_low', label: '評価の低い順' },
  { value: 'helpful', label: '参考になった順' },
];

export default function ReviewList({
  reviews,
  showFilters = true,
  showPagination = true,
  pageSize = 10,
  className,
}: ReviewListProps) {
  const [filteredReviews, setFilteredReviews] = useState(reviews);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [selectedSort, setSelectedSort] = useState('newest');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // フィルタリング・ソート処理
  const applyFilters = (filter: string, sort: string) => {
    let filtered = [...reviews];

    // フィルター適用
    switch (filter) {
      case 'parent':
        filtered = filtered.filter(r => r.type === 'parent');
        break;
      case 'child':
        filtered = filtered.filter(r => r.type === 'child');
        break;
      case 'rating_5':
        filtered = filtered.filter(r => r.rating === 5);
        break;
      case 'rating_4_plus':
        filtered = filtered.filter(r => r.rating >= 4);
        break;
    }

    // ソート適用
    switch (sort) {
      case 'oldest':
        filtered.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case 'rating_high':
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case 'rating_low':
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case 'helpful':
        filtered.sort((a, b) => b.helpful - a.helpful);
        break;
      default: // newest
        filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    }

    setFilteredReviews(filtered);
    setCurrentPage(1);
  };

  const handleFilterChange = (filter: string) => {
    setSelectedFilter(filter);
    applyFilters(filter, selectedSort);
  };

  const handleSortChange = (sort: string) => {
    setSelectedSort(sort);
    applyFilters(selectedFilter, sort);
  };

  const handleHelpful = async (reviewId: string) => {
    // 実際のアプリではAPIを呼び出し
    console.log('Mark as helpful:', reviewId);
  };

  // ページネーション
  const totalPages = Math.ceil(filteredReviews.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const currentReviews = filteredReviews.slice(startIndex, endIndex);

  const renderStars = (rating: number) => {
    const stars = generateStarArray(rating);
    return (
      <div className="flex items-center gap-0.5">
        {stars.map((star, index) => (
          <StarSolidIcon
            key={index}
            className={cn(
              "w-4 h-4",
              star === 'full' ? "text-yellow-400" : "text-gray-300"
            )}
          />
        ))}
      </div>
    );
  };

  const getReviewTypeInfo = (review: Review) => {
    if (review.type === 'parent') {
      return {
        icon: UserIcon,
        bgColor: 'bg-primary-500',
        label: '保護者',
        name: review.reviewerName,
        age: review.reviewerAge,
        additional: review.childAge ? `お子様: ${review.childAge}` : undefined,
      };
    } else {
      return {
        icon: HeartIcon,
        bgColor: 'bg-accent-yellow',
        label: '子ども',
        name: review.reviewerName,
        age: review.reviewerAge,
        additional: undefined,
      };
    }
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* フィルター・ソート */}
      {showFilters && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-4">
              <span className="font-medium text-gray-900">
                {filteredReviews.length}件の口コミ
              </span>
              
              {/* モバイル用フィルターボタン */}
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="sm:hidden flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
              >
                <FunnelIcon className="w-4 h-4" />
                フィルター
                <ChevronDownIcon className={cn(
                  "w-4 h-4 transition-transform",
                  isFilterOpen && "rotate-180"
                )} />
              </button>
            </div>

            {/* デスクトップ用フィルター */}
            <div className={cn(
              "flex flex-col sm:flex-row gap-4 w-full sm:w-auto",
              "sm:flex",
              isFilterOpen ? "flex" : "hidden"
            )}>
              <select
                value={selectedFilter}
                onChange={(e) => handleFilterChange(e.target.value)}
                className="form-select text-sm"
              >
                {filterOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              <select
                value={selectedSort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="form-select text-sm"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* 口コミリスト */}
      <div className="space-y-6">
        {currentReviews.length > 0 ? (
          currentReviews.map((review) => {
            const typeInfo = getReviewTypeInfo(review);
            const TypeIcon = typeInfo.icon;
            
            return (
              <div key={review.id} className="bg-white rounded-lg border border-gray-200 p-6">
                {/* ヘッダー */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn(
                      "w-12 h-12 rounded-full flex items-center justify-center text-white",
                      typeInfo.bgColor
                    )}>
                      <TypeIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {typeInfo.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          （{typeInfo.age}）
                        </span>
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-xs font-medium",
                          review.type === 'parent' 
                            ? "bg-primary-100 text-primary-800"
                            : "bg-yellow-100 text-yellow-800"
                        )}>
                          {typeInfo.label}
                        </span>
                      </div>
                      {typeInfo.additional && (
                        <div className="text-sm text-gray-600">
                          {typeInfo.additional}
                        </div>
                      )}
                      <div className="text-sm text-gray-500">
                        {formatDate(review.date)}
                        {review.targetName && (
                          <> • {review.targetType === 'school' ? '教室' : '講師'}: {review.targetName}</>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {renderStars(review.rating)}
                    <span className="font-semibold text-gray-900">
                      {review.rating}
                    </span>
                  </div>
                </div>

                {/* 口コミ本文 */}
                <div className="mb-4">
                  <p className="text-gray-700 leading-relaxed">
                    {review.comment}
                  </p>
                </div>

                {/* 画像（もしあれば） */}
                {review.images && review.images.length > 0 && (
                  <div className="mb-4">
                    <div className="flex gap-2 overflow-x-auto">
                      {review.images.map((image, index) => (
                        <div
                          key={index}
                          className="w-20 h-20 bg-gray-200 rounded-lg flex-shrink-0 flex items-center justify-center"
                        >
                          <span className="text-2xl">📷</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* アクション */}
                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <button
                    onClick={() => handleHelpful(review.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm transition-colors",
                      review.isHelpful
                        ? "bg-primary-100 text-primary-700"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <HandThumbUpIcon className="w-4 h-4" />
                    参考になった ({review.helpful})
                  </button>

                  <div className="text-sm text-gray-500">
                    {review.targetType === 'school' ? '教室への評価' : '講師への評価'}
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              口コミが見つかりませんでした
            </h3>
            <p className="text-gray-600">
              フィルター条件を変更してお試しください
            </p>
          </div>
        )}
      </div>

      {/* ページネーション */}
      {showPagination && totalPages > 1 && (
        <div className="flex justify-center">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              前へ
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={cn(
                  "px-3 py-2 text-sm rounded-lg transition-colors",
                  currentPage === page
                    ? "bg-primary-600 text-white"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                )}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-2 text-sm bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              次へ
            </button>
          </nav>
        </div>
      )}
    </div>
  );
}