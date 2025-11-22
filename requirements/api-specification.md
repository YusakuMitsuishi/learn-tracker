# API仕様書

## 1. 概要

### 1.1 ベースURL

- **開発環境**: `http://localhost:3000/api`
- **ステージング**: `https://staging-api.example.com/api`
- **本番環境**: `https://api.example.com/api`

### 1.2 認証

すべてのAPIエンドポイント（`/auth`を除く）は、JWTトークンによる認証が必要です。

**リクエストヘッダー:**
```
Authorization: Bearer {JWT_TOKEN}
```

### 1.3 共通レスポンス形式

#### 成功時
```json
{
  "success": true,
  "data": { ... },
  "message": "Success message"
}
```

#### エラー時
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Error description",
    "details": { ... }
  }
}
```

### 1.4 HTTPステータスコード

| コード | 説明 |
|-------|------|
| 200 | OK - リクエスト成功 |
| 201 | Created - リソース作成成功 |
| 204 | No Content - リクエスト成功（レスポンスボディなし） |
| 400 | Bad Request - リクエストが不正 |
| 401 | Unauthorized - 認証エラー |
| 403 | Forbidden - アクセス権限なし |
| 404 | Not Found - リソースが見つからない |
| 409 | Conflict - リソースの競合 |
| 429 | Too Many Requests - レート制限超過 |
| 500 | Internal Server Error - サーバーエラー |

---

## 2. 認証 API (`/api/auth`)

### 2.1 ユーザー登録

**エンドポイント:** `POST /auth/register`

**説明:** 新規ユーザーを登録します。

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!",
  "username": "username",
  "displayName": "User Name"
}
```

**レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "username",
      "displayName": "User Name"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "User registered successfully"
}
```

---

### 2.2 ログイン

**エンドポイント:** `POST /auth/login`

**説明:** ユーザーログインを行います。

**リクエストボディ:**
```json
{
  "email": "user@example.com",
  "password": "SecurePassword123!"
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "username",
      "displayName": "User Name"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  },
  "message": "Login successful"
}
```

---

### 2.3 トークン更新

**エンドポイント:** `POST /auth/refresh`

**説明:** リフレッシュトークンを使用してアクセストークンを更新します。

**リクエストボディ:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### 2.4 ログアウト

**エンドポイント:** `POST /auth/logout`

**説明:** ユーザーログアウトを行います。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

---

### 2.5 現在のユーザー情報取得

**エンドポイント:** `GET /auth/me`

**説明:** 認証済みユーザーの情報を取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "email": "user@example.com",
      "username": "username",
      "profile": {
        "displayName": "User Name",
        "avatar": "https://example.com/avatar.jpg",
        "timezone": "Asia/Tokyo"
      },
      "settings": {
        "theme": "light",
        "displayInterval": 10,
        "notificationsEnabled": true,
        "soundEnabled": true,
        "celebrationLevel": "normal"
      }
    }
  }
}
```

---

## 3. TODO API (`/api/todos`)

### 3.1 TODO一覧取得

**エンドポイント:** `GET /todos`

**説明:** ユーザーのTODO一覧を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| status | string | No | フィルター: `active`, `completed`, `archived` |
| category | string | No | カテゴリでフィルター |
| priority | string | No | 優先度でフィルター: `high`, `medium`, `low` |
| page | number | No | ページ番号（デフォルト: 1） |
| limit | number | No | 1ページあたりの件数（デフォルト: 20） |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "英単語学習",
        "description": "TOEIC対策の単語を覚える",
        "category": "学習",
        "goalType": "count",
        "goalValue": 100,
        "currentValue": 45,
        "unit": "単語",
        "priority": "high",
        "deadline": "2025-12-31T23:59:59.000Z",
        "status": "active",
        "createdAt": "2025-01-01T00:00:00.000Z",
        "updatedAt": "2025-01-15T12:30:00.000Z"
      }
    ],
    "pagination": {
      "total": 15,
      "page": 1,
      "pages": 1,
      "limit": 20
    }
  }
}
```

---

### 3.2 TODO詳細取得

**エンドポイント:** `GET /todos/:id`

**説明:** 特定のTODOの詳細情報を取得します。

**パスパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| id | string | TODO ID |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "英単語学習",
      "description": "TOEIC対策の単語を覚える",
      "category": "学習",
      "goalType": "count",
      "goalValue": 100,
      "currentValue": 45,
      "unit": "単語",
      "priority": "high",
      "deadline": "2025-12-31T23:59:59.000Z",
      "status": "active",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-15T12:30:00.000Z"
    }
  }
}
```

