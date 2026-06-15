import { useState } from "react";
import { ChevronDown, ChevronRight, BookOpen } from "lucide-react";
import { getVocab } from "@/lib/glossary";

/** 주어진 이탈리아어 문장들에서 등장 단어를 모아 "단어" 목록을 접기/펼치기로 보여줍니다. */
export function VocabList({ texts, label = "이 대화의 단어" }: { texts: string[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const vocab = getVocab(texts);
  if (vocab.length === 0) return null;

  return (
    <div className="mt-4 border-t border-border pt-3">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 text-sm font-medium text-foreground/70 hover:text-foreground transition-colors"
      >
        {open ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
        <BookOpen className="w-4 h-4" style={{ color: "oklch(0.49 0.15 64)" }} />
        {label} {vocab.length}개
      </button>

      {open && (
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-2">
          {vocab.map((v, i) => (
            <div key={i} className="flex items-baseline gap-2 text-sm leading-snug">
              <span className="es-text font-semibold shrink-0" style={{ color: "oklch(0.49 0.15 64)" }}>
                {v.word}
              </span>
              <span className="text-xs text-muted-foreground shrink-0">{v.reading}</span>
              <span className="text-foreground/80">{v.meaning}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
