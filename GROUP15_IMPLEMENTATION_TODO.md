## 『習い事Prime』実装TODO（GUI構築・PR/FAQ/Tech整合）

本TODOは、`group15/group-15-pr.md` `group15/group-15-FAQ.md` `group15/group-15-tech.md` に準拠し、AWS GUIで実装を完遂するための依存関係つきタスクリストです。最小デモ(DynamoDB)から本番想定(RDS)への段階移行も明示します。

---

ステータス凡例: [未着手] / [着手中] / [完了] / [保留]
依存記法: （依存: A → B は「A完了後にB」）

## フェーズ0: デモ安定化（現構成の完成度向上）
- S3 静的サイト: 現在の `naraigoto-demo-site` をCloudFront経由で配信 [完了]（依存: なし）
- API Gateway + Lambda + DynamoDB（2表／MVP Read Model）: [未着手]（依存: DynamoDBテーブル作成 → Lambda作成/環境変数設定/IAM → API Gateway統合/デプロイ → CloudFrontにAPIオリジン追加）
  - Lessons: 一覧/詳細用（PK: lessonId）
  - Reviews: 口コミ取得/投稿（PK: lessonsId, SK: createdAt, role=parent|child）
  - 注: 既存の `get_reviews`/`post_reviews` は親/子別テーブル前提の実装です。単一 `Reviews` 採用時はLambdaを修正。
  - DynamoDB(MVP Read Model) テーブル定義（詳細）
    - `Lessons`（PK: lessonId[S]）
      - 代表属性: schoolId, classId, title, area, category, instructorId, ratingAvg[N], ratingCount[N], imageKey, updatedAt
    - `ParentReviews`（PK: lessonsId[S], SK: createdAt[S]）
      - 代表属性: id, bookingId, targetType(school|instructor), targetId, rating[N], comment, userId, familyId, createdAt
    - `ChildReviews`（PK: lessonsId[S], SK: createdAt[S]）
      - 代表属性: id, bookingId, targetType(school|instructor), targetId, rating[N], comment, userId, familyId, createdAt
    - 備考: 将来は単一 `Reviews`（SK: `type#createdAt`）へ集約可。Lambdaの環境変数/クエリ条件を調整
- CORS統一とエラーハンドリング整理 [未着手]（依存: API Gateway + Lambda 基本稼働）
- CloudFront `/api/*` → API Gateway ルーティング（オプションで Function によるパス書き換え）[未着手]（依存: API Gateway ルート/ステージ デプロイ済み）

依存: S3 → CloudFront → API Gateway → Lambda → DynamoDB

---

## フェーズ1: 本番アーキ導入（Next.js + Cognito 準備）
1) フロント基盤（Next.js SSG/ISR + CSR） [未着手]（依存: CloudFront+S3 配信基盤）
- リポジトリに Next.js アプリを作成（静的出力：SSG/ISR中心、保護ページはCSR）
- ビルド成果物を S3 に配置し CloudFront で配信
- 画像等は別S3バケット（将来のプリサインドアップロード対応）

2) 認証（Cognito User Pool） [未着手]（依存: フロントのドメイン/コールバックURL設定 → Cognitoドメイン/Hosted UI）
- User Pool/ドメイン/Hosted UI 設定、グループ（parent/child/school_owner/admin）
- アプリクライアント設定（PKCE）
- CloudFront 経由のフロントから Hosted UI に遷移 → callback 受領

3) API 入り口（API Gateway REST/WebSocket） [未着手]（依存: なし／Authorizer導入時は Cognito 設定 → Authorizer 紐付け）
- REST: `GET/POST`等をLambda統合（Authorizerは後続で）
- WebSocket: メッセージ機能用の接続/送受信/切断ハンドラ雛形

4) 観測性/運用 [未着手]（依存: Lambda/API 稼働 → X-Ray/Alarms有効化）
- CloudWatch Logs/X-Ray有効化、基本メトリクス/アラーム作成
- WAF（レート/ボット）をCloudFrontに付与

---

