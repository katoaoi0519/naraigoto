'use client';

import { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { 
  PaperAirplaneIcon,
  PaperClipIcon,
  AcademicCapIcon,
  UserIcon,
  CalendarIcon,
  ClockIcon,
  PhotoIcon
} from '@heroicons/react/24/outline';

interface Message {
  id: string;
  content: string;
  senderName: string;
  senderType: 'family' | 'school';
  sentAt: string;
  readAt?: string;
  attachments?: {
    type: 'image' | 'file';
    url: string;
    name: string;
  }[];
}

interface ConversationDetail {
  id: string;
  schoolName: string;
  lessonTitle: string;
  bookingId: string;
  participants: {
    familyName: string;
    schoolName: string;
  };
  lessonDate: string;
  messages: Message[];
  createdAt: string;
}

export default function ConversationDetailPage() {
  const params = useParams();
  const conversationId = params.id as string;
  
  const [conversation, setConversation] = useState<ConversationDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [newMessage, setNewMessage] = useState('');
  const [sending, setSending] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConversationDetail();
  }, [conversationId]);

  useEffect(() => {
    scrollToBottom();
  }, [conversation?.messages]);

  const fetchConversationDetail = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch(`/api/conversations/${conversationId}`);
      // const data = await response.json();
      
      // モックデータ
      const mockConversation: ConversationDetail = {
        id: conversationId,
        schoolName: 'テックキッズアカデミー渋谷校',
        lessonTitle: 'キッズプログラミング体験クラス',
        bookingId: 'booking-123',
        participants: {
          familyName: '田中家',
          schoolName: 'テックキッズアカデミー渋谷校'
        },
        lessonDate: '2024-01-25T10:00:00Z',
        messages: [
          {
            id: '1',
            content: 'この度は体験レッスンにお申し込みいただき、ありがとうございます。当日は10時からの開始となります。',
            senderName: '山田先生',
            senderType: 'school',
            sentAt: '2024-01-20T10:30:00Z',
            readAt: '2024-01-20T11:00:00Z'
          },
          {
            id: '2',
            content: 'よろしくお願いします。子どもが初めてのプログラミングなのですが、何か準備するものはありますか？',
            senderName: '田中（保護者）',
            senderType: 'family',
            sentAt: '2024-01-20T11:15:00Z',
            readAt: '2024-01-20T12:00:00Z'
          },
          {
            id: '3',
            content: '特別な準備は不要です。筆記用具だけお持ちください。パソコンはこちらで用意いたします。',
            senderName: '山田先生',
            senderType: 'school',
            sentAt: '2024-01-20T12:30:00Z',
            readAt: '2024-01-20T13:00:00Z'
          },
          {
            id: '4',
            content: 'ありがとうございます。当日は少し早めに伺わせていただきます。',
            senderName: '田中（保護者）',
            senderType: 'family',
            sentAt: '2024-01-20T13:15:00Z',
            readAt: '2024-01-20T14:00:00Z'
          },
          {
            id: '5',
            content: 'レッスンの準備物について確認させていただきたいことがあります。お子様の年齢を改めて教えていただけますでしょうか？',
            senderName: '山田先生',
            senderType: 'school',
            sentAt: '2024-01-22T14:30:00Z'
          }
        ],
        createdAt: '2024-01-20T10:00:00Z'
      };
      
      setConversation(mockConversation);
    } catch (error) {
      console.error('会話詳細の取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() && selectedFiles.length === 0) return;
    
    setSending(true);
    try {
      // 実際のAPIコール（WebSocketまたはREST）をここに実装
      // await sendMessage(conversationId, newMessage, selectedFiles);
      
      // モックで新しいメッセージを追加
      const mockMessage: Message = {
        id: Date.now().toString(),
        content: newMessage,
        senderName: '田中（保護者）',
        senderType: 'family',
        sentAt: new Date().toISOString(),
      };
      
      setConversation(prev => prev ? {
        ...prev,
        messages: [...prev.messages, mockMessage]
      } : null);
      
      setNewMessage('');
      setSelectedFiles([]);
    } catch (error) {
      console.error('メッセージの送信に失敗:', error);
    } finally {
      setSending(false);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedFiles(prev => [...prev, ...files]);
  };

  const removeFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const formatMessageTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('ja-JP', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (!conversation) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">会話が見つかりません</h2>
          <Link href="/conversations" className="text-purple-600 hover:text-purple-500">
            メッセージ一覧に戻る
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* ヘッダー */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          <Link href="/conversations" className="text-purple-600 hover:text-purple-500 mb-2 inline-block">
            ← メッセージ一覧に戻る
          </Link>
          
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
              <AcademicCapIcon className="w-6 h-6 text-purple-600" />
            </div>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">{conversation.schoolName}</h1>
              <p className="text-sm text-gray-600">{conversation.lessonTitle}</p>
            </div>
            <div className="text-right">
              <div className="flex items-center space-x-1 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                <span>
                  {new Date(conversation.lessonDate).toLocaleDateString('ja-JP', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* メッセージ一覧 */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto space-y-4">
          {conversation.messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.senderType === 'family' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-xs md:max-w-md ${
                message.senderType === 'family' ? 'order-2' : 'order-1'
              }`}>
                {/* 送信者名 */}
                <div className={`flex items-center space-x-1 mb-1 ${
                  message.senderType === 'family' ? 'justify-end' : 'justify-start'
                }`}>
                  <UserIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">{message.senderName}</span>
                </div>
                
                {/* メッセージバブル */}
                <div className={`rounded-lg px-4 py-2 ${
                  message.senderType === 'family'
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-900 border border-gray-200'
                }`}>
                  <p className="text-sm">{message.content}</p>
                  
                  {/* 添付ファイル */}
                  {message.attachments && message.attachments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {message.attachments.map((attachment, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          {attachment.type === 'image' ? (
                            <PhotoIcon className="w-4 h-4" />
                          ) : (
                            <PaperClipIcon className="w-4 h-4" />
                          )}
                          <span className="text-xs">{attachment.name}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* 時間・既読ステータス */}
                <div className={`flex items-center space-x-1 mt-1 ${
                  message.senderType === 'family' ? 'justify-end' : 'justify-start'
                }`}>
                  <ClockIcon className="w-3 h-3 text-gray-400" />
                  <span className="text-xs text-gray-500">
                    {formatMessageTime(message.sentAt)}
                  </span>
                  {message.senderType === 'family' && (
                    <span className="text-xs text-gray-500">
                      {message.readAt ? '既読' : '未読'}
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* メッセージ入力 */}
      <div className="bg-white border-t border-gray-200 px-4 py-4">
        <div className="max-w-4xl mx-auto">
          {/* 選択されたファイル */}
          {selectedFiles.length > 0 && (
            <div className="mb-3 flex flex-wrap gap-2">
              {selectedFiles.map((file, index) => (
                <div key={index} className="flex items-center space-x-2 bg-gray-100 rounded-lg px-3 py-1">
                  <PhotoIcon className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-700 truncate max-w-32">{file.name}</span>
                  <button
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          )}
          
          <div className="flex items-end space-x-3">
            <div className="flex-1">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="メッセージを入力..."
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 resize-none"
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
              />
            </div>
            
            <div className="flex space-x-2">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-500 hover:text-gray-700 transition-colors"
                title="ファイルを添付"
              >
                <PaperClipIcon className="w-5 h-5" />
              </button>
              
              <button
                onClick={handleSendMessage}
                disabled={sending || (!newMessage.trim() && selectedFiles.length === 0)}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {sending ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <PaperAirplaneIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/*,.pdf,.doc,.docx"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          <p className="text-xs text-gray-500 mt-2">
            Shift + Enter で改行、Enter で送信
          </p>
        </div>
      </div>
    </div>
  );
}
