# プロジェクト構成設計書（Supabase + Vercel版）

## 1. 全体アーキテクチャ

本アプリケーションは、**Supabase（BaaS）+ Vercel（ホスティング）** による完全無料構成を採用します。

- **フロントエンド層**: Next.js (React) + PWA
- **バックエンド層**: Supabase（BaaS - Backend as a Service）
- **データ層**: PostgreSQL（Supabase提供） + IndexedDB（オフライン）

### アーキテクチャの特徴
- バックエンドサーバー不要（Supabaseが提供）
- 完全無料で運用可能
- リアルタイム同期が標準搭載
- 認証・ストレージ・データベースが統合

## 2. ディレクトリ構成

### 2.1 シンプルな Next.js 構成

バックエンドサーバーが不要なため、Next.js単一プロジェクトで構成します。

```
web_app/
├── package.json                    # プロジェクト依存関係
├── pnpm-lock.yaml                  # pnpmロックファイル
├── next.config.js                  # Next.js設定（PWA含む）
├── tsconfig.json                   # TypeScript設定
├── tailwind.config.js              # Tailwind CSS設定
├── .eslintrc.json                  # ESLint設定
├── .prettierrc                     # Prettier設定
├── .gitignore
├── .env.local.example              # 環境変数のサンプル
├── README.md                       # プロジェクトREADME
│
├── requirements/                   # 要件定義・設計ドキュメント
│   ├── requirements.md
│   ├── project-structure.md
│   └── diagrams/                   # PlantUML図
│       ├── architecture.puml
│       ├── database-schema.puml
│       └── sequence-diagrams.puml
│
├── supabase/                       # Supabase設定（ローカル開発用）
│   ├── config.toml                 # Supabase設定
│   ├── migrations/                 # データベースマイグレーション
│   │   ├── 20250101000000_initial_schema.sql
│   │   ├── 20250102000000_add_achievements.sql
│   │   └── 20250103000000_add_rls_policies.sql
│   ├── seed.sql                    # 初期データ
│   └── functions/                  # Edge Functions（必要に応じて）
│       └── check-achievements/
│
├── public/                         # 静的ファイル
│   ├── manifest.json              # PWAマニフェスト
│   ├── icons/                     # アプリアイコン
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── favicon.ico
│   └── sounds/                    # 効果音・BGM
│       ├── achievement.mp3
│       ├── celebration.mp3
│       └── notification.mp3
│
├── src/                           # ソースコード
│   ├── package.json
│   ├── vite.config.js             # Vite設定（React開発環境）
│   ├── tsconfig.json              # TypeScript設定
│   ├── .eslintrc.js               # ESLint設定
│   ├── .prettierrc                # Prettier設定
│   ├── public/                    # 静的ファイル
│   │   ├── manifest.json          # PWAマニフェスト
│   │   ├── service-worker.js      # Service Worker
│   │   ├── icons/                 # アプリアイコン
│   │   └── sounds/                # 効果音・BGM
│   │       ├── achievement.mp3
│   │       ├── celebration.mp3
│   │       └── notification.mp3
│   │
│   └── src/
│       ├── main.tsx               # エントリーポイント
│       ├── App.tsx                # ルートコンポーネント
│       ├── vite-env.d.ts
│       │
│       ├── components/            # Reactコンポーネント
│       │   ├── common/           # 共通コンポーネント
│       │   │   ├── Button/
│       │   │   ├── Input/
│       │   │   ├── Modal/
│       │   │   ├── Loading/
│       │   │   └── ErrorBoundary/
│       │   │
│       │   ├── display/          # ディスプレイモード関連
│       │   │   ├── DisplayContainer/
│       │   │   ├── TodoListView/
│       │   │   ├── ProgressView/
│       │   │   ├── CalendarView/
│       │   │   ├── StatsView/
│       │   │   └── MotivationView/
│       │   │
│       │   ├── todo/             # TODO管理関連
│       │   │   ├── TodoForm/
│       │   │   ├── TodoList/
│       │   │   ├── TodoItem/
│       │   │   └── ProgressInput/
│       │   │
│       │   ├── stats/            # 統計・分析関連
│       │   │   ├── DashboardView/
│       │   │   ├── ChartWrapper/
│       │   │   ├── StreakDisplay/
│       │   │   └── ReportGenerator/
│       │   │
│       │   ├── celebration/      # 演出関連
│       │   │   ├── Confetti/
│       │   │   ├── Fireworks/
│       │   │   ├── BadgeDisplay/
│       │   │   └── AchievementNotification/
│       │   │
│       │   └── settings/         # 設定関連
│       │       ├── SettingsPanel/
│       │       ├── ThemeSelector/
│       │       ├── NotificationSettings/
│       │       └── DataExport/
│       │
│       ├── pages/                # ページコンポーネント
│       │   ├── DisplayModePage.tsx
│       │   ├── InputModePage.tsx
│       │   ├── StatsPage.tsx
│       │   ├── SettingsPage.tsx
│       │   └── LoginPage.tsx
│       │
│       ├── hooks/                # カスタムフック
│       │   ├── useTodo.ts
│       │   ├── useAuth.ts
│       │   ├── useProgress.ts
│       │   ├── useStats.ts
│       │   ├── useNotification.ts
│       │   ├── useTheme.ts
│       │   └── useLocalStorage.ts
│       │
│       ├── store/                # 状態管理（Redux Toolkit）
│       │   ├── index.ts
│       │   ├── slices/
│       │   │   ├── authSlice.ts
│       │   │   ├── todoSlice.ts
│       │   │   ├── progressSlice.ts
│       │   │   ├── statsSlice.ts
│       │   │   ├── settingsSlice.ts
│       │   │   └── uiSlice.ts
│       │   └── middleware/
│       │       ├── syncMiddleware.ts  # デバイス間同期
│       │       └── offlineMiddleware.ts
│       │
│       ├── services/             # APIクライアント・サービス
│       │   ├── api/
│       │   │   ├── client.ts         # Axios設定
│       │   │   ├── authApi.ts
│       │   │   ├── todoApi.ts
│       │   │   ├── progressApi.ts
│       │   │   └── statsApi.ts
│       │   ├── firebase/
│       │   │   ├── config.ts
│       │   │   ├── auth.ts
│       │   │   └── messaging.ts
│       │   ├── storage/
│       │   │   ├── indexedDB.ts      # オフラインストレージ
│       │   │   └── localStorage.ts
│       │   └── notifications/
│       │       ├── pushNotification.ts
│       │       └── scheduler.ts
│       │
│       ├── utils/                # ユーティリティ関数
│       │   ├── dateHelpers.ts
│       │   ├── chartHelpers.ts
│       │   ├── validators.ts
│       │   ├── formatters.ts
│       │   └── constants.ts
│       │
│       ├── types/                # TypeScript型定義
│       │   ├── todo.types.ts
│       │   ├── user.types.ts
│       │   ├── stats.types.ts
│       │   ├── settings.types.ts
│       │   └── api.types.ts
│       │
│       ├── styles/               # スタイル定義
│       │   ├── globals.css
│       │   ├── themes/
│       │   │   ├── light.ts
│       │   │   ├── dark.ts
│       │   │   └── custom.ts
│       │   └── animations/
│       │       ├── confetti.css
│       │       └── transitions.css
│       │
│       └── assets/               # アセット
│           ├── images/
│           ├── icons/
│           └── fonts/
│
├── backend/                      # バックエンドアプリケーション
│   ├── package.json
│   ├── tsconfig.json
│   ├── .eslintrc.js
│   ├── .env.example
│   │
│   └── src/
│       ├── index.ts              # エントリーポイント
│       ├── app.ts                # Express設定
│       ├── server.ts             # サーバー起動
│       │
│       ├── config/               # 設定ファイル
│       │   ├── database.ts
│       │   ├── redis.ts
│       │   ├── firebase.ts
│       │   └── constants.ts
│       │
│       ├── routes/               # ルーティング
│       │   ├── index.ts
│       │   ├── auth.routes.ts
│       │   ├── todo.routes.ts
│       │   ├── progress.routes.ts
│       │   ├── stats.routes.ts
│       │   └── user.routes.ts
│       │
│       ├── controllers/          # コントローラー
│       │   ├── authController.ts
│       │   ├── todoController.ts
│       │   ├── progressController.ts
│       │   ├── statsController.ts
│       │   └── userController.ts
│       │
│       ├── services/             # ビジネスロジック
│       │   ├── authService.ts
│       │   ├── todoService.ts
│       │   ├── progressService.ts
│       │   ├── statsService.ts
│       │   ├── notificationService.ts
│       │   └── achievementService.ts
│       │
│       ├── models/               # データモデル（Mongoose）
│       │   ├── User.ts
│       │   ├── Todo.ts
│       │   ├── Progress.ts
│       │   ├── Achievement.ts
│       │   └── Settings.ts
│       │
│       ├── middleware/           # ミドルウェア
│       │   ├── auth.middleware.ts
│       │   ├── validate.middleware.ts
│       │   ├── errorHandler.middleware.ts
│       │   ├── rateLimit.middleware.ts
│       │   └── logger.middleware.ts
│       │
│       ├── validators/           # バリデーション
│       │   ├── todoValidator.ts
│       │   ├── progressValidator.ts
│       │   └── userValidator.ts
│       │
│       ├── utils/                # ユーティリティ
│       │   ├── logger.ts
│       │   ├── errorTypes.ts
│       │   ├── dateHelpers.ts
│       │   └── encryption.ts
│       │
│       └── types/                # TypeScript型定義
│           ├── express.d.ts
│           ├── models.types.ts
│           └── api.types.ts
│
├── shared/                       # フロントエンド・バックエンド共通
│   ├── package.json
│   └── src/
│       ├── types/               # 共通型定義
│       │   ├── todo.types.ts
│       │   ├── user.types.ts
│       │   └── api.types.ts
│       ├── constants/           # 共通定数
│       │   └── index.ts
│       └── utils/               # 共通ユーティリティ
│           └── validators.ts
│
└── tests/                       # テストコード
    ├── e2e/                     # E2Eテスト
    │   ├── display-mode.spec.ts
    │   ├── todo-management.spec.ts
    │   └── achievements.spec.ts
    ├── integration/             # 統合テスト
    │   └── api/
    └── unit/                    # ユニットテスト
        ├── frontend/
        └── backend/
```