## フェーズ2: RDS(PostgreSQL+RDS Proxy) への本実装
1) RDS 構築 [未着手]（依存: VPC/サブネット/セキュリティグループ設計 → RDS Proxy）
- マルチAZのRDS for PostgreSQL + RDS Proxy + VPC内配置
- セキュリティグループ/NACL設定、Secrets Managerで資格情報管理

2) スキーマ実装（Techのデータモデルに準拠） [未着手]（依存: RDS 構築 → 接続/資格情報準備）
（主系の切り分け: RDS=強整合/トランザクション/結合、DynamoDB=レビュー/いいね等の高スループット＆低レイテンシ。詳細は下記SoR/CQRS方針参照）
- users: `id, type(parent|child|school_owner|admin), email, name, created_at`
  - 役割: 利用者（保護者/子/教室オーナー/管理者）
  - 列の意味: id(ユーザーID), type(ロール), email(連絡先), name(表示名), created_at(作成時刻)
  - 主な制約: PK(id), UNIQUE(email)
- families: `id, parent_user_id, stripe_customer_id`
  - 役割: 家族（世帯）
  - 列の意味: id(家族ID), parent_user_id(保護者ユーザーID), stripe_customer_id(Stripe顧客ID)
  - 主な制約: PK(id), FK(parent_user_id→users.id), UNIQUE(stripe_customer_id)
- family_members: `family_id, child_user_id`
  - 役割: 家族と子ユーザーの関連
  - 列の意味: family_id(家族ID), child_user_id(子ユーザーID)
  - 主な制約: PK(family_id, child_user_id), FK(family_id→families.id), FK(child_user_id→users.id)
- schools: `id, name, area, category, description, image_key, location`
  - 役割: 教室（施設）
  - 列の意味: id(教室ID), name(名称), area(エリア), category(ジャンル), description(紹介文), image_key(S3キー), location(位置Point)
  - 主な制約: PK(id)
- instructors: `id, school_id, name, profile, image_key`
  - 役割: 指導者（先生）
  - 列の意味: id(先生ID), school_id(所属教室), name(氏名), profile(紹介), image_key(S3キー)
  - 主な制約: PK(id), FK(school_id→schools.id)
- classes: `id, school_id, title, capacity, duration_min`
  - 役割: クラス（講座の種類）
  - 列の意味: id(クラスID), school_id(教室ID), title(タイトル), capacity(定員), duration_min(所要分)
  - 主な制約: PK(id), FK(school_id→schools.id)
- lesson_schedules: `id, class_id, instructor_id, start_at, end_at`
  - 役割: 開催スケジュール（日時枠）
  - 列の意味: id(枠ID), class_id(クラスID), instructor_id(担当先生ID), start_at(開始), end_at(終了)
  - 主な制約: PK(id), FK(class_id→classes.id), FK(instructor_id→instructors.id), UNIQUE(class_id, start_at)
- subscriptions: `id, family_id, plan, status, current_period_start, current_period_end, stripe_subscription_id`
  - 役割: 月額契約
  - 列の意味: id(契約ID), family_id(家族ID), plan(プラン), status(状態), current_period_start(期間開始), current_period_end(期間終了), stripe_subscription_id(Stripe契約ID)
  - 主な制約: PK(id), FK(family_id→families.id), UNIQUE(stripe_subscription_id)
- payments: `id, family_id, stripe_payment_intent_id, amount, currency, status, created_at, meta`
  - 役割: 個別決済（初回/更新/失敗）
  - 列の意味: id(決済ID), family_id(家族ID), stripe_payment_intent_id(Stripe PI), amount(金額), currency(通貨), status(状態), created_at(発生), meta(付随情報)
  - 主な制約: PK(id), FK(family_id→families.id), UNIQUE(stripe_payment_intent_id)
- webhook_events: `id, stripe_event_id, type, payload, received_at, processed_at`
  - 役割: Stripe Webhookイベント受信
  - 列の意味: id(受信ID), stripe_event_id(イベントID), type(種別), payload(生データ), received_at(受信), processed_at(処理完了)
  - 主な制約: PK(id), UNIQUE(stripe_event_id)
