# 수다에스파뇰 (Suda Español)

스페인어 프리토킹 학습을 위한 정적 웹 애플리케이션.
수다니혼고(suda-nihongo)의 구조를 기반으로 스페인어 학습용으로 포팅한 프로젝트입니다.

## 원본 대비 변경 사항

| 항목 | 수다니혼고 | 수다에스파뇰 |
|---|---|---|
| 레벨 체계 | JLPT (N5~N1) | CEFR (A1~C2, 6단계) |
| 타깃 언어 필드 | `titleJp`, `q.jp`, `promptJp` | `titleEs`, `q.es`, `promptEs` |
| `reading` 필드 | 후리가나 | 한글 발음 표기 |
| 카테고리 | 일본생활 | 스페인어권생활 |
| 폰트 | Noto Sans/Serif JP | Noto Sans KR + Lora |
| 카드 수 | 417개 | 221개 (확장 중, 목표 400개+) |

## 개발

```bash
pnpm install
pnpm dev      # 개발 서버
pnpm check    # 타입 체크
pnpm build    # 프로덕션 빌드 → dist/public/
```

## 콘텐츠 추가 방법

`client/src/lib/data.ts`의 `topicCards` 배열에 `TopicCard` 타입에 맞는 객체를 추가하면 됩니다.
카드 ID 규칙: `{카테고리코드}-{슬러그}` — daily- / relation- / school- / hispano- / culture- / trend- / media- / social- / imagine-

현재 카테고리별 카드 수: 일상수다 41, 스페인어권생활 40, 그 외 7개 카테고리(관계와감정·학교직장·문화비교·트렌드·미디어·사회이슈·상상토론) 각 20 (총 221개). 9개 카테고리가 모두 20장 이상으로 균형을 이룹니다. 레벨은 A1 41·A2 128·B1 44·B2 6·C1 2로 기초(A1·A2)가 약 76%입니다. 문법 페이지에는 학습 보조로 한국어↔스페인어 어순 원리 18개, 핵심 동사 현재형 활용표 12개, 핵심 동사 과거형(단순과거) 활용표 8개를 제공합니다. 목표는 원본처럼 400개+.

## 학습 보조 페이지

- **발음 가이드** (`/pronunciation`): 모음 5개, 한국인이 헷갈리는 자음(c·z·g·j·h·ñ·ll·rr·v 등), 이중자음(ch·ll·rr), 강세 규칙 3가지를 한글 발음·예시와 함께 정리한 초급자용 레퍼런스.
- **자동 한글 발음**: `client/src/lib/pronounce.ts`의 규칙 기반 변환기(`esToHangul`)가 카드 상세·랜덤 카드·대화실·문법 페이지의 워밍업·심화·대화문·예문 스페인어에 한글 발음을 실시간으로 붙여 줍니다. (근사치이며 c·z, ll 지역차는 미반영)
- **단어장(스페인어→한글 사전)**: `client/src/lib/glossary.ts`의 사전(약 3,274단어, 학습 콘텐츠 전체에서 추출)을 바탕으로, **대화·워밍업·심화·문법·표현** 각 섹션 하단에 "이 ○○의 단어" 목록(단어·발음·뜻)을 접기/펼치기로 보여 줍니다(`components/VocabList.tsx`, `getVocab`). 각 섹션의 스페인어 문장(대화 `text`, 질문 `es`, 표현·문법 `example`)에서 단어를 자동 추출하므로 새 콘텐츠에도 그대로 적용됩니다(사전에 없는 단어는 표시 생략 → 새 카드 추가 시 새 단어는 `glossary.ts`에 보강 필요).
- **문법 페이지** (`/grammar`): 기초 A1 문법 10개(규칙 현재형, 관사·성, 복수형, 주어대명사 생략, hay, tener 표현, ir a+동사원형, 의문사, ser/estar, gustar)를 포함해 총 14개 패턴. 레벨 필터 지원.

## 배포

GitHub 업로드 + Vercel 배포 절차는 `DEPLOY.md`를 참고하세요. `vercel.json`에 빌드 명령(`pnpm build`)과 출력 디렉터리(`dist/public`), SPA 라우팅 설정이 포함되어 있습니다.
