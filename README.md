# 習い事Prime デモ - AWS GUI 構築 TODO

本リストは `group15/group-15-pr.md` `group15/group-15-FAQ.md` `group15/group-15-tech.md` に準拠した、AWS コンソール(GUI)での構築手順の TODO（依存関係つき）です。フロントは CloudFront、API は API Gateway+Lambda、ストレージは MVP 段階では DynamoDB を採用します。

注記（設計整合性）:
- 本番設計の主系(System of Record)は `group-15-tech.md` に示す RDS/PostgreSQL（必要に応じ PostGIS）。本READMEは「デモ/MVPの最小構成（DynamoDBの読み取りモデル）」を示します。
- 既存 Lambda（`get_reviews`/`post_reviews`）は親/子レビューの2系統を前提としているため、レビューは親用・子用を分けて保存します。

## 事前準備
- **リージョン選択**: ap-northeast-1（東京）を想定
- **権限**: 管理者相当（CloudFrontはグローバル、証明書はバージニア北部）

## 依存マップ（高レベル）
- S3(静的サイト) → CloudFront(フロント配信)
- DynamoDB(データ) → Lambda(実装) → API Gateway(公開) → CloudFront(/api/* 経由)
- カスタムドメイン利用時: ACM(us-east-1) → CloudFront、Route 53 → CloudFront/API

## TODO（GUI手順）

1. S3 バケット作成とデプロイ
   - バケット作成（プライベート/OAC前提、ブロックパブリックアクセス有効）
   - `s3/naraigoto-demo-site` の `index.html` `style.css` `app.js` `diag.html` をアップロード
   - 必要に応じてバージョニング有効化

2. CloudFront ディストリビューション（S3 オリジン）
   - オリジン: 作成した S3 バケット + OAC を新規作成・アタッチ
   - デフォルトビヘイビア: GET/HEAD、キャッシュ基本、OAC必須
   - エラーページ: 403/404 → `/index.html` にフォールバック（任意）

3. DynamoDB テーブル（MVPの最小構成／Read Model）
   - `Lessons`（PK: `lessonId` 文字列）
   - `Reviews`（PK: `lessonsId` 文字列, SK: `createdAt` 文字列）
     - 代表属性: `reviewId, userId, rating, comment, role(parent|child)`

4. DynamoDB 初期データ投入
   - `database/parentschildrenjson` の `lessons` を `Lessons` へ PutItem（`lessonId,title,area,genre`）
   - レビュー: `reviews_parent` と `reviews_child` を `Reviews` に統合投入（各アイテムに `role` を付与）
   - 項目マッピング例: `target_id` → `lessonsId`、`created_at` → `createdAt`、`id` → `reviewId`、`reviews_parent` は `role=parent`、`reviews_child` は `role=child`

5. Lambda 関数デプロイ（ランタイム: Python 3.11 例）
   - `lambda/list_lessons/lambda_function.py`
     - 環境変数: `Lessons` テーブル名を参照する実装なら `LESSONS_TABLE` 等に修正/設定
     - 今回のコードは `Lessons` 固定参照のため、そのままでも可
     - IAM: `dynamodb:Scan` 権限（リソース: Lessons）
   - `lambda/get_lesson_by_id/lambda_function.py`
     - スタブ（メモリ辞書）で動作
     - IAM: 追加不要
    - `lambda/get_reviews/lambda_function.py`
      - 環境変数: `REVIEWS_TABLE`
      - IAM: `dynamodb:Query` 権限（リソース: Reviews）
      - 実装メモ: `lessonsId` で Query、必要に応じ `role` で絞り込み
      - 注意: 本リポジトリ同梱の既存コードは親/子でテーブル分割された版です。単一 `Reviews` 版を採用する場合はコードを修正してください。
    - `lambda/post_reviews/lambda_function.py`
      - 環境変数: `REVIEWS_TABLE`
      - IAM: `dynamodb:PutItem` 権限（リソース: Reviews）
      - 実装メモ: `role` を `parent|child` で格納、`reviewId` は UUID、`createdAt` をソートキーに
      - 注意: 本リポジトリ同梱の既存コードは親/子でテーブル分割された版です。単一 `Reviews` 版を採用する場合はコードを修正してください。

6. API Gateway（REST API）
   - ルート作成:
     - `GET /lessons` → Lambda(list_lessons)
     - `GET /lessons/{lessonId}` → Lambda(get_lesson_by_id)
     - `GET /reviews` → Lambda(get_reviews) 期待パラメータ: `lessonsId`
     - `POST /reviews` → Lambda(post_reviews) 期待ボディ: `{ lessonsId, userId, rating, comment, role }`
   - CORS 有効化（`/reviews` は OPTIONS, POST を許可）
   - デプロイ（ステージ: `prod`）

7. CloudFront に API オリジン追加
   - オリジン: API Gateway invoke URL（リージョンエンドポイント）
   - 振り分けビヘイビア: パスパターン `/api/*` を API オリジンへ
   - オプション: CloudFront Function でオリジンリクエスト前に `/api` を除去（APIルートが直下の場合）

8. カスタムドメイン（任意）
   - ACM(us-east-1) で証明書を発行し CloudFront にアタッチ
   - Route 53 で A/AAAA(エイリアス) を CloudFront に向ける

9. セキュリティ/運用（任意/推奨）
   - CloudFront に WAF WebACL（レート/ボット）
   - CloudWatch Logs を Lambda にて確認、必要に応じメトリクス/アラーム

10. 動作確認（CloudFront経由）
   - ルートにアクセスし日本語表示が正常（文字化けなし）
   - 「一覧」→「詳細」取得
   - `/diag.html` で `/api/reviews?lessonsId=L002` 成功
   - レビュー投稿が成功し、読み出しに反映

---

トラブルシュート
- 文字化け: S3 の `Content-Type` に `charset=utf-8` が付くようメタデータを確認
- 403/404: OAC 設定と S3 バケットポリシーの紐付けを確認
- API 4xx: API Gateway の統合リクエスト/レスポンスマッピングと CORS 設定
- DDB: パーティションキー/ソートキー名（`lessonId` vs `lessonsId`）の不一致に注意
- 設計準拠: 本番移行時は `group-15-tech.md` の RDS スキーマを主系にし、DynamoDB への投影（CQRS Read Model）を検討
# naraigoto