---

### 3.3 TODO作成

**エンドポイント:** `POST /todos`

**説明:** 新しいTODOを作成します。

**リクエストボディ:**
```json
{
  "title": "英単語学習",
  "description": "TOEIC対策の単語を覚える",
  "category": "学習",
  "goalType": "count",
  "goalValue": 100,
  "unit": "単語",
  "priority": "high",
  "deadline": "2025-12-31T23:59:59.000Z"
}
```

**バリデーション:**
- `title`: 必須、1〜100文字
- `goalType`: 必須、`time`, `distance`, `count`, `weight` のいずれか
- `goalValue`: 必須、正の数値
- `priority`: `high`, `medium`, `low` のいずれか（デフォルト: `medium`）

**レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "英単語学習",
      "description": "TOEIC対策の単語を覚える",
      "category": "学習",
      "goalType": "count",
      "goalValue": 100,
      "currentValue": 0,
      "unit": "単語",
      "priority": "high",
      "deadline": "2025-12-31T23:59:59.000Z",
      "status": "active",
      "createdAt": "2025-01-15T12:00:00.000Z",
      "updatedAt": "2025-01-15T12:00:00.000Z"
    }
  },
  "message": "Todo created successfully"
}
```

---

### 3.4 TODO更新

**エンドポイント:** `PUT /todos/:id`

**説明:** 既存のTODOを更新します。

**リクエストボディ:**
```json
{
  "title": "英単語学習（更新）",
  "description": "TOEIC対策の単語を覚える - 目標を上方修正",
  "goalValue": 150,
  "priority": "high"
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "todo": {
      "_id": "507f1f77bcf86cd799439011",
      "title": "英単語学習（更新）",
      "description": "TOEIC対策の単語を覚える - 目標を上方修正",
      "goalValue": 150,
      "priority": "high",
      "updatedAt": "2025-01-15T13:00:00.000Z"
    }
  },
  "message": "Todo updated successfully"
}
```

---

### 3.5 TODO削除

**エンドポイント:** `DELETE /todos/:id`

**説明:** TODOを削除（アーカイブ）します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "message": "Todo deleted successfully"
}
```

---

### 3.6 本日のTODO取得

**エンドポイント:** `GET /todos/today`

**説明:** 本日のアクティブなTODOを取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "todos": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "title": "英単語学習",
        "currentValue": 45,
        "goalValue": 100,
        "unit": "単語",
        "progress": 45
      }
    ],
    "date": "2025-01-15"
  }
}
```

---

## 4. 進捗 API (`/api/progress`)

### 4.1 進捗記録

**エンドポイント:** `POST /progress`

**説明:** 進捗を記録します。

**リクエストボディ:**
```json
{
  "todoId": "507f1f77bcf86cd799439011",
  "value": 10,
  "note": "今日は集中できた",
  "timestamp": "2025-01-15T14:30:00.000Z"
}
```

**レスポンス (201 Created):**
```json
{
  "success": true,
  "data": {
    "progress": {
      "_id": "507f1f77bcf86cd799439012",
      "todoId": "507f1f77bcf86cd799439011",
      "value": 10,
      "note": "今日は集中できた",
      "timestamp": "2025-01-15T14:30:00.000Z",
      "createdAt": "2025-01-15T14:30:00.000Z"
    },
    "todo": {
      "_id": "507f1f77bcf86cd799439011",
      "currentValue": 55,
      "goalValue": 100
    },
    "achievements": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "milestone",
        "title": "50単語達成！",
        "description": "英単語50個を習得しました",
        "icon": "🎉"
      }
    ]
  },
  "message": "Progress recorded successfully"
}
```

---

### 4.2 TODO別進捗履歴取得

**エンドポイント:** `GET /progress/todo/:todoId`

**説明:** 特定のTODOの進捗履歴を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| limit | number | No | 取得件数（デフォルト: 50） |
| offset | number | No | オフセット（デフォルト: 0） |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "progress": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "value": 10,
        "note": "今日は集中できた",
        "timestamp": "2025-01-15T14:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439013",
        "value": 15,
        "note": "新しい単語帳を使い始めた",
        "timestamp": "2025-01-14T10:00:00.000Z"
      }
    ],
    "total": 25
  }
}
```

