'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  CalendarIcon, 
  ClockIcon, 
  MapPinIcon, 
  UserIcon,
  PhoneIcon,
  EnvelopeIcon,
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline';

interface BookingDetail {
  id: string;
  status: 'confirmed' | 'completed' | 'cancelled' | 'pending';
  lessonTitle: string;
  schoolName: string;
  instructorName: string;
  scheduledAt: string;
  duration: number;
  location: string;
  description: string;
  consumedTickets: number;
  childName: string;
  schoolContact: {
    phone: string;
    email: string;
  };
  cancellationPolicy: string;
  attendanceStatus?: 'attended' | 'absent' | null;
  createdAt: string;
}

export default function BookingDetailPage() {
  const params = useParams();
  const router = useRouter();
  const bookingId = params.id as string;
  
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    fetchBookingDetail();
  }, [bookingId]);

  const fetchBookingDetail = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch(`/api/me/bookings/${bookingId}`);
      // const data = await response.json();
      
      // モックデータ
      const mockBooking: BookingDetail = {
        id: bookingId,
        status: 'confirmed',
        lessonTitle: 'キッズプログラミング体験クラス',
        schoolName: 'テックキッズアカデミー渋谷校',
        instructorName: '山田 太郎',
        scheduledAt: '2024-01-15T10:00:00Z',
        duration: 60,
        location: '東京都渋谷区渋谷1-1-1 テックビル3F',
        description: 'Scratchを使った楽しいプログラミング体験です。初心者のお子様でも安心してご参加いただけます。',
        consumedTickets: 1,
        childName: '田中 花子',
        schoolContact: {
          phone: '03-1234-5678',
          email: 'contact@techkids-academy.com'
        },
        cancellationPolicy: 'レッスン開始24時間前までキャンセル可能です。',
        attendanceStatus: null,
        createdAt: '2024-01-10T15:30:00Z'
      };
      
      setBooking(mockBooking);
    } catch (error) {
      console.error('予約詳細の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async () => {
    setCancelling(true);
    try {
      // 実際のAPIコールをここに実装
      // await fetch(`/api/me/bookings/${bookingId}/cancel`, { method: 'POST' });
      
      console.log('予約をキャンセルしました');
      setShowCancelModal(false);
      router.push('/me/bookings');
    } catch (error) {
      console.error('予約のキャンセルに失敗:', error);
    } finally {
      setCancelling(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      confirmed: { color: 'bg-green-100 text-green-800', text: '予約確定', icon: CheckCircleIcon },
      completed: { color: 'bg-blue-100 text-blue-800', text: '受講完了', icon: CheckCircleIcon },
      cancelled: { color: 'bg-red-100 text-red-800', text: 'キャンセル済み', icon: XMarkIcon },
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '確認待ち', icon: ExclamationTriangleIcon }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
        <IconComponent className="w-4 h-4 mr-1" />
        {config.text}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">予約が見つかりません</h2>
          <Link href="/me/bookings" className="text-purple-600 hover:text-purple-500">
            予約一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <Link href="/me/bookings" className="text-purple-600 hover:text-purple-500 mb-4 inline-block">
            ← 予約一覧に戻る
          </Link>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">予約詳細</h1>
              <p className="text-gray-600 mt-1">予約ID: {booking.id}</p>
            </div>
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* メイン情報 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">{booking.lessonTitle}</h2>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <MapPinIcon className="w-5 h-5 text-gray-400 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{booking.schoolName}</p>
                    <p className="text-gray-600 text-sm">{booking.location}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <UserIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">担当講師: </span>
                    <span className="text-gray-600">{booking.instructorName}</span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <CalendarIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">レッスン日時: </span>
                    <span className="text-gray-600">
                      {new Date(booking.scheduledAt).toLocaleString('ja-JP', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        weekday: 'short',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <ClockIcon className="w-5 h-5 text-gray-400" />
                  <div>
                    <span className="font-medium text-gray-900">所要時間: </span>
                    <span className="text-gray-600">{booking.duration}分</span>
                  </div>
                </div>
              </div>

              {booking.description && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h3 className="font-medium text-gray-900 mb-2">レッスン内容</h3>
                  <p className="text-gray-600">{booking.description}</p>
                </div>
              )}
            </div>

            {/* 出席状況 */}
            {booking.attendanceStatus && (
              <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">出席状況</h3>
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                  booking.attendanceStatus === 'attended' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {booking.attendanceStatus === 'attended' ? '出席' : '欠席'}
                </div>
              </div>
            )}
          </div>

          {/* サイドバー */}
          <div className="space-y-6">
            {/* 参加者情報 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">参加者情報</h3>
              <div className="space-y-2">
                <p><span className="font-medium">お子様:</span> {booking.childName}</p>
                <p><span className="font-medium">使用チケット:</span> {booking.consumedTickets}枚</p>
                <p className="text-sm text-gray-600">
                  予約日: {new Date(booking.createdAt).toLocaleDateString('ja-JP')}
                </p>
              </div>
            </div>

            {/* 教室連絡先 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">教室連絡先</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <PhoneIcon className="w-4 h-4 text-gray-400" />
                  <a href={`tel:${booking.schoolContact.phone}`} className="text-purple-600 hover:text-purple-500">
                    {booking.schoolContact.phone}
                  </a>
                </div>
                <div className="flex items-center space-x-2">
                  <EnvelopeIcon className="w-4 h-4 text-gray-400" />
                  <a href={`mailto:${booking.schoolContact.email}`} className="text-purple-600 hover:text-purple-500">
                    {booking.schoolContact.email}
                  </a>
                </div>
              </div>
            </div>

            {/* アクション */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">アクション</h3>
              <div className="space-y-3">
                <Link
                  href={`/conversations?booking=${booking.id}`}
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
                >
                  <ChatBubbleLeftRightIcon className="w-4 h-4 mr-2" />
                  メッセージ
                </Link>
                
                {booking.status === 'confirmed' && (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    className="w-full px-4 py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 transition-colors"
                  >
                    予約をキャンセル
                  </button>
                )}

                {booking.status === 'completed' && !booking.attendanceStatus && (
                  <Link
                    href={`/me/reviews/new?booking=${booking.id}`}
                    className="w-full inline-flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                  >
                    口コミを投稿
                  </Link>
                )}
              </div>
            </div>

            {/* キャンセルポリシー */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">キャンセルポリシー</h3>
              <p className="text-sm text-gray-600">{booking.cancellationPolicy}</p>
            </div>
          </div>
        </div>
      </div>

      {/* キャンセル確認モーダル */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">予約をキャンセルしますか？</h3>
            <p className="text-gray-600 mb-6">
              この操作は取り消せません。使用したチケットは返却されます。
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                戻る
              </button>
              <button
                onClick={handleCancelBooking}
                disabled={cancelling}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                {cancelling ? 'キャンセル中...' : 'キャンセル'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
