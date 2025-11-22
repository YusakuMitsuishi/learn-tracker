# プロジェクト状態メモ

**最終更新**: 2025-01-22

---

## 📌 クイックサマリー

### プロジェクト名
学習継続支援Webアプリ（仮称）

### 現在のフェーズ
**Phase 0: 環境セットアップ** - 未開始

### 次にやること
1. Node.js、pnpm、Docker、Supabase CLIのインストール確認
2. Supabaseアカウント作成
3. Next.jsプロジェクト作成
4. 初回起動確認

---

## 🎯 プロジェクト概要

### 何を作るか
ディスプレイに常時表示する学習・運動継続支援アプリ
- TODO管理
- 進捗記録
- 統計分析・グラフ表示
- ド派手な達成演出
- リアルタイム同期
- オフライン対応

### 技術構成
```
フロントエンド: Next.js + TypeScript + Tailwind CSS
バックエンド:    Supabase（完全無料BaaS）
ホスティング:    Vercel（無料プラン）
データベース:    PostgreSQL（Supabase）
状態管理:        Zustand
オフライン:      IndexedDB（Dexie.js）
```

### なぜこの構成？
- ✅ 完全無料で運用可能
- ✅ バックエンドコード不要（BaaS）
- ✅ リアルタイム同期が標準機能
- ✅ 認証システム組み込み済み
- ✅ Vercel初心者・Supabase初心者でも扱いやすい

---

## 📂 重要ファイル

### 設計ドキュメント
| ファイル | 説明 | 状態 |
|---------|------|------|
| `requirements/requirements.md` | 要件定義書 | ✅ 完成 |
| `requirements/project-structure-supabase.md` | プロジェクト構成設計 | ✅ 完成 |
| `requirements/development-plan.md` | WBS・開発計画 | ✅ 完成 |
| `requirements/diagrams/architecture-supabase.puml` | アーキテクチャ図 | ✅ 完成 |
| `requirements/diagrams/database-schema-supabase.puml` | DB設計図 | ✅ 完成 |

### ソースコード（未作成）
- `src/` - ソースコードディレクトリ
- `supabase/migrations/` - DBマイグレーション
- `package.json` - 依存関係

---

## ✅ 完了タスク

- [x] 要件定義の作成・ブラッシュアップ
- [x] Supabase + Vercel構成への変更
- [x] プロジェクト構成設計
- [x] データベーススキーマ設計
- [x] WBS（開発計画）作成
- [x] PlantUML図の作成

---

## 📋 次回やること（Phase 0）

### Phase 0.1: ローカル開発環境構築
```bash
# 確認コマンド
node -v      # v18以上
pnpm -v      # インストールされているか確認
docker -v    # Docker Desktop起動確認
supabase -v  # Supabase CLI確認
```

### Phase 0.2: Supabaseアカウント・プロジェクト作成
1. https://supabase.com でアカウント作成
2. 新規プロジェクト作成
3. プロジェクトURL、API Key取得
4. ローカルSupabase起動テスト

### Phase 0.3: Vercelアカウント作成
1. https://vercel.com でGitHub連携
2. アカウント作成完了

### Phase 0.4: Next.jsプロジェクト作成
```bash
cd c:\Users\yuusu\Documents\web_app
pnpm create next-app@latest . --typescript --tailwind --app --src-dir
pnpm install @supabase/supabase-js @supabase/ssr zustand dexie
pnpm dev
```

詳細は `requirements/development-plan.md` の Phase 0 を参照

---

## 🗄️ データベース設計（概要）

### 主要テーブル
1. **profiles** - ユーザープロフィール
2. **todos** - TODO管理（タイトル、目標値、進捗、優先度、締切）
3. **progress** - 進捗記録（値、メモ、タイムスタンプ）
4. **achievements** - 実績（タイプ、条件、解除状態）
5. **stats** - 日次統計（完了数、総時間、ストリーク）
6. **settings** - ユーザー設定（テーマ、表示間隔、通知）

