# プロジェクト構成設計書（Supabase + Vercel版）

## 1. 全体アーキテクチャ

本アプリケーションは、**Supabase（BaaS）+ Vercel（ホスティング）** による完全無料構成を採用します。

- **フロントエンド層**: Next.js (React) + PWA
- **バックエンド層**: Supabase（BaaS - Backend as a Service）
- **データ層**: PostgreSQL（Supabase提供） + IndexedDB（オフライン）

### アーキテクチャの特徴
- ✅ バックエンドサーバー不要（Supabaseが提供）
- ✅ 完全無料で運用可能（両サービスの無料プラン利用）
- ✅ リアルタイム同期が標準搭載
- ✅ 認証・ストレージ・データベースが統合
- ✅ Row Level Security (RLS) によるセキュリティ
- ✅ 自動生成されるREST API

## 2. ディレクトリ構成

### 2.1 Next.js プロジェクト構成

```
web_app/
├── package.json                    # プロジェクト依存関係
├── pnpm-lock.yaml                  # pnpmロックファイル
├── next.config.mjs                 # Next.js設定（PWA含む）
├── tsconfig.json                   # TypeScript設定
├── tailwind.config.ts              # Tailwind CSS設定
├── .eslintrc.json                  # ESLint設定
├── .prettierrc                     # Prettier設定
├── .gitignore
├── .env.local.example              # 環境変数のサンプル
├── README.md                       # プロジェクトREADME
│
├── requirements/                   # 要件定義・設計ドキュメント
│   ├── requirements.md
│   ├── project-structure-supabase.md
│   └── diagrams/
│
├── supabase/                       # Supabase設定
│   ├── config.toml                 # Supabase CLI設定
│   ├── migrations/                 # データベースマイグレーション
│   │   ├── 20250101000000_initial_schema.sql
│   │   ├── 20250102000000_add_achievements.sql
│   │   └── 20250103000000_add_rls_policies.sql
│   ├── seed.sql                    # 初期データ
│   └── functions/                  # Edge Functions（オプション）
│       └── check-achievements/
│           ├── index.ts
│           └── package.json
│
├── public/                         # 静的ファイル
│   ├── manifest.json
│   ├── sw.js                       # Service Worker（自動生成）
│   ├── icons/
│   │   ├── icon-192x192.png
│   │   ├── icon-512x512.png
│   │   └── favicon.ico
│   └── sounds/
│       ├── achievement.mp3
│       ├── celebration.mp3
│       └── notification.mp3
│
└── src/
    ├── app/                        # Next.js App Router
    │   ├── layout.tsx              # ルートレイアウト
    │   ├── page.tsx                # ホームページ
    │   ├── globals.css             # グローバルスタイル
    │   │
    │   ├── (auth)/                 # 認証グループ
    │   │   ├── login/
    │   │   │   └── page.tsx
    │   │   └── signup/
    │   │       └── page.tsx
    │   │
    │   ├── (app)/                  # メインアプリグループ
    │   │   ├── layout.tsx          # アプリレイアウト（認証必須）
    │   │   ├── display/            # ディスプレイモード
    │   │   │   └── page.tsx
    │   │   ├── input/              # 入力モード
    │   │   │   └── page.tsx
    │   │   ├── stats/              # 統計
    │   │   │   └── page.tsx
    │   │   └── settings/           # 設定
    │   │       └── page.tsx
    │   │
    │   └── api/                    # API Routes（必要に応じて）
    │       └── webhooks/
    │           └── route.ts
    │
    ├── components/                 # Reactコンポーネント
    │   ├── ui/                     # shadcn/ui コンポーネント
    │   │   ├── button.tsx
    │   │   ├── input.tsx
    │   │   ├── card.tsx
    │   │   ├── dialog.tsx
    │   │   └── ...
    │   │
    │   ├── display/                # ディスプレイモード関連
    │   │   ├── DisplayContainer.tsx
    │   │   ├── TodoListView.tsx
    │   │   ├── ProgressView.tsx
    │   │   ├── CalendarView.tsx
    │   │   ├── StatsView.tsx
    │   │   └── MotivationView.tsx
    │   │
    │   ├── todo/                   # TODO管理関連
    │   │   ├── TodoForm.tsx
    │   │   ├── TodoList.tsx
    │   │   ├── TodoItem.tsx
    │   │   └── ProgressInput.tsx
    │   │
    │   ├── stats/                  # 統計・分析関連
    │   │   ├── DashboardView.tsx
    │   │   ├── ChartWrapper.tsx
    │   │   ├── StreakDisplay.tsx
    │   │   └── ReportGenerator.tsx
    │   │
    │   ├── celebration/            # 演出関連
    │   │   ├── Confetti.tsx
    │   │   ├── Fireworks.tsx
    │   │   ├── BadgeDisplay.tsx
    │   │   └── AchievementNotification.tsx
    │   │
    │   └── settings/               # 設定関連
    │       ├── SettingsPanel.tsx
    │       ├── ThemeSelector.tsx
    │       ├── NotificationSettings.tsx
    │       └── DataExport.tsx
    │
    ├── lib/                        # ライブラリ・ユーティリティ
    │   ├── supabase/              # Supabase関連
    │   │   ├── client.ts          # Supabaseクライアント
    │   │   ├── server.ts          # サーバーサイドクライアント
    │   │   ├── middleware.ts      # 認証ミドルウェア
    │   │   └── types.ts           # Supabase型定義
    │   │
    │   ├── db/                    # データベース操作
    │   │   ├── todos.ts
    │   │   ├── progress.ts
    │   │   ├── stats.ts
    │   │   ├── achievements.ts
    │   │   └── users.ts
    │   │
    │   ├── hooks/                 # カスタムフック
    │   │   ├── useTodo.ts
    │   │   ├── useAuth.ts
    │   │   ├── useProgress.ts
    │   │   ├── useStats.ts
    │   │   ├── useRealtime.ts
    │   │   └── useOffline.ts
    │   │
    │   ├── store/                 # 状態管理（Zustand）
    │   │   ├── authStore.ts
    │   │   ├── todoStore.ts
    │   │   ├── progressStore.ts
    │   │   ├── statsStore.ts
    │   │   ├── settingsStore.ts
    │   │   └── uiStore.ts
    │   │
    │   ├── utils/                 # ユーティリティ関数
    │   │   ├── dateHelpers.ts
    │   │   ├── chartHelpers.ts
    │   │   ├── validators.ts
    │   │   ├── formatters.ts
    │   │   └── constants.ts
    │   │
    │   └── indexeddb/             # オフライン対応
    │       ├── db.ts              # Dexie設定
    │       └── sync.ts            # 同期処理
    │
    ├── types/                     # TypeScript型定義
    │   ├── database.types.ts      # Supabase自動生成型
    │   ├── todo.types.ts
    │   ├── user.types.ts
    │   ├── stats.types.ts
    │   └── settings.types.ts
    │
    └── styles/                    # スタイル（必要に応じて）
        └── animations.css
```

