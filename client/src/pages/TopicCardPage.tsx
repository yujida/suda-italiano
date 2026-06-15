/*
 * 수다이탈리아노 주제 카드 상세 페이지
 * 에듀마가진 스타일: 탭 기반 학습 흐름
 */
import { useState } from "react";
import { useParams, useLocation } from "wouter";
import {
  ArrowLeft, Clock, Users, BookOpen, MessageSquare,
  Zap, GraduationCap, Edit3, ChevronDown, ChevronUp, Eye, EyeOff,
  Copy, Check, CheckCircle2, Bookmark, RotateCcw
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { esToHangul } from "@/lib/pronounce";
import { VocabList } from "@/components/VocabList";
import { toast } from "sonner";
import Layout from "@/components/Layout";
import { topicCards, type TopicCard } from "@/lib/data";
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

function WarmupSection({ card }: { card: TopicCard }) {
  const [revealed, setRevealed] = useState<boolean[]>(card.warmupQuestions.map(() => false));
  const toggle = (i: number) => setRevealed((prev) => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        부담 없이 대답할 수 있는 쉬운 질문입니다. 먼저 이탈리아어로 답해보고, 힌트를 확인하세요.
      </div>
      {card.warmupQuestions.map((q, i) => (
        <div key={i} className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
                >
                  {i + 1}
                </span>
                <span className="text-xs text-muted-foreground">워밍업 질문</span>
              </div>
              <p className="font-medium text-base" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {q.es}
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">{esToHangul(q.es)}</p>
              {revealed[i] && (
                <p className="text-sm text-muted-foreground mt-2 animate-float-in">{q.ko}</p>
              )}
            </div>
            <button
              onClick={() => toggle(i)}
              className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
            >
              {revealed[i] ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
      ))}
      <VocabList texts={card.warmupQuestions.map((q) => q.es)} label="이 워밍업 질문의 단어" />
    </div>
  );
}

function DeepSection({ card }: { card: TopicCard }) {
  const [revealed, setRevealed] = useState<boolean[]>(card.deepQuestions.map(() => false));
  const toggle = (i: number) => setRevealed((prev) => prev.map((v, idx) => idx === i ? !v : v));

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        의견, 비교, 이유, 경험을 말하게 하는 심화 질문입니다.
      </div>
      {card.deepQuestions.map((q, i) => (
        <div key={i} className="bg-white rounded-xl border border-border p-4">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white shrink-0"
                  style={{ backgroundColor: "oklch(0.40 0.16 150)" }}
                >
                  {i + 1}
                </span>
                <span className="text-xs text-muted-foreground">심화 질문</span>
              </div>
              <p className="font-medium text-base" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                {q.es}
              </p>
              <p className="text-xs text-muted-foreground/80 mt-1">{esToHangul(q.es)}</p>
              {revealed[i] && (
                <p className="text-sm text-muted-foreground mt-2 animate-float-in">{q.ko}</p>
              )}
            </div>
            <button
              onClick={() => toggle(i)}
              className="p-2 rounded-lg hover:bg-muted transition-colors shrink-0"
            >
              {revealed[i] ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
            </button>
          </div>
        </div>
      ))}
      <VocabList texts={card.deepQuestions.map((q) => q.es)} label="이 심화 질문의 단어" />

      {/* 롤플레이 */}
      <div
        className="rounded-xl p-4 mt-4"
        style={{ backgroundColor: "oklch(0.40 0.16 150 / 0.06)", border: "1px solid oklch(0.40 0.16 150 / 0.15)" }}
      >
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">🎭</span>
          <span className="font-semibold text-sm">롤플레이</span>
        </div>
        <p className="text-sm text-muted-foreground mb-3">{card.roleplay.situation}</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="speech-bubble-a p-3 rounded-xl">
            <div className="text-xs text-white/70 mb-1">역할 A</div>
            <p className="text-sm text-white">{card.roleplay.roleA}</p>
          </div>
          <div className="speech-bubble-b p-3 rounded-xl">
            <div className="text-xs text-white/70 mb-1">역할 B</div>
            <p className="text-sm text-white">{card.roleplay.roleB}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ExpressionsSection({ card }: { card: TopicCard }) {
  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        오늘 주제에서 바로 써먹을 수 있는 표현입니다.
      </div>
      {card.expressions.map((expr, i) => (
        <div key={i} className="bg-white rounded-xl border border-border p-4 animate-float-in" style={{ animationDelay: `${i * 0.06}s` }}>
          <div className="flex items-start gap-4">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold shrink-0"
              style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
            >
              {i + 1}
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-lg font-bold es-text">{expr.word}</span>
                {expr.reading !== expr.word && (
                  <span className="text-xs text-muted-foreground">{expr.reading}</span>
                )}
              </div>
              <p className="text-sm font-medium text-foreground mb-2">{expr.meaning}</p>
              <div className="bg-muted rounded-lg px-3 py-2">
                <p className="text-sm es-text text-foreground/80">{expr.example}</p>
                <p className="text-xs text-muted-foreground/80 mt-1">{esToHangul(expr.example)}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <VocabList texts={card.expressions.map((e) => e.example)} label="이 표현 예문의 단어" />
    </div>
  );
}

function DialogueSection({ card }: { card: TopicCard }) {
  const [showTranslation, setShowTranslation] = useState(false);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-muted-foreground">실제 말투에 가까운 대화문입니다. 소리 내어 읽어보세요.</p>
        <button
          onClick={() => setShowTranslation(!showTranslation)}
          className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border border-border hover:bg-muted transition-colors"
        >
          {showTranslation ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
          번역 {showTranslation ? "숨기기" : "보기"}
        </button>
      </div>

      <div className="space-y-3">
        {card.dialogue.map((line, i) => (
          <div
            key={i}
            className={cn(
              "flex gap-3 animate-float-in",
              line.speaker === 'B' && "flex-row-reverse"
            )}
            style={{ animationDelay: `${i * 0.08}s` }}
          >
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-bold shrink-0"
              style={{
                backgroundColor: line.speaker === 'A'
                  ? "oklch(0.40 0.16 150)"
                  : "oklch(0.49 0.15 64)"
              }}
            >
              {line.speaker}
            </div>
            <div className={cn("max-w-[75%]", line.speaker === 'B' && "items-end")}>
              <div
                className={cn(
                  "px-4 py-3 rounded-2xl",
                  line.speaker === 'A'
                    ? "speech-bubble-a"
                    : "speech-bubble-b"
                )}
              >
                <p className="text-sm es-text leading-relaxed">{line.text}</p>
                <p className="text-[11px] text-white/70 mt-0.5">{esToHangul(line.text)}</p>
              </div>
              {showTranslation && (
                <p className={cn(
                  "text-xs text-muted-foreground mt-1 animate-float-in",
                  line.speaker === 'B' && "text-right"
                )}>
                  {line.translation}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>
      <VocabList texts={card.dialogue.map((l) => l.text)} label="이 대화의 단어" />
    </div>
  );
}

function GrammarSection({ card }: { card: TopicCard }) {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  return (
    <div className="space-y-3">
      <div className="text-sm text-muted-foreground mb-4">
        이 주제를 말할 때 쓰기 좋은 문법 패턴입니다.
      </div>
      {card.grammarPatterns.map((gp, i) => (
        <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
          <button
            className="w-full flex items-center justify-between p-4 hover:bg-muted/50 transition-colors"
            onClick={() => setOpenIdx(openIdx === i ? null : i)}
          >
            <div className="flex items-center gap-3">
              <span
                className="font-bold text-base es-text"
                style={{ color: "oklch(0.40 0.16 150)" }}
              >
                {gp.pattern}
              </span>
              <span
                className="text-xs px-2 py-0.5 rounded-full text-white"
                style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
              >
                {gp.function}
              </span>
            </div>
            {openIdx === i ? <ChevronUp className="w-4 h-4 text-muted-foreground" /> : <ChevronDown className="w-4 h-4 text-muted-foreground" />}
          </button>
          {openIdx === i && (
            <div className="px-4 pb-4 animate-float-in">
              <div className="bg-muted rounded-xl p-4 mb-3">
                <p className="text-sm es-text font-medium mb-1">{gp.example}</p>
                <p className="text-xs text-muted-foreground/80 mb-1">{esToHangul(gp.example)}</p>
                <p className="text-xs text-muted-foreground">{gp.translation}</p>
              </div>
            </div>
          )}
        </div>
      ))}
      <VocabList texts={card.grammarPatterns.map((g) => g.example)} label="이 문법 예문의 단어" />
    </div>
  );
}

function WritingSection({ card }: { card: TopicCard }) {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);
  const charCount = text.length;
  const isGoalMet = charCount >= card.writingMission.minChars;

  const handleCopy = async () => {
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast.success("클립보드에 복사되었습니다!");
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error("복사에 실패했습니다.");
    }
  };

  const handleReset = () => {
    setText("");
  };

  return (
    <div>
      <div className="bg-white rounded-xl border border-border p-5 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-lg">✏️</span>
          <span className="font-semibold">쓰기 미션</span>
        </div>
        <p className="text-sm text-foreground mb-2">{card.writingMission.prompt}</p>
        <p className="text-sm es-text text-muted-foreground mb-3">{card.writingMission.promptEs}</p>
        <div
          className="text-xs px-3 py-2 rounded-lg"
          style={{ backgroundColor: "oklch(0.49 0.15 64 / 0.1)", color: "oklch(0.45 0.12 35)" }}
        >
          💡 힌트: {card.writingMission.hint}
        </div>
      </div>

      <div className="relative">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="여기에 이탈리아어로 써보세요... (Scrivi qui in italiano)"
          className="w-full h-40 p-4 rounded-xl border border-border bg-white text-sm resize-none focus:outline-none focus:ring-2 es-text"
          style={{ fontFamily: "'Noto Sans KR', sans-serif" }}
        />
        <div className={cn(
          "absolute bottom-3 right-3 text-xs font-medium",
          isGoalMet ? "text-green-600" : "text-muted-foreground"
        )}>
          {charCount} / {card.writingMission.minChars}자 이상
          {isGoalMet && " ✓"}
        </div>
      </div>

      {/* 액션 버튼 */}
      <div className="flex gap-2 mt-3">
        <button
          onClick={handleCopy}
          disabled={!text.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
            text.trim()
              ? "bg-white border-border hover:bg-muted text-foreground active:scale-[0.97]"
              : "bg-muted border-border text-muted-foreground cursor-not-allowed"
          )}
        >
          {copied ? <Check className="w-4 h-4 text-green-600" /> : <Copy className="w-4 h-4" />}
          {copied ? "복사됨" : "클립보드 복사"}
        </button>
        <button
          onClick={handleReset}
          disabled={!text.trim()}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 border",
            text.trim()
              ? "bg-white border-border hover:bg-muted text-foreground active:scale-[0.97]"
              : "bg-muted border-border text-muted-foreground cursor-not-allowed"
          )}
        >
          <RotateCcw className="w-4 h-4" />
          다시 쓰기
        </button>
      </div>

      {isGoalMet && (
        <div className="mt-3 p-3 rounded-xl bg-green-50 border border-green-200 text-green-700 text-sm animate-float-in">
          🎉 목표 글자 수를 달성했습니다! 위의 클립보드 복사 버튼으로 선생님께 공유해 보세요.
        </div>
      )}
    </div>
  );
}

export default function TopicCardPage() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const card = topicCards.find((c) => c.id === id);

  if (!card) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <p className="text-muted-foreground">카드를 찾을 수 없습니다.</p>
          <button onClick={() => navigate("/")} className="text-sm underline" style={{ color: "oklch(0.49 0.15 64)" }}>
            홈으로 돌아가기
          </button>
        </div>
      </Layout>
    );
  }

  const { isCompleted, toggleCompleted, isBookmarked, toggleBookmark } = useProgressContext();
  const completed = isCompleted(card.id);
  const bookmarked = isBookmarked(card.id);

  const handleToggleCompleted = () => {
    toggleCompleted(card.id);
    if (!completed) {
      toast.success("학습 완료 체크! 홍백이 업데이트되었습니다.");
    } else {
      toast("완료 표시가 해제되었습니다.");
    }
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* 헤더 */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            목록으로
          </button>
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBookmark.bind(null, card.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-[0.97]",
                bookmarked
                  ? "text-white border-transparent"
                  : "bg-white border-border text-muted-foreground hover:bg-muted"
              )}
              style={bookmarked ? { backgroundColor: "oklch(0.49 0.15 64)", borderColor: "oklch(0.49 0.15 64)" } : {}}
            >
              <Bookmark className="w-4 h-4" style={{ fill: bookmarked ? "white" : "none" }} />
              {bookmarked ? "즐겨찾기" : "즐겨찾기"}
            </button>
            <button
              onClick={handleToggleCompleted}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-medium border transition-all duration-200 active:scale-[0.97]",
                completed
                  ? "text-white border-transparent"
                  : "bg-white border-border text-muted-foreground hover:bg-muted"
              )}
              style={completed ? { backgroundColor: "oklch(0.55 0.15 145)", borderColor: "oklch(0.55 0.15 145)" } : {}}
            >
              <CheckCircle2 className="w-4 h-4" />
              {completed ? "완료됨" : "완료 체크"}
            </button>
          </div>
        </div>

        {/* 카드 헤더 */}
        <div
          className="rounded-2xl p-6 text-white mb-6"
          style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150) 0%, oklch(0.46 0.11 150) 100%)" }}
        >
          <div className="flex flex-wrap gap-2 mb-4">
            <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", levelColors[card.level])}>
              {card.level}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
              {card.category}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white">
              {card.activity}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/20 text-white flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {card.duration}분
            </span>
          </div>

          <h1
            className="text-2xl lg:text-3xl font-bold mb-1"
            style={{ fontFamily: "'Lora', serif" }}
          >
            {card.titleKo}
          </h1>
          <p className="text-white/60 text-lg es-text">{card.titleEs}</p>

          <div className="flex flex-wrap gap-1.5 mt-4">
            {card.tags.map((tag) => (
              <span key={tag} className="text-xs text-white/60 bg-white/10 px-2 py-0.5 rounded">
                #{tag}
              </span>
            ))}
          </div>
        </div>

        {/* 탭 콘텐츠 */}
        <Tabs defaultValue="warmup">
          <TabsList className="w-full grid grid-cols-3 md:grid-cols-6 mb-6 h-auto gap-1 bg-muted p-1 rounded-xl">
            {[
              { value: "warmup", icon: "🌱", label: "워밍업" },
              { value: "deep", icon: "💬", label: "심화" },
              { value: "expressions", icon: "⚡", label: "표현" },
              { value: "dialogue", icon: "🗣️", label: "대화문" },
              { value: "grammar", icon: "📐", label: "문법" },
              { value: "writing", icon: "✏️", label: "쓰기" },
            ].map((tab) => (
              <TabsTrigger
                key={tab.value}
                value={tab.value}
                className="flex flex-col items-center gap-0.5 py-2 px-1 text-xs rounded-lg data-[state=active]:bg-white data-[state=active]:shadow-sm"
              >
                <span>{tab.icon}</span>
                <span>{tab.label}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          <TabsContent value="warmup"><WarmupSection card={card} /></TabsContent>
          <TabsContent value="deep"><DeepSection card={card} /></TabsContent>
          <TabsContent value="expressions"><ExpressionsSection card={card} /></TabsContent>
          <TabsContent value="dialogue"><DialogueSection card={card} /></TabsContent>
          <TabsContent value="grammar"><GrammarSection card={card} /></TabsContent>
          <TabsContent value="writing"><WritingSection card={card} /></TabsContent>
        </Tabs>

        {/* 교사용 메모 */}
        <div
          className="mt-6 rounded-xl p-4"
          style={{ backgroundColor: "oklch(0.40 0.16 150 / 0.05)", border: "1px dashed oklch(0.40 0.16 150 / 0.3)" }}
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold" style={{ color: "oklch(0.40 0.16 150)" }}>
              👩‍🏫 교사용 메모
            </span>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{card.teacherNote}</p>
        </div>
      </div>
    </Layout>
  );
}
