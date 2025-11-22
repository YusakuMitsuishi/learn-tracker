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
  deadline: string | null;
  created_at: string;
}

export default function TodosPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);
  const [expandedTodoId, setExpandedTodoId] = useState<string | null>(null);

  // フォーム用の状態
  const [todoForm, setTodoForm] = useState({
    title: '',
    description: '',
    category: '',
    priority: 'medium' as const,
    goal_type: 'count',
    goal_value: '',
    unit: '',
  });

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
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error loading todos:', error);
    } else {
      setTodos(data || []);
    }
    setLoading(false);
  };

  const openAddModal = () => {
    setTodoForm({
      title: '',
      description: '',
      category: '',
      priority: 'medium',
      goal_type: 'count',
      goal_value: '',
      unit: '',
    });
    setEditingTodo(null);
    setShowAddModal(true);
  };

  const openEditModal = (todo: Todo) => {
    setTodoForm({
      title: todo.title,
      description: todo.description || '',
      category: todo.category || '',
      priority: todo.priority,
      goal_type: todo.goal_type,
      goal_value: todo.goal_value.toString(),
      unit: todo.unit || '',
    });
    setEditingTodo(todo);
    setShowAddModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const supabase = createClient();
    const todoData = {
      title: todoForm.title,
      description: todoForm.description || null,
      category: todoForm.category || null,
      priority: todoForm.priority,
      goal_type: todoForm.goal_type,
      goal_value: todoForm.goal_value ? parseFloat(todoForm.goal_value) : 1,
      unit: todoForm.unit || null,
    };

    if (editingTodo) {
      // 編集
      const { data, error } = await supabase
        .from('todos')
        .update(todoData)
        .eq('id', editingTodo.id)
        .select()
        .single();

      if (error) {
        console.error('Error updating todo:', error);
        alert(`TODOの更新に失敗しました: ${error.message}`);
      } else {
        setTodos(todos.map(t => t.id === editingTodo.id ? data : t));
        setShowAddModal(false);
      }
    } else {
      // 新規追加
      const { data, error } = await supabase
        .from('todos')
        .insert({ ...todoData, user_id: user.id })
        .select()
        .single();

      if (error) {
        console.error('Error adding todo:', error);
        alert(`TODOの追加に失敗しました: ${error.message}`);
      } else {
        setTodos([data, ...todos]);
        setShowAddModal(false);
      }
    }
  };

  const handleStatusChange = async (todoId: string, newStatus: Todo['status']) => {
    if (!user) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('todos')
      .update({ status: newStatus })
      .eq('id', todoId);

    if (error) {
      console.error('Error updating status:', error);
    } else {
      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, status: newStatus } : todo
      ));
    }
  };

  const handleProgressUpdate = async (todoId: string, newValue: number) => {
    if (!user) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('todos')
      .update({ current_value: newValue })
      .eq('id', todoId);

    if (error) {
      console.error('Error updating progress:', error);
    } else {
      setTodos(todos.map(todo =>
        todo.id === todoId ? { ...todo, current_value: newValue } : todo
      ));
    }
  };

  const handleDelete = async (todoId: string) => {
    if (!confirm('このTODOを削除しますか？')) return;
    if (!user) return;

    const supabase = createClient();
    const { error } = await supabase
      .from('todos')
      .delete()
      .eq('id', todoId);

    if (error) {
      console.error('Error deleting todo:', error);
    } else {
      setTodos(todos.filter(todo => todo.id !== todoId));
    }
  };

  const getStatusColor = (status: Todo['status']) => {
    const colors = {
      not_started: 'bg-gray-500',
      in_progress: 'bg-blue-500',
      completed: 'bg-green-500',
    };
    return colors[status];
  };

  const getStatusLabel = (status: Todo['status']) => {
    const labels = {
      not_started: '未着手',
      in_progress: '進行中',
      completed: '完了',
    };
    return labels[status];
  };

  const getPriorityColor = (priority: Todo['priority']) => {
    const colors = {
      low: 'text-gray-600',
      medium: 'text-yellow-600',
      high: 'text-red-600',
    };
    return colors[priority];
  };

  const calculateProgress = (current: number, goal: number) => {
    return Math.min(Math.round((current / goal) * 100), 100);
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
            <h1 className="text-xl font-bold">TODO管理</h1>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              ← ダッシュボード
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={openAddModal}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
          >
            + 新しいTODOを追加
          </button>
        </div>

        <div className="space-y-4">
          {todos.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <div className="text-6xl mb-4">📝</div>
              <p className="text-gray-500 text-lg">TODOがありません</p>
              <p className="text-sm text-gray-400 mt-2">上のボタンから新しいTODOを追加しましょう</p>
            </div>
          ) : (
            todos.map((todo) => {
              const progress = calculateProgress(todo.current_value, todo.goal_value);
              const isExpanded = expandedTodoId === todo.id;

              return (
                <div key={todo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold">{todo.title}</h3>
                          <span className={`text-2xl ${getPriorityColor(todo.priority)}`}>
                            {todo.priority === 'high' && '🔴'}
                            {todo.priority === 'medium' && '🟡'}
                            {todo.priority === 'low' && '⚪'}
                          </span>
                        </div>

                        {todo.description && (
                          <p className="text-gray-600 text-sm mb-3">{todo.description}</p>
                        )}

                        <div className="flex gap-2 flex-wrap mb-4">
                          {todo.category && (
                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              📁 {todo.category}
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-xs font-medium text-white ${getStatusColor(todo.status)}`}>
                            {getStatusLabel(todo.status)}
                          </span>
                        </div>

                        {/* プログレスバー */}
                        <div className="mb-4">
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-sm font-medium text-gray-700">
                              進捗: {todo.current_value} / {todo.goal_value} {todo.unit}
                            </span>
                            <span className="text-sm font-bold text-blue-600">{progress}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div
                              className={`h-3 rounded-full transition-all ${
                                progress === 100 ? 'bg-green-500' : 'bg-blue-500'
                              }`}
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* アクションボタン */}
                    <div className="flex gap-2 flex-wrap">
                      <button
                        onClick={() => setExpandedTodoId(isExpanded ? null : todo.id)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm font-medium"
                      >
                        {isExpanded ? '閉じる' : '詳細・編集'}
                      </button>
                      <button
                        onClick={() => openEditModal(todo)}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm font-medium"
                      >
                        ✏️ 編集
                      </button>
                      <button
                        onClick={() => handleDelete(todo.id)}
                        className="px-4 py-2 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm font-medium"
                      >
                        🗑️ 削除
                      </button>
                    </div>

                    {/* 詳細ビュー（展開時） */}
                    {isExpanded && (
                      <div className="mt-6 pt-6 border-t border-gray-200">
                        <h4 className="font-semibold mb-4">ステータス変更</h4>
                        <div className="grid grid-cols-3 gap-3 mb-6">
                          <button
                            onClick={() => handleStatusChange(todo.id, 'not_started')}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${
                              todo.status === 'not_started'
                                ? 'bg-gray-500 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }`}
                          >
                            未着手
                          </button>
                          <button
                            onClick={() => handleStatusChange(todo.id, 'in_progress')}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${
                              todo.status === 'in_progress'
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                            }`}
                          >
                            進行中
                          </button>
                          <button
                            onClick={() => handleStatusChange(todo.id, 'completed')}
                            className={`py-3 px-4 rounded-lg font-medium transition-all ${
                              todo.status === 'completed'
                                ? 'bg-green-500 text-white shadow-lg'
                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                            }`}
                          >
                            完了
                          </button>
                        </div>

                        <h4 className="font-semibold mb-4">進捗を記録</h4>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            defaultValue={todo.current_value}
                            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="現在の値"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                const value = parseFloat((e.target as HTMLInputElement).value);
                                handleProgressUpdate(todo.id, value);
                              }
                            }}
                            id={`progress-${todo.id}`}
                          />
                          <button
                            onClick={() => {
                              const input = document.getElementById(`progress-${todo.id}`) as HTMLInputElement;
                              const value = parseFloat(input.value);
                              handleProgressUpdate(todo.id, value);
                            }}
                            className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-medium"
                          >
                            更新
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      {/* 追加・編集モーダル */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h2 className="text-2xl font-bold mb-6">
                {editingTodo ? 'TODOを編集' : '新しいTODO'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    タイトル *
                  </label>
                  <input
                    type="text"
                    value={todoForm.title}
                    onChange={(e) => setTodoForm({ ...todoForm, title: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="例: 英語の勉強"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    説明
                  </label>
                  <textarea
                    value={todoForm.description}
                    onChange={(e) => setTodoForm({ ...todoForm, description: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="詳細な説明（任意）"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      カテゴリ
                    </label>
                    <input
                      type="text"
                      value={todoForm.category}
                      onChange={(e) => setTodoForm({ ...todoForm, category: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: 学習"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      優先度
                    </label>
                    <select
                      value={todoForm.priority}
                      onChange={(e) => setTodoForm({ ...todoForm, priority: e.target.value as any })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">低</option>
                      <option value="medium">中</option>
                      <option value="high">高</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      目標値 *
                    </label>
                    <input
                      type="number"
                      value={todoForm.goal_value}
                      onChange={(e) => setTodoForm({ ...todoForm, goal_value: e.target.value })}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: 30"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      単位
                    </label>
                    <input
                      type="text"
                      value={todoForm.unit}
                      onChange={(e) => setTodoForm({ ...todoForm, unit: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="例: 分"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
                  >
                    キャンセル
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
                  >
                    {editingTodo ? '更新' : '追加'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
