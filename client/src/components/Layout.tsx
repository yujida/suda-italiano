/*
 * 수다이탈리아노 레이아웃 컴포넌트
 * 에듀마가진 스타일: 딥 인디고 사이드바 + 오프화이트 메인 콘텐츠
 */
import { useState } from "react";
import { Link, useLocation } from "wouter";
import {
  Shuffle,
  MessageSquare,
  Zap,
  AlertCircle,
  Headphones,
  Trophy,
  Tv,
  GraduationCap,
  Volume2,
  Menu,
  X,
  ChevronRight,
  BarChart2,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/", icon: Shuffle, label: "오늘의 랜덤 수다", labelEs: "Chiacchiere a caso di oggi", badge: "HOT" },
  { href: "/dialogue", icon: MessageSquare, label: "진짜 이탈리아어 대화실", labelEs: "Conversazione vera" },
  { href: "/expressions", icon: Zap, label: "트렌드 단어장", labelEs: "Parole di tendenza" },
  { href: "/pronunciation", icon: Volume2, label: "발음 가이드", labelEs: "Guida alla pronuncia" },
  { href: "/grammar", icon: GraduationCap, label: "문법은 말하기 도구", labelEs: "Grammatica per parlare" },
  { href: "/error-fix", icon: AlertCircle, label: "어디가 어색하지?", labelEs: "Cosa suona strano?" },
  { href: "/progress", icon: BarChart2, label: "학습 진도 통계", labelEs: "I miei progressi" },
  { href: "#", icon: Headphones, label: "읽듣쓰기 훈련실", labelEs: "Allenamento completo" },
  { href: "#", icon: Trophy, label: "챌린지", labelEs: "Sfide" },
  { href: "#", icon: Tv, label: "이탈리아어 콘텐츠 추천관", labelEs: "Contenuti consigliati" },
];

interface LayoutProps {
  children: React.ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [location] = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      {/* 모바일 오버레이 */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* 사이드바 */}
      <aside
        className={cn(
          "fixed top-0 left-0 h-full w-64 z-50 flex flex-col transition-transform duration-300",
          "lg:translate-x-0 lg:static lg:z-auto",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}
        style={{ backgroundColor: "oklch(0.40 0.16 150)" }}
      >
        {/* 로고 */}
        <div className="p-6 border-b border-white/10">
          <Link href="/" onClick={() => setMobileOpen(false)}>
            <div className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-lg"
                style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
              >
                è
              </div>
              <div>
                <div className="text-white font-bold text-base leading-tight" style={{ fontFamily: "'Lora', serif" }}>
                  수다이탈리아노
                </div>
                <div className="text-white/50 text-xs">수다 × Italiano</div>
              </div>
            </div>
          </Link>
        </div>

        {/* 네비게이션 */}
        <nav className="flex-1 overflow-y-auto py-4 px-3">
          <div className="text-white/40 text-xs font-semibold uppercase tracking-wider px-3 mb-2">학습 메뉴</div>
          {navItems.map((item) => {
            const isActive = location === item.href;
            const isDisabled = item.href === "#";
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => !isDisabled && setMobileOpen(false)}
              >
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 transition-all duration-150 cursor-pointer group",
                    isActive
                      ? "nav-item-active text-white"
                      : "text-white/70 hover:text-white hover:bg-white/10",
                    isDisabled && "opacity-40 cursor-not-allowed"
                  )}
                >
                  <item.icon className="w-4 h-4 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{item.label}</div>
                    <div className="text-xs text-white/40 truncate" style={{ fontFamily: "'Noto Sans KR', sans-serif" }}>
                      {item.labelEs}
                    </div>
                  </div>
                  {item.badge && (
                    <span
                      className="text-xs px-1.5 py-0.5 rounded font-bold shrink-0"
                      style={{ backgroundColor: "oklch(0.49 0.15 64)", color: "white" }}
                    >
                      {item.badge}
                    </span>
                  )}
                  {isDisabled && (
                    <span className="text-xs text-white/30 shrink-0">준비중</span>
                  )}
                </div>
              </Link>
            );
          })}
        </nav>

        {/* 하단 정보 */}
        <div className="p-4 border-t border-white/10">
          <div className="text-white/40 text-xs text-center">
            수다이탈리아노 v0.1 · 2026.06
          </div>
        </div>
      </aside>

      {/* 메인 콘텐츠 */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* 모바일 헤더 */}
        <header
          className="lg:hidden flex items-center gap-4 px-4 py-3 border-b border-border sticky top-0 z-30 bg-background"
        >
          <button
            onClick={() => setMobileOpen(true)}
            className="p-2 rounded-lg hover:bg-muted transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-lg flex items-center justify-center text-white text-sm font-bold"
              style={{ backgroundColor: "oklch(0.49 0.15 64)" }}
            >
              è
            </div>
            <span className="font-bold text-sm">수다이탈리아노</span>
          </div>
        </header>

        {/* 페이지 콘텐츠 */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