## 3. データベース設計

### 3.1 MongoDB コレクション構成

#### users コレクション
```javascript
{
  _id: ObjectId,
  email: String,
  username: String,
  firebaseUid: String,
  profile: {
    displayName: String,
    avatar: String,
    timezone: String
  },
  settings: {
    theme: String,
    displayInterval: Number,
    notificationsEnabled: Boolean,
    soundEnabled: Boolean,
    celebrationLevel: String
  },
  createdAt: Date,
  updatedAt: Date
}
```

#### todos コレクション
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  title: String,
  description: String,
  category: String,
  goalType: String,              // 'time', 'distance', 'count', 'weight', etc.
  goalValue: Number,
  currentValue: Number,
  unit: String,
  priority: String,              // 'high', 'medium', 'low'
  deadline: Date,
  status: String,                // 'active', 'completed', 'archived'
  createdAt: Date,
  updatedAt: Date
}
```

#### progress コレクション
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  todoId: ObjectId,
  value: Number,
  note: String,
  timestamp: Date,
  location: {
    type: String,
    coordinates: [Number]
  },
  createdAt: Date
}
```

#### achievements コレクション
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  type: String,                  // 'streak', 'milestone', 'total', 'hidden'
  title: String,
  description: String,
  icon: String,
  condition: Object,
  unlocked: Boolean,
  unlockedAt: Date,
  createdAt: Date
}
```

#### stats コレクション（日次集計）
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  date: Date,
  totalTodos: Number,
  completedTodos: Number,
  totalTime: Number,
  categoryBreakdown: [{
    category: String,
    time: Number,
    count: Number
  }],
  streak: Number,
  createdAt: Date
}
```

