/*
 * 이탈리아어 → 한글 발음 근사 변환기
 * 학습 보조용 근사치입니다. 이탈리아어 철자는 규칙적이라 비교적 정확하지만,
 * 이중자음(gemination)·z(ts/dz)·gl/gn 같은 구개음은 한글로 완벽히 옮기기 어려워 근사합니다.
 */

const CHO = ['ㄱ','ㄲ','ㄴ','ㄷ','ㄸ','ㄹ','ㅁ','ㅂ','ㅃ','ㅅ','ㅆ','ㅇ','ㅈ','ㅉ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];
const JUNG = ['ㅏ','ㅐ','ㅑ','ㅒ','ㅓ','ㅔ','ㅕ','ㅖ','ㅗ','ㅘ','ㅙ','ㅚ','ㅛ','ㅜ','ㅝ','ㅞ','ㅟ','ㅠ','ㅡ','ㅢ','ㅣ'];
const JONG = ['','ㄱ','ㄲ','ㄳ','ㄴ','ㄵ','ㄶ','ㄷ','ㄹ','ㄺ','ㄻ','ㄼ','ㄽ','ㄾ','ㄿ','ㅀ','ㅁ','ㅂ','ㅄ','ㅅ','ㅆ','ㅇ','ㅈ','ㅊ','ㅋ','ㅌ','ㅍ','ㅎ'];

const vowelJung: Record<string, string> = { a: 'ㅏ', e: 'ㅔ', i: 'ㅣ', o: 'ㅗ', u: 'ㅜ' };
const vowelIot: Record<string, string> = { a: 'ㅑ', e: 'ㅖ', i: 'ㅣ', o: 'ㅛ', u: 'ㅠ' };
const stripMap: Record<string, string> = { 'à':'a','è':'e','é':'e','ì':'i','í':'i','ò':'o','ó':'o','ù':'u','ú':'u' };
// 소리 기준 자모.
// 이탈리아어 무성 파열음 p·t·k(c·q)와 파찰음 z([ts])·부드러운 c([tʃ])는 '무기음'이라
// 한국어 된소리(ㅃ·ㄸ·ㄲ·ㅉ)가 실제 발음에 가장 가깝다(거센소리 ㅍ·ㅌ·ㅋ는 기식이 과함).
// 유성음 b·d·g와 부드러운 g([dʒ]=j)는 평음(ㅂ·ㄷ·ㄱ·ㅈ) 유지.
const consJamo: Record<string, string> = { b:'ㅂ', c:'ㄲ', d:'ㄷ', f:'ㅍ', g:'ㄱ', k:'ㄲ', l:'ㄹ', m:'ㅁ', n:'ㄴ', p:'ㅃ', q:'ㄲ', r:'ㄹ', s:'ㅅ', t:'ㄸ', v:'ㅂ', w:'ㅂ', z:'ㅉ', ch:'ㅉ', j:'ㅈ' };
const codaCons: Record<string, string> = { n:'ㄴ', m:'ㅁ', l:'ㄹ' };
// 이중자음(gemination)은 앞 음절 받침으로 표현해 '길게 막는' 실제 발음을 근사한다.
// pp/bb→ㅂ, tt/dd/ss/zz→ㅅ, cc/gg(경음)→ㄱ, cc/gg(연음 ce·ci)→ㅅ, ll→ㄹ, mm→ㅁ, nn→ㄴ.
// f·v·r 겹자음은 한글 받침으로 옮기면 부자연스러워(예: caffè) 단순화 유지.
const gemCoda: Record<string, string> = { p:'ㅂ', b:'ㅂ', t:'ㅅ', d:'ㅅ', s:'ㅅ', z:'ㅅ', l:'ㄹ', m:'ㅁ', n:'ㄴ' };

const isVowel = (c: string) => 'aeiou'.includes(c);

function compose(onset: string, vowel: string, coda: string): string {
  const ci = CHO.indexOf(onset === '' ? 'ㅇ' : onset);
  const vi = JUNG.indexOf(vowel);
  const ki = coda ? JONG.indexOf(coda) : 0;
  if (ci < 0 || vi < 0 || ki < 0) return '';
  return String.fromCharCode(0xac00 + (ci * 21 + vi) * 28 + ki);
}

type Token = { k: 'V'; v: string; iot: boolean } | { k: 'C'; c: string } | { k: 'CD'; j: string } | { k: 'X' };

function tokenize(word: string): string[] | Token[] {
  let s = word.toLowerCase().split('').map((c) => stripMap[c] || c).join('');
  s = s.replace(/cq/g, 'cc'); // acqua [akkwa] → cc(경음 ㄱ받침)로 처리
  s = s.replace(/([fvr])\1+/g, '$1'); // f·v·r 겹자음은 한글 받침이 부자연 → 단순화(caffè→까페, carro→카로)
  const t: Token[] = [];
  let i = 0;
  while (i < s.length) {
    const c = s[i], n = s[i + 1], n2 = s[i + 2];
    if (isVowel(c)) { t.push({ k: 'V', v: c, iot: false }); i++; continue; }
    // 단순 이중자음(장음화): 앞 음절에 받침을 더하고 한 글자만 소비 (c·g는 연/경음 구분 위해 아래 분기에서 처리)
    if (c === n && gemCoda[c]) { t.push({ k: 'CD', j: gemCoda[c] }); i++; continue; }
    switch (c) {
      case 'c':
        if (n === 'c') { const a = s[i + 2]; t.push({ k: 'CD', j: (a === 'e' || a === 'i') ? 'ㅅ' : 'ㄱ' }); i++; break; } // cc 장음화(연음 ㅅ/경음 ㄱ)
        if (n === 'h') { t.push({ k: 'C', c: 'k' }); i += 2; }          // ch → 경음 k (che/chi)
        else if (n === 'i' && isVowel(n2)) { t.push({ k: 'C', c: 'ch' }); i += 2; } // cia/cio/ciu → ㅊ+모음(i 묵음)
        else if (n === 'e' || n === 'i') { t.push({ k: 'C', c: 'ch' }); i++; }       // ce/ci → ㅊ
        else { t.push({ k: 'C', c: 'c' }); i++; }                        // 그 외 → 경음 k
        break;
      case 'g':
        if (n === 'g') { const a = s[i + 2]; t.push({ k: 'CD', j: (a === 'e' || a === 'i') ? 'ㅅ' : 'ㄱ' }); i++; break; } // gg 장음화(연음 ㅅ/경음 ㄱ)
        if (n === 'h') { t.push({ k: 'C', c: 'g' }); i += 2; }           // gh → 경음 g
        else if (n === 'l' && n2 === 'i') { t.push({ k: 'C', c: 'l' }); i += 2; } // gli → 구개 ʎ ≈ ㄹ(+이)
        else if (n === 'n' && isVowel(n2)) { t.push({ k: 'C', c: 'n' }); t.push({ k: 'V', v: n2, iot: true }); i += 3; } // gn+모음 → ɲ ≈ 냐/뇨
        else if (n === 'n') { t.push({ k: 'C', c: 'n' }); i += 2; }
        else if (n === 'i' && isVowel(n2)) { t.push({ k: 'C', c: 'j' }); i += 2; }  // gia/gio/giu → ㅈ+모음(i 묵음)
        else if (n === 'e' || n === 'i') { t.push({ k: 'C', c: 'j' }); i++; }       // ge/gi → ㅈ
        else { t.push({ k: 'C', c: 'g' }); i++; }                        // 그 외 → 경음 g
        break;
      case 's':
        if (n === 'c' && n2 === 'h') { t.push({ k: 'C', c: 's' }); t.push({ k: 'C', c: 'k' }); i += 3; } // sch → s+k
        else if (n === 'c' && s[i + 2] === 'i' && isVowel(s[i + 3])) { t.push({ k: 'C', c: 's' }); i += 3; t.push({ k: 'V', v: s[i], iot: true }); i++; } // scia/scio → ʃ+모음
        else if (n === 'c' && (s[i + 2] === 'e' || s[i + 2] === 'i')) { t.push({ k: 'C', c: 's' }); i += 2; } // sce/sci → ʃ ≈ ㅅ(시/세)
        else { t.push({ k: 'C', c: 's' }); i++; }
        break;
      case 'h': i++; break;                                             // 항상 묵음
      case 'q':
        t.push({ k: 'C', c: 'q' }); i++;                                // qu+모음: u를 일반 모음으로 (qua→쿠아)
        break;
      case 'x': t.push({ k: 'X' }); i++; break;
      case 'y': if (isVowel(n)) { t.push({ k: 'V', v: n, iot: true }); i += 2; } else { t.push({ k: 'V', v: 'i', iot: false }); i++; } break;
      default:
        if (consJamo[c] !== undefined) { t.push({ k: 'C', c }); }
        i++;
    }
  }
  return t;
}

function assemble(tokens: Token[]): string {
  const out: { onset: string; vowel: string; coda: string }[] = [];
  let i = 0;
  while (i < tokens.length) {
    let tk = tokens[i];
    if (tk.k === 'CD') {
      if (out.length && out[out.length - 1].coda === '') out[out.length - 1].coda = tk.j;
      i++; continue;
    }
    if (tk.k === 'X') {
      if (out.length && out[out.length - 1].coda === '') out[out.length - 1].coda = 'ㄱ';
      tokens.splice(i, 1, { k: 'C', c: 's' });
      tk = tokens[i];
    }
    let onset = '', vowel = '', coda = '';
    if (tk.k === 'V') {
      onset = ''; vowel = tk.iot ? vowelIot[tk.v] : vowelJung[tk.v]; i++;
    } else if (tk.k === 'C') {
      onset = consJamo[tk.c]; i++;
      const nx = tokens[i];
      if (nx && nx.k === 'V') {
        if (tk.c === 'l' && out.length && out[out.length - 1].coda === '') out[out.length - 1].coda = 'ㄹ';
        vowel = nx.iot ? vowelIot[nx.v] : vowelJung[nx.v]; i++;
      } else {
        vowel = 'ㅡ';
      }
    } else { i++; continue; }
    const nx = tokens[i];
    if (coda === '' && nx && nx.k === 'C') {
      const after = tokens[i + 1];
      const beforeVowel = after && after.k === 'V';
      if (!beforeVowel && codaCons[nx.c]) { coda = codaCons[nx.c]; i++; }
    }
    out.push({ onset, vowel, coda });
  }
  return out.map((s) => compose(s.onset, s.vowel, s.coda)).join('');
}

function toHangul(w: string): string {
  return assemble(tokenize(w) as Token[]);
}

/** 이탈리아어 문장을 한글 발음 근사치로 변환합니다. 구두점·공백은 보존됩니다. */
export function itToHangul(text: string): string {
  if (!text) return '';
  return text.replace(/[A-Za-zÀàÈèÉéÌìÍíÒòÓóÙùÚú]+/g, (m) => toHangul(m));
}

/** 기존 코드 호환용 별칭 */
export const esToHangul = itToHangul;
