# 수다이탈리아노 (Suda Italiano)

이탈리아어 프리토킹 학습을 위한 정적 웹 애플리케이션입니다. 오늘의 주제 카드, 대화문, 발음 가이드, 문법 도구, 단어장, 학습 진도 기능을 제공합니다.

수다니혼고/수다에스파뇰 계열 구조를 기반으로 이탈리아어 학습용으로 포팅한 프로젝트입니다.

## 주요 특징

- **CEFR 레벨**: A1~C2 기반 난이도 구성
- **주제 카드**: 일상수다, 이탈리아 생활, 관계와 감정, 학교·직장, 문화비교, 트렌드, 미디어, 사회이슈, 상상토론 등
- **발음 가이드** (`/pronunciation`): 이탈리아어 철자·발음 규칙을 한국어 학습자 기준으로 정리
- **자동 한글 발음**: `client/src/lib/pronounce.ts`의 규칙 기반 변환기가 이탈리아어 문장에 한글 발음 근사치를 붙임
- **단어장**: `client/src/lib/glossary.ts` 기반 이탈리아어→한국어 단어 목록
- **문법 페이지** (`/grammar`): 말하기에 바로 쓰는 기초 문법과 동사 활용표
- **대화실** (`/dialogue`): 실제 말투에 가까운 이탈리아어 대화문 학습
- **진도 통계** (`/progress`): 브라우저 localStorage 기반 학습 기록

## 개발

```bash
pnpm install
pnpm dev      # 개발 서버
pnpm check    # 타입 체크
pnpm build    # 프로덕션 빌드 → dist/public/
```

## 콘텐츠 추가 방법

`client/src/lib/data.ts`의 `topicCards` 배열에 `TopicCard` 타입에 맞는 객체를 추가하면 됩니다.

카드 ID 규칙 예:

```text
{카테고리코드}-{슬러그}
```

예: `daily-...`, `relation-...`, `school-...`, `italy-...`, `culture-...`, `trend-...`, `media-...`, `social-...`, `imagine-...`

새 이탈리아어 단어를 단어장에 노출하려면 `client/src/lib/glossary.ts`에도 뜻을 보강하세요.

## 배포

GitHub 업로드 + Vercel 배포 절차는 `DEPLOY.md`를 참고하세요. `vercel.json`에 빌드 명령(`pnpm build`)과 출력 디렉터리(`dist/public`), SPA 라우팅 설정이 포함되어 있습니다.
