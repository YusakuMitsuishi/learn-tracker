# 学習継続支援Webアプリ

> 学習や運動などの継続的な活動をサポートするWebアプリケーション

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green)](https://supabase.com/)
[![Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com/)
[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)

---

## 📖 概要

このアプリは、学習・運動・習慣など、**継続が重要な活動**をサポートするWebアプリケーションです。

### 主な特徴

✨ **ディスプレイモード**: 常時表示用の画面で、TODO・進捗・カレンダーを自動切り替え
📊 **統計・分析**: 日次・週次・月次レポート、継続日数の可視化
🎉 **達成演出**: 目標達成時のド派手な演出でモチベーションUP
📱 **PWA対応**: スマホ・タブレット・PCすべてで動作、オフライン利用可能
🔄 **リアルタイム同期**: 複数デバイス間で自動同期
🎨 **カスタマイズ**: テーマ、演出レベル、表示設定を自由に調整

---

## 🚀 技術スタック

### フロントエンド
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS** + shadcn/ui
- **Zustand** (状態管理)
- **Framer Motion** (アニメーション)
- **Recharts** (グラフ描画)

### バックエンド（BaaS）
- **Supabase**
  - PostgreSQL
  - Supabase Auth（認証）
  - Realtime（リアルタイム同期）
  - Storage（ファイル保存）
  - Edge Functions（サーバーレス）

### インフラ
- **Vercel** (ホスティング - 無料プラン)
- **Supabase** (バックエンド - 無料プラン)

### その他
- **IndexedDB** (オフライン対応)
- **PWA** (next-pwa)

---

## 📁 プロジェクト構成

```
web_app/
├── requirements/              # 設計ドキュメント
│   ├── requirements.md       # 要件定義書
│   ├── project-structure-supabase.md  # プロジェクト構成
│   ├── development-plan.md   # WBS・開発計画
│   └── diagrams/             # PlantUML図
│
├── supabase/                 # Supabase設定
│   ├── migrations/           # DBマイグレーション
│   └── functions/            # Edge Functions
│
├── src/
│   ├── app/                  # Next.js App Router
│   ├── components/           # Reactコンポーネント
│   ├── lib/                  # ライブラリ・ユーティリティ
│   └── types/                # TypeScript型定義
│
├── public/                   # 静的ファイル
├── PROJECT_STATUS.md         # プロジェクト状態（最新情報）
└── README.md                 # このファイル
```

---

## 🛠️ セットアップ

### 必要な環境
- Node.js 18以上
- pnpm
- Docker Desktop（Supabaseローカル起動用）
- Supabase CLI

### インストール手順

#### 1. リポジトリのクローン
```bash
git clone <repository-url>
cd web_app
```

#### 2. 依存関係のインストール
```bash
pnpm install
```

#### 3. 環境変数の設定
```bash
# .env.local ファイルを作成
cp .env.local.example .env.local

# 以下を設定
# NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
# NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

#### 4. Supabaseローカル起動
```bash
supabase start
```

#### 5. 開発サーバー起動
```bash
pnpm dev
```

ブラウザで http://localhost:3000 を開く

---

## 📚 ドキュメント

### 設計ドキュメント
- **[要件定義書](requirements/requirements.md)** - アプリの要件・機能一覧
- **[プロジェクト構成](requirements/project-structure-supabase.md)** - ディレクトリ構成・技術詳細
- **[開発計画](requirements/development-plan.md)** - WBS・タスク一覧
- **[プロジェクト状態](PROJECT_STATUS.md)** - 現在の進捗状況（最新）

### アーキテクチャ図
- `requirements/diagrams/architecture-supabase.puml` - システム全体図
- `requirements/diagrams/database-schema-supabase.puml` - DB設計図

---

## 🎯 開発フェーズ

### Phase 0: 環境セットアップ ⏳
- [ ] ローカル開発環境構築
- [ ] Supabaseアカウント・プロジェクト作成
- [ ] Vercelアカウント作成
- [ ] Next.jsプロジェクト作成

### Phase 1: MVP実装 📝
- [ ] データベース構築
- [ ] 認証機能
- [ ] TODO管理機能
- [ ] 進捗記録機能
- [ ] ディスプレイモード（基本）
- [ ] シンプルな達成演出

### Phase 2: コア機能拡張 📊
- [ ] 統計・分析機能
- [ ] 実績システム
- [ ] カスタマイズ機能
- [ ] リアルタイム同期
- [ ] 通知・リマインダー

### Phase 3: PWA・オフライン対応 📱
- [ ] PWA設定
- [ ] オフライン対応
- [ ] データエクスポート

### Phase 4: UX向上・演出強化 🎨
- [ ] 高度な演出システム
- [ ] 応援メッセージシステム
- [ ] ゲーミフィケーション要素
- [ ] 音声入力
- [ ] アクセシビリティ対応

### Phase 5: テスト・最適化 🧪
- [ ] ユニットテスト
- [ ] E2Eテスト
- [ ] パフォーマンス最適化
- [ ] セキュリティ監査

### Phase 6: デプロイ・本番運用 🚀
- [ ] Supabase本番環境設定
- [ ] Vercelデプロイ
- [ ] モニタリング設定

詳細は [development-plan.md](requirements/development-plan.md) を参照

---

## 🗄️ データベース設計

### 主要テーブル

| テーブル | 説明 |
|---------|------|
| `profiles` | ユーザープロフィール |
| `todos` | TODO管理（目標・進捗） |
| `progress` | 進捗記録（履歴） |
| `achievements` | 実績・バッジ |
| `stats` | 日次統計 |
| `settings` | ユーザー設定 |

すべてのテーブルに**Row Level Security (RLS)**を適用し、ユーザーは自分のデータのみアクセス可能。

---

## 🎨 主要機能

### 1. ディスプレイモード
- 10秒間隔で画面を自動切り替え
- 本日のTODO、進捗、カレンダー、統計を表示
- 全画面表示モード対応
- ダークモード切り替え

### 2. TODO管理
- TODO作成・編集・削除
- 数値目標設定（時間、距離、回数等）
- 優先度・締切設定
- カテゴリ分類

### 3. 進捗記録
- テキスト/音声入力
- タイムスタンプ自動記録
- グラフ可視化

### 4. 統計・分析
- 日次・週次・月次レポート
- 継続日数（ストリーク）表示
- カテゴリ別時間配分
- ヒートマップカレンダー

### 5. 達成演出
- 紙吹雪・花火アニメーション
- 効果音・BGM
- バッジ・トロフィー獲得
- マイルストーン達成演出

### 6. 実績システム
- 7日連続達成
- 累計100時間
- カテゴリ別実績
- 隠し実績

---

## 💰 コスト（完全無料）

### Supabase無料プラン
- データベース: 500MB
- ストレージ: 1GB
- 帯域幅: 2GB/月
- 認証ユーザー: 50,000 MAU

### Vercel無料プラン
- 帯域幅: 100GB/月
- ビルド時間: 6,000分/月
- サーバーレス実行: 100GB-時間/月

**個人利用・小規模運用なら完全無料で運用可能！**

---

## 🔧 開発コマンド

```bash
# 開発サーバー起動
pnpm dev

# ビルド
pnpm build

# 本番サーバー起動
pnpm start

# Lint
pnpm lint

# テスト
pnpm test

# Supabase起動（ローカル）
supabase start

# Supabase停止
supabase stop

# マイグレーション作成
supabase migration new <migration_name>

# マイグレーション適用
supabase db push

# 型定義生成
supabase gen types typescript --local > src/types/database.types.ts
```

---

## 📝 ライセンス

MIT License

---

## 🙏 謝辞

このプロジェクトは以下のオープンソースプロジェクトを使用しています：
- [Next.js](https://nextjs.org/)
- [Supabase](https://supabase.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Recharts](https://recharts.org/)

---

## 📞 サポート

質問・バグレポート・機能リクエストは Issue にてお願いします。

---

**現在のステータス**: Phase 0（環境セットアップ） - [詳細はこちら](PROJECT_STATUS.md)
