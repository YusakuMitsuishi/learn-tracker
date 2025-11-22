'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface Todo {
  id: string;
  title: string;
  description: string | null;
  status: 'not_started' | 'in_progress' | 'completed';
  priority: 'low' | 'medium' | 'high';
  category: string | null;
  goal_type: string;
  goal_value: number;
  unit: string | null;
  current_value: number;
  created_at: string;
}

export default function ProgressPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressValues, setProgressValues] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      loadTodos(user.id);
    });
  }, [router]);

  const loadTodos = async (userId: string) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .neq('status', 'completed') // 完了済みは除外
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading todos:', error);
    } else {
      setTodos(data || []);
      // 初期値を設定
      const initialValues: { [key: string]: string } = {};
      data?.forEach(todo => {
        initialValues[todo.id] = todo.current_value.toString();
      });
      setProgressValues(initialValues);
    }
    setLoading(false);
  };

  const handleProgressUpdate = async (todo: Todo) => {
    if (!user) return;

    const newValue = parseFloat(progressValues[todo.id] || '0');

    if (isNaN(newValue) || newValue < 0) {
      alert('正しい数値を入力してください');
      return;
    }

    const supabase = createClient();
    const { error } = await supabase
      .from('todos')
      .update({
        current_value: newValue,
        updated_at: new Date().toISOString() // updated_atを明示的に更新
      })
      .eq('id', todo.id);

    if (error) {
      console.error('Error updating progress:', error);
      alert('進捗の更新に失敗しました');
    } else {
      // 成功メッセージを表示
      setSuccessMessage(`「${todo.title}」の進捗を更新しました！`);
      setTimeout(() => setSuccessMessage(null), 3000);

      // TODOリストを更新
      setTodos(todos.map(t =>
        t.id === todo.id ? { ...t, current_value: newValue } : t
      ));

      // 目標達成チェック
      if (newValue >= todo.goal_value) {
        if (confirm(`🎉 目標達成おめでとうございます！\n「${todo.title}」を完了済みにしますか？`)) {
          await supabase
            .from('todos')
            .update({ status: 'completed' })
            .eq('id', todo.id);

          // 完了したTODOをリストから削除
          setTodos(todos.filter(t => t.id !== todo.id));
        }
      }
    }
  };

  const quickAdd = (todoId: string, amount: number) => {
    const currentValue = parseFloat(progressValues[todoId] || '0');
    const newValue = currentValue + amount;
    setProgressValues({
      ...progressValues,
      [todoId]: Math.max(0, newValue).toString()
    });
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
  };

  const getPriorityLabel = (priority: Todo['priority']) => {
    const labels = {
      high: { text: '高', emoji: '🔴', color: 'text-red-600' },
      medium: { text: '中', emoji: '🟡', color: 'text-yellow-600' },
      low: { text: '低', emoji: '⚪', color: 'text-gray-600' },
    };
    return labels[priority];
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-gray-600">読み込み中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <h1 className="text-xl font-bold">📊 進捗記録</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              ← ダッシュボード
            </button>
          </div>
        </div>
      </nav>

      {/* 成功メッセージ */}
      {successMessage && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg animate-pulse">
            ✅ {successMessage}
          </div>
        </div>
      )}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            💡 今日の進捗を記録しましょう！各TODOの進捗を入力して「記録」ボタンを押してください。
          </p>
        </div>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">🎉</div>
              <p className="text-gray-500 text-lg">進行中のTODOがありません</p>
              <p className="text-sm text-gray-400 mt-2">すべてのTODOが完了しているか、新しいTODOを追加してください</p>
              <button
                onClick={() => router.push('/todos')}
                className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                TODO管理へ
              </button>
            </div>
          ) : (
            todos.map((todo) => {
              const progress = calculateProgress(
                parseFloat(progressValues[todo.id] || '0'),
                todo.goal_value
              );
              const priorityInfo = getPriorityLabel(todo.priority);

              return (
                <div key={todo.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{todo.title}</h3>
                        <span className="text-xl">{priorityInfo.emoji}</span>
                      </div>
                      {todo.description && (
                        <p className="text-sm text-gray-600 mb-2">{todo.description}</p>
                      )}
                      {todo.category && (
                        <span className="inline-block px-2 py-1 bg-purple-100 text-purple-800 rounded text-xs font-medium">
                          📁 {todo.category}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* プログレスバー */}
                  <div className="mb-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium text-gray-700">
                        目標: {todo.goal_value} {todo.unit}
                      </span>
                      <span className="text-sm font-bold text-blue-600">{progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          progress >= 100 ? 'bg-green-500' : 'bg-blue-500'
                        }`}
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  {/* 進捗入力 */}
                  <div className="space-y-3">
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-600 mb-1">
                          現在の進捗
                        </label>
                        <input
                          type="number"
                          value={progressValues[todo.id] || '0'}
                          onChange={(e) => setProgressValues({
                            ...progressValues,
                            [todo.id]: e.target.value
                          })}
                          onKeyPress={(e) => {
                            if (e.key === 'Enter') {
                              handleProgressUpdate(todo);
                            }
                          }}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-semibold"
                          placeholder="0"
                          step="0.1"
                        />
                      </div>
                      <div className="flex flex-col justify-end">
                        <span className="text-sm text-gray-500 mb-1">{todo.unit}</span>
                        <button
                          onClick={() => handleProgressUpdate(todo)}
                          className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
                        >
                          記録
                        </button>
                      </div>
                    </div>

                    {/* クイック追加ボタン */}
                    <div className="flex gap-2">
                      <span className="text-xs text-gray-500 self-center">クイック追加:</span>
                      {[1, 5, 10].map(amount => (
                        <button
                          key={amount}
                          onClick={() => quickAdd(todo.id, amount)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                        >
                          +{amount}
                        </button>
                      ))}
                      {todo.goal_value > 20 && (
                        <button
                          onClick={() => quickAdd(todo.id, 30)}
                          className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                        >
                          +30
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h3 className="font-semibold mb-4">📈 今日の進捗サマリー</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <p className="text-sm text-blue-600 font-medium">進行中のTODO</p>
                <p className="text-3xl font-bold text-blue-700">{todos.length}</p>
              </div>
              <div className="bg-green-50 rounded-lg p-4">
                <p className="text-sm text-green-600 font-medium">平均進捗率</p>
                <p className="text-3xl font-bold text-green-700">
                  {Math.round(
                    todos.reduce((sum, todo) => {
                      const progress = calculateProgress(
                        parseFloat(progressValues[todo.id] || '0'),
                        todo.goal_value
                      );
                      return sum + progress;
                    }, 0) / todos.length
                  )}%
                </p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
