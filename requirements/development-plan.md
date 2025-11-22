# 学習継続支援アプリ 開発計画書（WBS）

## プロジェクト概要

### アプリケーション名
学習継続支援Webアプリ（仮称）

### 目的
学習や運動などの継続的な活動をサポートするWebアプリケーション。ディスプレイに常時表示し、TODO管理・進捗記録・統計分析・達成演出を提供。

### 技術スタック
- **フロントエンド**: Next.js (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: Supabase（BaaS - 完全無料）
- **ホスティング**: Vercel（無料プラン）
- **状態管理**: Zustand
- **データベース**: PostgreSQL（Supabase提供）
- **オフライン対応**: IndexedDB（Dexie.js）

### 対象ユーザー
- Vercel初心者
- Supabase初心者
- まずローカル環境で開発・動作確認
- 最後にデプロイ

---

## WBS（Work Breakdown Structure）

### Phase 0: 環境セットアップ（推定: 1-2日）

#### 0.1 ローカル開発環境構築
- [ ] 0.1.1 Node.js、pnpm インストール確認
- [ ] 0.1.2 Supabase CLI インストール
- [ ] 0.1.3 Docker Desktop インストール（Supabaseローカル起動用）
- [ ] 0.1.4 VSCode拡張機能インストール
  - ESLint
  - Prettier
  - Tailwind CSS IntelliSense
  - PostgreSQL

#### 0.2 Supabaseアカウント・プロジェクト作成
- [ ] 0.2.1 Supabaseアカウント作成（無料）
- [ ] 0.2.2 新規プロジェクト作成
- [ ] 0.2.3 プロジェクトURL・API Key取得
- [ ] 0.2.4 ローカルSupabase起動（`supabase start`）

#### 0.3 Vercelアカウント作成
- [ ] 0.3.1 Vercelアカウント作成（GitHub連携）
- [ ] 0.3.2 GitHubリポジトリ作成

#### 0.4 Next.jsプロジェクト作成
- [ ] 0.4.1 `create-next-app`でプロジェクト作成
- [ ] 0.4.2 TypeScript、Tailwind CSS、App Router設定
- [ ] 0.4.3 `.env.local`ファイル作成
- [ ] 0.4.4 初回起動確認（`pnpm dev`）

---

### Phase 1: MVP実装 - 基本機能（推定: 5-7日）

#### 1.1 データベース設計・構築
- [ ] 1.1.1 マイグレーションファイル作成（初期スキーマ）
  - `profiles`テーブル
  - `todos`テーブル
  - `progress`テーブル
  - `settings`テーブル
- [ ] 1.1.2 Row Level Security (RLS) ポリシー設定
- [ ] 1.1.3 マイグレーション適用（`supabase db push`）
- [ ] 1.1.4 型定義生成（`supabase gen types typescript`）

#### 1.2 認証機能実装
- [ ] 1.2.1 Supabase Authクライアント設定
- [ ] 1.2.2 ログインページ作成（`/login`）
- [ ] 1.2.3 サインアップページ作成（`/signup`）
- [ ] 1.2.4 認証ミドルウェア実装
- [ ] 1.2.5 ログアウト機能実装
- [ ] 1.2.6 認証状態管理（Zustand）

#### 1.3 TODO管理機能実装
- [ ] 1.3.1 Zustand Store作成（`todoStore`）
- [ ] 1.3.2 TODO一覧取得API実装
- [ ] 1.3.3 TODO作成フォーム実装
- [ ] 1.3.4 TODO一覧表示コンポーネント実装
- [ ] 1.3.5 TODO編集・削除機能実装
- [ ] 1.3.6 優先度・カテゴリフィルター実装

#### 1.4 進捗記録機能実装
- [ ] 1.4.1 進捗記録フォーム実装
- [ ] 1.4.2 進捗データ保存API実装
- [ ] 1.4.3 TODO の `current_value` 自動更新
- [ ] 1.4.4 進捗履歴表示機能

#### 1.5 ディスプレイモード（基本版）実装
- [ ] 1.5.1 ディスプレイモードページ作成（`/display`）
- [ ] 1.5.2 本日のTODOリスト表示
- [ ] 1.5.3 自動画面切り替え機能（10秒間隔）
- [ ] 1.5.4 手動操作（スワイプ・クリック）対応
- [ ] 1.5.5 全画面表示モード

#### 1.6 シンプルな達成演出
- [ ] 1.6.1 目標達成判定ロジック実装
- [ ] 1.6.2 Confettiアニメーション実装
- [ ] 1.6.3 達成メッセージ表示
- [ ] 1.6.4 効果音再生（オプション）

---

### Phase 2: コア機能拡張（推定: 7-10日）

#### 2.1 統計・分析機能実装
- [ ] 2.1.1 `stats`テーブル追加（マイグレーション）
- [ ] 2.1.2 日次統計計算ロジック実装
- [ ] 2.1.3 週次・月次統計表示
- [ ] 2.1.4 Recharts によるグラフ描画
  - 棒グラフ（日別進捗）
  - 折れ線グラフ（推移）
  - 円グラフ（カテゴリ別）
- [ ] 2.1.5 継続日数（ストリーク）計算
- [ ] 2.1.6 GitHubスタイルのヒートマップ実装

#### 2.2 実績（Achievement）システム実装
- [ ] 2.2.1 `achievements`テーブル追加
- [ ] 2.2.2 実績条件定義（JSONB）
- [ ] 2.2.3 実績チェックロジック実装
  - 7日連続達成
  - 累計100時間
  - マイルストーン達成
- [ ] 2.2.4 実績解除通知機能
- [ ] 2.2.5 バッジ表示UI実装

#### 2.3 カスタマイズ機能実装
- [ ] 2.3.1 設定ページ作成（`/settings`）
- [ ] 2.3.2 テーマ切り替え（ライト/ダーク）
- [ ] 2.3.3 ディスプレイモード設定
  - 画面切り替え間隔
  - 表示項目のON/OFF
- [ ] 2.3.4 演出設定
  - 演出レベル（控えめ/通常/派手）
  - 効果音ON/OFF

#### 2.4 リアルタイム同期実装
- [ ] 2.4.1 Supabase Realtime設定
- [ ] 2.4.2 TODO変更のリアルタイム反映
- [ ] 2.4.3 複数デバイス同期テスト
- [ ] 2.4.4 競合解決ロジック

#### 2.5 通知・リマインダー機能
- [ ] 2.5.1 ブラウザ通知許可取得
- [ ] 2.5.2 リマインダー設定UI
- [ ] 2.5.3 スケジュール通知機能
- [ ] 2.5.4 継続促進通知

---

### Phase 3: PWA・オフライン対応（推定: 3-5日）

#### 3.1 PWA設定
- [ ] 3.1.1 `next-pwa` インストール・設定
- [ ] 3.1.2 `manifest.json` 作成
- [ ] 3.1.3 アプリアイコン作成（192x192、512x512）
- [ ] 3.1.4 Service Worker 動作確認

#### 3.2 オフライン対応実装
- [ ] 3.2.1 IndexedDB設定（Dexie.js）
- [ ] 3.2.2 オフライン時のデータ保存
- [ ] 3.2.3 オンライン復帰時の同期処理
- [ ] 3.2.4 ネットワーク状態検知
- [ ] 3.2.5 楽観的UI更新

#### 3.3 データエクスポート機能
- [ ] 3.3.1 CSV形式エクスポート
- [ ] 3.3.2 JSON形式エクスポート
- [ ] 3.3.3 データインポート機能

---

### Phase 4: UX向上・演出強化（推定: 5-7日）

#### 4.1 高度な演出システム
- [ ] 4.1.1 Framer Motion によるアニメーション強化
- [ ] 4.1.2 複数の演出パターン実装
  - 紙吹雪
  - 花火
  - キラキラエフェクト
- [ ] 4.1.3 マイルストーン達成時の特別演出
- [ ] 4.1.4 最長記録更新時の演出

#### 4.2 応援メッセージシステム
- [ ] 4.2.1 日替わりメッセージDB作成
- [ ] 4.2.2 状況に応じたメッセージ選択ロジック
- [ ] 4.2.3 モチベーションTips表示

#### 4.3 ゲーミフィケーション要素
- [ ] 4.3.1 レベルシステム実装
- [ ] 4.3.2 ポイントシステム実装
- [ ] 4.3.3 称号システム実装

#### 4.4 音声入力機能（オプション）
- [ ] 4.4.1 Web Speech API 統合
- [ ] 4.4.2 音声認識による進捗記録

#### 4.5 アクセシビリティ対応
- [ ] 4.5.1 ARIAラベル追加
- [ ] 4.5.2 キーボード操作対応
- [ ] 4.5.3 スクリーンリーダー対応

---

### Phase 5: テスト・最適化（推定: 3-5日）

#### 5.1 ユニットテスト実装
- [ ] 5.1.1 Vitest 設定
- [ ] 5.1.2 ユーティリティ関数テスト
- [ ] 5.1.3 コンポーネントテスト（React Testing Library）

#### 5.2 E2Eテスト実装（オプション）
- [ ] 5.2.1 Playwright 設定
- [ ] 5.2.2 主要フローのE2Eテスト

#### 5.3 パフォーマンス最適化
- [ ] 5.3.1 Lighthouse スコア計測
- [ ] 5.3.2 画像最適化（Next.js Image）
- [ ] 5.3.3 コード分割・遅延ロード
- [ ] 5.3.4 メモ化（useMemo、useCallback）

#### 5.4 セキュリティ監査
- [ ] 5.4.1 RLSポリシー再確認
- [ ] 5.4.2 XSS対策確認
- [ ] 5.4.3 環境変数の適切な管理

---

### Phase 6: デプロイ・本番運用（推定: 2-3日）

#### 6.1 Supabase本番環境設定
- [ ] 6.1.1 本番プロジェクトでマイグレーション実行
- [ ] 6.1.2 認証設定（メール確認、OAuth設定）
- [ ] 6.1.3 Realtime 有効化確認
- [ ] 6.1.4 バックアップ設定

#### 6.2 Vercelデプロイ
- [ ] 6.2.1 GitHubリポジトリとVercel連携
- [ ] 6.2.2 環境変数設定（Vercel管理画面）
- [ ] 6.2.3 本番ビルド実行
- [ ] 6.2.4 デプロイ確認

#### 6.3 カスタムドメイン設定（オプション）
- [ ] 6.3.1 ドメイン取得
- [ ] 6.3.2 Vercelにカスタムドメイン設定
- [ ] 6.3.3 SSL証明書設定（自動）

#### 6.4 モニタリング設定
- [ ] 6.4.1 Vercel Analytics 有効化
- [ ] 6.4.2 エラートラッキング設定（Sentry等）
- [ ] 6.4.3 Supabase ダッシュボード監視設定

---

## 開発の進め方

### 推奨フロー

1. **Phase 0**: 環境セットアップ（最初の1日）
2. **Phase 1**: MVP実装（ローカルで動作確認）
3. **Phase 2**: コア機能拡張（ローカルで完成度を高める）
4. **Phase 3**: PWA・オフライン対応
5. **Phase 4**: 演出・UX向上（楽しい部分！）
6. **Phase 5**: テスト・最適化
7. **Phase 6**: 本番デプロイ

### 各Phaseの完了条件

- **Phase 0**: ローカルでNext.jsとSupabaseが起動できる
- **Phase 1**: ローカルでTODO作成・進捗記録・ディスプレイモード表示ができる
- **Phase 2**: 統計グラフ表示、実績解除、リアルタイム同期ができる
- **Phase 3**: PWAとしてインストール可能、オフラインで操作できる
- **Phase 4**: 演出が派手で楽しい、UIが洗練されている
- **Phase 5**: テストが通る、パフォーマンススコアが高い
- **Phase 6**: Vercelで本番公開、複数デバイスから利用可能

---

## 詳細な初期設定手順（Phase 0詳細版）

### 0.1 必要なツールのインストール

#### Node.js インストール
```bash
# Node.js 18以上が必要
node -v
# v18.x.x 以上であればOK

# pnpm インストール
npm install -g pnpm
pnpm -v
```

#### Supabase CLI インストール
```bash
# Windows (Scoop使用)
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
scoop install supabase

# または npm経由
npm install -g supabase

# 確認
supabase --version
```

#### Docker Desktop インストール
- https://www.docker.com/products/docker-desktop からダウンロード
- インストール後、Docker Desktopを起動しておく

---

### 0.2 Supabaseプロジェクト作成

#### オンライン（本番用）
1. https://supabase.com にアクセス
2. 「Start your project」をクリック
3. GitHubアカウントでサインアップ
4. 「New project」をクリック
5. プロジェクト名を入力（例: `habit-tracker`）
6. Database Passwordを設定（メモしておく）
7. Regionは「Northeast Asia (Tokyo)」を選択
8. 「Create new project」をクリック
9. プロジェクトURL、API Keyをメモ
   - Project URL: `https://xxxxx.supabase.co`
   - anon/public key: `eyJhbGc...`

#### ローカル（開発用）
```bash
# プロジェクトディレクトリで実行
cd c:\Users\yuusu\Documents\web_app
supabase init

# Dockerが起動していることを確認してから
supabase start

# 起動後、以下の情報が表示される
# API URL: http://localhost:54321
# DB URL: postgresql://postgres:postgres@localhost:54322/postgres
# Studio URL: http://localhost:54323
# anon key: eyJhbGc...
```

---

### 0.3 Vercelアカウント作成

1. https://vercel.com にアクセス
2. 「Sign Up」をクリック
3. GitHubアカウントで連携
4. Hobby（無料プラン）を選択
5. 準備完了（デプロイ時に使用）

---

### 0.4 Next.jsプロジェクト作成

```bash
# プロジェクトディレクトリに移動
cd c:\Users\yuusu\Documents\web_app

# Next.jsプロジェクト作成
pnpm create next-app@latest . --typescript --tailwind --app --src-dir --import-alias "@/*"

# 質問に対する回答例:
# ✔ Would you like to use TypeScript? … Yes
# ✔ Would you like to use ESLint? … Yes
# ✔ Would you like to use Tailwind CSS? … Yes
# ✔ Would you like to use `src/` directory? … Yes
# ✔ Would you like to use App Router? … Yes
# ✔ Would you like to customize the default import alias? … No

# 依存関係インストール
pnpm install @supabase/supabase-js @supabase/ssr zustand dexie

# 開発サーバー起動
pnpm dev

# ブラウザで http://localhost:3000 を開く
```

#### 環境変数設定
```bash
# .env.local ファイルを作成
# c:\Users\yuusu\Documents\web_app\.env.local
```

```.env.local
# Supabase（ローカル開発用）
NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...（supabase startで表示されたanon key）

# 本番環境用（後で設定）
# NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
# NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
```

---

## 次回起動時のための情報

### プロジェクト状態の記録

#### 現在の状況
- **フェーズ**: Phase 0（環境セットアップ）未完了
- **完了タスク**: 要件定義、プロジェクト構成設計、WBS作成
- **次のタスク**: Phase 0.1〜0.4（環境セットアップ）

#### 重要な設計判断
1. **技術スタック**: Supabase + Vercel（完全無料構成）
2. **データベース**: PostgreSQL（Supabase）
3. **認証**: Supabase Auth
4. **状態管理**: Zustand
5. **UI**: Tailwind CSS + shadcn/ui
6. **オフライン**: IndexedDB（Dexie.js）

#### ドキュメント一覧
- `requirements/requirements.md` - 要件定義書（Supabase版に更新済み）
- `requirements/project-structure-supabase.md` - プロジェクト構成設計書
- `requirements/development-plan.md` - 開発計画書（本ファイル）
- `requirements/diagrams/architecture-supabase.puml` - アーキテクチャ図
- `requirements/diagrams/database-schema-supabase.puml` - DB スキーマ図

#### データベーススキーマ概要
主要テーブル：
- `profiles` - ユーザープロフィール（auth.users連携）
- `todos` - TODO管理
- `progress` - 進捗記録
- `achievements` - 実績
- `stats` - 日次統計
- `settings` - ユーザー設定

すべてのテーブルにRow Level Security (RLS)を適用。

#### ディレクトリ構成
```
web_app/
├── requirements/        # 設計ドキュメント（作成済み）
├── supabase/           # Supabaseマイグレーション（未作成）
├── public/             # 静的ファイル（未作成）
├── src/                # ソースコード（未作成）
│   ├── app/           # Next.js App Router
│   ├── components/    # Reactコンポーネント
│   ├── lib/           # ライブラリ・ユーティリティ
│   └── types/         # TypeScript型定義
├── package.json        # 依存関係（未作成）
└── .env.local         # 環境変数（未作成）
```

---

## 次回の作業開始時の手順

### 1. 前回の状態を確認
```markdown
1. このファイル（development-plan.md）を開く
2. WBSのチェックボックスで進捗確認
3. 「現在の状況」セクションを確認
```

### 2. 開発環境の起動
```bash
# ターミナルを2つ開く

# ターミナル1: Supabaseローカル起動
cd c:\Users\yuusu\Documents\web_app
supabase start

# ターミナル2: Next.js開発サーバー起動
cd c:\Users\yuusu\Documents\web_app
pnpm dev
```

### 3. 参照ドキュメント
- 要件: `requirements/requirements.md`
- 設計: `requirements/project-structure-supabase.md`
- 進捗: `requirements/development-plan.md`（本ファイル）

### 4. 困ったときの質問テンプレート
```
「Phase X.X.X の〇〇を実装したいです。
具体的な手順を教えてください。」

例:
「Phase 1.1.1 のマイグレーションファイル作成を実装したいです。
具体的な手順を教えてください。」
```

---

## 見積もり

### 最小構成（MVP）
- **期間**: 2週間〜1ヶ月
- **フェーズ**: Phase 0 〜 Phase 1
- **機能**: 認証、TODO管理、進捗記録、簡単なディスプレイモード

### フル機能版
- **期間**: 1.5〜2ヶ月
- **フェーズ**: Phase 0 〜 Phase 6
- **機能**: 全機能（統計、実績、PWA、オフライン、演出等）

### 1日あたりの作業時間想定
- 1-2時間/日: 2〜3ヶ月
- 3-4時間/日: 1.5〜2ヶ月
- 6-8時間/日（集中開発）: 3〜4週間

---

## リスクと対策

### リスク1: Supabase無料プランの制限超過
- **対策**: データ量監視、必要に応じてデータ削減

### リスク2: Vercel無料プランの帯域制限
- **対策**: 画像最適化、CDN活用

### リスク3: 複雑な演出によるパフォーマンス低下
- **対策**: アニメーション最適化、設定で演出レベル調整可能に

### リスク4: オフライン同期の競合
- **対策**: タイムスタンプベースの競合解決、LWW（Last Write Wins）

---

## 完成イメージ

### MVP（Phase 1完了時）
- ログイン/サインアップができる
- TODOを作成・編集・削除できる
- 進捗を記録できる
- ディスプレイモードで今日のTODOを確認できる
- 目標達成時に簡単な演出が表示される

### フル機能版（Phase 6完了時）
- 美しい統計グラフが表示される
- 継続日数が可視化される
- 実績を解除するとド派手な演出がある
- PWAとしてスマホにインストールできる
- オフラインでも使える
- 複数デバイスでリアルタイム同期される
- 励ましメッセージが表示される
- ダークモード対応
- スマホ、タブレット、PCすべてで快適に使える

---

## 参考リンク

### 公式ドキュメント
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Vercel: https://vercel.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand-demo.pmnd.rs/

### 学習リソース
- Supabase チュートリアル: https://supabase.com/docs/guides/getting-started
- Next.js App Router: https://nextjs.org/docs/app
- PostgreSQL RLS: https://supabase.com/docs/guides/auth/row-level-security

---

## 更新履歴

| 日付 | 更新内容 | 更新者 |
|------|---------|--------|
| 2025-01-22 | 初版作成 | Claude |

---

## 次回作業時のチェックリスト

次回セッション開始時に以下を確認してください：

- [ ] このファイルを開いて進捗状況を確認
- [ ] 「現在の状況」セクションを更新
- [ ] 完了したタスクにチェック☑を入れる
- [ ] 次のタスクを確認
- [ ] 必要なドキュメントを開く
- [ ] Docker Desktop起動（Supabase使用時）
- [ ] ターミナルで `supabase start` 実行
- [ ] ターミナルで `pnpm dev` 実行
