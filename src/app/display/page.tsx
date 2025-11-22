'use client';

import { useEffect, useState, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useRouter } from 'next/navigation';
import type { User } from '@supabase/supabase-js';

interface Todo {
  id: string;
  title: string;
  status: 'not_started' | 'in_progress' | 'completed';
  category: string | null;
  goal_value: number;
  unit: string | null;
  current_value: number;
  updated_at: string;
}

// 進捗率別の祝福メッセージ（ダジャレ・ジョーク込み）
const PROGRESS_MESSAGES = {
  small: [
    '🌱 一歩前進！千里の道も一歩から！',
    '🚀 ロケットスタート！いい感じ！',
    '💪 やる気マンマン！この調子！',
    '🎯 目標にロックオン！ナイス！',
    '⚡ 電光石火のスタート！速い！',
    '🌟 輝き始めた！君の可能性！',
    '🔥 火がついたね！燃えてる！',
    '🎪 ショーの始まりだ！楽しもう！'
  ],
  medium: [
    '📈 グラフが右肩上がり！経済成長か！',
    '🎨 順調に「色」がついてきたね！（進捗に）',
    '🏃‍♂️ 中間地点通過！ペース配分完璧！',
    '🌈 虹の半分を超えた！あと半分！',
    '🎵 リズムに乗ってきた！グルーヴィー！',
    '🎯 的の中心に迫ってる！狙い撃ち！',
    '⛰️ 登山で言えば5合目！景色最高！',
    '🚂 快速列車で進行中！次は急行だ！'
  ],
  high: [
    '🎊 もう「ゴール」が見えてきた！（語呂良し）',
    '🏔️ 山頂まであと少し！頂上の景色は最高だぞ！',
    '🌕 満月に近づいてる！もうすぐ満点だ！',
    '🎪 クライマックス！盛り上がってきた！',
    '🚀 大気圏突破寸前！宇宙が待ってる！',
    '💎 ダイヤモンドの原石が輝き出した！',
    '🏆 トロフィーが手の届くところに！',
    '⚡ 最後のスパート！ラストスパート！'
  ],
  complete: [
    '🎉 パーフェクト！100点「満点」！',
    '👑 王者の貫禄！キング・オブ・キングス！',
    '🏆 金メダル確定！オリンピック選手か！',
    '💯 百発百中！スナイパーかよ！',
    '🌟 完璧すぎて言葉が出ない...！',
    '🎊 伝説が生まれた瞬間を目撃した！',
    '✨ キラキラ輝いてる！まぶしい！',
    '🔥 燃え尽きた...真っ白に...じゃなくて達成！'
  ]
};

// 時間帯別のメッセージ
const TIME_BASED_MESSAGES = {
  morning: [
    '☀️ 朝からやる気満々！素晴らしい！',
    '🌅 早起きは三文の徳！今日も頑張ろう！',
    '🐓 朝型人間の鑑！コケコッコー！',
    '☕ モーニングルーティン完璧！',
    '🌞 朝日のように輝いてる！'
  ],
  afternoon: [
    '🌤️ 午後も元気いっぱい！',
    '☀️ 昼下がりの努力が光る！',
    '🍱 ランチ後も頑張るなんて偉い！',
    '⏰ 午後の時間を有効活用！',
    '🌻 太陽のように明るく頑張ろう！'
  ],
  evening: [
    '🌆 夕方も諦めない！その姿勢が素晴らしい！',
    '🌇 一日の締めくくりに最高の努力！',
    '🌙 夕暮れ時の頑張りが明日を作る！',
    '🌃 今日も一日お疲れ様！最後まで全力！',
    '⭐ 夕方の星のように輝いてる！'
  ],
  night: [
    '🌙 夜の努力は誰も見てないけど、神様は見てる！',
    '⭐ 夜空の星のように輝く努力！',
    '🌃 夜型人間もカッコいい！',
    '🦉 フクロウのように賢く頑張る！',
    '✨ 深夜の努力が明日の成功を作る！'
  ],
  lateNight: [
    '🌜 深夜まで頑張るなんて...尊敬！',
    '⭐ 真夜中の戦士！かっこいい！',
    '🌟 寝る前の努力が一番身につく！',
    '💫 深夜のラストスパート！最高！',
    '🌠 流れ星に願いを...じゃなくて実行を！'
  ]
};

