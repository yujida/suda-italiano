/*
 * 수다이탈리아노 트렌드 단어장 페이지
 * 에듀마가진 스타일: 카드 그리드 + 상태 배지
 */
import { useState } from "react";
import { Search, Zap } from "lucide-react";
import Layout from "@/components/Layout";
import { trendExpressionsTyped as trendExpressions, type TrendExpression } from "@/lib/data";
import { cn } from "@/lib/utils";

const statusConfig: Record<TrendExpression["status"], { label: string; color: string; bg: string }> = {
  '현재사용가능': { label: '✅ 현재 사용 가능', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  '정착표현': { label: '🔵 정착 표현', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  '세대감있음': { label: '🟡 세대감 있음', color: 'text-amber-700', bg: 'bg-amber-50 border-amber-200' },
  '캐주얼': { label: '🟠 캐주얼', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' },
};

function ExpressionCard({ expr }: { expr: TrendExpression }) {
  const [flipped, setFlipped] = useState(false);
  const config = statusConfig[expr.status];

  return (
    <div
      className="card-flip-container h-48 cursor-pointer"
      onClick={() => setFlipped(!flipped)}
    >
      <div className={cn("card-flip-inner", flipped && "flipped")}>
        {/* 앞면 */}
        <div className="card-front bg-white rounded-2xl border border-border p-5 flex flex-col justify-between suda-card">
          <div>
            <div className={cn("inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full border mb-3", config.bg, config.color)}>
              {config.label}
            </div>
            <div className="text-3xl font-bold es-text mb-1" style={{ color: "oklch(0.40 0.16 150)" }}>
              {expr.word}
            </div>
            <div className="text-sm text-muted-foreground">{expr.reading}</div>
          </div>
          <div className="text-xs text-muted-foreground text-right">탭하여 뒤집기 →</div>
        </div>

        {/* 뒷면 */}
        <div
          className="card-back rounded-2xl p-5 flex flex-col justify-between"
          style={{ backgroundColor: "oklch(0.40 0.16 150)" }}
        >
          <div>
            <div className="text-white/60 text-xs mb-2">뜻</div>
            <p className="text-white font-semibold text-base mb-3">{expr.meaning}</p>
            <div className="bg-white/10 rounded-xl p-3">
              <p className="text-white/90 text-sm es-text">{expr.example}</p>
            </div>
          </div>
          {expr.caution && (
            <div className="bg-amber-500/20 rounded-lg px-3 py-2 mt-2">
              <p className="text-amber-200 text-xs">⚠️ {expr.caution}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function ExpressionsPage() {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("전체");

  const statuses = ["전체", "현재사용가능", "정착표현", "세대감있음", "캐주얼"];

  const filtered = trendExpressions.filter((expr) => {
    const matchSearch = search === "" ||
      expr.word.includes(search) ||
      expr.meaning.includes(search) ||
      expr.reading.includes(search);
    const matchStatus = filterStatus === "전체" || expr.status === filterStatus;
    return matchSearch && matchStatus;
  });

  return (
    <Layout>
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* 헤더 */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ backgroundColor: "oklch(0.49 0.15 64 / 0.15)" }}
            >
              <Zap className="w-5 h-5" style={{ color: "oklch(0.49 0.15 64)" }} />
            </div>
            <div>
              <h1 className="text-xl font-bold">트렌드 단어장</h1>
              <p className="text-sm text-muted-foreground" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                Vocabulario de moda
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            요즘 이탈리아어권에서 실제로 쓰이는 표현들입니다. 카드를 탭하면 뜻과 예문을 확인할 수 있어요.
          </p>
        </div>

        {/* 검색 & 필터 */}
        <div className="bg-white rounded-2xl border border-border p-4 mb-6">
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="표현 검색... (예: guay, 덕후)"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-border text-sm focus:outline-none focus:ring-2"
              style={{ "--tw-ring-color": "oklch(0.40 0.16 150 / 0.3)" } as React.CSSProperties}
            />
          </div>
          <div className="flex flex-wrap gap-2">
            {statuses.map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-150",
                  filterStatus === s
                    ? "text-white"
                    : "bg-muted text-muted-foreground hover:bg-secondary"
                )}
                style={filterStatus === s ? { backgroundColor: "oklch(0.40 0.16 150)" } : {}}
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* 상태 가이드 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-6">
          {Object.entries(statusConfig).map(([key, val]) => (
            <div key={key} className={cn("rounded-xl p-3 border text-xs", val.bg)}>
              <div className={cn("font-semibold mb-0.5", val.color)}>{val.label}</div>
              <div className="text-muted-foreground">
                {key === '현재사용가능' && '지금 써도 자연스러움'}
                {key === '정착표현' && '이미 일반화된 표현'}
                {key === '세대감있음' && '젊은 세대 주로 사용'}
                {key === '캐주얼' && '친한 사이에서만'}
              </div>
            </div>
          ))}
        </div>

        {/* 카드 그리드 */}
        <div className="text-sm text-muted-foreground mb-3">{filtered.length}개 표현</div>
        {filtered.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
            <p className="text-4xl mb-3">🔍</p>
            <p>검색 결과가 없습니다.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((expr, i) => (
              <div key={`${expr.word}-${i}`} className={cn("animate-float-in", `stagger-${Math.min(i + 1, 5)}`)}>
                <ExpressionCard expr={expr} />
              </div>
            ))}
          </div>
        )}

        {/* 사용 팁 */}
        <div
          className="mt-8 rounded-2xl p-5"
          style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150 / 0.06) 0%, oklch(0.49 0.15 64 / 0.06) 100%)", border: "1px solid oklch(0.40 0.16 150 / 0.1)" }}
        >
          <h3 className="font-semibold mb-3">💡 트렌드 표현 사용 팁</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
            <div>
              <strong className="text-foreground">뜻보다 "지금 써도 되는가"가 중요</strong>
              <p>각 표현의 상태 배지를 확인하고, 상황에 맞게 사용하세요.</p>
            </div>
            <div>
              <strong className="text-foreground">세대감 있는 표현 주의</strong>
              <p>젊은 세대 표현은 중장년층에게 어색하게 들릴 수 있습니다.</p>
            </div>
            <div>
              <strong className="text-foreground">캐주얼 표현은 친한 사이에서만</strong>
              <p>선생님, 직장 상사에게는 정중한 표현을 사용하세요.</p>
            </div>
            <div>
              <strong className="text-foreground">SNS vs 실제 대화</strong>
              <p>일부 표현은 SNS에서만 쓰이고 실제 대화에서는 어색할 수 있습니다.</p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
