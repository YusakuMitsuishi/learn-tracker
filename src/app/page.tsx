'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export default function Home() {
  const [supabaseConnected, setSupabaseConnected] = useState<boolean | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function testSupabaseConnection() {
      try {
        const supabase = createClient();

        // Supabase接続テスト（環境変数とクライアント初期化を確認）
        const { data, error } = await supabase.from('_test_').select('*').limit(1);

        // テーブルが存在しないエラーは正常（まだDBを作っていない）
        if (error && (
          error.message.includes('relation "_test_" does not exist') ||
          error.message.includes('Could not find the table')
        )) {
          // Supabaseへの接続自体は成功している
          setSupabaseConnected(true);
          setError(null);
        } else if (error) {
          // その他のエラー（認証エラーなど）
          setSupabaseConnected(false);
          setError(error.message);
        } else {
          setSupabaseConnected(true);
          setError(null);
        }
      } catch (err) {
        setSupabaseConnected(false);
        setError(err instanceof Error ? err.message : 'Unknown error');
      }
    }

    testSupabaseConnection();
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center max-w-2xl">
        <h1 className="text-4xl font-bold mb-4">
          学習継続支援アプリ
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          学習や運動の継続をサポートするアプリ
        </p>

        {/* Supabase接続状態 */}
        <div className="mt-8 p-6 border rounded-lg bg-gray-50">
          <h2 className="text-lg font-semibold mb-4">環境セットアップ状態</h2>

          <div className="space-y-3 text-left">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✅</span>
              <span>Next.js起動</span>
            </div>

            <div className="flex items-center gap-2">
              {supabaseConnected === null ? (
                <>
                  <span className="text-2xl">⏳</span>
                  <span>Supabase接続確認中...</span>
                </>
              ) : supabaseConnected ? (
                <>
                  <span className="text-2xl">✅</span>
                  <span>Supabase接続成功</span>
                </>
              ) : (
                <>
                  <span className="text-2xl">❌</span>
                  <span>Supabase接続失敗</span>
                </>
              )}
            </div>

            {error && (
              <div className="mt-2 p-3 bg-red-50 border border-red-200 rounded text-sm text-red-600">
                エラー: {error}
              </div>
            )}
          </div>
        </div>

        <p className="mt-8 text-sm text-gray-500">
          Next.js + Supabase + Vercel
        </p>

        {supabaseConnected && (
          <div className="mt-8 flex gap-4 justify-center">
            <a
              href="/auth/login"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              ログイン
            </a>
            <a
              href="/auth/signup"
              className="px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              新規登録
            </a>
          </div>
        )}
      </div>
    </main>
  );
}