// 連続記録別の特別メッセージ
const STREAK_MESSAGES = {
  3: '🔥 3日連続！習慣化の第一歩！',
  7: '🌟 1週間継続！もう立派な習慣だ！',
  14: '💎 2週間継続！ダイヤモンド級の継続力！',
  21: '👑 3週間継続！習慣形成完了！もう無敵！',
  30: '🏆 1ヶ月達成！レジェンド誕生！',
  50: '🎊 50日継続！もはや伝説！',
  100: '🎉 100日！！！百発百中！完璧だ！',
  365: '🌈 1年継続！！！神の領域！！！'
};

// 応援キャラクター
const CHEER_CHARACTERS = [
  { emoji: '🐶', name: 'わんわん', message: 'ワンダフル！' },
  { emoji: '🐱', name: 'にゃんこ', message: 'にゃんとすごい！' },
  { emoji: '🐼', name: 'パンダ', message: 'パンダもびっくり！' },
  { emoji: '🦁', name: 'ライオン', message: '百獣の王も認める！' },
  { emoji: '🐯', name: 'トラ', message: 'タイガー級の頑張り！' },
  { emoji: '🐸', name: 'カエル', message: 'ケロっと達成！' },
  { emoji: '🐧', name: 'ペンギン', message: 'ペンギンも拍手！' },
  { emoji: '🦄', name: 'ユニコーン', message: '伝説級の努力！' },
  { emoji: '🐉', name: 'ドラゴン', message: 'ドラゴン級のパワー！' },
  { emoji: '🦅', name: 'イーグル', message: '鷲掴みで達成！' }
];

// ダジャレ・名言集
const MOTIVATIONAL_MESSAGES = [
  '継続は力なり！今日も「今日」という日を大切に！',
  '努力は裏切らない！...たまに寝坊するけど！',
  '目標達成まで「もう少し」じゃなくて「もう少しだけ」！',
  '完璧を目指すな！「完璧」は「完璧主義者」の敵だ！',
  '成功の秘訣は「諦めない」こと！諦めたらそこで試合終了！',
  'やればできる子！...いや、もうできてる！',
  '天才は1%のひらめきと99%の努力！君は200%！',
  '頂上は近い！「頂上」と「超上級者」をかけてみた！',
  '勝利の女神は努力する者に微笑む！ニコッ！',
  '限界を超えろ！限界は自分が決めるもの！',
  '一日一歩、三日で三歩！三歩進んで二歩下がる...いや下がるな！',
  '諦めなければ必ず道は開く！ドアも開く！',
  'できる！できる！きっとできる！（某CMソング風）',
  '昨日の自分を超えていけ！タイムマシンはないけど！',
  '夢は逃げない、逃げるのはいつも自分だ！逃げるな！',
  '小さな一歩が大きな一歩に！巨人の一歩に！',
  '今日が人生で一番若い日！若返りはしないけど！',
  '壁は乗り越えるためにある！穴を開けてもいい！',
  'やる気があれば何でもできる！ないなら寝ろ...じゃなくて頑張れ！',
  '失敗は成功のもと！もとが多すぎると困るけど！'
];

// アニメーションパターン
const ANIMATION_PATTERNS = {
  confetti: { particles: 50, emoji: ['🎊', '🎉', '⭐', '✨', '🌟', '💫', '🎈', '🎁'] },
  fireworks: { particles: 40, emoji: ['💥', '✨', '🎆', '🎇', '⭐', '🌟', '💫'] },
  hearts: { particles: 30, emoji: ['❤️', '💖', '💕', '💗', '💓', '💝', '💞'] },
  stars: { particles: 35, emoji: ['⭐', '🌟', '✨', '💫', '🌠'] },
  flowers: { particles: 25, emoji: ['🌸', '🌺', '🌻', '🌷', '🌹', '💐', '🌼'] },
  sakura: { particles: 40, emoji: ['🌸', '🌸', '🌸', '🌸', '🌸'] }
};

