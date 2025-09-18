# 習い事Prime フロントエンド

Next.js 14 (App Router) で構築された習い事検索・予約プラットフォームのフロントエンド。

## 🚀 特徴

- **モダンなUI/UX**: Tailwind CSS ベースの洗練されたデザインシステム
- **レスポンシブデザイン**: モバイルファーストでどのデバイスでも最適表示
- **静的出力**: SSG/ISR による高速配信とSEO最適化
- **認証システム**: AWS Cognito Hosted UI + PKCE による安全な認証
- **API統合**: Lambda バックエンドとの完全統合

## 📁 プロジェクト構成

```
frontend/
├── src/
│   ├── app/                 # App Router ページ
│   │   ├── (auth)/         # 認証関連ページ
│   │   ├── me/             # 保護されたマイページ
│   │   ├── schools/        # 習い事検索・詳細
│   │   └── layout.tsx      # グローバルレイアウト
│   ├── components/         # 再利用可能コンポーネント
│   │   ├── Header.tsx      # ヘッダーナビゲーション
│   │   ├── Footer.tsx      # フッター
│   │   ├── SearchForm.tsx  # 検索フォーム
│   │   ├── ReviewList.tsx  # レビュー表示
│   │   └── LikeButton.tsx  # いいねボタン
│   └── lib/                # ユーティリティ
│       ├── api.ts          # API クライアント
│       └── auth.ts         # 認証ヘルパー
├── package.json
├── next.config.js          # 静的出力設定
└── tsconfig.json
```

## 🛠 セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. 環境変数の設定

`.env.local` ファイルを作成し、以下の環境変数を設定してください：

```env
# API Gateway のベースURL
NEXT_PUBLIC_API_BASE_URL=https://your-api-id.execute-api.ap-northeast-1.amazonaws.com/prod

# Cognito 設定
NEXT_PUBLIC_COGNITO_DOMAIN=https://your-domain.auth.ap-northeast-1.amazoncognito.com
NEXT_PUBLIC_COGNITO_CLIENT_ID=your_client_id
NEXT_PUBLIC_COGNITO_REDIRECT_URI=https://your-cloudfront-domain/auth/callback
NEXT_PUBLIC_COGNITO_LOGOUT_REDIRECT_URI=https://your-cloudfront-domain/
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

http://localhost:3000 でアプリケーションが起動します。

## 🏗 ビルド・デプロイ

### 本番ビルド

```bash
npm run build
```

静的ファイルが `out/` ディレクトリに生成されます。

### S3 デプロイ

1. `out/` ディレクトリの内容を S3 バケットにアップロード
2. CloudFront で配信設定
3. デフォルトルートオブジェクト: `index.html`
4. エラーページ: `404.html` (オプション)

## 🎨 デザインシステム

### カラーパレット

- **プライマリ**: Purple (#6366f1)
- **セカンダリ**: Amber (#f59e0b)
- **成功**: Green (#10b981)
- **エラー**: Red (#ef4444)
- **グレースケール**: Gray 50-900

### コンポーネント

- **ボタン**: `.btn`, `.btn-primary`, `.btn-secondary`
- **カード**: `.card`, `.card-body`, `.card-header`
- **フォーム**: `.form-input`, `.form-select`, `.form-label`

## 📱 ページ構成

### 公開ページ (SSG/ISR)

- `/` - ホーム（ヒーロー + 検索）
- `/schools` - 習い事一覧
- `/schools/[id]` - 習い事詳細
- `/pricing` - 料金プラン
- `/faq` - よくある質問
- `/about` - サービス紹介

### 認証ページ

- `/auth/login` - ログイン（Hosted UI 連携）
- `/auth/callback` - コールバック（トークン交換）

### 保護ページ (CSR)

- `/me` - マイページダッシュボード
- `/me/bookings` - 予約管理
- `/me/tickets` - チケット残高
- `/me/likes` - お気に入り
- `/me/reviews/new` - レビュー投稿
- `/me/points` - ポイント管理

## 🔐 認証フロー

1. ユーザーがログインボタンをクリック
2. PKCE コードチャレンジを生成
3. Cognito Hosted UI にリダイレクト
4. 認証後、コールバックで認証コードを受信
5. コードとバリファイアーでトークン交換
6. JWT トークンを localStorage に保存
7. マイページにリダイレクト

## 🔌 API 統合

### 主要エンドポイント

- `GET /lessons` - 習い事一覧
- `GET /lessons/{id}` - 習い事詳細
- `GET /reviews?lessonsId={id}` - レビュー取得
- `POST /reviews` - レビュー投稿
- `POST /bookings` - 予約作成
- `GET /bookings?userId={id}` - 予約一覧
- `POST /likes` - いいね追加
- `DELETE /likes/{userId}/{schoolId}` - いいね削除

### エラーハンドリング

API エラーは適切にキャッチし、ユーザーフレンドリーなメッセージを表示します。

## 🧪 開発・デバッグ

### ローカル開発

```bash
# 開発サーバー
npm run dev

# 型チェック
npx tsc --noEmit

# ビルドテスト
npm run build
```

### 環境変数の確認

ブラウザの開発者ツールで `process.env` を確認し、`NEXT_PUBLIC_*` 変数が正しく設定されているか確認してください。

## 📈 パフォーマンス最適化

- **静的生成**: 公開ページは SSG で事前生成
- **増分再生成**: ISR で定期的な更新
- **画像最適化**: Next.js Image コンポーネント
- **コード分割**: 動的インポートによる最適化
- **キャッシュ戦略**: API レスポンスの適切なキャッシュ

## 🌐 SEO 対応

- **メタデータ**: 各ページに適切な title/description
- **構造化データ**: JSON-LD による検索エンジン対応
- **サイトマップ**: 自動生成（オプション）
- **OGP**: ソーシャルメディア対応

## 🔧 トラブルシューティング

### よくある問題

1. **認証エラー**: 環境変数の設定を確認
2. **API エラー**: CORS 設定とエンドポイントを確認
3. **ビルドエラー**: 型エラーと依存関係を確認

### ログ確認

```bash
# ブラウザコンソール
# Network タブで API リクエストを確認

# サーバーログ
npm run dev -- --debug
```

## 📞 サポート

質問や問題がある場合は、プロジェクトの Issues または開発チームまでお気軽にお問い合わせください。
