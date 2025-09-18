'use client';

import { useState } from 'react';
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/24/outline';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'service' | 'pricing' | 'booking' | 'reviews' | 'technical';
}

export default function FAQPage() {
  const [openItems, setOpenItems] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (id: string) => {
    const newOpenItems = new Set(openItems);
    if (newOpenItems.has(id)) {
      newOpenItems.delete(id);
    } else {
      newOpenItems.add(id);
    }
    setOpenItems(newOpenItems);
  };

  const faqData: FAQItem[] = [
    // サービス全般
    {
      id: '1',
      question: 'プロダクト/サービスの仕組みの一連の流れを教えてください。',
      answer: `「習い事Prime」の利用は非常に簡単です。

1. 親子でそれぞれアカウントを作成し、お子様のアカウントと連携させます
2. アプリ上で興味のある習い事を検索し、口コミを確認
3. 親子で互いに「いいね」した習い事教室が共有されます
4. 行きたい教室が見つかったら、保有しているチケットを使って体験レッスンを予約
5. 予約後は教室側とやりとりができるようになり、出席状況なども確認できます
6. レッスン後には、保護者とお子様それぞれの視点から、教室や先生（コーチ）への口コミを投稿できます`,
      category: 'service'
    },
    {
      id: '2',
      question: 'チケットはどのような教室で使えますか？',
      answer: 'スポーツ、音楽、学習塾、プログラミング、アートなど、当社の審査基準をクリアした全国の様々なジャンルの教室でご利用いただけます。対応エリアと教室は順次拡大予定です。',
      category: 'service'
    },
    
    // 料金・プラン
    {
      id: '3',
      question: '「習い事Prime」の料金体系を教えてください。',
      answer: '教室の検索や口コミの閲覧は無料です。習い事を体験する際には、月額定額のチケット制サブスクリプションプランにご加入いただきます。プランに応じて毎月付与されるチケットを使い、様々な教室の体験レッスンに参加できます。',
      category: 'pricing'
    },
    
    // 口コミ・評価
    {
      id: '4',
      question: '親と子で口コミが分かれているのはなぜですか？',
      answer: '保護者の方が評価する「施設の清潔さ」や「料金の妥当性」と、お子様が感じる「楽しさ」や「先生との相性」は、必ずしも一致しません。両方の視点からの情報を公開することで、より多角的で信頼性の高い教室選びが可能になると考えています。',
      category: 'reviews'
    },
    {
      id: '5',
      question: '教室を探す際、保護者は子供用、逆に子供は保護者用の口コミは閲覧もできないのですか？',
      answer: `いいえ、親子ともに両方の口コミを閲覧できます。当サービスの「親子別口コミ機能」は、多角的な視点から教室を総合的に判断していただくために設計されています。口コミを閲覧する際、同じご家庭の保護者の口コミとお子様の口コミは、セットで表示されます。

これにより、以下のような比較がひと目で可能になります：

- **保護者の視点**（料金、安全性、運営の対応など）
- **お子様の視点**（楽しさ、先生との相性、友達のできやすさなど）

このセット表示により、親子でそれぞれの感想を見比べながら話し合うことができ、ご家庭にとって最も納得のいく教室選びができるようサポートします。`,
      category: 'reviews'
    },
    {
      id: '6',
      question: '口コミの信頼性はどのように担保していますか？',
      answer: '口コミを投稿できるのは、実際にチケットを利用してレッスンに参加したユーザーのみです。また、不適切な内容や誹謗中傷は、システムと人手により常に監視し、健全なコミュニティの維持に努めています。',
      category: 'reviews'
    },
    {
      id: '7',
      question: '評価の対象は施設だけですか？',
      answer: 'いいえ。施設全体の評価に加えて、担当した先生やコーチ個人に対する評価も投稿できます。習い事の種類や教室によっては、先生を指定した予約もできるようになっています。これにより、指導者個人の素晴らしい指導力が正当に評価されることを目指しています。',
      category: 'reviews'
    },
    
    // 予約・利用
    {
      id: '8',
      question: '予約はどのように行いますか？',
      answer: 'ログイン後、教室やクラスの詳細ページから「体験レッスンを予約」ボタンをクリックし、希望するスケジュールを選択してください。予約にはチケットが1枚消費されます。',
      category: 'booking'
    },
    {
      id: '9',
      question: '予約のキャンセルはできますか？',
      answer: 'レッスン開始24時間前までキャンセル可能です。キャンセルされた場合、使用したチケットは返却されます。詳細なキャンセルポリシーは各教室により異なる場合があります。',
      category: 'booking'
    },
    
    // 技術的な質問
    {
      id: '10',
      question: 'アプリはありますか？',
      answer: '現在はWebブラウザからご利用いただけます。スマートフォンやタブレットのブラウザからも快適にご利用いただけるよう、レスポンシブデザインを採用しています。ネイティブアプリについては今後検討予定です。',
      category: 'technical'
    },
    {
      id: '11',
      question: 'どのようなブラウザで利用できますか？',
      answer: 'Chrome、Firefox、Safari、Edgeの最新版でご利用いただけます。Internet Explorerには対応しておりません。最適な体験のため、ブラウザを最新版に更新してご利用ください。',
      category: 'technical'
    }
  ];

  const categories = [
    { value: 'all', label: 'すべて' },
    { value: 'service', label: 'サービス全般' },
    { value: 'pricing', label: '料金・プラン' },
    { value: 'booking', label: '予約・利用' },
    { value: 'reviews', label: '口コミ・評価' },
    { value: 'technical', label: '技術的な質問' }
  ];

  const filteredFAQs = selectedCategory === 'all' 
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">よくある質問</h1>
          <p className="text-xl text-gray-600">
            習い事Primeについてよくいただくご質問にお答えします
          </p>
        </div>

        {/* カテゴリフィルター */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">カテゴリで絞り込み</h2>
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-purple-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ一覧 */}
        <div className="space-y-4">
          {filteredFAQs.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <button
                onClick={() => toggleItem(item.id)}
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-medium text-gray-900 pr-4">
                  {item.question}
                </span>
                {openItems.has(item.id) ? (
                  <ChevronUpIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                ) : (
                  <ChevronDownIcon className="w-5 h-5 text-gray-500 flex-shrink-0" />
                )}
              </button>
              
              {openItems.has(item.id) && (
                <div className="px-6 pb-4 border-t border-gray-100">
                  <div className="pt-4">
                    {item.answer.split('\n').map((paragraph, index) => (
                      <p key={index} className="text-gray-600 mb-3 last:mb-0">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* お問い合わせセクション */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg p-8 mt-12 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">
            他にご質問がございますか？
          </h2>
          <p className="text-purple-100 mb-6">
            上記で解決しない場合は、お気軽にお問い合わせください。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:support@naraigotoprime.com"
              className="bg-white text-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors"
            >
              メールでお問い合わせ
            </a>
            <a
              href="tel:0120-123-456"
              className="bg-purple-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-400 transition-colors"
            >
              電話でお問い合わせ
            </a>
          </div>
          <p className="text-purple-200 text-sm mt-4">
            受付時間: 平日 10:00-18:00
          </p>
        </div>
      </div>
    </div>
  );
}