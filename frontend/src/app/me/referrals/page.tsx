'use client';

import { useState, useEffect } from 'react';
import { 
  ShareIcon, 
  ClipboardDocumentIcon, 
  UserPlusIcon, 
  GiftIcon,
  CheckCircleIcon,
  ClockIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

interface ReferralData {
  myReferralCode: string;
  totalReferrals: number;
  pendingReferrals: number;
  completedReferrals: number;
  totalEarnedTickets: number;
  referralHistory: ReferralRecord[];
}

interface ReferralRecord {
  id: string;
  referredUserName: string;
  status: 'pending' | 'accepted' | 'completed';
  createdAt: string;
  completedAt?: string;
  earnedTickets: number;
}

export default function ReferralsPage() {
  const [referralData, setReferralData] = useState<ReferralData | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  useEffect(() => {
    fetchReferralData();
  }, []);

  const fetchReferralData = async () => {
    try {
      // 実際のAPIコールをここに実装
      // const response = await fetch('/api/me/referrals');
      // const data = await response.json();
      
      // モックデータ
      const mockData: ReferralData = {
        myReferralCode: 'TANAKA123',
        totalReferrals: 5,
        pendingReferrals: 1,
        completedReferrals: 4,
        totalEarnedTickets: 8,
        referralHistory: [
          {
            id: '1',
            referredUserName: '佐藤さん',
            status: 'completed',
            createdAt: '2024-01-10T10:00:00Z',
            completedAt: '2024-01-15T14:30:00Z',
            earnedTickets: 2
          },
          {
            id: '2',
            referredUserName: '田中さん',
            status: 'completed',
            createdAt: '2024-01-08T15:20:00Z',
            completedAt: '2024-01-12T09:45:00Z',
            earnedTickets: 2
          },
          {
            id: '3',
            referredUserName: '山田さん',
            status: 'pending',
            createdAt: '2024-01-20T11:15:00Z',
            earnedTickets: 0
          },
          {
            id: '4',
            referredUserName: '鈴木さん',
            status: 'completed',
            createdAt: '2024-01-05T16:30:00Z',
            completedAt: '2024-01-08T13:20:00Z',
            earnedTickets: 2
          },
          {
            id: '5',
            referredUserName: '高橋さん',
            status: 'completed',
            createdAt: '2024-01-03T12:45:00Z',
            completedAt: '2024-01-06T10:15:00Z',
            earnedTickets: 2
          }
        ]
      };
      
      setReferralData(mockData);
    } catch (error) {
      console.error('紹介データの取得に失敗:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyReferralCode = async () => {
    if (!referralData) return;
    
    try {
      await navigator.clipboard.writeText(referralData.myReferralCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('コピーに失敗:', error);
    }
  };

  const shareReferralLink = () => {
    if (!referralData) return;
    
    const shareUrl = `https://naraigotoprime.com/register?ref=${referralData.myReferralCode}`;
    const shareText = `習い事Primeで一緒に子どもの可能性を広げませんか？私の紹介コード「${referralData.myReferralCode}」で登録すると、お互いにチケットがもらえます！ ${shareUrl}`;
    
    if (navigator.share) {
      navigator.share({
        title: '習い事Prime - 紹介',
        text: shareText,
        url: shareUrl
      });
    } else {
      setShareModalOpen(true);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', text: '登録待ち', icon: ClockIcon },
      accepted: { color: 'bg-blue-100 text-blue-800', text: '登録完了', icon: UserPlusIcon },
      completed: { color: 'bg-green-100 text-green-800', text: '利用開始', icon: CheckCircleIcon }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    const IconComponent = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        <IconComponent className="w-3 h-3 mr-1" />
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

  if (!referralData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">データの取得に失敗しました</h2>
          <button 
            onClick={fetchReferralData}
            className="text-purple-600 hover:text-purple-500"
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">お友達紹介</h1>
          <p className="text-gray-600 mt-2">
            お友達を紹介して、お互いにチケットをもらいましょう！
          </p>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-md">
                <UserPlusIcon className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">総紹介数</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.totalReferrals}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-100 rounded-md">
                <ClockIcon className="w-6 h-6 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">登録待ち</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.pendingReferrals}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-md">
                <CheckCircleIcon className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">成功紹介</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.completedReferrals}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-md">
                <GiftIcon className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">獲得チケット</p>
                <p className="text-2xl font-bold text-gray-900">{referralData.totalEarnedTickets}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* 紹介コードセクション */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-gray-900 mb-4">あなたの紹介コード</h2>
              
              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 mb-4">
                <div className="text-center">
                  <p className="text-sm text-gray-600 mb-2">紹介コード</p>
                  <p className="text-2xl font-bold text-purple-600 font-mono tracking-wider">
                    {referralData.myReferralCode}
                  </p>
                </div>
              </div>
              
              <div className="space-y-3">
                <button
                  onClick={copyReferralCode}
                  className="w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircleIcon className="w-4 h-4 mr-2" />
                      コピーしました！
                    </>
                  ) : (
                    <>
                      <ClipboardDocumentIcon className="w-4 h-4 mr-2" />
                      コードをコピー
                    </>
                  )}
                </button>
                
                <button
                  onClick={shareReferralLink}
                  className="w-full flex items-center justify-center px-4 py-2 border border-purple-300 text-purple-700 rounded-md hover:bg-purple-50 transition-colors"
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  シェア
                </button>
              </div>
            </div>

            {/* 紹介方法 */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">紹介方法</h3>
              <div className="space-y-4 text-sm text-gray-600">
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">1</div>
                  <p>お友達に紹介コードを教える</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">2</div>
                  <p>お友達が紹介コードを使って登録</p>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-6 h-6 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center text-xs font-bold">3</div>
                  <p>お友達が初回利用でお互いにチケット獲得！</p>
                </div>
              </div>
            </div>
          </div>

          {/* 紹介履歴 */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">紹介履歴</h2>
              
              {referralData.referralHistory.length === 0 ? (
                <div className="text-center py-12">
                  <UserPlusIcon className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500">まだ紹介履歴がありません</p>
                  <p className="text-sm text-gray-400 mt-2">お友達を紹介してチケットを獲得しましょう！</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {referralData.referralHistory.map((record) => (
                    <div key={record.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                            <UserPlusIcon className="w-5 h-5 text-purple-600" />
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{record.referredUserName}</p>
                            <p className="text-sm text-gray-500">
                              紹介日: {new Date(record.createdAt).toLocaleDateString('ja-JP')}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          {getStatusBadge(record.status)}
                          {record.earnedTickets > 0 && (
                            <p className="text-sm text-green-600 mt-1">
                              +{record.earnedTickets} チケット獲得
                            </p>
                          )}
                        </div>
                      </div>
                      
                      {record.completedAt && (
                        <p className="text-xs text-gray-500">
                          利用開始日: {new Date(record.completedAt).toLocaleDateString('ja-JP')}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* シェアモーダル */}
      {shareModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">紹介リンクをシェア</h3>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">紹介URL</label>
              <div className="flex">
                <input
                  type="text"
                  value={`https://naraigotoprime.com/register?ref=${referralData.myReferralCode}`}
                  readOnly
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md bg-gray-50 text-sm"
                />
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`https://naraigotoprime.com/register?ref=${referralData.myReferralCode}`);
                  }}
                  className="px-3 py-2 bg-purple-600 text-white rounded-r-md hover:bg-purple-700 transition-colors"
                >
                  <DocumentDuplicateIcon className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">メッセージ</label>
              <textarea
                value={`習い事Primeで一緒に子どもの可能性を広げませんか？私の紹介コード「${referralData.myReferralCode}」で登録すると、お互いにチケットがもらえます！`}
                readOnly
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-50 text-sm"
                rows={4}
              />
            </div>
            
            <div className="flex space-x-3">
              <button
                onClick={() => setShareModalOpen(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
              >
                閉じる
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