export default function DisplayModePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [todos, setTodos] = useState<Todo[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [celebration, setCelebration] = useState(false);
  const [celebrationMessage, setCelebrationMessage] = useState('');
  const [celebrationEmoji, setCelebrationEmoji] = useState('🎉');
  const [animationPattern, setAnimationPattern] = useState<keyof typeof ANIMATION_PATTERNS>('confetti');
  const [streak, setStreak] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [cheerCharacter, setCheerCharacter] = useState(CHEER_CHARACTERS[0]);
  const channelRef = useRef<any>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/auth/login');
        return;
      }
      setUser(user);
      loadTodos(user.id);
      subscribeToTodos(user.id);
      calculateStreak(user.id);
    });

    // 時計の更新
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    // メッセージのローテーション（30秒ごと）
    const messageTimer = setInterval(() => {
      setCurrentMessageIndex(prev => (prev + 1) % MOTIVATIONAL_MESSAGES.length);
    }, 30000);

    // 応援キャラクターのランダム変更（1分ごと）
    const characterTimer = setInterval(() => {
      setCheerCharacter(CHEER_CHARACTERS[Math.floor(Math.random() * CHEER_CHARACTERS.length)]);
    }, 60000);

    return () => {
      clearInterval(timer);
      clearInterval(messageTimer);
      clearInterval(characterTimer);
      if (channelRef.current) {
        const supabase = createClient();
        supabase.removeChannel(channelRef.current);
      }
    };
  }, [router]);

  // スライドショーのタイマー
  useEffect(() => {
    if (todos.length === 0) return;

    const todosPerSlide = 2;
    const totalSlides = Math.ceil(todos.length / todosPerSlide);

    const slideTimer = setInterval(() => {
      setCurrentSlideIndex(prev => (prev + 1) % totalSlides);
    }, 10000);

    return () => {
      clearInterval(slideTimer);
    };
  }, [todos.length]);

  useEffect(() => {
    setCurrentSlideIndex(0);
  }, [todos.length]);

  const loadTodos = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('todos')
      .select('*')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (data) {
      setTodos(data);
    }
  };

  const getTimeBasedMessage = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 11) return TIME_BASED_MESSAGES.morning;
    if (hour >= 11 && hour < 17) return TIME_BASED_MESSAGES.afternoon;
    if (hour >= 17 && hour < 21) return TIME_BASED_MESSAGES.evening;
    if (hour >= 21 && hour < 24) return TIME_BASED_MESSAGES.night;
    return TIME_BASED_MESSAGES.lateNight;
  };

  const getProgressMessage = (progress: number) => {
    if (progress >= 100) return PROGRESS_MESSAGES.complete;
    if (progress >= 75) return PROGRESS_MESSAGES.high;
    if (progress >= 40) return PROGRESS_MESSAGES.medium;
    return PROGRESS_MESSAGES.small;
  };

  const getAnimationPattern = (progress: number): keyof typeof ANIMATION_PATTERNS => {
    if (progress >= 100) return 'fireworks';
    if (progress >= 75) return 'stars';
    if (progress >= 50) return 'hearts';
    if (progress >= 25) return 'flowers';
    return 'confetti';
  };

  const subscribeToTodos = (userId: string) => {
    const supabase = createClient();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`todos-realtime-${userId}`, {
        config: {
          broadcast: { self: true },
        },
      })
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'todos',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          console.log('🔔 Realtime update received!', payload);
          const updated = payload.new as Todo;

          setTodos(prev => {
            const filtered = prev.filter(t => t.id !== updated.id);
            const updatedTodos = [updated, ...filtered];
            return updatedTodos.sort((a, b) =>
              new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
            );
          });

          const progress = (updated.current_value / updated.goal_value) * 100;
          const messages = getProgressMessage(progress);
          const timeMessages = getTimeBasedMessage();
          const randomMessage = messages[Math.floor(Math.random() * messages.length)];
          const randomTimeMessage = timeMessages[Math.floor(Math.random() * timeMessages.length)];
          const pattern = getAnimationPattern(progress);
          const character = CHEER_CHARACTERS[Math.floor(Math.random() * CHEER_CHARACTERS.length)];

          setAnimationPattern(pattern);
          setCheerCharacter(character);

          if (progress >= 100) {
            showCelebration(
              `🎊🎉 ${character.emoji} 完全達成！ 🎉🎊`,
              `「${updated.title}」\n${updated.current_value} ${updated.unit} 達成！\n\n${randomMessage}\n${character.message}`,
              `${character.emoji}`,
              true
            );
          } else if (updated.current_value > 0) {
            showCelebration(
              `${character.emoji} 進捗更新！ナイス！`,
              `「${updated.title}」\n${updated.current_value}/${updated.goal_value} ${updated.unit} (${Math.round(progress)}%)\n\n${randomMessage}\n${randomTimeMessage}`,
              `${character.emoji}`,
              false
            );
          }

          // 連続記録の特別メッセージ
          calculateStreak(userId).then(() => {
            const streakKeys = Object.keys(STREAK_MESSAGES).map(Number);
            const matchingStreak = streakKeys.find(key => key === streak);
            if (matchingStreak) {
              setTimeout(() => {
                showCelebration(
                  '🎊 連続記録達成！ 🎊',
                  STREAK_MESSAGES[matchingStreak as keyof typeof STREAK_MESSAGES],
                  '🔥',
                  true
                );
              }, 6000);
            }
          });
        }
      )
      .subscribe((status) => {
        console.log('📡 Realtime subscription status:', status);
        if (status === 'SUBSCRIBED') {
          console.log('✅ Successfully subscribed to realtime updates!');
        }
      });

    channelRef.current = channel;
  };

  const calculateStreak = async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from('todos')
      .select('current_value')
      .eq('user_id', userId)
      .gt('current_value', 0);

    if (data) {
      setStreak(data.length);
    }
  };

  const showCelebration = (title: string, message: string, emoji: string, isCompletion: boolean) => {
    setCelebrationMessage(`${title}\n\n${message}`);
    setCelebrationEmoji(emoji);
    setCelebration(true);
    setTimeout(() => setCelebration(false), isCompletion ? 10000 : 6000);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const totalProgress = todos.reduce((sum, todo) => {
    return sum + (todo.current_value / todo.goal_value) * 100;
  }, 0);

  const averageProgress = todos.length > 0 ? Math.round(totalProgress / todos.length) : 0;
  const completedCount = todos.filter(t => t.status === 'completed').length;
  const inProgressCount = todos.filter(t => t.status === 'in_progress').length;

  const todosPerSlide = 2;
  const totalSlides = Math.ceil(todos.length / todosPerSlide);
  const currentSlideTodos = todos.slice(
    currentSlideIndex * todosPerSlide,
    (currentSlideIndex + 1) * todosPerSlide
  );

  const currentPattern = ANIMATION_PATTERNS[animationPattern];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* 背景アニメーション */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-pink-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000" />
      </div>

      {/* 祝福アニメーション */}
      {celebration && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80 animate-fade-in">
          <div className="text-center animate-bounce-in max-w-4xl px-8">
            <div className="text-9xl mb-8 animate-pulse">{celebrationEmoji}</div>
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 whitespace-pre-line leading-tight">
              {celebrationMessage}
            </div>
            <div className="text-2xl md:text-3xl mt-8 text-yellow-300 animate-pulse">
              {cheerCharacter.emoji} {cheerCharacter.name}: 「{cheerCharacter.message}」
            </div>
          </div>

          {/* 多様なパーティクルエフェクト */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(currentPattern.particles)].map((_, i) => (
              <div
                key={i}
                className="absolute text-4xl animate-float"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`,
                  animationDuration: `${3 + Math.random() * 2}s`,
                }}
              >
                {currentPattern.emoji[Math.floor(Math.random() * currentPattern.emoji.length)]}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* メインコンテンツ */}
      <div className="relative z-10 p-4 md:p-8 min-h-screen flex flex-col">
        {/* ヘッダー */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 md:mb-12 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.push('/dashboard')}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 rounded-lg backdrop-blur-sm transition-all text-sm md:text-base font-semibold"
            >
              ← 戻る
            </button>
            <button
              onClick={toggleFullscreen}
              className="px-4 md:px-6 py-2 md:py-3 bg-gray-900 bg-opacity-70 hover:bg-opacity-90 rounded-lg backdrop-blur-sm transition-all text-sm md:text-base font-semibold"
            >
              {isFullscreen ? '通常表示' : '全画面'}
            </button>
          </div>

          <div className="text-right">
            <div className="text-4xl md:text-5xl lg:text-6xl font-bold animate-pulse">
              {currentTime.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-base md:text-xl lg:text-2xl text-gray-300">
              {currentTime.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'long' })}
            </div>
          </div>
        </div>

        {/* 統計カード */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12">
          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white border-opacity-20 transform hover:scale-105 transition-all">
            <div className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">連続記録</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-yellow-400 animate-pulse">
              🔥 {streak}日
            </div>
            {streak >= 3 && (
              <div className="text-xs md:text-sm text-yellow-300 mt-2">すごい！</div>
            )}
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white border-opacity-20 transform hover:scale-105 transition-all">
            <div className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">平均進捗</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-green-400">{averageProgress}%</div>
            {averageProgress >= 50 && (
              <div className="text-xs md:text-sm text-green-300 mt-2">半分超えた！</div>
            )}
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white border-opacity-20 transform hover:scale-105 transition-all">
            <div className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">完了</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-blue-400">✅ {completedCount}</div>
          </div>

          <div className="bg-white bg-opacity-10 backdrop-blur-md rounded-xl md:rounded-2xl p-4 md:p-6 border border-white border-opacity-20 transform hover:scale-105 transition-all">
            <div className="text-xs md:text-sm text-gray-300 mb-1 md:mb-2">進行中</div>
            <div className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-400">📊 {inProgressCount}</div>
          </div>
        </div>

        {/* 応援キャラクターとメッセージ */}
        <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-pink-500 rounded-xl md:rounded-2xl p-4 md:p-8 mb-8 md:mb-12 text-center shadow-2xl transform hover:scale-105 transition-all">
          <div className="text-6xl md:text-7xl mb-4 animate-bounce">
            {cheerCharacter.emoji}
          </div>
          <div className="text-2xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-2 md:mb-4">
            {MOTIVATIONAL_MESSAGES[currentMessageIndex]}
          </div>
          <div className="text-sm md:text-xl lg:text-2xl text-gray-800 font-semibold">
            {cheerCharacter.name} が応援してるよ！{cheerCharacter.message}
          </div>
        </div>

        {/* TODOカード（スライドショー） */}
        <div className="flex-1 relative">
          {todos.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center animate-bounce">
                <div className="text-8xl mb-6">📝</div>
                <div className="text-3xl text-gray-300 font-bold">TODOがありません</div>
                <div className="text-xl text-gray-400 mt-4">新しいTODOを追加して始めよう！</div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
                {currentSlideTodos.map((todo, index) => {
                  const progress = Math.min(Math.round((todo.current_value / todo.goal_value) * 100), 100);

                  return (
                    <div
                      key={todo.id}
                      className="bg-gradient-to-br from-gray-800 to-gray-900 bg-opacity-90 backdrop-blur-md rounded-2xl md:rounded-3xl p-6 md:p-10 border-2 border-white border-opacity-30 shadow-2xl transform transition-all animate-slide-in hover:scale-105"
                      style={{ animationDelay: `${index * 0.2}s` }}
                    >
                      <div className="flex items-start justify-between mb-4 md:mb-6">
                        <div className="flex-1 min-w-0">
                          <h3 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-2 md:mb-3 text-white">
                            {todo.title}
                          </h3>
                          {todo.category && (
                            <span className="inline-block px-4 py-2 bg-purple-600 bg-opacity-70 rounded-full text-sm md:text-base font-semibold text-white">
                              📁 {todo.category}
                            </span>
                          )}
                        </div>
                        {progress >= 100 && <div className="text-6xl md:text-7xl lg:text-8xl ml-4 animate-spin-slow">🏆</div>}
                        {progress >= 75 && progress < 100 && <div className="text-6xl md:text-7xl lg:text-8xl ml-4 animate-bounce">🌟</div>}
                      </div>

                      <div className="mb-4 md:mb-6">
                        <div className="flex justify-between items-center mb-3 md:mb-4">
                          <span className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
                            {todo.current_value} / {todo.goal_value} {todo.unit}
                          </span>
                          <span className="text-4xl md:text-5xl font-bold text-yellow-300 animate-pulse">{progress}%</span>
                        </div>

                        <div className="w-full bg-gray-700 bg-opacity-70 rounded-full h-6 md:h-8 overflow-hidden shadow-inner">
                          <div
                            className={`h-6 md:h-8 rounded-full transition-all duration-1000 ${
                              progress >= 100
                                ? 'bg-gradient-to-r from-green-400 via-emerald-500 to-green-600 animate-pulse shadow-lg'
                                : progress >= 75
                                ? 'bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 shadow-lg'
                                : 'bg-gradient-to-r from-blue-400 via-purple-500 to-indigo-600 shadow-lg'
                            }`}
                            style={{ width: `${progress}%` }}
                          />
                        </div>
                      </div>

                      {progress >= 75 && progress < 100 && (
                        <div className="text-yellow-300 text-xl md:text-2xl font-bold animate-pulse">
                          🌟 ラストスパート！あと少し！
                        </div>
                      )}

                      {progress >= 50 && progress < 75 && (
                        <div className="text-blue-300 text-xl md:text-2xl font-bold">
                          💪 折り返し地点通過！いい感じ！
                        </div>
                      )}

                      {progress >= 100 && (
                        <div className="text-green-300 text-xl md:text-2xl font-bold animate-bounce">
                          🎉 パーフェクト達成！最高だ！
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* スライドインジケーター */}
              {totalSlides > 1 && (
                <div className="flex justify-center gap-3 mt-8">
                  {[...Array(totalSlides)].map((_, index) => (
                    <div
                      key={index}
                      className={`rounded-full transition-all ${
                        index === currentSlideIndex
                          ? 'bg-white w-12 h-4'
                          : 'bg-white bg-opacity-30 w-4 h-4'
                      }`}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -50px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(50px, 50px) scale(1.05); }
        }

        @keyframes float {
          0% { transform: translateY(0) rotate(0deg); opacity: 1; }
          100% { transform: translateY(-100vh) rotate(360deg); opacity: 0; }
        }

        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes bounce-in {
          0% { transform: scale(0.3); opacity: 0; }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); opacity: 1; }
        }

        @keyframes slide-in {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animation-delay-4000 {
          animation-delay: 4s;
        }

        .animate-float {
          animation: float 4s linear;
        }

        .animate-fade-in {
          animation: fade-in 0.5s ease-out;
        }

        .animate-bounce-in {
          animation: bounce-in 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55);
        }

        .animate-slide-in {
          animation: slide-in 0.6s ease-out;
        }

        .animate-spin-slow {
          animation: spin-slow 3s linear infinite;
        }
      `}</style>
    </div>
  );
}