## 3. データベース設計（PostgreSQL）

### 3.1 テーブル構成

#### users テーブル（Supabase Auth連携）
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT,
  avatar_url TEXT,
  timezone TEXT DEFAULT 'Asia/Tokyo',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

#### settings テーブル
```sql
CREATE TABLE settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  theme TEXT DEFAULT 'light',
  display_interval INTEGER DEFAULT 10,
  notifications_enabled BOOLEAN DEFAULT true,
  sound_enabled BOOLEAN DEFAULT true,
  celebration_level TEXT DEFAULT 'normal',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

#### todos テーブル
```sql
CREATE TABLE todos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT,
  goal_type TEXT NOT NULL, -- 'time', 'distance', 'count', 'weight'
  goal_value NUMERIC NOT NULL,
  current_value NUMERIC DEFAULT 0,
  unit TEXT,
  priority TEXT DEFAULT 'medium', -- 'high', 'medium', 'low'
  deadline TIMESTAMPTZ,
  status TEXT DEFAULT 'active', -- 'active', 'completed', 'archived'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_todos_user_id ON todos(user_id);
CREATE INDEX idx_todos_status ON todos(user_id, status);
CREATE INDEX idx_todos_deadline ON todos(user_id, deadline);
```

#### progress テーブル
```sql
CREATE TABLE progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  todo_id UUID REFERENCES todos(id) ON DELETE CASCADE,
  value NUMERIC NOT NULL,
  note TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_progress_user_id ON progress(user_id);
