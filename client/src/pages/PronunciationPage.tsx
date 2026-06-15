/*
 * 수다이탈리아노 발음 가이드 페이지
 * 이탈리아어 발음 규칙을 초급자(A1)용으로 정리한 레퍼런스
 */
import { Volume2 } from "lucide-react";
import Layout from "@/components/Layout";

const BRAND = "oklch(0.40 0.16 150)";
const ACCENT = "oklch(0.49 0.15 64)";

const vowels = [
  { letter: "a", sound: "아", example: "casa", reading: "까사", meaning: "집" },
  { letter: "e", sound: "에", example: "bene", reading: "베네", meaning: "잘, 좋게" },
  { letter: "i", sound: "이", example: "vino", reading: "비노", meaning: "와인" },
  { letter: "o", sound: "오", example: "sole", reading: "솔레", meaning: "해" },
  { letter: "u", sound: "우", example: "luna", reading: "루나", meaning: "달" },
];

const consonants = [
  { letter: "c", rule: "a·o·u 앞 = ㄲ / e·i 앞 = ㅊ", example: "casa · cena", reading: "까사 · 체나" },
  { letter: "ch", rule: "e·i 앞에서도 ㄲ로 (거센 ㅋ보다 된소리에 가까움)", example: "chi · perché", reading: "끼 · 뻬르께" },
  { letter: "g", rule: "a·o·u 앞 = ㄱ / e·i 앞 = ㅈ", example: "gatto · gelato", reading: "가또 · 젤라또" },
  { letter: "gh", rule: "e·i 앞에서도 ㄱ로 유지", example: "spaghetti", reading: "스빠게띠" },
  { letter: "gn", rule: "'냐·뇨'처럼 부드러운 ㄴ 소리", example: "gnocchi · signore", reading: "뇨끼 · 시뇨레" },
  { letter: "gli", rule: "'리'처럼 부드럽게 굴리는 ㄹ", example: "famiglia · figlio", reading: "파밀리아 · 필리오" },
  { letter: "h", rule: "항상 묵음 (소리가 없음)", example: "ho · hotel", reading: "오 · 오텔" },
  { letter: "z", rule: "ㅉ 또는 ㅈ (ts/dz). 영어 z 아님", example: "pizza · zero", reading: "삐짜 · 쩨로" },
  { letter: "s", rule: "보통 ㅅ, 모음 사이에선 약한 ㅈ", example: "sole · casa", reading: "솔레 · 까사" },
  { letter: "sc", rule: "e·i 앞 = ㅅ(시/셰) / 그 외 = ㅅㄲ", example: "scena · scuola", reading: "셰나 · 스꾸올라" },
  { letter: "r", rule: "혀를 가볍게 굴리는 ㄹ", example: "Roma · caro", reading: "로마 · 카로" },
  { letter: "qu", rule: "ㄲ+w 모음 (꽈·꿰·뀌)", example: "quattro · qui", reading: "꽈뜨로 · 뀌" },
];

const digraphs = [
  { letter: "ch · gh", sound: "ㄲ · ㄱ", example: "chi · ghiaccio", reading: "끼 · 기아쪼", meaning: "누구 · 얼음" },
  { letter: "gn", sound: "ㄴ(냐뇨)", example: "gnocchi", reading: "뇨끼", meaning: "뇨키" },
  { letter: "gli", sound: "ㄹ(리)", example: "aglio", reading: "알리오", meaning: "마늘" },
  { letter: "sc(e·i)", sound: "ㅅ(시)", example: "pesce", reading: "페셰", meaning: "생선" },
];

const stressRules = [
  { rule: "대부분의 단어", detail: "끝에서 두 번째 음절에 강세 (가장 흔함)", example: "amore → a-MO-re · ragazzo → ra-GAZ-zo" },
  { rule: "악센트(à é ì ò ù)가 붙은 단어", detail: "그 모음에 강세 (주로 마지막 음절)", example: "città → cit-TÀ · perché → per-CHÉ" },
  { rule: "일부 단어", detail: "끝에서 세 번째 음절에 강세가 오기도 함", example: "musica → MU-si-ca · sabato → SA-ba-to" },
];

function LetterBadge({ text }: { text: string }) {
  return (
    <span
      className="inline-flex items-center justify-center min-w-10 h-10 px-2 rounded-xl text-white font-bold es-text shrink-0"
      style={{ backgroundColor: BRAND }}
    >
      {text}
    </span>
  );
}