- ticket_balances: `id, family_id, month, balance`
  - 役割: 月次チケット残高
  - 列の意味: id(残高ID), family_id(家族ID), month(対象月), balance(残枚数)
  - 主な制約: PK(id), FK(family_id→families.id), UNIQUE(family_id, month)
- bookings: `id, user_id(child), schedule_id, status, consumed_tickets, created_at`
  - 役割: 子ユーザーの予約
  - 列の意味: id(予約ID), user_id(子ユーザーID), schedule_id(スケジュールID), status(状態), consumed_tickets(消費枚数), created_at(作成)
  - 主な制約: PK(id), FK(user_id→users.id), FK(schedule_id→lesson_schedules.id), UNIQUE(user_id, schedule_id)
- attendances: `id, booking_id, status(attended|absent)`
  - 役割: 出欠
  - 列の意味: id(出欠ID), booking_id(予約ID), status(出席/欠席)
  - 主な制約: PK(id), FK(booking_id→bookings.id)
- conversations: `id, booking_id, family_id, school_id, created_at`
  - 役割: メッセージ会話スレッド
  - 列の意味: id(会話ID), booking_id(予約ID), family_id(家族ID), school_id(教室ID), created_at(作成)
  - 主な制約: PK(id), FK(booking_id→bookings.id), FK(family_id→families.id), FK(school_id→schools.id)
- messages: `id, conversation_id, sender_user_id, body, created_at, read_at`
  - 役割: 会話内メッセージ
  - 列の意味: id(メッセージID), conversation_id(会話ID), sender_user_id(送信者ID), body(本文), created_at(送信), read_at(既読)
  - 主な制約: PK(id), FK(conversation_id→conversations.id), FK(sender_user_id→users.id)
- points_transactions: `id, family_id, type(review|referral|redeem), amount, created_at, meta`
  - 役割: ポイント取引履歴
  - 列の意味: id(取引ID), family_id(家族ID), type(種別), amount(増減), created_at(記録), meta(付随情報)
  - 主な制約: PK(id), FK(family_id→families.id)
- referrals: `id, referrer_family_id, code, referred_family_id, status(pending|accepted), created_at`
  - 役割: 紹介（リファラル）
  - 列の意味: id(リファラルID), referrer_family_id(紹介元家族ID), code(招待コード), referred_family_id(紹介先家族ID), status(状態), created_at(作成)
  - 主な制約: PK(id), FK(referrer_family_id→families.id), FK(referred_family_id→families.id), UNIQUE(code)

2.1) DynamoDB スキーマ（SoR/Read Model） [未着手]
- SoR（主系: DynamoDB 管理）
  - ParentReviews（PK: lessonsId[S], SK: createdAt[S]）
    - 代表属性: id, bookingId, targetType(school|instructor), targetId, rating[N], comment, userId, familyId, createdAt
    - 備考: 投稿可否（予約済/受講済）はアプリ層で検証（RDS bookings参照）。GSI例: `targetType-targetId`（reviews by target）
  - ChildReviews（PK: lessonsId[S], SK: createdAt[S]）
    - 代表属性: 上に同じ
  - Likes（PK: userId[S], SK: schoolId[S]）
    - 代表属性: id, createdAt。GSI例: `schoolId`（like数集計用）/ `familyId-userId`
- Read Model（投影: 高速閲覧/集計用途）
  - LessonsCatalog（PK: lessonId[S]）
    - 代表属性: schoolId, classId, title, area, category, instructorId, ratingAvg[N], ratingCount[N], imageKey, updatedAt
    - 由来: RDSの schools/classes/lesson_schedules から投影
  - SchoolsStats / InstructorsStats（PK: id[S]）
    - 代表属性: ratingAvg, ratingCount, likesCount, recentReviewAt など（可変）
    - 由来: RDS/DynamoDBのイベントから非同期集計