CREATE INDEX idx_progress_todo_id ON progress(todo_id);
CREATE INDEX idx_progress_timestamp ON progress(user_id, timestamp DESC);
```

#### achievements テーブル
```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL, -- 'streak', 'milestone', 'total', 'hidden'
  title TEXT NOT NULL,
  description TEXT,
  icon TEXT,
  condition JSONB,
  unlocked BOOLEAN DEFAULT false,
  unlocked_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_achievements_user_id ON achievements(user_id);
CREATE INDEX idx_achievements_unlocked ON achievements(user_id, unlocked);
```

#### stats テーブル（日次集計）
```sql
CREATE TABLE stats (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  total_todos INTEGER DEFAULT 0,
  completed_todos INTEGER DEFAULT 0,
  total_time NUMERIC DEFAULT 0,
  category_breakdown JSONB,
  streak INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

CREATE INDEX idx_stats_user_date ON stats(user_id, date DESC);
```

### 3.2 Row Level Security (RLS) ポリシー

全テーブルにRLSを適用し、ユーザーは自分のデータのみアクセス可能にします。

```sql
-- profiles テーブル
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- todos テーブル
ALTER TABLE todos ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own todos"
  ON todos FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own todos"
  ON todos FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own todos"
  ON todos FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own todos"
  ON todos FOR DELETE
  USING (auth.uid() = user_id);

-- 同様に progress, achievements, stats, settings にも適用
```

### 3.3 リアルタイム同期設定

```sql
-- リアルタイム同期を有効化
ALTER PUBLICATION supabase_realtime ADD TABLE todos;
ALTER PUBLICATION supabase_realtime ADD TABLE progress;
ALTER PUBLICATION supabase_realtime ADD TABLE achievements;
ALTER PUBLICATION supabase_realtime ADD TABLE stats;
```

## 4. 状態管理設計（Zustand）

### 4.1 Store構成

```typescript
// authStore.ts
interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

// todoStore.ts
interface TodoState {
  todos: Todo[];
  selectedTodo: Todo | null;
  loading: boolean;
  fetchTodos: () => Promise<void>;
  createTodo: (todo: CreateTodoInput) => Promise<void>;
  updateTodo: (id: string, updates: Partial<Todo>) => Promise<void>;
  deleteTodo: (id: string) => Promise<void>;
}

// progressStore.ts
interface ProgressState {
  progress: Progress[];
  todayProgress: Progress[];
  loading: boolean;
  recordProgress: (data: CreateProgressInput) => Promise<void>;
  fetchProgress: (todoId?: string) => Promise<void>;
}

// statsStore.ts
interface StatsState {
  daily: DailyStats | null;
  weekly: WeeklyStats | null;
  monthly: MonthlyStats | null;
  streak: number;
  loading: boolean;
  fetchStats: (period: 'daily' | 'weekly' | 'monthly') => Promise<void>;
}

// settingsStore.ts
interface SettingsState {
  settings: Settings;
  updateSettings: (updates: Partial<Settings>) => Promise<void>;
}

// uiStore.ts
interface UIState {
  displayMode: {
    currentScreen: number;
    isAutoPlay: boolean;
    interval: number;
  };
  modals: {
    celebration: boolean;
    achievement: boolean;
  };
  isOnline: boolean;
  setDisplayMode: (mode: Partial<UIState['displayMode']>) => void;
  toggleModal: (modal: keyof UIState['modals']) => void;
}
```

## 5. Supabaseクライアント設定

### 5.1 クライアントサイド

```typescript
// src/lib/supabase/client.ts
import { createBrowserClient } from '@supabase/ssr';
import { Database } from '@/types/database.types';

export const createClient = () => {
  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
};
```

### 5.2 サーバーサイド

```typescript
// src/lib/supabase/server.ts
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { Database } from '@/types/database.types';

export const createClient = () => {
  const cookieStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
      },
    }
  );
};
```

### 5.3 リアルタイム同期

```typescript
// src/lib/hooks/useRealtime.ts
import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useTodoStore } from '@/lib/store/todoStore';