---

### 4.3 日付別進捗取得

**エンドポイント:** `GET /progress/date/:date`

**説明:** 指定日の進捗を取得します。

**パスパラメータ:**
| パラメータ | 型 | 説明 |
|-----------|-----|------|
| date | string | 日付 (YYYY-MM-DD) |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "progress": [
      {
        "_id": "507f1f77bcf86cd799439012",
        "todoId": "507f1f77bcf86cd799439011",
        "todoTitle": "英単語学習",
        "value": 10,
        "note": "今日は集中できた",
        "timestamp": "2025-01-15T14:30:00.000Z"
      }
    ],
    "totalTodos": 3,
    "completedTodos": 1
  }
}
```

---

### 4.4 期間別進捗取得

**エンドポイント:** `GET /progress/range`

**説明:** 指定期間の進捗を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| startDate | string | Yes | 開始日 (YYYY-MM-DD) |
| endDate | string | Yes | 終了日 (YYYY-MM-DD) |
| todoId | string | No | 特定のTODOでフィルター |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "startDate": "2025-01-01",
    "endDate": "2025-01-15",
    "progress": [
      {
        "date": "2025-01-15",
        "totalValue": 25,
        "count": 3
      },
      {
        "date": "2025-01-14",
        "totalValue": 30,
        "count": 4
      }
    ],
    "summary": {
      "totalDays": 15,
      "activeDays": 12,
      "totalValue": 450,
      "averagePerDay": 37.5
    }
  }
}
```

---

## 5. 統計 API (`/api/stats`)

### 5.1 日次統計取得

**エンドポイント:** `GET /stats/daily/:date`

**説明:** 指定日の統計データを取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "date": "2025-01-15",
    "totalTodos": 5,
    "completedTodos": 3,
    "totalTime": 180,
    "categoryBreakdown": [
      {
        "category": "学習",
        "time": 120,
        "count": 2
      },
      {
        "category": "運動",
        "time": 60,
        "count": 1
      }
    ],
    "streak": 12
  }
}
```

---

### 5.2 週次統計取得

**エンドポイント:** `GET /stats/weekly`

**説明:** 現在の週の統計データを取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| date | string | No | 基準日 (YYYY-MM-DD、デフォルト: 今日) |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "weekStart": "2025-01-13",
    "weekEnd": "2025-01-19",
    "totalTodos": 35,
    "completedTodos": 28,
    "completionRate": 80,
    "totalTime": 840,
    "averageTimePerDay": 120,
    "dailyBreakdown": [
      {
        "date": "2025-01-13",
        "completedTodos": 4,
        "totalTime": 120
      },
      {
        "date": "2025-01-14",
        "completedTodos": 5,
        "totalTime": 150
      }
    ],
    "topCategories": [
      {
        "category": "学習",
        "time": 500,
        "percentage": 59.5
      },
      {
        "category": "運動",
        "time": 340,
        "percentage": 40.5
      }
    ]
  }
}
```

---

### 5.3 月次統計取得

**エンドポイント:** `GET /stats/monthly`

**説明:** 指定月の統計データを取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| year | number | No | 年（デフォルト: 今年） |
| month | number | No | 月（デフォルト: 今月） |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "year": 2025,
    "month": 1,
    "totalTodos": 150,
    "completedTodos": 135,
    "completionRate": 90,
    "totalTime": 3600,
    "activeDays": 28,
    "dailyAverage": 128.6,
    "weeklyBreakdown": [
      {
        "week": 1,
        "completedTodos": 35,
        "totalTime": 900
      }
    ],
    "categoryBreakdown": [
      {
        "category": "学習",
        "time": 2400,
        "percentage": 66.7
      },
      {
        "category": "運動",
        "time": 1200,
        "percentage": 33.3
      }
    ]
  }
}
```

---

### 5.4 継続日数取得

**エンドポイント:** `GET /stats/streak`

**説明:** 現在の継続日数と最長記録を取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "currentStreak": 12,
    "longestStreak": 45,
    "streakStartDate": "2025-01-04",
    "lastActivityDate": "2025-01-15",
    "calendar": [
      {
        "date": "2025-01-15",
        "active": true,
        "count": 3
      },
      {
        "date": "2025-01-14",
        "active": true,
        "count": 4
      }
    ]
  }
}
```

