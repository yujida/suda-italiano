/*
 * 수다이탈리아노 홈 페이지 - 오늘의 랜덤 수다
 * 에듀마가진 스타일: 히어로 배너 + 랜덤 카드 뽑기 + 카테고리 그리드
 */
import { useState, useCallback } from "react";
import { useLocation } from "wouter";
import { Shuffle, ChevronRight, Clock, Users, BookOpen, CheckCircle2, Bookmark, Search, X, BarChart2 } from "lucide-react";
import Layout from "@/components/Layout";
import { topicCards, categories, type TopicCard } from "@/lib/data";
import { esToHangul } from "@/lib/pronounce";
import { useProgressContext } from "@/contexts/ProgressContext";
import { cn } from "@/lib/utils";

const levelColors: Record<string, string> = {
  A1: "badge-a1",
  A2: "badge-a2",
  B1: "badge-b1",
  B2: "badge-b2",
  C1: "badge-c1",
  C2: "badge-c2",
};

const activityIcons: Record<string, string> = {
  '페어대화': '👥',
  '그룹토론': '💬',
  '롤플레이': '🎭',
  '발표': '🎤',
  '작문': '✏️',
};

function TopicCardPreview({
  card,
  onClick,
  completed,
  bookmarked,
  onToggleBookmark,
  searchQuery,
}: {
  card: TopicCard;
  onClick: () => void;
  completed: boolean;
  bookmarked: boolean;
  onToggleBookmark: (e: React.MouseEvent) => void;
  searchQuery?: string;
}) {
  // 검색어 하이라이트 함수
  const highlight = (text: string) => {
    if (!searchQuery || searchQuery.trim() === "") return text;
    const escaped = searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const parts = text.split(new RegExp(`(${escaped})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === searchQuery.toLowerCase()
        ? <mark key={i} className="bg-yellow-200 text-foreground rounded px-0.5">{part}</mark>
        : part
    );
  };

  return (
    <div
      className="suda-card bg-white rounded-2xl overflow-hidden cursor-pointer border border-border"
      onClick={onClick}
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap gap-1.5">
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", levelColors[card.level])}>
              {card.level}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground">
              {activityIcons[card.activity]} {card.activity}
            </span>
          </div>
          <span className="text-xs text-muted-foreground flex items-center gap-1 shrink-0">
            <Clock className="w-3 h-3" />
            {card.duration}분
          </span>
        </div>

        <h3 className="font-bold text-base text-foreground mb-1 leading-snug">
          {highlight(card.titleKo)}
        </h3>
        <p className="text-sm text-muted-foreground mb-3" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
          {highlight(card.titleEs)}
        </p>

        <p className="text-sm text-foreground/70 line-clamp-2 mb-4">
          {card.warmupQuestions[0].ko}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex flex-wrap gap-1">
            {card.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded"
              >
                #{highlight(tag)}
              </span>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {completed && (
              <span className="text-xs font-semibold text-green-600 flex items-center gap-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                완료
              </span>
            )}
            <button
              onClick={onToggleBookmark}
              className="p-1 rounded-lg hover:bg-muted transition-colors"
              title={bookmarked ? "즐겨찾기 해제" : "즐겨찾기"}
            >
              <Bookmark
                className="w-4 h-4"
                style={{
                  color: bookmarked ? "oklch(0.49 0.15 64)" : undefined,
                  fill: bookmarked ? "oklch(0.49 0.15 64)" : "none",
                }}
              />
            </button>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [, navigate] = useLocation();
  const [selectedLevel, setSelectedLevel] = useState<string>("전체");
  const [selectedCategory, setSelectedCategory] = useState<string>("전체");
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawnCard, setDrawnCard] = useState<TopicCard | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const { isCompleted, isBookmarked, toggleBookmark, completedCount, bookmarkedCount } = useProgressContext();
  const [showBookmarked, setShowBookmarked] = useState(false);
  const levels = ["전체", "A1", "A2", "B1", "B2", "C1", "C2"];

  const filteredCards = topicCards.filter((card) => {
    const levelMatch = selectedLevel === "전체" || card.level === selectedLevel;
    const catMatch = selectedCategory === "전체" || card.category === selectedCategory;
    const bookmarkMatch = !showBookmarked || isBookmarked(card.id);

    // 검색어 필터: 제목(한/일), 태그, 카테고리, 레벨, 워밍업 질문 대상
    const q = searchQuery.trim().toLowerCase();
    const searchMatch = q === "" || [
      card.titleKo,
      card.titleEs,
      card.category,
      card.level,
      card.activity,
      ...card.tags,
      card.warmupQuestions[0]?.ko ?? "",
    ].some((field) => field.toLowerCase().includes(q));

    return levelMatch && catMatch && bookmarkMatch && searchMatch;
  });

  const handleDraw = useCallback(() => {
    setIsDrawing(true);
    setDrawnCard(null);
    setTimeout(() => {
      const pool = filteredCards.length > 0 ? filteredCards : topicCards;
      const random = pool[Math.floor(Math.random() * pool.length)];
      setDrawnCard(random);
      setIsDrawing(false);
    }, 800);
  }, [filteredCards]);

  const handleCardClick = (card: TopicCard) => {
    navigate(`/topic/${card.id}`);
  };

  const clearSearch = () => setSearchQuery("");

  return (
    <Layout>
      {/* 히어로 섹션 */}
      <section className="relative overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundColor: "oklch(0.40 0.16 150)",
            backgroundImage: `url(/hero-banner.webp)`,
          }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(to right, oklch(0.40 0.16 150 / 0.85) 0%, oklch(0.40 0.16 150 / 0.4) 60%, transparent 100%)" }} />
        <div className="relative px-6 py-16 lg:py-20 max-w-2xl">
          <div className="animate-float-in">
            <div className="flex items-center gap-2 mb-4">
              <span
                className="text-xs font-bold px-3 py-1 rounded-full text-white"
                style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
              >
                오늘의 랜덤 수다
              </span>
              <span className="text-white/60 text-xs">Chiacchiere a caso di oggi</span>
            </div>
            <h1
              className="text-3xl lg:text-4xl font-bold text-white mb-3 leading-tight"
              style={{ fontFamily: "'Lora', serif" }}
            >
              오늘은 무슨 주제로<br />
              <span style={{ color: "oklch(0.85 0.12 60)" }}>수다 떨어볼까요?</span>
            </h1>
            <p className="text-white/70 text-sm lg:text-base mb-6 leading-relaxed">
              레벨과 카테고리를 선택하고 주제를 뽑아보세요.<br />
              질문, 표현, 대화문, 문법이 한 번에 준비됩니다.
            </p>
          </div>

          {/* 통계 */}
          <div className="flex gap-4 animate-float-in stagger-2">
            {[
              { icon: BookOpen, value: `${topicCards.length}개`, label: "주제 카드" },
              { icon: CheckCircle2, value: `${completedCount}/${topicCards.length}`, label: "완료 카드" },
              { icon: Users, value: "A1~B2", label: "레벨 지원" },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex items-center gap-2 text-white/80">
                <Icon className="w-4 h-4" style={{ color: "oklch(0.85 0.12 60)" }} />
                <div>
                  <div className="text-sm font-bold">{value}</div>
                  <div className="text-xs text-white/50">{label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="p-6 max-w-5xl mx-auto">
        {/* 검색 바 */}
        <section className="mb-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="카드 검색: 주제, 태그, 레벨, 활동 유형..."
              className="w-full pl-12 pr-12 py-3.5 rounded-2xl border border-border bg-white text-sm focus:outline-none focus:ring-2 shadow-sm transition-all"
              style={{ "--tw-ring-color": "oklch(0.40 0.16 150 / 0.3)" } as React.CSSProperties}
            />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4 text-muted-foreground" />
              </button>
            )}
          </div>
          {searchQuery && (
            <div className="mt-2 text-sm text-muted-foreground px-1">
              <span className="font-medium" style={{ color: "oklch(0.40 0.16 150)" }}>
                "{searchQuery}"
              </span>
              에 대한 검색 결과: <span className="font-bold">{filteredCards.length}개</span>
            </div>
          )}
        </section>

        {/* 랜덤 뽑기 섹션 */}
        <section className="mb-10">
          <div className="bg-white rounded-2xl border border-border p-6 shadow-sm">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Shuffle className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
              주제 뽑기 필터
            </h2>

            {/* 레벨 필터 */}
            <div className="mb-4">
              <div className="text-sm font-medium text-muted-foreground mb-2">레벨</div>
              <div className="flex flex-wrap gap-2">
                {levels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSelectedLevel(level)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                      selectedLevel === level
                        ? "text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    )}
                    style={selectedLevel === level ? { backgroundColor: "oklch(0.40 0.16 150)" } : {}}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>

            {/* 카테고리 필터 */}
            <div className="mb-6">
              <div className="text-sm font-medium text-muted-foreground mb-2">카테고리</div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setSelectedCategory("전체")}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                    selectedCategory === "전체"
                      ? "text-white shadow-sm"
                      : "bg-muted text-muted-foreground hover:bg-secondary"
                  )}
                  style={selectedCategory === "전체" ? { backgroundColor: "oklch(0.40 0.16 150)" } : {}}
                >
                  전체
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                      selectedCategory === cat.id
                        ? "text-white shadow-sm"
                        : "bg-muted text-muted-foreground hover:bg-secondary"
                    )}
                    style={selectedCategory === cat.id ? { backgroundColor: "oklch(0.40 0.16 150)" } : {}}
                  >
                    {cat.icon} {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 뽑기 버튼 */}
            <button
              onClick={handleDraw}
              disabled={isDrawing}
              className="w-full py-4 rounded-xl text-white font-bold text-lg flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] disabled:opacity-70 whitespace-nowrap overflow-hidden"
              style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
            >
              {isDrawing ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/40 border-t-white rounded-full animate-spin flex-shrink-0" />
                  <span className="whitespace-nowrap">주제 뽑는 중...</span>
                </>
              ) : (
                <>
                  <Shuffle className="w-5 h-5 flex-shrink-0" />
                  <span className="whitespace-nowrap">오늘의 주제 뽑기</span>
                  <span className="text-sm font-normal opacity-80 whitespace-nowrap hidden sm:inline">Saca el tema de hoy</span>
                </>
              )}
            </button>
          </div>

          {/* 뽑힌 카드 결과 */}
          {drawnCard && (
            <div className="mt-4 animate-card-pop">
              <div
                className="rounded-2xl p-6 text-white cursor-pointer transition-all duration-200 hover:shadow-xl active:scale-[0.99]"
                style={{ backgroundColor: "oklch(0.40 0.16 150)" }}
                onClick={() => handleCardClick(drawnCard)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex gap-2">
                    <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", levelColors[drawnCard.level])}>
                      {drawnCard.level}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
                      {activityIcons[drawnCard.activity]} {drawnCard.activity}
                    </span>
                  </div>
                  <span className="text-white/60 text-xs flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {drawnCard.duration}분
                  </span>
                </div>

                <h3
                  className="text-2xl font-bold mb-1"
                  style={{ fontFamily: "'Lora', serif" }}
                >
                  {drawnCard.titleKo}
                </h3>
                <p className="text-white/60 text-base mb-4" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {drawnCard.titleEs}
                </p>

                <div className="bg-white/10 rounded-xl p-4 mb-4">
                  <div className="text-white/60 text-xs mb-2">워밍업 질문 1</div>
                  <p className="text-sm text-white/90" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {drawnCard.warmupQuestions[0].es}
                  </p>
                  <p className="text-[11px] text-white/50 mt-0.5">{esToHangul(drawnCard.warmupQuestions[0].es)}</p>
                  <p className="text-xs text-white/60 mt-1">{drawnCard.warmupQuestions[0].ko}</p>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {drawnCard.tags.map((tag) => (
                      <span key={tag} className="text-xs text-white/50 bg-white/10 px-2 py-0.5 rounded">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-white/70 text-sm font-medium">
                    카드 열기 <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </section>

        {/* 전체 카드 목록 */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold">
              주제별 프리토킹 카드
              <span className="text-sm font-normal text-muted-foreground ml-2">
                ({filteredCards.length}개)
              </span>
            </h2>
            <div className="flex items-center gap-2">
              <button
                onClick={() => navigate("/progress")}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border border-border bg-white text-muted-foreground hover:bg-muted transition-all duration-200"
              >
                <BarChart2 className="w-3.5 h-3.5" />
                진도 통계
              </button>
              <button
                onClick={() => setShowBookmarked(!showBookmarked)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border transition-all duration-200",
                  showBookmarked
                    ? "text-white border-transparent"
                    : "bg-white border-border text-muted-foreground hover:bg-muted"
                )}
                style={showBookmarked ? { backgroundColor: "oklch(0.49 0.15 64)" } : {}}
              >
                <Bookmark className="w-3.5 h-3.5" style={{ fill: showBookmarked ? "white" : "none" }} />
                즐겨찾기 ({bookmarkedCount})
              </button>
            </div>
          </div>

          {filteredCards.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p className="text-4xl mb-3">🔍</p>
              <p className="font-medium mb-1">
                {searchQuery ? `"${searchQuery}"에 해당하는 카드가 없습니다.` : "해당 조건의 카드가 없습니다."}
              </p>
              <p className="text-sm mb-3">다른 검색어나 필터를 시도해보세요.</p>
              <button
                onClick={() => { setSelectedLevel("전체"); setSelectedCategory("전체"); clearSearch(); }}
                className="mt-1 text-sm underline"
                style={{ color: "oklch(0.49 0.15 64)" }}
              >
                필터 전체 초기화
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredCards.map((card, i) => (
                <div key={card.id} className={cn("animate-float-in", `stagger-${Math.min(i + 1, 5)}`)}>
                  <TopicCardPreview
                    card={card}
                    onClick={() => handleCardClick(card)}
                    completed={isCompleted(card.id)}
                    bookmarked={isBookmarked(card.id)}
                    onToggleBookmark={(e) => { e.stopPropagation(); toggleBookmark(card.id); }}
                    searchQuery={searchQuery}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* 카테고리 그리드 */}
        <section className="mt-10">
          <h2 className="text-lg font-bold mb-4">카테고리 탐색</h2>
          <div className="grid grid-cols-3 md:grid-cols-5 gap-3">
            {categories.map((cat, i) => (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setSearchQuery(""); }}
                className={cn(
                  "animate-float-in p-3 rounded-xl border border-border bg-white text-center transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 active:scale-[0.97]",
                  `stagger-${Math.min(i + 1, 5)}`
                )}
              >
                <div className="text-2xl mb-1">{cat.icon}</div>
                <div className="text-xs font-medium text-foreground">{cat.label}</div>
                <div className="text-xs text-muted-foreground mt-0.5" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                  {cat.labelEs}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* 수업 시나리오 안내 */}
        <section className="mt-10 mb-6">
          <div
            className="rounded-2xl p-6 text-white"
            style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150) 0%, oklch(0.46 0.11 150) 100%)" }}
          >
            <h2 className="text-lg font-bold mb-4">
              📋 50분 수업 활용 예시
              <span className="text-sm font-normal text-white/60 ml-2">Ejemplo de una clase de 50 minutos</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                { time: "5분", activity: "랜덤 주제 뽑기", es: "Sacar tema" },
                { time: "10분", activity: "표현·대화문 확인", es: "Ver expresiones" },
                { time: "15분", activity: "페어 대화 연습", es: "Práctica en parejas" },
                { time: "10분", activity: "역할극 / 토론", es: "Rol y debate" },
                { time: "5분", activity: "오류 교정", es: "Corregir errores" },
                { time: "5분", activity: "쓰기 미션", es: "Escritura" },
              ].map(({ time, activity, es }) => (
                <div key={activity} className="bg-white/10 rounded-xl p-3">
                  <div className="text-white/50 text-xs mb-1">{time}</div>
                  <div className="text-sm font-medium">{activity}</div>
                  <div className="text-xs text-white/50 mt-0.5">{es}</div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