export const useRealtimeTodos = (userId: string) => {
  const fetchTodos = useTodoStore((state) => state.fetchTodos);

  useEffect(() => {
    const supabase = createClient();

    const channel = supabase
      .channel('todos-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('Todo changed:', payload);
          fetchTodos(); // 再取得
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, fetchTodos]);
};
```

## 6. オフライン対応

### 6.1 IndexedDB設定（Dexie.js使用）

```typescript
// src/lib/indexeddb/db.ts
import Dexie, { Table } from 'dexie';

export interface OfflineTodo {
  id: string;
  user_id: string;
  title: string;
  // ... 他のフィールド
  synced: boolean;
}

export class AppDatabase extends Dexie {
  todos!: Table<OfflineTodo>;
  progress!: Table<OfflineProgress>;
  pendingSync!: Table<PendingSync>;

  constructor() {
    super('HabitTrackerDB');
    this.version(1).stores({
      todos: 'id, user_id, synced',
      progress: 'id, todo_id, timestamp',
      pendingSync: '++id, type, timestamp',
    });
  }
}

export const db = new AppDatabase();
```

### 6.2 同期処理

```typescript
// src/lib/indexeddb/sync.ts
export const syncPendingChanges = async () => {
  const supabase = createClient();
  const pendingChanges = await db.pendingSync.toArray();

  for (const change of pendingChanges) {
    try {
      if (change.type === 'insert_todo') {
        await supabase.from('todos').insert(change.data);
      } else if (change.type === 'update_todo') {
        await supabase.from('todos').update(change.data).eq('id', change.data.id);
      }

      // 成功したら削除
      await db.pendingSync.delete(change.id);
    } catch (error) {
      console.error('Sync failed:', error);
    }
  }
};
```

## 7. PWA設定

### 7.1 next.config.mjs

```javascript
import withPWA from 'next-pwa';

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js設定
};

export default withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})(nextConfig);
```

### 7.2 manifest.json

```json
{
  "name": "学習継続支援アプリ",
  "short_name": "継続アプリ",
  "description": "学習や運動の継続をサポートするアプリ",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#4A90E2",
  "icons": [
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## 8. 環境変数

### 8.1 .env.local.example

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# アプリ設定
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 9. デプロイ設定

### 9.1 Vercel設定

1. GitHubリポジトリと連携
2. 環境変数を設定
3. 自動デプロイ有効化

### 9.2 Supabase設定

1. プロジェクト作成
2. マイグレーション実行: `supabase db push`
3. 認証設定（メール認証、OAuth等）

## 10. パッケージ依存関係

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "@supabase/supabase-js": "^2.39.0",
    "@supabase/ssr": "^0.0.10",
    "zustand": "^4.4.7",
    "dexie": "^3.2.4",
    "framer-motion": "^10.16.16",
    "recharts": "^2.10.3",
    "tailwindcss": "^3.4.0",
    "next-pwa": "^5.6.0",
    "react-confetti": "^6.1.0"
  },
  "devDependencies": {
    "@types/node": "^20.10.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.3.0",
    "eslint": "^8.56.0",
    "prettier": "^3.1.0",
    "supabase": "^1.142.0"
  }
}
```

## 11. 開発ワークフロー

### 11.1 ローカル開発

```bash
# Supabaseローカル起動
supabase start

# Next.js開発サーバー起動
pnpm dev
```

### 11.2 マイグレーション

```bash
# 新しいマイグレーション作成
supabase migration new add_new_table

# マイグレーション適用
supabase db push

# 型定義生成
supabase gen types typescript --local > src/types/database.types.ts
```

## 12. コスト試算（無料プラン）

### Supabase無料プラン
- ✅ データベース: 500MB
- ✅ ストレージ: 1GB
- ✅ 帯域幅: 2GB/月
- ✅ 認証ユーザー: 50,000 MAU

### Vercel無料プラン
- ✅ 帯域幅: 100GB/月
- ✅ ビルド実行時間: 6,000分/月
- ✅ サーバーレス関数実行: 100GB-時間/月

**結論**: 個人利用・小規模運用であれば完全無料で運用可能