---

### 5.5 トレンド分析取得

**エンドポイント:** `GET /stats/trends`

**説明:** 進捗のトレンド分析を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| period | string | No | `week`, `month`, `quarter`, `year` (デフォルト: `month`) |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "period": "month",
    "trends": {
      "completionRate": {
        "current": 90,
        "previous": 85,
        "change": 5.9,
        "trend": "up"
      },
      "totalTime": {
        "current": 3600,
        "previous": 3200,
        "change": 12.5,
        "trend": "up"
      },
      "averagePerDay": {
        "current": 128.6,
        "previous": 114.3,
        "change": 12.5,
        "trend": "up"
      }
    },
    "forecast": {
      "nextWeekEstimate": 950,
      "monthEndEstimate": 4200
    }
  }
}
```

---

## 6. 実績 API (`/api/achievements`)

### 6.1 実績一覧取得

**エンドポイント:** `GET /achievements`

**説明:** ユーザーの全実績を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| unlocked | boolean | No | 解除済みのみ/未解除のみフィルター |
| type | string | No | 実績タイプでフィルター |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "streak",
        "title": "7日連続達成！",
        "description": "7日間連続でTODOを達成しました",
        "icon": "🔥",
        "unlocked": true,
        "unlockedAt": "2025-01-15T00:00:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439014",
        "type": "milestone",
        "title": "累計100時間",
        "description": "合計100時間の学習を達成しました",
        "icon": "🏆",
        "unlocked": false
      }
    ],
    "summary": {
      "total": 50,
      "unlocked": 12,
      "progress": 24
    }
  }
}
```

---

### 6.2 解除済み実績取得

**エンドポイント:** `GET /achievements/unlocked`

**説明:** 解除済みの実績のみを取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "achievements": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "type": "streak",
        "title": "7日連続達成！",
        "description": "7日間連続でTODOを達成しました",
        "icon": "🔥",
        "unlockedAt": "2025-01-15T00:00:00.000Z"
      }
    ],
    "total": 12
  }
}
```

---

### 6.3 実績達成チェック

**エンドポイント:** `POST /achievements/check`

**説明:** 実績の達成条件をチェックし、解除可能な実績を解除します。

**リクエストボディ:**
```json
{
  "action": "progress_recorded",
  "data": {
    "todoId": "507f1f77bcf86cd799439011",
    "value": 10
  }
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "newAchievements": [
      {
        "_id": "507f1f77bcf86cd799439015",
        "type": "milestone",
        "title": "50単語達成！",
        "description": "英単語50個を習得しました",
        "icon": "🎉",
        "unlockedAt": "2025-01-15T14:30:00.000Z"
      }
    ]
  },
  "message": "Achievements checked"
}
```

---

## 7. 設定 API (`/api/settings`)

### 7.1 設定取得

**エンドポイント:** `GET /settings`

**説明:** ユーザー設定を取得します。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "theme": "light",
      "displayInterval": 10,
      "notificationsEnabled": true,
      "soundEnabled": true,
      "celebrationLevel": "normal",
      "timezone": "Asia/Tokyo",
      "language": "ja"
    }
  }
}
```

---

### 7.2 設定更新

**エンドポイント:** `PUT /settings`

**説明:** ユーザー設定を更新します。

**リクエストボディ:**
```json
{
  "theme": "dark",
  "displayInterval": 15,
  "celebrationLevel": "high"
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "settings": {
      "theme": "dark",
      "displayInterval": 15,
      "celebrationLevel": "high"
    }
  },
  "message": "Settings updated successfully"
}
```

---

### 7.3 データエクスポート

**エンドポイント:** `POST /settings/export`

**説明:** ユーザーデータをエクスポートします。

**リクエストボディ:**
```json
{
  "format": "json",
  "includeProgress": true,
  "includeAchievements": true,
  "startDate": "2025-01-01",
  "endDate": "2025-12-31"
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "downloadUrl": "https://example.com/exports/user_data_20250115.json",
    "expiresAt": "2025-01-16T00:00:00.000Z",
    "fileSize": 1024000
  },
  "message": "Export completed successfully"
}
```

---

### 7.4 データインポート

**エンドポイント:** `POST /settings/import`

**説明:** バックアップデータをインポートします。

