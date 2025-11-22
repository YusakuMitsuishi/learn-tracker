'use client';

import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      {/* ヘッダー */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
              📚 Learn Tracker
            </h1>
            <div className="flex gap-2 sm:gap-4">
              <Link
                href="/auth/login"
                className="px-3 sm:px-6 py-2 text-sm sm:text-base text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                ログイン
              </Link>
              <Link
                href="/auth/signup"
                className="px-3 sm:px-6 py-2 text-sm sm:text-base bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors shadow-md"
              >
                無料で始める
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* メインコンテンツ */}
      <main>
        {/* ヒーローセクション */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 sm:mb-6">
              学習を継続する力を、<br className="sm:hidden" />
              あなたに。
            </h2>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-8 sm:mb-12 max-w-3xl mx-auto px-4">
              目標達成をリアルタイムで祝福する、<br className="sm:hidden" />
              新しい習慣化サポートアプリ
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center px-4">
              <Link
                href="/auth/signup"
                className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl"
              >
                今すぐ無料で始める
              </Link>
              <Link
                href="#features"
                className="w-full sm:w-auto px-8 py-4 bg-white text-gray-700 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors shadow-md"
              >
                機能を見る
              </Link>
            </div>
          </div>

          {/* スクリーンショットプレビュー（オプション） */}
          <div className="mt-12 sm:mt-20">
            <div className="relative rounded-xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-4 sm:p-8">
              <div className="aspect-video bg-white bg-opacity-10 rounded-lg flex items-center justify-center backdrop-blur-sm border-2 border-white border-opacity-20">
                <div className="text-center text-white px-4">
                  <div className="text-4xl sm:text-6xl mb-4 animate-bounce">🎉</div>
                  <p className="text-lg sm:text-2xl font-bold">リアルタイム祝福機能</p>
                  <p className="text-sm sm:text-base text-gray-300 mt-2">進捗を入力すると即座に祝福アニメーション！</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 機能紹介セクション */}
        <section id="features" className="bg-white py-12 sm:py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                継続を楽しくする機能
              </h3>
              <p className="text-base sm:text-lg text-gray-600">
                あなたの学習・運動習慣を全力でサポート
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {/* 機能1 */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">🎯</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">TODO管理</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  学習や運動の目標を設定し、進捗をリアルタイムで追跡。優先度やカテゴリで整理できます。
                </p>
              </div>

              {/* 機能2 */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">🎊</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">リアルタイム祝福</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  進捗を入力すると、ディスプレイに派手な祝福アニメーション！40種類以上のメッセージで応援。
                </p>
              </div>

              {/* 機能3 */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">📱</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">どこでも記録</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  スマホから進捗を入力。家のディスプレイにリアルタイムで反映されます。
                </p>
              </div>

              {/* 機能4 */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">🔥</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">連続記録</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  3日、7日、30日...継続日数に応じた特別な祝福で、モチベーションを維持。
                </p>
              </div>

              {/* 機能5 */}
              <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">🐶</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">応援キャラクター</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  わんわん、にゃんこ、パンダなど10種類のキャラクターが、ユーモアたっぷりに応援。
                </p>
              </div>

              {/* 機能6 */}
              <div className="bg-gradient-to-br from-cyan-50 to-blue-50 rounded-xl p-6 sm:p-8 shadow-md hover:shadow-xl transition-shadow">
                <div className="text-4xl sm:text-5xl mb-4">⏰</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">時間帯別メッセージ</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  朝、昼、夜、深夜...時間帯に合わせた励ましのメッセージで、いつでもサポート。
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 使い方セクション */}
        <section className="py-12 sm:py-20 bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12 sm:mb-16">
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                3ステップで始める
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md text-center">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">1</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">無料登録</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  メールアドレスだけで簡単登録。クレジットカード不要。
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md text-center">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">2</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">目標設定</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  学習や運動の目標を登録。「毎日30分」「100ページ」など自由に設定。
                </p>
              </div>

              <div className="bg-white rounded-xl p-6 sm:p-8 shadow-md text-center">
                <div className="text-4xl sm:text-5xl font-bold text-blue-600 mb-4">3</div>
                <h4 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">進捗記録</h4>
                <p className="text-sm sm:text-base text-gray-600">
                  スマホから進捗を入力。ディスプレイに派手な祝福が表示！
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTAセクション */}
        <section className="bg-gradient-to-r from-blue-600 to-indigo-600 py-12 sm:py-20">
          <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 sm:mb-6">
              今日から始める、新しい習慣
            </h3>
            <p className="text-base sm:text-lg md:text-xl text-blue-100 mb-8 sm:mb-12">
              完全無料。クレジットカード不要。今すぐ始められます。
            </p>
            <Link
              href="/auth/signup"
              className="inline-block px-8 sm:px-12 py-4 bg-white text-blue-600 text-lg font-bold rounded-lg hover:bg-gray-100 transition-colors shadow-xl"
            >
              無料で始める →
            </Link>
          </div>
        </section>
      </main>

      {/* フッター */}
      <footer className="bg-gray-900 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-bold mb-4">Learn Tracker</h4>
              <p className="text-sm text-gray-400">
                継続する力を、すべての人に。
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">機能</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>TODO管理</li>
                <li>進捗記録</li>
                <li>表示モード</li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">サポート</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>
                  <Link href="/auth/login" className="hover:text-white transition-colors">
                    ログイン
                  </Link>
                </li>
                <li>
                  <Link href="/auth/signup" className="hover:text-white transition-colors">
                    新規登録
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm text-gray-400">
            <p>&copy; 2025 Learn Tracker. All rights reserved.</p>
            <p className="mt-2">Made with Next.js, Supabase & Vercel</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
