'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  ChatBubbleLeftRightIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  AcademicCapIcon,
  UserIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

interface Conversation {
  id: string;
  schoolName: string;
  lessonTitle: string;
  lastMessage: {
    content: string;
    senderName: string;
    sentAt: string;
    isRead: boolean;
  };
  unreadCount: number;
  participants: {
    familyName: string;
    schoolName: string;
  };
  bookingId: string;
  createdAt: string;
}

export default function ConversationsPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch('/api/conversations');
      // const data = await response.json();
      
      // モックデータ
      const mockConversations: Conversation[] = [
        {
          id: '1',
          schoolName: 'テックキッズアカデミー渋谷校',
          lessonTitle: 'キッズプログラミング体験クラス',
          lastMessage: {
            content: 'レッスンの準備物について確認させていただきたいことがあります。',
            senderName: '山田先生',
            sentAt: '2024-01-22T14:30:00Z',
            isRead: false
          },
          unreadCount: 2,
          participants: {
            familyName: '田中家',
            schoolName: 'テックキッズアカデミー渋谷校'
          },
          bookingId: 'booking-123',
          createdAt: '2024-01-20T10:00:00Z'
        },
        {
          id: '2',
          schoolName: 'ミュージックスクール新宿',
          lessonTitle: 'ピアノ個人レッスン',
          lastMessage: {
            content: 'ありがとうございました。次回もよろしくお願いします。',
            senderName: '田中（保護者）',
            sentAt: '2024-01-21T16:45:00Z',
            isRead: true
          },
          unreadCount: 0,
          participants: {
            familyName: '田中家',
            schoolName: 'ミュージックスクール新宿'
          },
          bookingId: 'booking-124',
          createdAt: '2024-01-18T09:30:00Z'
        },
        {
          id: '3',
          schoolName: 'アートスタジオ青山',
          lessonTitle: '子ども絵画教室',
          lastMessage: {
            content: 'お疲れ様でした。作品の仕上がりがとても良かったです！',
            senderName: '佐藤先生',
            sentAt: '2024-01-19T18:20:00Z',
            isRead: true
          },
          unreadCount: 0,
          participants: {
            familyName: '田中家',
            schoolName: 'アートスタジオ青山'
          },
          bookingId: 'booking-125',
          createdAt: '2024-01-15T13:15:00Z'
        },
        {
          id: '4',
          schoolName: 'スポーツクラブ池袋',
          lessonTitle: 'キッズサッカー体験',
          lastMessage: {
            content: '明日のレッスンの時間が30分早まりました。ご確認ください。',
            senderName: '鈴木コーチ',
            sentAt: '2024-01-22T11:15:00Z',
            isRead: false
          },
          unreadCount: 1,
          participants: {
            familyName: '田中家',
            schoolName: 'スポーツクラブ池袋'
          },
          bookingId: 'booking-126',
          createdAt: '2024-01-17T15:45:00Z'
        }
      ];
      
      setConversations(mockConversations);
    } catch (error) {
      console.error('会話一覧の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations
    .filter(conversation => {
      const matchesSearch = searchTerm === '' || 
        conversation.schoolName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        conversation.lessonTitle.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'all' || 
        (filter === 'unread' && conversation.unreadCount > 0);
      
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.lastMessage.sentAt).getTime() - new Date(a.lastMessage.sentAt).getTime());

  const totalUnreadCount = conversations.reduce((sum, conv) => sum + conv.unreadCount, 0);

  const formatMessageTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);
    
    if (diffInHours < 24) {
      return date.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
    } else if (diffInHours < 24 * 7) {
      return date.toLocaleDateString('ja-JP', { weekday: 'short' });
    } else {
      return date.toLocaleDateString('ja-JP', { month: 'short', day: 'numeric' });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">メッセージ</h1>
              <p className="text-gray-600 mt-1">教室とのやりとり一覧</p>
            </div>
            {totalUnreadCount > 0 && (
              <div className="flex items-center space-x-2 text-red-600">
                <ExclamationCircleIcon className="w-5 h-5" />
                <span className="font-medium">{totalUnreadCount}件の未読</span>
              </div>
            )}
          </div>
        </div>

        {/* 検索・フィルター */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
            <div className="flex-1 relative">
              <MagnifyingGlassIcon className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
              <input
                type="text"
                placeholder="教室名やレッスン名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                すべて
              </button>
              <button
                onClick={() => setFilter('unread')}
                className={`px-4 py-2 rounded-md font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                未読のみ
              </button>
            </div>
          </div>
        </div>

        {/* 会話一覧 */}
        <div className="bg-white rounded-lg shadow-sm">
          {filteredConversations.length === 0 ? (
            <div className="text-center py-12">
              <ChatBubbleLeftRightIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {searchTerm || filter === 'unread' 
                  ? '条件に一致するメッセージがありません' 
                  : 'まだメッセージがありません'}
              </p>
              <p className="text-sm text-gray-400 mt-2">
                レッスンを予約すると、教室とメッセージのやりとりができるようになります。
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredConversations.map((conversation) => (
                <Link
                  key={conversation.id}
                  href={`/conversations/${conversation.id}`}
                  className="block hover:bg-gray-50 transition-colors"
                >
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1 min-w-0">
                        {/* アイコン */}
                        <div className="flex-shrink-0">
                          <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                            <AcademicCapIcon className="w-6 h-6 text-purple-600" />
                          </div>
                        </div>
                        
                        {/* メイン情報 */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="text-lg font-semibold text-gray-900 truncate">
                              {conversation.schoolName}
                            </h3>
                            {conversation.unreadCount > 0 && (
                              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[1.25rem] text-center">
                                {conversation.unreadCount}
                              </span>
                            )}
                          </div>
                          
                          <p className="text-sm text-gray-600 mb-2 truncate">
                            {conversation.lessonTitle}
                          </p>
                          
                          <div className="flex items-center space-x-2">
                            <UserIcon className="w-4 h-4 text-gray-400" />
                            <span className="text-sm text-gray-600">
                              {conversation.lastMessage.senderName}:
                            </span>
                            <p className="text-sm text-gray-600 truncate flex-1">
                              {conversation.lastMessage.content}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* 時間・ステータス */}
                      <div className="flex-shrink-0 text-right ml-4">
                        <div className="flex items-center space-x-1 text-sm text-gray-500 mb-2">
                          <ClockIcon className="w-4 h-4" />
                          <span>{formatMessageTime(conversation.lastMessage.sentAt)}</span>
                        </div>
                        
                        {!conversation.lastMessage.isRead && conversation.unreadCount > 0 && (
                          <div className="w-3 h-3 bg-red-500 rounded-full ml-auto"></div>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* フッター情報 */}
        {filteredConversations.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              {filteredConversations.length}件のメッセージ
              {filter === 'unread' && totalUnreadCount > 0 && (
                <span className="text-red-600 ml-2">
                  （未読: {totalUnreadCount}件）
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