3) マイグレーション [未着手]（依存: スキーマ実装 → 初期データ整備）
- 初期マイグレーション適用（DDL）
- 既存DynamoDBデータからの最小移行（lessons, reviews）※デモ保持用

4) データベース運用方針（SoR/CQRS） [未着手]（依存: なし／以降のAPI設計の前提）
- ドメインごとに主系(System of Record)を固定
  - RDS（主系）: users, families, family_members, schools, instructors, classes, lesson_schedules, subscriptions, payments, webhook_events, ticket_balances, bookings, attendances, conversations, messages, points_transactions, referrals
  - DynamoDB（主系）: reviews_parent, reviews_child, likes
  - DynamoDB（投影/集計）: lessons_catalog, schools_stats, instructors_stats, recent_reviews, ranking など
- 片方向投影（CQRS Read Model）。Dual-write禁止（アプリは常に主系へ書き込み→イベントで投影）
- 同期手段: Outbox（RDS）/ DynamoDB Streams → EventBridge/SQS → 投影更新。冪等キー（ID/updatedAt）で重複適用防止
- UI: 即時整合が必要な操作（予約/決済/残高等）はRDSを参照、一覧/ランキング/詳細のレビュー表示はDynamoDB投影を参照

4) Lambda のRDS化 [未着手]（依存: RDSスキーマ/接続情報 → Secrets Manager 設定 → IAM 権限）
- 予約/チケット消費はトランザクションで実装
- Stripe Webhookで subscriptions/payments 更新とチケット付与

---

## フェーズ3: ドメイン機能の実装（API）
REST主要エンドポイント（Tech準拠・例） [未着手]
- 認証: `POST /auth/callback`（初回プロビジョニング） [未着手]（依存: Cognito 設定 → Secrets/ユーザーレコード初期化）
- 検索/閲覧: `GET /schools` `GET /schools/{id}` `GET /instructors/{id}` `GET /classes` [未着手]（依存: RDS スキーマ/データ → Lambda RDS化）
- 予約: `POST /bookings` `GET /me/bookings` `POST /bookings/{id}/cancel` [未着手]（依存: RDS スキーマ/トランザクション → Stripe(必要に応じ)）
- 出席: `POST /attendances/{bookingId}`（教室権限） [未着手]（依存: RDS スキーマ/認可）
- 口コミ: `POST /reviews/parent` `POST /reviews/child` `GET /schools/{id}/reviews` [未着手]（依存: RDS スキーマ（本実装）／MVPはDynamoDB）
- いいね: `POST /schools/{id}/like` `DELETE /schools/{id}/like` `GET /families/{id}/likes` [未着手]（依存: RDS スキーマ（本実装）／MVPはDynamoDB投影）
- メッセージ: `POST /conversations` `GET /conversations` `GET /conversations/{id}/messages` `POST /conversations/{id}/messages`（REST）/ WebSocket: 接続・送受信・切断 [未着手]（依存: RDS スキーマ → API GW(REST/WS) → Lambda 実装）
- ポイント: `GET /me/points` `POST /points/redeem` [未着手]（依存: RDS スキーマ → イベント/集計）
- 紹介: `POST /referrals` `POST /referrals/accept` `GET /me/referrals` [未着手]（依存: RDS スキーマ/認可）
- 決済(Stripe): `POST /billing/checkout-session` `POST /billing/portal-session` `POST /webhooks/stripe` [未着手]（依存: Stripeダッシュボード設定 → Secrets Manager → Lambda 実装）

非同期/イベント [未着手]（依存: 対象ドメインのRDS/Lambda 実装 → EventBridge/SES/SNS 設定）
- 月次チケット付与（EventBridge）
- 受講後口コミ依頼メール（SES）
- 口コミ投稿に応じたポイント付与

---

## フロントエンド: 必要ページ一覧とレンダリング方式 [未着手]