### セキュリティ
- すべてのテーブルにRow Level Security (RLS)適用
- ユーザーは自分のデータのみアクセス可能
- `auth.uid() = user_id` でフィルタリング

---

## 🎨 主要機能

### Phase 1 (MVP)
- [x] 認証（ログイン/サインアップ）
- [x] TODO作成・編集・削除
- [x] 進捗記録
- [x] ディスプレイモード（基本）
- [x] シンプルな達成演出

### Phase 2 (コア機能)
- [ ] 統計・グラフ表示
- [ ] 実績システム
- [ ] リアルタイム同期
- [ ] 通知・リマインダー
- [ ] カスタマイズ設定

### Phase 3 (PWA)
- [ ] PWA化（インストール可能）
- [ ] オフライン対応
- [ ] データエクスポート/インポート

### Phase 4 (演出強化)
- [ ] ド派手な演出（紙吹雪、花火）
- [ ] 応援メッセージシステム
- [ ] ゲーミフィケーション
- [ ] 音声入力

---

## 🚀 開発の進め方

### 基本フロー
```
Phase 0（環境構築）
    ↓
Phase 1（MVP実装）← ローカルで動作確認
    ↓
Phase 2（機能拡張）← ローカルで完成度UP
    ↓
Phase 3（PWA化）
    ↓
Phase 4（演出強化）← 楽しい部分！
    ↓
Phase 5（テスト・最適化）
    ↓
Phase 6（本番デプロイ）← Vercelで公開
```

### 開発環境起動コマンド
```bash
# ターミナル1: Supabaseローカル起動
cd c:\Users\yuusu\Documents\web_app
supabase start

# ターミナル2: Next.js開発サーバー
cd c:\Users\yuusu\Documents\web_app
pnpm dev

# アクセス
# Next.js: http://localhost:3000
# Supabase Studio: http://localhost:54323
```

---

## 💡 ユーザー（開発者）の状況

- **経験レベル**: Vercel初心者、Supabase初心者
- **希望**: まずローカルで開発・動作確認してからデプロイ
- **詳細設定が必要**: 各ツールの設定方法を丁寧にレクチャー

---

## 📝 次回セッション開始時のチェックリスト

次回Claude Codeを起動したら：

1. [ ] このファイル（PROJECT_STATUS.md）を開く
2. [ ] 「現在のフェーズ」を確認
3. [ ] 「次にやること」を確認
4. [ ] `requirements/development-plan.md` でWBSを確認
5. [ ] 完了したタスクにチェック☑を入れる
6. [ ] 次のタスクに取り組む

---

## 🔗 クイックリンク

### ドキュメント
- [要件定義](requirements/requirements.md)
- [プロジェクト構成](requirements/project-structure-supabase.md)
- [開発計画・WBS](requirements/development-plan.md)

### 公式ドキュメント
- [Next.js](https://nextjs.org/docs)
- [Supabase](https://supabase.com/docs)
- [Vercel](https://vercel.com/docs)

---

## 🎯 今後の目標

### 短期目標（1-2週間）
- Phase 0完了: 環境セットアップ
- Phase 1完了: MVPローカル動作

### 中期目標（1ヶ月）
- Phase 1-3完了: コア機能実装、PWA化

### 長期目標（2ヶ月）
- Phase 1-6完了: フル機能版デプロイ、本番公開

---

## 📞 困ったときの質問テンプレート

Claudeに質問する際は、以下のような形式で：

```
「Phase X.X の〇〇を実装したいです。
具体的な手順を教えてください。」
```

例:
```
「Phase 0.4 のNext.jsプロジェクト作成を実行したいです。
コマンドと設定の詳細を教えてください。」
```

---

## 🔄 更新履歴

| 日付 | フェーズ | 更新内容 |
|------|---------|---------|
| 2025-01-22 | Phase 0（未開始） | プロジェクト状態ファイル作成 |

---

**次回開始時**: このファイルを開いて、「次にやること」から始めましょう！
