'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // 保護者情報
    parentName: '',
    parentAge: '',
    parentInterests: [] as string[],
    
    // 子ども情報
    childName: '',
    childAge: '',
    childInterests: [] as string[],
    
    // 地域・その他
    area: '',
    preferredCategories: [] as string[],
  });

  const interests = [
    'スポーツ', '音楽', 'アート・絵画', 'プログラミング', 
    '学習塾', 'ダンス', '料理・お菓子作り', '英会話',
    '書道・習字', '空手・武道', 'バレエ', 'サッカー',
    'ピアノ', 'バイオリン', 'そろばん', 'ロボット教室'
  ];

  const areas = [
    '東京都23区', '東京都多摩地区', '神奈川県横浜市', '神奈川県川崎市',
    '埼玉県さいたま市', '千葉県千葉市', '大阪府大阪市', '愛知県名古屋市',
    'その他'
  ];

  const handleInterestToggle = (interest: string, type: 'parent' | 'child' | 'preferred') => {
    setFormData(prev => {
      if (type === 'parent') {
        const interests = prev.parentInterests.includes(interest)
          ? prev.parentInterests.filter(i => i !== interest)
          : [...prev.parentInterests, interest];
        return { ...prev, parentInterests: interests };
      } else if (type === 'child') {
        const interests = prev.childInterests.includes(interest)
          ? prev.childInterests.filter(i => i !== interest)
          : [...prev.childInterests, interest];
        return { ...prev, childInterests: interests };
      } else {
        const categories = prev.preferredCategories.includes(interest)
          ? prev.preferredCategories.filter(i => i !== interest)
          : [...prev.preferredCategories, interest];
        return { ...prev, preferredCategories: categories };
      }
    });
  };

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    try {
      // ここで実際のAPIにデータを送信
      console.log('オンボーディングデータ:', formData);
      
      // 成功時はダッシュボードにリダイレクト
      router.push('/me');
    } catch (error) {
      console.error('オンボーディング失敗:', error);
    }
  };

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">保護者情報の設定</h2>
        <p className="text-gray-600">まず、保護者の方の基本情報を入力してください。</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="parentName" className="block text-sm font-medium text-gray-700 mb-2">
            お名前
          </label>
          <input
            type="text"
            id="parentName"
            value={formData.parentName}
            onChange={(e) => setFormData(prev => ({ ...prev, parentName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="田中 太郎"
          />
        </div>
        
        <div>
          <label htmlFor="parentAge" className="block text-sm font-medium text-gray-700 mb-2">
            年代
          </label>
          <select
            id="parentAge"
            value={formData.parentAge}
            onChange={(e) => setFormData(prev => ({ ...prev, parentAge: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">選択してください</option>
            <option value="20代">20代</option>
            <option value="30代">30代</option>
            <option value="40代">40代</option>
            <option value="50代">50代</option>
            <option value="60代以上">60代以上</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            興味のある習い事ジャンル（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interests.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest, 'parent')}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  formData.parentInterests.includes(interest)
                    ? 'bg-purple-100 border-purple-300 text-purple-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">お子様情報の設定</h2>
        <p className="text-gray-600">お子様の基本情報を入力してください。</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="childName" className="block text-sm font-medium text-gray-700 mb-2">
            お子様のお名前
          </label>
          <input
            type="text"
            id="childName"
            value={formData.childName}
            onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="田中 花子"
          />
        </div>
        
        <div>
          <label htmlFor="childAge" className="block text-sm font-medium text-gray-700 mb-2">
            年齢
          </label>
          <select
            id="childAge"
            value={formData.childAge}
            onChange={(e) => setFormData(prev => ({ ...prev, childAge: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">選択してください</option>
            <option value="4歳">4歳</option>
            <option value="5歳">5歳</option>
            <option value="6歳">6歳</option>
            <option value="7歳">7歳</option>
            <option value="8歳">8歳</option>
            <option value="9歳">9歳</option>
            <option value="10歳">10歳</option>
            <option value="11歳">11歳</option>
            <option value="12歳">12歳</option>
            <option value="13歳">13歳</option>
            <option value="14歳">14歳</option>
            <option value="15歳">15歳</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            お子様が興味を持ちそうな習い事（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interests.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest, 'child')}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  formData.childInterests.includes(interest)
                    ? 'bg-blue-100 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">地域・希望設定</h2>
        <p className="text-gray-600">お住まいの地域と希望する習い事ジャンルを選択してください。</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-2">
            お住まいの地域
          </label>
          <select
            id="area"
            value={formData.area}
            onChange={(e) => setFormData(prev => ({ ...prev, area: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="">選択してください</option>
            {areas.map(area => (
              <option key={area} value={area}>{area}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            優先的に検索したい習い事ジャンル（複数選択可）
          </label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {interests.map(interest => (
              <button
                key={interest}
                type="button"
                onClick={() => handleInterestToggle(interest, 'preferred')}
                className={`px-3 py-2 text-sm rounded-md border transition-colors ${
                  formData.preferredCategories.includes(interest)
                    ? 'bg-green-100 border-green-300 text-green-700'
                    : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                {interest}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">設定内容の確認</h2>
        <p className="text-gray-600">入力いただいた内容をご確認ください。</p>
      </div>
      
      <div className="space-y-6 bg-gray-50 p-6 rounded-lg">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">保護者情報</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">お名前:</span> {formData.parentName}</p>
            <p><span className="font-medium">年代:</span> {formData.parentAge}</p>
            <p><span className="font-medium">興味のあるジャンル:</span> {formData.parentInterests.join(', ') || 'なし'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">お子様情報</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">お名前:</span> {formData.childName}</p>
            <p><span className="font-medium">年齢:</span> {formData.childAge}</p>
            <p><span className="font-medium">興味のありそうなジャンル:</span> {formData.childInterests.join(', ') || 'なし'}</p>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">地域・希望設定</h3>
          <div className="space-y-1 text-sm text-gray-600">
            <p><span className="font-medium">地域:</span> {formData.area}</p>
            <p><span className="font-medium">優先ジャンル:</span> {formData.preferredCategories.join(', ') || 'なし'}</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* プログレスバー */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-500">ステップ {step} / 4</span>
              <span className="text-sm font-medium text-gray-500">{Math.round((step / 4) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 4) * 100}%` }}
              />
            </div>
          </div>

          {/* ステップコンテンツ */}
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
          {step === 4 && renderStep4()}

          {/* ナビゲーションボタン */}
          <div className="flex justify-between mt-8">
            <button
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
              className={`px-6 py-2 rounded-md font-medium transition-colors ${
                step === 1
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              戻る
            </button>
            
            <button
              onClick={handleNext}
              className="px-6 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-md font-medium hover:from-purple-600 hover:to-blue-600 transition-colors"
            >
              {step === 4 ? '設定完了' : '次へ'}
            </button>
          </div>

          {/* スキップリンク */}
          <div className="text-center mt-4">
            <Link 
              href="/me"
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              スキップして後で設定する
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