公開（未認証。SSG/ISR）
- `/` ホーム・検索導線（SSG + CSRで検索UI）
- `/schools` 教室一覧（ISR）
- `/schools/[id]` 教室詳細（ISR）
- `/instructors/[id]` 先生詳細（ISR）
- `/classes` クラス検索（ISR）
- `/classes/[id]` クラス詳細（ISR）
- `/pricing` 料金/プラン（SSG）
- `/faq` よくある質問（SSG）
- `/about` 事業紹介（SSG）

認証/オンボーディング（Hosted UI遷移/CSR） [未着手]
- `/auth/login`（Hosted UIへ誘導リンク）
- `/auth/callback`（CSR/SSRいずれか。JWT受領・初期プロビジョニング）
- `/onboarding` 初回設定（CSR）

保護（親/子。CSRガード） [未着手]
- `/me` ダッシュボード（CSR）
- `/me/tickets` チケット残高（CSR）
- `/me/bookings` 予約一覧（CSR）
- `/me/bookings/[id]` 予約詳細（CSR）
- `/me/reviews/new` 口コミ投稿（CSR）
- `/me/likes` いいね（CSR）
- `/me/points` ポイント（CSR）
- `/me/referrals` 紹介（CSR）

教室オーナー（保護/CSR）
- `/owner/dashboard` 概況（CSR）
- `/owner/classes` クラス管理（CSR）
- `/owner/schedules` 開催枠管理（CSR）
- `/owner/attendances` 出欠確定（CSR）

メッセージ（保護/CSR + WebSocket） [未着手]
- `/conversations` スレッド一覧（CSR）
- `/conversations/[id]` 会話（CSR + WS）

補足
- 公開ページは SSG/ISR で高速表示とSEO。
- 保護ページは CSRでトークン検証（将来SSR化も可）。
- 画像は CloudFront+S3（OAC）。アップロードはプリサインドURL。

---

## コンポーネント/UX TODO（抜粋）
- 検索フォーム（エリア/ジャンル/日付）と結果一覧（無限スクロール） [未着手]
- 詳細ページのレビュー（親/子並列）といいねボタン [未着手]
- 予約フロー（残チケット検証 → 予約作成 → メール） [未着手]
- 受講後の口コミ依頼通知（メール） [未着手]
- メッセージUI（既読、未読バッジ、リアルタイム反映） [未着手]
- アクセシビリティ（キーボード操作/aria属性/コントラスト） [未着手]

---

## セキュリティ/認可 TODO
- Cognito JWT 検証（API Gateway Authorizer） [未着手]
- ロール別権限制御（親/子/教室/管理者） [未着手]
- WAF レート制御/ボット対策 [未着手]
- Stripe Webhook署名検証/Idempotency-Key 運用 [未着手]

---

## CI/CD TODO
- GitHub Actions（フロント: S3デプロイ→CloudFront無効化、バックエンド: CDK/Lambda更新） [保留]
- IaC（CDK TypeScript）で主要リソースをコード化 [保留]

---

## データ移行・段階運用 [未着手]
- 現行DynamoDB(MVP Read Model)を維持しつつ、予約/チケット等はRDSを主系として段階導入
- 並行期間は RDS(主系) → DynamoDB(Read Model) に投影し、フロントは用途別に参照先を選択
- Dual-writeは禁止。切替はシャドーライティング→差分検証→段階カットオーバーで実施

---

## 明示的な依存関係順序（実行ガイド）
1. CloudFront+S3（フロント配信）
2. API Gateway+Lambda（デモAPI稼働）
3. Cognito（Hosted UI/コールバック）
4. RDS+RDS Proxy（本番DB）
5. Stripe（課金/Webhook）
6. 予約/チケット/口コミ/メッセージAPI（本実装）
7. Next.js ページの段階的置換（SSG/ISR/CSR）
8. WAF/監視/アラーム/通知の整備

---

## 完了判定（DoD）
- 公開ページがSEO/OGP含め安定配信（SSG/ISR）
- 認証後、予約～受講～口コミ投稿が一気通貫で成功
- メッセージがリアルタイムに送受信できる
- 月次チケット付与・決済Webhookが冪等に運用
- 主要メトリクス/アラームが可視化されている


