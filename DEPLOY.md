# 배포 가이드 (GitHub + Vercel)

수다이탈리아노를 GitHub에 올리고 Vercel로 배포하는 절차입니다.
이 프로젝트는 **서버가 필요 없는 정적 SPA**라서, 빌드 결과물(`dist/public`)만 정적 호스팅하면 됩니다.

---

## 0. 준비물

- Node.js 18 이상, [pnpm](https://pnpm.io/) (`npm install -g pnpm`)
- Git
- GitHub 계정
- Vercel 계정 (https://vercel.com — GitHub 계정으로 로그인 가능)

---

## 1. 로컬에서 빌드 확인

압축을 푼 폴더에서:

```bash
pnpm install
pnpm check     # 타입 체크 (오류 없어야 함)
pnpm build     # dist/public/ 생성되면 성공
pnpm dev       # http://localhost:3000 에서 미리보기 (선택)
```

여기까지 문제가 없으면 배포 준비 완료입니다.

---

## 2. Git 저장소 초기화 & 첫 커밋

```bash
git init
git add .
git commit -m "Initial commit: 수다이탈리아노"
```

> `.gitignore`에 `node_modules`와 `dist`가 이미 제외되어 있어, 소스코드만 커밋됩니다.

---

## 3. GitHub에 올리기

1. GitHub에서 **새 저장소(New repository)**를 만듭니다.
   - 이름 예: `suda-italiano`
   - **README/.gitignore/license는 추가하지 마세요** (이미 로컬에 있으므로 충돌 방지).
2. 만들면 나오는 저장소 주소를 복사해 아래에 넣습니다.

```bash
# HTTPS 방식 (USER, REPO를 본인 것으로 교체)
git remote add origin https://github.com/USER/REPO.git
git branch -M main
git push -u origin main
```

> 푸시할 때 비밀번호 대신 **Personal Access Token**을 요구할 수 있습니다.
> GitHub → Settings → Developer settings → Personal access tokens 에서 발급하세요.
> (SSH 키를 쓰는 경우 `git@github.com:USER/REPO.git` 주소를 사용)

---

## 4. Vercel로 배포

1. https://vercel.com 로그인 → **Add New… → Project**.
2. **Import Git Repository**에서 방금 올린 `suda-italiano` 저장소를 선택(Import).
3. 빌드 설정은 저장소의 `vercel.json`에서 자동 적용됩니다. 값이 비어 보이면 아래로 직접 채우세요:
   - **Framework Preset**: Other
   - **Build Command**: `pnpm build`
   - **Output Directory**: `dist/public`
   - **Install Command**: `pnpm install`
4. **Deploy** 클릭 → 1~2분 후 `https://<프로젝트명>.vercel.app` 주소가 발급됩니다.

> Vercel 대시보드 UI는 수시로 바뀝니다. 버튼 이름이 다르더라도
> "GitHub 저장소 import → 빌드 명령/출력 디렉터리 확인 → Deploy" 흐름은 동일합니다.

---

## 5. 이후 업데이트 (자동 배포)

한 번 연결해 두면, 그 다음부터는 GitHub에 푸시만 하면 Vercel이 자동으로 다시 배포합니다.

```bash
# 예: data.ts에 카드를 더 추가한 뒤
git add .
git commit -m "Add more topic cards"
git push
```

---

## 참고 사항

- **환경 변수 불필요**: 이 앱은 외부 API/서버 없이 동작합니다(학습 진도는 브라우저 localStorage에 저장). 별도 `.env` 설정이 필요 없습니다.
- **SPA 라우팅**: `vercel.json`의 `rewrites` 설정이 모든 경로를 `index.html`로 보내므로, `/topic/...` 같은 주소를 새로고침해도 404가 나지 않습니다.
- **커스텀 도메인**: Vercel 프로젝트 → Settings → Domains 에서 연결할 수 있습니다.
- **빌드 산출물(dist)·node_modules는 커밋하지 않습니다.** Vercel이 매 배포 때 `pnpm install` 후 `pnpm build`를 직접 실행합니다.
