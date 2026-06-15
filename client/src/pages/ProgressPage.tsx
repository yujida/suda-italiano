/*
 * 수다이탈리아노 학습 진도 통계 페이지 (/progress)
 * 에듀마가진 스타일: 카테고리별 달성률, 레벨별 분포, 활동 유형 통계, 연속 학습 동기 부여
 */
import { useMemo } from "react";
import { useLocation } from "wouter";
import {
  CheckCircle2,
  Bookmark,
  BarChart2,
  TrendingUp,
  Award,
  BookOpen,
  Zap,
  ChevronRight,
  RotateCcw,
  Target,
} from "lucide-react";
import Layout from "@/components/Layout";
import { topicCards, categories } from "@/lib/data";
import { useProgressContext } from "@/contexts/ProgressContext";
import { cn } from "@/lib/utils";

const levelColors: Record<string, { bg: string; text: string; bar: string }> = {
  A1: { bg: "bg-emerald-50", text: "text-emerald-700", bar: "bg-emerald-500" },
  A2: { bg: "bg-sky-50", text: "text-sky-700", bar: "bg-sky-500" },
  B1: { bg: "bg-violet-50", text: "text-violet-700", bar: "bg-violet-500" },
  B2: { bg: "bg-amber-50", text: "text-amber-700", bar: "bg-amber-500" },
  C1: { bg: "bg-rose-50", text: "text-rose-700", bar: "bg-rose-500" },
  C2: { bg: "bg-fuchsia-50", text: "text-fuchsia-700", bar: "bg-fuchsia-500" },
};

const activityIcons: Record<string, string> = {
  '페어대화': '👥',
  '그룹토론': '💬',
  '롤플레이': '🎭',
  '발표': '🎤',
  '작문': '✏️',
};

// 달성률에 따른 색상
function getRateColor(rate: number): string {
  if (rate >= 80) return "oklch(0.55 0.15 155)"; // 초록
  if (rate >= 50) return "oklch(0.49 0.15 64)";  // 주황
  if (rate >= 20) return "oklch(0.52 0.15 150)"; // 인디고
  return "oklch(0.72 0.03 60)";                  // 회색
}

// 달성 메시지
function getMotivationMsg(rate: number): string {
  if (rate === 100) return "🏆 완벽 달성! 모든 카드를 완료했어요!";
  if (rate >= 80) return "🔥 거의 다 왔어요! 마지막 스퍼트!";
  if (rate >= 50) return "💪 절반 이상 완료! 훌륭한 진도예요!";
  if (rate >= 20) return "🌱 좋은 출발! 꾸준히 이어나가요.";
  return "👋 지금 시작해보세요! 첫 카드를 완료해봐요.";
}