export default function PronunciationPage() {
  return (
    <Layout>
      <div className="max-w-3xl mx-auto p-4 lg:p-6">
        {/* 헤더 */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: "oklch(0.94 0.05 150)" }}
          >
            <Volume2 className="w-5 h-5" style={{ color: BRAND }} />
          </div>
          <div>
            <h1 className="text-xl font-bold">발음 가이드</h1>
            <p className="text-sm text-muted-foreground">Guida alla pronuncia</p>
          </div>
        </div>

        {/* 핵심 원칙 */}
        <div
          className="rounded-2xl p-5 mb-6 text-white"
          style={{ background: "linear-gradient(135deg, oklch(0.40 0.16 150) 0%, oklch(0.46 0.11 150) 100%)" }}
        >
          <h2 className="font-bold mb-2">✨ 좋은 소식: 이탈리아어는 거의 읽는 대로 발음돼요</h2>
          <p className="text-sm text-white/80 leading-relaxed">
            영어와 달리 이탈리아어는 철자와 소리가 거의 일대일로 대응합니다. 아래 규칙만 익히면
            처음 보는 단어도 자신 있게 소리 내어 읽을 수 있어요. 포인트는 모든 모음을 또렷하게,
            그리고 끝모음까지 분명히 살려 읽는 것입니다.
          </p>
          <p className="text-xs text-white/60 mt-3">
            ※ 한글 발음은 어디까지나 근사치예요. z(ts/dz)나 이중자음(겹자음)의 길이는 한글로 정확히 옮기기 어렵습니다.
          </p>
        </div>

        {/* 모음 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-1">1. 모음 <span className="text-sm font-normal text-muted-foreground es-text">· Vocali</span></h2>
          <p className="text-sm text-muted-foreground mb-4">5개뿐이고, 어느 위치에서나 소리가 변하지 않아요.</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {vowels.map((v) => (
              <div key={v.letter} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-4 suda-card">
                <LetterBadge text={v.letter} />
                <div className="min-w-0">
                  <div className="font-bold text-lg" style={{ color: ACCENT }}>{v.sound}</div>
                  <div className="text-sm text-muted-foreground">
                    <span className="es-text font-medium text-foreground">{v.example}</span> {v.reading} · {v.meaning}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 주의할 자음 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-1">2. 주의할 자음 <span className="text-sm font-normal text-muted-foreground es-text">· Consonanti</span></h2>
          <p className="text-sm text-muted-foreground mb-4">한국인이 헷갈리기 쉬운 글자들만 모았어요. 나머지는 대체로 알파벳대로 읽으면 됩니다.</p>
          <div className="space-y-2">
            {consonants.map((c) => (
              <div key={c.letter} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-4 suda-card">
                <LetterBadge text={c.letter} />
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium leading-snug">{c.rule}</div>
                  <div className="text-sm text-muted-foreground mt-1">
                    <span className="es-text font-medium text-foreground">{c.example}</span>
                    <span className="ml-2">{c.reading}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 이중 자음 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-1">3. 두 글자가 한 소리 <span className="text-sm font-normal text-muted-foreground es-text">· Digrammi</span></h2>
          <p className="text-sm text-muted-foreground mb-4">ch·gh · gn · gl · sc 는 두 글자가 묶여 하나의 소리를 냅니다.</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {digraphs.map((d) => (
              <div key={d.letter} className="bg-white rounded-2xl border border-border p-4 text-center suda-card">
                <div className="es-text font-bold text-2xl mb-1" style={{ color: BRAND }}>{d.letter}</div>
                <div className="font-bold" style={{ color: ACCENT }}>{d.sound}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  <span className="es-text text-foreground">{d.example}</span> {d.reading}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 강세 규칙 */}
        <section className="mb-8">
          <h2 className="text-lg font-bold mb-1">4. 강세 규칙 <span className="text-sm font-normal text-muted-foreground es-text">· L'accento</span></h2>
          <p className="text-sm text-muted-foreground mb-4">어느 음절을 세게 읽을지는 단 3가지 규칙으로 정해집니다.</p>
          <div className="space-y-3">
            {stressRules.map((s, i) => (
              <div key={i} className="bg-white rounded-2xl border border-border p-4 flex items-start gap-4 suda-card">
                <span
                  className="inline-flex items-center justify-center w-7 h-7 rounded-full text-white text-sm font-bold shrink-0"
                  style={{ backgroundColor: ACCENT }}
                >
                  {i + 1}
                </span>
                <div className="min-w-0">
                  <div className="font-semibold text-sm">{s.rule}</div>
                  <div className="text-sm text-muted-foreground">{s.detail}</div>
                  <div className="text-sm es-text mt-1" style={{ color: BRAND }}>{s.example}</div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 마무리 팁 */}
        <div className="rounded-2xl p-5 border border-border bg-muted/30">
          <h2 className="font-bold mb-2">🎯 연습 팁</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            단어를 볼 때마다 (1) 모음을 또박또박 5개 소리로, (2) 위 자음 규칙을 적용하고, (3) 강세 위치를 찾아
            그 음절을 살짝 세게 읽어 보세요. 카드의 표현마다 붙어 있는 한글 발음과 함께 소리 내어 읽으면
            금방 익숙해집니다.
          </p>
        </div>
      </div>
    </Layout>
  );
}
