'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    const supabase = createClient();

    // 現在のユーザーを取得
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);

      // プロフィール情報を取得
      supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()
        .then(({ data, error }) => {
          if (data) {
            setProfile(data);
          }
          setLoading(false);
        });
    });
  }, [router]);

  const handleLogout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
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
            <h1 className="text-xl font-bold">学習継続支援アプリ</h1>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
            >
              ログアウト
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold mb-4">ようこそ！</h2>
          <div className="space-y-2">
            <p className="text-gray-600">
              <span className="font-semibold">表示名:</span> {profile?.display_name || 'ゲスト'}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">メール:</span> {user?.email}
            </p>
            <p className="text-gray-600">
              <span className="font-semibold">登録日:</span> {new Date(user?.created_at || '').toLocaleDateString('ja-JP')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">TODO管理</h3>
            <p className="text-gray-600 mb-4">学習や運動のTODOを管理しましょう</p>
            <button
              onClick={() => router.push('/todos')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
            >
              TODO一覧へ
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">進捗記録</h3>
            <p className="text-gray-600 mb-4">日々の進捗を記録しましょう</p>
            <button
              onClick={() => router.push('/progress')}
              className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
            >
              進捗を記録
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">表示モード</h3>
            <p className="text-gray-600 mb-4">学習中の画面表示を開始</p>
            <button
              onClick={() => router.push('/display')}
              className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700"
            >
              表示モード開始
            </button>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold mb-4">統計・分析</h3>
            <p className="text-gray-600 mb-4">あなたの継続状況を確認</p>
            <button className="w-full bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700">
              統計を見る（準備中）
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