**リクエスト:** `multipart/form-data`
```
file: <JSON or CSV file>
mergeStrategy: "replace" | "merge"
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "imported": {
      "todos": 25,
      "progress": 150,
      "achievements": 10
    }
  },
  "message": "Import completed successfully"
}
```

---

## 8. 通知 API (`/api/notifications`)

### 8.1 通知一覧取得

**エンドポイント:** `GET /notifications`

**説明:** ユーザーの通知一覧を取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| read | boolean | No | 既読/未読でフィルター |
| limit | number | No | 取得件数（デフォルト: 20） |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "_id": "507f1f77bcf86cd799439016",
        "type": "achievement",
        "title": "実績解除！",
        "message": "7日連続達成の実績を解除しました",
        "read": false,
        "createdAt": "2025-01-15T14:30:00.000Z"
      },
      {
        "_id": "507f1f77bcf86cd799439017",
        "type": "reminder",
        "title": "リマインダー",
        "message": "今日のTODOを確認しましょう",
        "read": true,
        "readAt": "2025-01-15T09:00:00.000Z",
        "createdAt": "2025-01-15T08:00:00.000Z"
      }
    ],
    "unreadCount": 3
  }
}
```

---

### 8.2 プッシュ通知登録

**エンドポイント:** `POST /notifications/register`

**説明:** プッシュ通知用のデバイストークンを登録します。

**リクエストボディ:**
```json
{
  "token": "firebase_device_token",
  "platform": "web"
}
```

**レスポンス (200 OK):**
```json
{
  "success": true,
  "message": "Device registered for push notifications"
}
```

---

### 8.3 通知を既読にする

**エンドポイント:** `PUT /notifications/:id/read`

**説明:** 特定の通知を既読にします。

**レスポンス (200 OK):**
```json
{
  "success": true,
  "message": "Notification marked as read"
}
```

---

## 9. エラーコード一覧

| エラーコード | 説明 |
|------------|------|
| `AUTH_INVALID_CREDENTIALS` | メールアドレスまたはパスワードが正しくありません |
| `AUTH_TOKEN_EXPIRED` | トークンの有効期限が切れています |
| `AUTH_TOKEN_INVALID` | トークンが無効です |
| `AUTH_UNAUTHORIZED` | 認証が必要です |
| `VALIDATION_ERROR` | リクエストのバリデーションエラー |
| `RESOURCE_NOT_FOUND` | リソースが見つかりません |
| `RESOURCE_CONFLICT` | リソースが既に存在します |
| `RATE_LIMIT_EXCEEDED` | レート制限を超えました |
| `INTERNAL_SERVER_ERROR` | サーバー内部エラー |
| `DATABASE_ERROR` | データベースエラー |

---

## 10. レート制限

| エンドポイント | 制限 |
|--------------|------|
| `/auth/login` | 5リクエスト / 15分 |
| `/auth/register` | 3リクエスト / 1時間 |
| その他のAPI | 100リクエスト / 1分 |

レート制限超過時は、`429 Too Many Requests` が返されます。

**レスポンスヘッダー:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

---

## 11. データ同期API（オフライン対応）

### 11.1 同期データ取得

**エンドポイント:** `GET /sync`

**説明:** 最終同期以降の更新データを取得します。

**クエリパラメータ:**
| パラメータ | 型 | 必須 | 説明 |
|-----------|-----|------|------|
| lastSync | string | Yes | 最終同期日時（ISO 8601形式） |

**レスポンス (200 OK):**
```json
{
  "success": true,
  "data": {
    "todos": {
      "created": [...],
      "updated": [...],
      "deleted": [...]
    },
    "progress": {
      "created": [...],
      "updated": [...],
      "deleted": [...]
    },
    "achievements": {
      "unlocked": [...]
    },
    "syncTimestamp": "2025-01-15T15:00:00.000Z"
  }
}
```

---

## 12. Webhook（将来実装予定）

### 12.1 実績解除通知

**イベント:** `achievement.unlocked`

**ペイロード:**
```json
{
  "event": "achievement.unlocked",
  "userId": "507f1f77bcf86cd799439011",
  "achievement": {
    "_id": "507f1f77bcf86cd799439013",
    "type": "streak",
    "title": "7日連続達成！"
  },
  "timestamp": "2025-01-15T14:30:00.000Z"
}
```