### 3.2 Redis キャッシュ構成

```
Key Patterns:
- user:session:{userId}          # セッション情報
- user:stats:{userId}:{date}     # 日次統計キャッシュ
- user:streak:{userId}           # 継続日数キャッシュ
- notification:queue:{userId}    # 通知キュー
```

## 4. API エンドポイント設計

### 4.1 認証関連 (`/api/auth`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/register` | 新規ユーザー登録 |
| POST | `/login` | ログイン |
| POST | `/logout` | ログアウト |
| POST | `/refresh` | トークン更新 |
| GET | `/me` | 現在のユーザー情報取得 |

### 4.2 TODO関連 (`/api/todos`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | TODO一覧取得 |
| GET | `/:id` | TODO詳細取得 |
| POST | `/` | TODO作成 |
| PUT | `/:id` | TODO更新 |
| DELETE | `/:id` | TODO削除 |
| GET | `/today` | 本日のTODO取得 |
| GET | `/active` | アクティブなTODO取得 |

### 4.3 進捗関連 (`/api/progress`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| POST | `/` | 進捗記録 |
| GET | `/todo/:todoId` | TODO別進捗履歴取得 |
| GET | `/date/:date` | 日付別進捗取得 |
| GET | `/range` | 期間別進捗取得 |

### 4.4 統計関連 (`/api/stats`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/daily/:date` | 日次統計取得 |
| GET | `/weekly` | 週次統計取得 |
| GET | `/monthly` | 月次統計取得 |
| GET | `/streak` | 継続日数取得 |
| GET | `/trends` | トレンド分析取得 |

