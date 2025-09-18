'use client';

import { useState, useEffect } from 'react';
import { getLessonById, getReviewsByLesson, createBooking } from '@/lib/api';
import { LikeButton } from '@/components/LikeButton';
import { ReviewList } from '@/components/ReviewList';

interface Props { params: { id: string } }

export default function SchoolDetailPage({ params }: Props) {
  const [lesson, setLesson] = useState<any>({ lessonId: params.id });
  const [reviews, setReviews] = useState<any>({ parents: [], children: [] });
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    Promise.all([
      getLessonById(params.id).catch(() => ({
        lessonId: params.id,
        title: 'サッカー教室 大阪校',
        area: '大阪市北区',
        category: 'スポーツ',
        ratingAvg: 4.8,
        description: 'プロコーチによる本格的なサッカー指導。初心者から経験者まで、お子さまのレベルに合わせて丁寧に指導いたします。',
        schedule: '毎週土曜日 10:00-12:00',
        price: '月額 8,000円',
        instructor: '田中コーチ'
      })),
      getReviewsByLesson(params.id).catch(() => ({
        parents: [
          { reviewId: '1', rating: 5, comment: 'コーチがとても親切で、子どもが楽しく通っています。', userId: '保護者A', createdAt: new Date().toISOString() },
          { reviewId: '2', rating: 4, comment: '設備も充実していて安心です。', userId: '保護者B', createdAt: new Date().toISOString() }
        ],
        children: [
          { reviewId: '3', rating: 5, comment: 'サッカーが上手になった！', userId: '子どもC', createdAt: new Date().toISOString() },
          { reviewId: '4', rating: 4, comment: '友達ができて嬉しい', userId: '子どもD', createdAt: new Date().toISOString() }
        ]
      }))
    ]).then(([lessonData, reviewsData]) => {
      setLesson(lessonData);
      setReviews(reviewsData);
    }).finally(() => setLoading(false));
  }, [params.id]);

  const handleBooking = async () => {
    const userId = localStorage.getItem('user_id') || 'demo-user';
    setBookingLoading(true);
    
    try {
      await createBooking({
        userId,
        lessonId: params.id,
        schedule: new Date().toISOString()
      });
      alert('予約が完了しました！');
      setShowBookingForm(false);
    } catch (error) {
      alert('予約に失敗しました。もう一度お試しください。');
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="py-16">
        <div className="container text-center">
          <div className="loading mx-auto mb-4"></div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="py-8">
      <div className="container">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-500">
            <li><a href="/" className="hover:text-gray-700">ホーム</a></li>
            <li><span>›</span></li>
            <li><a href="/schools" className="hover:text-gray-700">習い事を探す</a></li>
            <li><span>›</span></li>
            <li className="text-gray-900">{lesson.title}</li>
          </ol>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Hero Image */}
            <div className="h-64 md:h-80 bg-gradient-to-br from-purple-400 to-blue-500 rounded-2xl mb-8 relative overflow-hidden">
              <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              <div className="absolute bottom-6 left-6">
                <span className="bg-white bg-opacity-90 text-gray-900 px-3 py-1 rounded-full text-sm font-medium">
                  {lesson.category}
                </span>
              </div>
              {lesson.ratingAvg && (
                <div className="absolute top-6 right-6 bg-white bg-opacity-90 rounded-full px-3 py-2 flex items-center gap-2">
                  <span className="text-yellow-500">★</span>
                  <span className="font-semibold">{lesson.ratingAvg}</span>
                </div>
              )}
            </div>

            {/* Title and Basic Info */}
            <div className="mb-8">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">
                  {lesson.title}
                </h1>
                <LikeButton />
              </div>
              
              <div className="flex flex-wrap gap-4 text-gray-600 mb-6">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>{lesson.area}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>{lesson.schedule}</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>{lesson.instructor}</span>
                </div>
              </div>

              <p className="text-gray-700 text-lg leading-relaxed">
                {lesson.description}
              </p>
            </div>

            {/* Reviews Section */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  口コミ・レビュー
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      保護者の声
                    </h3>
                    <ReviewList reviews={(reviews.parents || []).map((r: any) => ({
                      id: r.reviewId || r.createdAt,
                      rating: Number(r.rating || r.stars || 0),
                      comment: r.comment || '',
                      userName: r.userId,
                      createdAt: r.createdAt || new Date().toISOString()
                    }))} />
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1a3 3 0 000-6h-1m1 6V4a3 3 0 000 6M9 10v1a3 3 0 001 3h1m1-4h1a3 3 0 000-6h-1m1 6V4a3 3 0 000 6M9 10v1a3 3 0 001 3h1" />
                      </svg>
                      子どもの声
                    </h3>
                    <ReviewList reviews={(reviews.children || []).map((r: any) => ({
                      id: r.reviewId || r.createdAt,
                      rating: Number(r.rating || r.stars || 0),
                      comment: r.comment || '',
                      userName: r.userId,
                      createdAt: r.createdAt || new Date().toISOString()
                    }))} />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Booking Card */}
              <div className="card mb-8">
                <div className="card-body">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-purple-600 mb-2">
                      {lesson.price || '月額 8,000円'}
                    </div>
                    <p className="text-gray-600">入会金無料キャンペーン中</p>
                  </div>

                  {!showBookingForm ? (
                    <button
                      onClick={() => setShowBookingForm(true)}
                      className="btn btn-primary w-full btn-lg mb-4"
                    >
                      体験レッスンを予約
                    </button>
                  ) : (
                    <div className="space-y-4">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-blue-800 text-sm">
                          体験レッスンは無料です。お気軽にお申し込みください。
                        </p>
                      </div>
                      <button
                        onClick={handleBooking}
                        disabled={bookingLoading}
                        className="btn btn-primary w-full"
                      >
                        {bookingLoading ? (
                          <>
                            <div className="loading mr-2"></div>
                            予約中...
                          </>
                        ) : (
                          '予約を確定する'
                        )}
                      </button>
                      <button
                        onClick={() => setShowBookingForm(false)}
                        className="btn btn-secondary w-full"
                      >
                        キャンセル
                      </button>
                    </div>
                  )}

                  <div className="border-t pt-4 space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>対象年齢</span>
                      <span>4歳〜12歳</span>
                    </div>
                    <div className="flex justify-between">
                      <span>定員</span>
                      <span>12名</span>
                    </div>
                    <div className="flex justify-between">
                      <span>レッスン時間</span>
                      <span>2時間</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Contact Info */}
              <div className="card">
                <div className="card-body">
                  <h3 className="font-semibold text-gray-900 mb-4">お問い合わせ</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span>06-1234-5678</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span>info@soccer-school.com</span>
                    </div>
                    <div className="flex items-start gap-3">
                      <svg className="w-4 h-4 text-gray-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      <span>大阪市北区梅田1-2-3<br />梅田スポーツセンター内</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


