'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  EnvelopeIcon,
  LockClosedIcon,
  UserIcon,
  HeartIcon,
  EyeIcon,
  EyeSlashIcon,
  PhoneIcon,
  CalendarDaysIcon,
  CheckIcon,
  ArrowRightIcon,
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<'parent' | 'child'>('parent');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    birthDate: '',
    childName: '',
    childBirthDate: '',
    interests: [] as string[],
    agreeTerms: false,
    agreePrivacy: false,
  });

  const interests = [
    { id: 'sports', label: 'スポーツ', icon: '⚽' },
    { id: 'music', label: '音楽', icon: '🎵' },
    { id: 'art', label: 'アート・工作', icon: '🎨' },
    { id: 'programming', label: 'プログラミング', icon: '💻' },
    { id: 'language', label: '語学', icon: '🗣️' },
    { id: 'dance', label: 'ダンス', icon: '💃' },
    { id: 'study', label: '学習塾', icon: '📚' },
    { id: 'martial', label: '武道', icon: '🥋' },
  ];

  const handleNext = () => {
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    // 実際のアプリではCognito APIを使用
    setTimeout(() => {
      alert('アカウントが作成されました！メールアドレスの確認を行ってください。');
      window.location.href = '/auth/login';
    }, 2000);
  };

  const toggleInterest = (interestId: string) => {
    setFormData(prev => ({
      ...prev,
      interests: prev.interests.includes(interestId)
        ? prev.interests.filter(id => id !== interestId)
        : [...prev.interests, interestId]
    }));
  };

  const isStepValid = () => {
    switch (step) {
      case 1:
        return formData.email && formData.password && formData.confirmPassword && 
               formData.password === formData.confirmPassword && formData.name;
      case 2:
        return userType === 'parent' ? 
          (formData.phone && formData.childName && formData.childBirthDate) :
          (formData.birthDate);
      case 3:
        return formData.agreeTerms && formData.agreePrivacy;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* ロゴ */}
        <Link href="/" className="flex items-center justify-center space-x-2 mb-8">
          <div className="w-12 h-12 gradient-primary rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">習</span>
          </div>
          <span className="text-3xl font-bold text-gradient-primary">
            習い事Prime
          </span>
        </Link>

        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            アカウントを作成
          </h2>
          <p className="mt-2 text-gray-600">
            お子様にぴったりの習い事を見つけましょう
          </p>
        </div>

        {/* プログレスバー */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            {[1, 2, 3].map((stepNum) => (
              <div key={stepNum} className="flex items-center">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-200",
                  step >= stepNum 
                    ? "bg-primary-600 text-white" 
                    : "bg-gray-300 text-gray-600"
                )}>
                  {step > stepNum ? <CheckIcon className="w-4 h-4" /> : stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={cn(
                    "w-16 h-0.5 mx-2 transition-all duration-200",
                    step > stepNum ? "bg-primary-600" : "bg-gray-300"
                  )} />
                )}
              </div>
            ))}
          </div>
          <div className="text-center text-sm text-gray-600">
            ステップ {step} / 3
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 shadow-xl rounded-2xl border border-gray-200">
          {/* ステップ1: 基本情報 */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  基本情報の入力
                </h3>
                <p className="text-sm text-gray-600">
                  ログインに必要な情報を入力してください
                </p>
              </div>

              {/* ユーザータイプ選択 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  アカウントの種類
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setUserType('parent')}
                    className={cn(
                      "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200",
                      userType === 'parent'
                        ? "border-primary-500 bg-primary-50 text-primary-700"
                        : "border-gray-300 text-gray-700 hover:border-primary-300"
                    )}
                  >
                    <UserIcon className="w-5 h-5 mr-2" />
                    保護者
                  </button>
                  <button
                    type="button"
                    onClick={() => setUserType('child')}
                    className={cn(
                      "flex items-center justify-center px-4 py-3 rounded-lg border-2 transition-all duration-200",
                      userType === 'child'
                        ? "border-accent-yellow bg-yellow-50 text-yellow-700"
                        : "border-gray-300 text-gray-700 hover:border-yellow-300"
                    )}
                  >
                    <HeartIcon className="w-5 h-5 mr-2" />
                    子ども
                  </button>
                </div>
              </div>

              {/* お名前 */}
              <div>
                <label className="form-label">
                  お名前
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <UserIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="form-input pl-10"
                    placeholder="田中 太郎"
                  />
                </div>
              </div>

              {/* メールアドレス */}
              <div>
                <label className="form-label">
                  メールアドレス
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <EnvelopeIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                    className="form-input pl-10"
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              {/* パスワード */}
              <div>
                <label className="form-label">
                  パスワード
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={formData.password}
                    onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                    className="form-input pl-10 pr-10"
                    placeholder="8文字以上"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
              </div>

              {/* パスワード確認 */}
              <div>
                <label className="form-label">
                  パスワード確認
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <LockClosedIcon className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                    className="form-input pl-10 pr-10"
                    placeholder="パスワードを再入力"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    {showConfirmPassword ? (
                      <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                    ) : (
                      <EyeIcon className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword && (
                  <p className="form-error">パスワードが一致しません</p>
                )}
              </div>
            </div>
          )}

          {/* ステップ2: 詳細情報 */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  詳細情報の入力
                </h3>
                <p className="text-sm text-gray-600">
                  {userType === 'parent' ? 'お子様の情報を入力してください' : '生年月日を入力してください'}
                </p>
              </div>

              {userType === 'parent' ? (
                <>
                  {/* 保護者の電話番号 */}
                  <div>
                    <label className="form-label">
                      電話番号
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <PhoneIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="tel"
                        required
                        value={formData.phone}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        className="form-input pl-10"
                        placeholder="090-1234-5678"
                      />
                    </div>
                  </div>

                  {/* 子どもの名前 */}
                  <div>
                    <label className="form-label">
                      お子様のお名前
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <HeartIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        required
                        value={formData.childName}
                        onChange={(e) => setFormData(prev => ({ ...prev, childName: e.target.value }))}
                        className="form-input pl-10"
                        placeholder="田中 花子"
                      />
                    </div>
                  </div>

                  {/* 子どもの生年月日 */}
                  <div>
                    <label className="form-label">
                      お子様の生年月日
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        type="date"
                        required
                        value={formData.childBirthDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, childBirthDate: e.target.value }))}
                        className="form-input pl-10"
                      />
                    </div>
                  </div>
                </>
              ) : (
                /* 子どもの生年月日 */
                <div>
                  <label className="form-label">
                    生年月日
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <CalendarDaysIcon className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="date"
                      required
                      value={formData.birthDate}
                      onChange={(e) => setFormData(prev => ({ ...prev, birthDate: e.target.value }))}
                      className="form-input pl-10"
                    />
                  </div>
                </div>
              )}

              {/* 興味のある分野 */}
              <div>
                <label className="form-label">
                  興味のある分野（複数選択可）
                </label>
                <div className="grid grid-cols-2 gap-3">
                  {interests.map((interest) => (
                    <button
                      key={interest.id}
                      type="button"
                      onClick={() => toggleInterest(interest.id)}
                      className={cn(
                        "flex items-center p-3 rounded-lg border-2 transition-all duration-200 text-left",
                        formData.interests.includes(interest.id)
                          ? "border-primary-500 bg-primary-50 text-primary-700"
                          : "border-gray-300 text-gray-700 hover:border-primary-300"
                      )}
                    >
                      <span className="text-xl mr-2">{interest.icon}</span>
                      <span className="text-sm font-medium">{interest.label}</span>
                      {formData.interests.includes(interest.id) && (
                        <CheckIcon className="w-4 h-4 ml-auto text-primary-600" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ステップ3: 利用規約 */}
          {step === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  利用規約への同意
                </h3>
                <p className="text-sm text-gray-600">
                  サービスをご利用いただくために、以下にご同意ください
                </p>
              </div>

              {/* 利用規約 */}
              <div className="space-y-4">
                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreeTerms}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreeTerms: e.target.checked }))}
                    className="form-checkbox text-primary-600 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <Link href="/terms" className="text-primary-600 hover:underline">
                      利用規約
                    </Link>
                    に同意します
                  </span>
                </label>

                <label className="flex items-start cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.agreePrivacy}
                    onChange={(e) => setFormData(prev => ({ ...prev, agreePrivacy: e.target.checked }))}
                    className="form-checkbox text-primary-600 mt-1"
                  />
                  <span className="ml-3 text-sm text-gray-700">
                    <Link href="/privacy" className="text-primary-600 hover:underline">
                      プライバシーポリシー
                    </Link>
                    に同意します
                  </span>
                </label>
              </div>

              {/* 特徴説明 */}
              <div className="bg-primary-50 rounded-lg p-4">
                <h4 className="font-semibold text-primary-900 mb-3">
                  習い事Primeの特徴
                </h4>
                <div className="space-y-2 text-sm text-primary-800">
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary-600" />
                    月額チケット制で様々な習い事を体験
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary-600" />
                    親子それぞれの視点から口コミを確認
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckIcon className="w-4 h-4 text-primary-600" />
                    安心・安全な習い事環境
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ボタン */}
          <div className="mt-8 flex gap-3">
            {step > 1 && (
              <button
                type="button"
                onClick={() => setStep(step - 1)}
                className="flex-1 btn btn-ghost"
              >
                戻る
              </button>
            )}
            <button
              type="button"
              onClick={handleNext}
              disabled={!isStepValid() || isLoading}
              className="flex-1 btn btn-primary"
            >
              {isLoading ? (
                <>
                  <div className="loading w-5 h-5 mr-2" />
                  作成中...
                </>
              ) : step === 3 ? (
                'アカウント作成'
              ) : (
                <>
                  次へ
                  <ArrowRightIcon className="w-4 h-4 ml-2" />
                </>
              )}
            </button>
          </div>

          {/* ログインリンク */}
          <div className="mt-6 text-center">
            <span className="text-sm text-gray-600">
              すでにアカウントをお持ちの方は{' '}
            </span>
            <Link href="/auth/login" className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              ログイン
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