### 4.5 実績関連 (`/api/achievements`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | 実績一覧取得 |
| GET | `/unlocked` | 解除済み実績取得 |
| POST | `/check` | 実績達成チェック |

### 4.6 設定関連 (`/api/settings`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | 設定取得 |
| PUT | `/` | 設定更新 |
| POST | `/export` | データエクスポート |
| POST | `/import` | データインポート |

### 4.7 通知関連 (`/api/notifications`)

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | 通知一覧取得 |
| POST | `/register` | プッシュ通知登録 |
| PUT | `/:id/read` | 既読マーク |

## 5. 状態管理設計

### 5.1 Redux Store 構成

```typescript
{
  auth: {
    user: User | null,
    token: string | null,
    isAuthenticated: boolean,
    loading: boolean
  },
  todos: {
    items: Todo[],
    selectedTodo: Todo | null,
    filter: TodoFilter,
    loading: boolean
  },
  progress: {
    items: Progress[],
    todayProgress: Progress[],
    loading: boolean
  },
  stats: {
    daily: DailyStats | null,
    weekly: WeeklyStats | null,
    monthly: MonthlyStats | null,
    streak: number,
    loading: boolean
  },
  settings: {
    theme: ThemeSettings,
    display: DisplaySettings,
    notification: NotificationSettings
  },
  ui: {
    displayMode: {
      currentScreen: number,
      isAutoPlay: boolean,
      interval: number
    },
    modals: {
      celebration: boolean,
      achievementNotification: boolean
    },
    isOnline: boolean
  }
}
```

## 6. PWA構成

### 6.1 Service Worker 戦略

```javascript
// キャッシュ戦略
{
  // アプリシェル: Cache First
  appShell: ['/', '/index.html', '/main.js', '/styles.css'],

  // API: Network First (with fallback)
  api: ['/api/*'],

  // 静的アセット: Cache First
  assets: ['/icons/*', '/sounds/*', '/images/*'],

  // フォント: Cache First
  fonts: ['/fonts/*']
}
```

### 6.2 オフライン同期

```typescript
// IndexedDB構成
{
  stores: {
    todos: 'id, userId, status, updatedAt',
    progress: 'id, todoId, timestamp',
    pendingSync: 'id, type, data, timestamp'
  }
}
```

## 7. セキュリティ設計

### 7.1 認証フロー

