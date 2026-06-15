/*
 * 수다이탈리아노 진짜 이탈리아어 대화실 페이지
 * 에듀마가진 스타일: 대화문 + 분석 패널
 */
import { useState, useRef } from "react";
import { MessageSquare, Eye, EyeOff, ChevronDown, ChevronUp } from "lucide-react";
import Layout from "@/components/Layout";
import { topicCards } from "@/lib/data";
import { esToHangul } from "@/lib/pronounce";
import { VocabList } from "@/components/VocabList";
import { cn } from "@/lib/utils";

export default function DialoguePage() {
  const [selectedCardId, setSelectedCardId] = useState(topicCards[0].id);
  const [showTranslation, setShowTranslation] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState<number | null>(null);

  const dialogueRef = useRef<HTMLDivElement>(null);

  const selectCard = (id: string) => {
    setSelectedCardId(id);
    setShowAnalysis(null);
    // 주제를 고르면 바로 대화문이 보이도록 스크롤 이동
    requestAnimationFrame(() =>
      dialogueRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
    );
  };

  const card = topicCards.find((c) => c.id === selectedCardId) || topicCards[0];

  // 대화문 분석 데이터 (각 줄의 핵심 포인트)
  const analysisPoints: Record<number, string> = {
    0: "Allora...: 말을 시작하거나 화제를 여는 필러. '자,', '그러면…'에 가까움.",
    1: "Vero? / No?: 문장 끝에 붙여 동의를 구하는 추임새. '그치?'에 해당.",
    2: "Che + 형용사!: 감탄·리액션 표현. Che bello!, Che buono! 처럼 사용.",
    3: "Dai!: 재촉이나 격려를 나타내는 만능 구어 표현. '자 어서!', '에이~'.",
    4: "축소형(-ino/-ina): 친근함이나 완곡함을 더하는 어미. un attimino, un pochino.",
    5: "Magari...: '그러면 좋겠다' 또는 '어쩌면'. 바람·가정을 부드럽게 나타냄.",
  };

  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.40 0.16 150 / 0.1)" }}
            >
              <MessageSquare className="w-5 h-5" style={{ color: "oklch(0.40 0.16 150)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">진짜 이탈리아어 대화실</h1>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                Conversazione vera in italiano
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            교과서 이탈리아어가 아닌, 실제로 쓰이는 말투의 대화문입니다.
            각 줄을 탭하면 표현 분석을 볼 수 있습니다.
          </p>
        </div>

        {/* 주제 선택 */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-6">
          <div className="text-sm font-medium text-muted-foreground mb-3">대화 주제 선택</div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-72 overflow-y-auto pr-1">
            {topicCards.map((c) => (
              <button
                key={c.id}
                onClick={() => selectCard(c.id)}
                className={cn(
                  "flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150",
                  selectedCardId === c.id
                    ? "text-white"
                    : "bg-muted hover:bg-secondary text-foreground"
                )}
                style={selectedCardId === c.id ? { backgroundColor: "oklch(0.40 0.16 150)" } : {}}
              >
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{c.titleKo}</div>
                  <div className={cn("text-xs truncate", selectedCardId === c.id ? "text-white/60" : "text-muted-foreground")}
                    style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                    {c.titleEs}
                  </div>
                </div>
                <span className={cn(
                  "text-xs font-bold px-2 py-0.5 rounded-full shrink-0",
                  selectedCardId === c.id ? "bg-white/20 text-white" : "bg-background text-muted-foreground"
                )}>
                  {c.level}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* 대화문 */}
        <div ref={dialogueRef} className="bg-white rounded-2xl border border-border p-5 mb-4 scroll-mt-6">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-base">{card.titleKo}</h2>
              <p className="text-sm text-muted-foreground es-text">{card.titleEs}</p>
            </div>
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
              <div key={i}>
                <div
                  className={cn(
                    "flex gap-3 cursor-pointer",
                    line.speaker === 'B' && "flex-row-reverse"
                  )}
                  onClick={() => setShowAnalysis(showAnalysis === i ? null : i)}
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
                  <div className={cn("max-w-[75%]", line.speaker === 'B' && "items-end flex flex-col")}>
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl transition-all duration-150",
                        showAnalysis === i ? "ring-2" : "",
                        line.speaker === 'A' ? "speech-bubble-a" : "speech-bubble-b"
                      )}
                      style={showAnalysis === i ? { "--tw-ring-color": "oklch(0.49 0.15 64)" } as React.CSSProperties : {}}
                    >
                      <p className="text-sm es-text leading-relaxed">{line.text}</p>
                      <p className="text-[11px] text-white/70 mt-0.5">{esToHangul(line.text)}</p>
                    </div>
                    {showTranslation && (
                      <p className={cn(
                        "text-xs text-muted-foreground mt-1",
                        line.speaker === 'B' && "text-right"
                      )}>
                        {line.translation}
                      </p>
                    )}
                  </div>
                </div>

                {/* 분석 패널 */}
                {showAnalysis === i && analysisPoints[i] && (
                  <div
                    className="mt-2 ml-11 animate-float-in rounded-xl p-3 text-sm"
                    style={{ backgroundColor: "oklch(0.49 0.15 64 / 0.08)", border: "1px solid oklch(0.49 0.15 64 / 0.2)" }}
                  >
                    <span className="font-semibold" style={{ color: "oklch(0.45 0.12 35)" }}>💡 표현 분석: </span>
                    <span className="text-foreground/80">{analysisPoints[i]}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
          <VocabList texts={card.dialogue.map((l) => l.text)} label="이 대화의 단어" />
        </div>

        <div className="text-xs text-muted-foreground text-center mb-6">
          💬 대화문의 각 줄을 탭하면 표현 분석을 볼 수 있습니다
        </div>

        {/* 대화 스타일 가이드 */}
        <div
          className="rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150) 0%, oklch(0.46 0.11 150) 100%)" }}
        >
          <h3 className="font-bold text-white mb-4">🗣️ 실제 이탈리아어 말투 특징</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              { feature: "Vero? / No?", desc: "문장 끝에 붙여 동의를 구하는 추임새. 한국어의 '그치?', '알지?'에 해당. 회화에서 매우 빈번." },
              { feature: "Allora...", desc: "말을 열거나 화제를 전환하는 필러. '자,', '그러면…'. 일상 회화의 윤활유." },
              { feature: "Dai!", desc: "'자 어서!', '에이~' 같은 재촉·격려 표현. 친근한 대화에서 아주 자주 쓰임." },
              { feature: "tipo (필러)", desc: "'~같은', '약간'처럼 끼워 넣는 젊은 층 구어 필러. 영어 like와 비슷한 용법." },
            ].map(({ feature, desc }) => (
              <div key={feature} className="bg-white/10 rounded-xl p-3">
                <div className="text-white font-semibold text-sm es-text mb-1">{feature}</div>
                <div className="text-white/60 text-xs">{desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
}
