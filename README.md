# 🍚 오늘한끼 (TodayMeal)

> **AI 기반 역추산 식단 관리 플랫폼**  
> "찍자마자 삐링! 바로 다음 끼니 추천까지"

---

## 📱 서비스 소개

**오늘한끼**는 AI 이미지 인식 기술을 활용하여 사용자가 섭취한 음식을 자동으로 분석하고, **역추산 알고리즘**을 통해 남은 끼니에 무엇을 먹어야 하루 영양 목표를 달성할 수 있는지 실시간으로 추천하는 **스마트 식단 관리 서비스**입니다.

### 💡 핵심 가치

| 기존 서비스 | 오늘한끼 |
|-----------|---------|
| 수동 검색/입력 (평균 2-3분) | **사진 촬영 즉시 자동 인식 (3초)** |
| 과거 섭취 데이터 조회 | **미래 식사 선제적 추천** |
| "오늘 뭘 먹었지?" (회고형) | **"다음 끼니 뭐 먹지?" (계획형)** |
| 구매 연결 없음 | **근처 식당/편의점 메뉴 바로 연결** |

### 🎯 핵심 차별화

1. **역추산 알고리즘** - 저녁에 먹고 싶은 메뉴 선택 → 아침/점심 추천
2. **AI 즉시 인식** - Google Gemini Vision API (1.8초 인식)
3. **행동 연결** - 단순 경고 ❌ → 구체적 메뉴 + 구매처 ✅
4. **게이미피케이션** - 스트릭, XP, 리그, 스쿼드 챌린지

---

## 🚀 빠른 시작

```bash
# 의존성 설치
cd app
npm install

# 개발 서버 실행
npm run dev

# 빌드
npm run build
```

**접속 URL:**
- 📱 http://localhost:3000

---

## 🛠️ 기술 스택

| 영역 | 기술 |
|------|------|
| **Frontend** | Next.js 14, React, TypeScript, Tailwind CSS |
| **Animation** | Framer Motion |
| **State** | Zustand |
| **AI/ML** | Google Gemini 1.5 Flash (Vision API) |
| **Backend** | Supabase (Auth, DB, Storage) - 예정 |
| **Icons** | Lucide React |

---

## ✨ 주요 기능

### 📱 모바일 앱

| 기능 | 설명 | 상태 |
|------|------|------|
| 🍽️ 역추산 플래너 | 저녁 → 아침/점심 추천 | ✅ |
| 📸 AI 사진 인식 | Gemini Vision 영양 분석 | ✅ |
| 📊 영양 대시보드 | 원형 프로그레스 + 역추산 | ✅ |
| 🍚 한끼 마스코트 | 7가지 감정, 4단계 진화 | ✅ |
| ⭐ XP & 레벨 | 10단계 레벨 시스템 | ✅ |
| 🔥 스트릭 | 연속 기록, 프리즈, 마일스톤 | ✅ |
| 🎯 일일 퀘스트 | Easy + Challenge 미션 | ✅ |
| 🏆 주간 리그 | 브론즈~다이아몬드 5단계 | ✅ |
| 👥 스쿼드 | 친구와 함께 챌린지 | ✅ |

### 🖥️ PC 웹 전용

| 기능 | 설명 | 상태 |
|------|------|------|
| 📐 3컬럼 레이아웃 | 사이드바 + 메인 + 위젯 | ✅ |
| ⌨️ 키보드 단축키 | N, R, D, C, Q, L, P | ✅ |
| 📅 캘린더 뷰 | 월간 기록 시각화 | ✅ |
| 🍚 한끼 위젯 | 우측 플로팅 위젯 | ✅ |

---

## 📁 프로젝트 구조