1. Firebase Authenticationでユーザー認証
2. カスタムトークン生成（バックエンド）
3. JWTトークンを用いたAPI認証
4. Refreshトークンによる自動更新

### 7.2 セキュリティ対策

- HTTPS必須（本番環境）
- CORS設定（許可されたオリジンのみ）
- レートリミット（1分間に100リクエストまで）
- XSS対策（入力サニタイゼーション）
- CSRF対策（トークン検証）
- SQL/NoSQLインジェクション対策（パラメータ化クエリ）

## 8. パフォーマンス最適化

### 8.1 フロントエンド最適化

- コード分割（React.lazy + Suspense）
- 画像最適化（WebP、遅延ロード）
- メモ化（React.memo、useMemo、useCallback）
- 仮想スクロール（長いリスト表示）
- Service Worker によるキャッシュ

### 8.2 バックエンド最適化

- Redis キャッシュ（頻繁にアクセスされるデータ）
- データベースインデックス最適化
- クエリ最適化（N+1問題の回避）
- 接続プーリング
- レスポンス圧縮（gzip）

## 9. モニタリング・ログ

### 9.1 ログ収集

- アプリケーションログ（Winston）
- エラートラッキング（Sentry）
- パフォーマンスモニタリング（Web Vitals）
- ユーザー行動分析（Google Analytics / Mixpanel）

### 9.2 メトリクス

- API レスポンスタイム
- エラーレート
- アクティブユーザー数
- データベース接続数
- キャッシュヒット率

## 10. デプロイメント戦略

### 10.1 環境構成

- **開発環境**: ローカル（Docker Compose）
- **ステージング環境**: Vercel（フロントエンド） + Heroku（バックエンド）
- **本番環境**: Vercel（フロントエンド） + AWS/GCP（バックエンド）

### 10.2 CI/CDパイプライン

```yaml
# GitHub Actions
1. コードプッシュ
2. Lint & Format チェック
3. ユニットテスト実行
4. ビルド
5. E2Eテスト実行
6. ステージング環境へデプロイ
7. （マージ後）本番環境へデプロイ
```

### 10.3 バックアップ戦略

- データベース: 日次自動バックアップ（7日間保持）
- ユーザーデータ: エクスポート機能によるセルフバックアップ
- 設定情報: Git管理

## 11. 開発ツール・ライブラリ

### 11.1 フロントエンド

| カテゴリ | ツール/ライブラリ | 用途 |
|---------|------------------|------|
| ビルドツール | Vite | 高速開発環境 |
| 状態管理 | Redux Toolkit | グローバル状態管理 |
| ルーティング | React Router | ページ遷移 |
| UI | Material-UI / Tailwind CSS | UIコンポーネント |
| アニメーション | Framer Motion | 高度なアニメーション |
| グラフ | Chart.js / Recharts | データ可視化 |
| フォーム | React Hook Form | フォーム管理 |
| バリデーション | Zod | スキーマバリデーション |
| 日付操作 | date-fns | 日付処理 |
| HTTP | Axios | API通信 |

### 11.2 バックエンド

| カテゴリ | ツール/ライブラリ | 用途 |
|---------|------------------|------|
| フレームワーク | Express.js | Webサーバー |
| ORM | Mongoose | MongoDB操作 |
| バリデーション | Joi | リクエストバリデーション |
| 認証 | Passport.js | 認証戦略 |
| ログ | Winston | ロギング |
| テスト | Jest + Supertest | ユニット・統合テスト |
| ドキュメント | Swagger | API仕様書 |

## 12. 開発スケジュール（参考）

| フェーズ | 主要タスク | 期間目安 |
|---------|-----------|---------|
| Phase 1 | プロジェクトセットアップ、認証実装、基本TODO機能 | - |
| Phase 2 | ディスプレイモード、進捗記録、基本演出 | - |
| Phase 3 | 統計・分析機能、グラフ表示 | - |
| Phase 4 | PWA対応、オフライン機能、通知 | - |
| Phase 5 | 高度な演出、カスタマイズ機能 | - |
| Phase 6 | テスト、最適化、デプロイ | - |
