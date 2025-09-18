'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  CheckIcon,
  XMarkIcon,
  StarIcon,
  TicketIcon,
  HeartIcon,
  ChatBubbleLeftRightIcon,
  GiftIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline';

interface PlanFeature {
  name: string;
  included: boolean;
  description?: string;
}

interface PricingPlan {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  description: string;
  ticketsPerMonth: number;
  isPopular?: boolean;
  features: PlanFeature[];
  buttonText: string;
  buttonStyle: string;
}

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');

  const plans: PricingPlan[] = [
    {
      id: 'free',
      name: 'フリープラン',
      price: 0,
      description: '習い事探しを始めたい方におすすめ',
      ticketsPerMonth: 0,
      features: [
        { name: '教室・クラス検索', included: true, description: '全国の教室を自由に検索' },
        { name: '口コミ閲覧', included: true, description: '親子別口コミを無制限で閲覧' },
        { name: '教室情報詳細表示', included: true, description: '住所、料金、スケジュール等' },
        { name: 'いいね機能', included: true, description: '気になる教室をお気に入り登録' },
        { name: '体験レッスン予約', included: false },
        { name: 'メッセージ機能', included: false },
        { name: '口コミ投稿', included: false },
        { name: 'ポイント獲得', included: false }
      ],
      buttonText: '無料で始める',
      buttonStyle: 'bg-gray-600 hover:bg-gray-700 text-white'
    },
    {
      id: 'standard',
      name: 'スタンダードプラン',
      price: billingCycle === 'monthly' ? 2980 : 2680,
      originalPrice: billingCycle === 'yearly' ? 2980 : undefined,
      description: 'お子様に様々な体験をさせたい方に最適',
      ticketsPerMonth: 3,
      isPopular: true,
      features: [
        { name: '教室・クラス検索', included: true, description: '全国の教室を自由に検索' },
        { name: '口コミ閲覧', included: true, description: '親子別口コミを無制限で閲覧' },
        { name: '教室情報詳細表示', included: true, description: '住所、料金、スケジュール等' },
        { name: 'いいね機能', included: true, description: '気になる教室をお気に入り登録' },
        { name: '体験レッスン予約', included: true, description: '月3回まで体験レッスンに参加' },
        { name: 'メッセージ機能', included: true, description: '教室とのやりとりが可能' },
        { name: '口コミ投稿', included: true, description: '親子それぞれの視点で投稿' },
        { name: 'ポイント獲得', included: true, description: '口コミ投稿でポイント獲得' }
      ],
      buttonText: 'スタンダードを選ぶ',
      buttonStyle: 'bg-purple-600 hover:bg-purple-700 text-white'
    },
    {
      id: 'premium',
      name: 'プレミアムプラン',
      price: billingCycle === 'monthly' ? 4980 : 4480,
      originalPrice: billingCycle === 'yearly' ? 4980 : undefined,
      description: 'たくさんの習い事を試したいアクティブな家庭に',
      ticketsPerMonth: 6,
      features: [
        { name: '教室・クラス検索', included: true, description: '全国の教室を自由に検索' },
        { name: '口コミ閲覧', included: true, description: '親子別口コミを無制限で閲覧' },
        { name: '教室情報詳細表示', included: true, description: '住所、料金、スケジュール等' },
        { name: 'いいね機能', included: true, description: '気になる教室をお気に入り登録' },
        { name: '体験レッスン予約', included: true, description: '月6回まで体験レッスンに参加' },
        { name: 'メッセージ機能', included: true, description: '教室とのやりとりが可能' },
        { name: '口コミ投稿', included: true, description: '親子それぞれの視点で投稿' },
        { name: 'ポイント獲得', included: true, description: '口コミ投稿でポイント獲得（1.5倍）' }
      ],
      buttonText: 'プレミアムを選ぶ',
      buttonStyle: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white'
    }
  ];

  const additionalFeatures = [
    {
      icon: TicketIcon,
      title: 'チケット制で安心',
      description: '月額定額でチケットが付与されるので、予算を気にせず様々な習い事を体験できます。'
    },
    {
      icon: HeartIcon,
      title: '親子で選ぶ',
      description: '保護者とお子様、それぞれの視点からの口コミで、本当に合う教室が見つかります。'
    },
    {
      icon: ChatBubbleLeftRightIcon,
      title: '教室とのコミュニケーション',
      description: '予約後は教室と直接メッセージのやりとりができ、安心してレッスンに参加できます。'
    },
    {
      icon: GiftIcon,
      title: 'ポイント制度',
      description: '口コミ投稿でポイントを獲得し、追加チケットと交換できます。'
    }
  ];

  const faqs = [
    {
      question: 'チケットは翌月に繰り越せますか？',
      answer: 'チケットの有効期限は付与された月の末日までです。翌月への繰り越しはできませんので、計画的にご利用ください。'
    },
    {
      question: 'プランの変更はいつでもできますか？',
      answer: 'はい、いつでもプランの変更が可能です。アップグレードは即座に反映され、ダウングレードは次回更新日から適用されます。'
    },
    {
      question: '解約はいつでもできますか？',
      answer: 'はい、いつでも解約できます。解約後も現在の契約期間中はサービスをご利用いただけます。'
    },
    {
      question: '体験レッスンの料金は別途かかりますか？',
      answer: 'いいえ、チケットを使用する体験レッスンに追加料金は発生しません。ただし、継続受講される場合は各教室の料金体系に従います。'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* ヘッダーセクション */}
      <div className="bg-gradient-to-br from-purple-600 to-blue-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            シンプルで明確な料金プラン
          </h1>
          <p className="text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
            月額定額のチケット制で、お子様の「やってみたい！」を最大限に引き出します。
            無料プランから始めて、必要に応じてアップグレードできます。
          </p>
          
          {/* 請求サイクル切り替え */}
          <div className="flex items-center justify-center space-x-4 mb-8">
            <span className={`${billingCycle === 'monthly' ? 'text-white' : 'text-purple-200'}`}>
              月払い
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
              className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                billingCycle === 'yearly' ? 'bg-purple-400' : 'bg-purple-800'
              }`}
            >
              <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                  billingCycle === 'yearly' ? 'translate-x-6' : 'translate-x-1'
                }`}
              />
            </button>
            <span className={`${billingCycle === 'yearly' ? 'text-white' : 'text-purple-200'}`}>
              年払い
            </span>
            {billingCycle === 'yearly' && (
              <span className="bg-purple-400 text-purple-900 px-2 py-1 rounded-full text-sm font-medium">
                10%お得
              </span>
            )}
          </div>
        </div>
      </div>

      {/* 料金プランセクション */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg overflow-hidden ${
                plan.isPopular ? 'ring-2 ring-purple-600 scale-105' : ''
              }`}
            >
              {plan.isPopular && (
                <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-center py-2 font-medium">
                  <StarIcon className="w-4 h-4 inline mr-1" />
                  人気プラン
                </div>
              )}
              
              <div className={`p-8 ${plan.isPopular ? 'pt-16' : ''}`}>
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-4">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ¥{plan.price.toLocaleString()}
                    </span>
                    {plan.originalPrice && (
                      <span className="text-lg text-gray-500 line-through ml-2">
                        ¥{plan.originalPrice.toLocaleString()}
                      </span>
                    )}
                    <span className="text-gray-600 ml-1">/月</span>
                  </div>
                  
                  {plan.ticketsPerMonth > 0 && (
                    <div className="flex items-center justify-center space-x-2 text-purple-600 mb-6">
                      <TicketIcon className="w-5 h-5" />
                      <span className="font-medium">月{plan.ticketsPerMonth}枚のチケット</span>
                    </div>
                  )}
                </div>

                <ul className="space-y-4 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start space-x-3">
                      {feature.included ? (
                        <CheckIcon className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XMarkIcon className="w-5 h-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <div>
                        <span className={`${feature.included ? 'text-gray-900' : 'text-gray-400'}`}>
                          {feature.name}
                        </span>
                        {feature.description && (
                          <p className="text-sm text-gray-500 mt-1">{feature.description}</p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>

                <Link
                  href={plan.id === 'free' ? '/auth/register' : `/pricing/checkout?plan=${plan.id}&billing=${billingCycle}`}
                  className={`block w-full text-center py-3 px-6 rounded-lg font-medium transition-colors ${plan.buttonStyle}`}
                >
                  {plan.buttonText}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 追加機能セクション */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              習い事Primeの特徴
            </h2>
            <p className="text-xl text-gray-600">
              お子様の成長をサポートする充実の機能
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <feature.icon className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 比較表セクション */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              プラン詳細比較
            </h2>
          </div>

          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-500">機能</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">フリー</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">スタンダード</th>
                    <th className="px-6 py-4 text-center text-sm font-medium text-gray-500">プレミアム</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">月額料金</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">無料</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">¥2,980</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">¥4,980</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">月間チケット数</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">0枚</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">3枚</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">6枚</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">教室検索・口コミ閲覧</td>
                    <td className="px-6 py-4 text-center"><CheckIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">体験レッスン予約</td>
                    <td className="px-6 py-4 text-center"><XMarkIcon className="w-5 h-5 text-gray-300 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                    <td className="px-6 py-4 text-center"><CheckIcon className="w-5 h-5 text-green-500 mx-auto" /></td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">ポイント倍率</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-400">-</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">1.0倍</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-900">1.5倍</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ セクション */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              料金に関するよくある質問
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                <p className="text-gray-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA セクション */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            今すぐ始めて、お子様の可能性を広げましょう
          </h2>
          <p className="text-xl text-purple-100 mb-8">
            まずは無料プランで習い事探しを体験してみてください
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/auth/register"
              className="bg-white text-purple-600 px-8 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              無料で始める
            </Link>
            <Link
              href="/schools"
              className="bg-purple-500 text-white px-8 py-3 rounded-lg font-medium hover:bg-purple-400 transition-colors"
            >
              教室を探す
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}