export default function ProgressPage() {
  const [, navigate] = useLocation();
  const { completed, bookmarked, completedCount, bookmarkedCount, resetProgress } = useProgressContext();

  const totalCards = topicCards.length;
  const overallRate = totalCards > 0 ? Math.round((completedCount / totalCards) * 100) : 0;

  // 카테고리별 통계
  const categoryStats = useMemo(() => {
    return categories.map((cat) => {
      const catCards = topicCards.filter((c) => c.category === cat.id);
      const catCompleted = catCards.filter((c) => completed.has(c.id)).length;
      const rate = catCards.length > 0 ? Math.round((catCompleted / catCards.length) * 100) : 0;
      return {
        ...cat,
        total: catCards.length,
        done: catCompleted,
        rate,
      };
    });
  }, [completed]);

  // 레벨별 통계
  const levelStats = useMemo(() => {
    const levels = ["A1", "A2", "B1", "B2", "C1", "C2"] as const;
    return levels.map((lv) => {
      const lvCards = topicCards.filter((c) => c.level === lv);
      const lvCompleted = lvCards.filter((c) => completed.has(c.id)).length;
      const rate = lvCards.length > 0 ? Math.round((lvCompleted / lvCards.length) * 100) : 0;
      return { level: lv, total: lvCards.length, done: lvCompleted, rate };
    });
  }, [completed]);

  // 활동 유형별 통계
  const activityStats = useMemo(() => {
    const activities = ["페어대화", "그룹토론", "롤플레이", "발표", "작문"] as const;
    return activities.map((act) => {
      const actCards = topicCards.filter((c) => c.activity === act);
      const actCompleted = actCards.filter((c) => completed.has(c.id)).length;
      const rate = actCards.length > 0 ? Math.round((actCompleted / actCards.length) * 100) : 0;
      return { activity: act, total: actCards.length, done: actCompleted, rate };
    });
  }, [completed]);

  // 최근 완료 카드 5개 (bookmarked 중 완료된 것 우선, 나머지는 완료 순)
  const recentCompleted = useMemo(() => {
    return topicCards
      .filter((c) => completed.has(c.id))
      .slice(0, 6);
  }, [completed]);

  // 즐겨찾기 중 미완료 카드 (다음 학습 추천)
  const nextRecommended = useMemo(() => {
    return topicCards
      .filter((c) => bookmarked.has(c.id) && !completed.has(c.id))
      .slice(0, 3);
  }, [bookmarked, completed]);

  const handleReset = () => {
    if (window.confirm("학습 진도를 초기화하시겠습니까? 이 작업은 되돌릴 수 없습니다.")) {
      resetProgress();
    }
  };

  return (
    <Layout>
      {/* 헤더 */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0"
          style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150) 0%, oklch(0.33 0.13 28) 100%)" }}
        />
        <div className="relative px-6 py-12 lg:py-16 max-w-3xl">
          <div className="animate-float-in">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
              >
                학습 진도
              </span>
              <span className="text-white/60 text-xs">Mi progreso</span>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              나의 학습 통계
            </h1>
            <p className="text-white/70 text-sm lg:text-base leading-relaxed">
              {getMotivationMsg(overallRate)}
            </p>
          </div>

          {/* 전체 진도 원형 표시 */}
          <div className="mt-8 flex items-center gap-8 animate-float-in stagger-2">
            {/* 원형 진도 */}
            <div className="relative w-28 h-28 shrink-0">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="10" />
                <circle
                  cx="50" cy="50" r="42"
                  fill="none"
                  stroke="oklch(0.85 0.12 60)"
                  strokeWidth="10"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 42}`}
                  strokeDashoffset={`${2 * Math.PI * 42 * (1 - overallRate / 100)}`}
                  style={{ transition: "stroke-dashoffset 1s ease" }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-bold text-white">{overallRate}%</span>
                <span className="text-white/50 text-xs">달성</span>
              </div>
            </div>

            {/* 요약 수치 */}
            <div className="flex flex-col gap-3">
              {[
                { icon: CheckCircle2, value: `${completedCount}개`, label: "완료한 카드", sub: `전체 ${totalCards}개 중` },
                { icon: Bookmark, value: `${bookmarkedCount}개`, label: "즐겨찾기", sub: "관심 카드" },
                { icon: Target, value: `${totalCards - completedCount}개`, label: "남은 카드", sub: "완료 대기" },
              ].map(({ icon: Icon, value, label, sub }) => (
                <div key={label} className="flex items-center gap-3 text-white/80">
                  <Icon className="w-4 h-4 shrink-0" style={{ color: "oklch(0.85 0.12 60)" }} />
                  <div>
                    <span className="text-sm font-bold">{value}</span>
                    <span className="text-white/50 text-xs ml-1.5">{label}</span>
                    <div className="text-white/40 text-xs">{sub}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="p-6 max-w-5xl mx-auto">

        {/* 카테고리별 달성률 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
            <BarChart2 className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
            카테고리별 달성률
          </h2>
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <div className="space-y-4">
              {categoryStats.map((cat) => (
                <div key={cat.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{cat.icon}</span>
                      <span className="text-sm font-medium">{cat.label}</span>
                      <span className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                        {cat.labelEs}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground">{cat.done}/{cat.total}</span>
                      <span
                        className="font-bold text-xs px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: `${getRateColor(cat.rate)}22`,
                          color: getRateColor(cat.rate),
                        }}
                      >
                        {cat.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${cat.rate}%`,
                        backgroundColor: getRateColor(cat.rate),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 레벨별 + 활동 유형별 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* 레벨별 */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <TrendingUp className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
              레벨별 달성률
            </h2>
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
              {levelStats.map((lv) => {
                const colors = levelColors[lv.level];
                return (
                  <div key={lv.level} className={cn("rounded-xl p-3", colors.bg)}>
                    <div className="flex items-center justify-between mb-1.5">
                      <div className="flex items-center gap-2">
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full text-white", `badge-${lv.level.toLowerCase()}`)}>
                          {lv.level}
                        </span>
                        <span className={cn("text-xs font-medium", colors.text)}>
                          {lv.done}/{lv.total}개
                        </span>
                      </div>
                      <span className={cn("text-sm font-bold", colors.text)}>{lv.rate}%</span>
                    </div>
                    <div className="h-1.5 bg-white/60 rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all duration-700", colors.bar)}
                        style={{ width: `${lv.rate}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 활동 유형별 */}
          <section>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
              활동 유형별 달성률
            </h2>
            <div className="bg-white rounded-2xl border border-border p-5 shadow-sm space-y-3">
              {activityStats.map((act) => (
                <div key={act.activity}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="text-base">{activityIcons[act.activity]}</span>
                      <span className="text-sm font-medium">{act.activity}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="text-muted-foreground text-xs">{act.done}/{act.total}</span>
                      <span
                        className="font-bold text-xs"
                        style={{ color: getRateColor(act.rate) }}
                      >
                        {act.rate}%
                      </span>
                    </div>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${act.rate}%`,
                        backgroundColor: getRateColor(act.rate),
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* 다음 학습 추천 (즐겨찾기 중 미완료) */}
        {nextRecommended.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Bookmark className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
              다음에 공부할 카드
              <span className="text-sm font-normal text-muted-foreground">즐겨찾기 중 미완료</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {nextRecommended.map((card) => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/topic/${card.id}`)}
                  className="bg-white rounded-2xl border border-border p-4 cursor-pointer hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 active:scale-[0.98]"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", `badge-${card.level.toLowerCase()}`)}>
                      {card.level}
                    </span>
                    <span className="text-xs text-muted-foreground">{activityIcons[card.activity]} {card.activity}</span>
                  </div>
                  <h3 className="font-bold text-sm mb-1">{card.titleKo}</h3>
                  <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {card.titleEs}
                  </p>
                  <div className="flex items-center justify-end mt-3 text-xs text-muted-foreground">
                    학습 시작 <ChevronRight className="w-3.5 h-3.5 ml-0.5" />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 최근 완료 카드 */}
        {recentCompleted.length > 0 && (
          <section className="mb-8">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Award className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
              완료한 카드
              <span className="text-sm font-normal text-muted-foreground">{completedCount}개 완료</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
              {recentCompleted.map((card) => (
                <div
                  key={card.id}
                  onClick={() => navigate(`/topic/${card.id}`)}
                  className="bg-white rounded-xl border border-border p-4 cursor-pointer hover:shadow-sm transition-all duration-200 flex items-center gap-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0 text-green-500" />
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{card.titleKo}</div>
                    <div className="text-xs text-muted-foreground truncate" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {card.titleEs}
                    </div>
                  </div>
                  <span className={cn("text-xs font-bold px-1.5 py-0.5 rounded shrink-0", `badge-${card.level.toLowerCase()}`)}>
                    {card.level}
                  </span>
                </div>
              ))}
            </div>
            {completedCount > 6 && (
              <button
                onClick={() => navigate("/")}
                className="mt-3 text-sm underline"
                style={{ color: "oklch(0.49 0.15 64)" }}
              >
                홈에서 전체 완료 카드 보기 →
              </button>
            )}
          </section>
        )}

        {/* 학습 시작 / 진도 초기화 */}
        <section className="mb-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate("/")}
              className="flex-1 py-3.5 rounded-xl text-white font-bold flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
            >
              <BookOpen className="w-5 h-5" />
              카드 학습 계속하기
            </button>
            <button
              onClick={handleReset}
              className="flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl border border-border bg-white text-muted-foreground text-sm font-medium hover:bg-muted transition-all duration-200"
            >
              <RotateCcw className="w-4 h-4" />
              진도 초기화
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