```
app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx              # 메인 (반응형)
│   │   └── globals.css           # 글로벌 스타일
│   │
│   ├── components/               # React 컴포넌트
│   │   ├── pc/                   # PC 전용 (Sidebar, Dashboard 등)
│   │   ├── record/               # 식단 기록 플로우
│   │   ├── AnalysisLoading.tsx   # AI 분석 로딩 UI
│   │   ├── ConfidenceBadge.tsx   # 신뢰도 뱃지
│   │   ├── NutritionResult.tsx   # 분석 결과 카드
│   │   ├── HankiMascot.tsx       # 한끼 마스코트
│   │   ├── ReversePlanner.tsx    # 역추산 플래너
│   │   └── ...
│   │
│   ├── hooks/                    # React Hooks
│   │   └── useFoodAnalysis.ts    # AI 음식 분석 훅
│   │
│   ├── lib/                      # 라이브러리
│   │   └── gemini.ts             # Gemini API 클라이언트
│   │
│   ├── store/                    # Zustand 상태 관리
│   └── types/                    # TypeScript 타입
│       └── foodAnalysis.ts       # 음식 분석 타입
│
├── prompts/                      # AI 프롬프트 템플릿
│   └── pc_design_review_prompt.json
│
├── docs/                         # 문서
│   └── item_introduction_startup_package.md
│
└── README.md
```

---

## 🎯 목표 고객

**1차 타겟: 바쁜 20-30대 직장인 다이어터**

- 점심 외식 의존, 저녁 편의점/배달 위주
- 건강 관리하고 싶지만 시간/정보 부족
- 하루 1-2회 SNS 음식 사진 촬영

**확장 타겟:**
- 건강 관리 목적의 중장년층
- 운동 루틴이 있는 피트니스 유저
- 당뇨/고혈압 등 질환 관리 필요 고객

---

## 💰 비즈니스 모델

### 🆓 Free
- 일 3끼 식사 기록
- 기본 역추산 추천
- 주간 리포트

### 💎 Premium (월 4,900원)
- 무제한 기록
- 상세 영양소 분석
- AI 맞춤 식단 플랜
- 편의점/식당 실시간 추천

### 🏢 B2B
- 편의점/식품사 상품 노출 광고
- 구매 전환 수수료
- 기업 임직원 건강관리 솔루션

---

## 📅 개발 로드맵

| 단계 | 기간 | 주요 기능 |
|------|------|----------|
| **Phase 1** ✅ | 2026 Q1 | MVP, AI 분석, Mock 모드 |
| **Phase 2** | 2026 Q2 | Supabase 연동, 편의점 DB |
| **Phase 3** | 2026 Q3 | 프리미엄 출시, B2B 제휴 |
| **Phase 4** | 2026 Q4 | 사용자 10만 돌파 |

---

## 📄 관련 문서

- [📋 PRD v1.3 (모바일)](./PRD_TodayMeal_MVP_v1.3.md)
- [📋 PRD v2.0 (PC 웹)](./PRD_TodayMeal_MVP_v2.0_PC.md)
- [📊 서베이 기반 전략](./survey_based_strategy_v1.0.md)
- [📝 아이템 소개서](./docs/item_introduction_startup_package.md)

---

## ⌨️ 키보드 단축키 (PC)

| 키 | 동작 |
|----|------|
| `N` | 새 기록 추가 |
| `R` | 역추산 플래너 |
| `D` | 대시보드 |
| `H` | 홈 |
| `C` | 캘린더 |
| `/` | 음식 검색 |
| `?` | 단축키 도움말 |

---

## 🎨 디자인 시스템

### 컬러 팔레트 (Soft & Readable v3.1)
```css
primary-green: #4ADE80 ~ #34D399
secondary-orange: #F5B849
background: gradient(green-50 → white)
```

### 반응형 Breakpoints
```css
lg: 1024px+  → PC 3컬럼 레이아웃
md: 768px+   → 태블릿
sm: < 768px  → 모바일 (하단 탭)
```

---

## 📝 라이선스

Private - TodayMeal Team

---

> **"한 끼가 쌓여 당신의 건강이 됩니다"**  
> Made with 🍚 by TodayMeal Team
