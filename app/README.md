# 🍚 오늘한끼 (TodayMeal)
## MVP v2.0 - PC Web + Mobile Responsive

> **"오늘 저녁 뭐 먹지? 그럼 아침엔 이거!"**
> 
> 트레이너와 회원을 연결하는 AI 기반 개인화 식단 관리 플랫폼

---

## 📱 프로젝트 개요

TodayMeal은 PT 회원들이 **먹고 싶은 것을 포기하지 않으면서** 건강한 식단 목표를 달성할 수 있도록 돕는 앱입니다. 듀오링고 수준의 **게이미피케이션**과 **심리학 기반 UX**를 통해 사용자 리텐션을 극대화합니다.

### 🎯 핵심 차별화
- **역추산 플래너**: 저녁에 먹고 싶은 메뉴를 선택하면, 하루 목표를 맞추기 위한 아침/점심 메뉴 추천
- **한끼 마스코트**: 감정을 표현하는 밥공기 캐릭터로 정서적 유대 형성
- **4중 리텐션 구조**: 역추산(자율성) + 한끼(정서) + 스트릭/XP(게이미피케이션) + 리그(소셜)

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
- **회원 앱**: http://localhost:3000
- **트레이너 웹**: http://localhost:3000/trainer

---

## 📁 프로젝트 구조

```
app/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── page.tsx             # 메인 (반응형)
│   │   ├── trainer/page.tsx     # 트레이너 대시보드
│   │   ├── layout.tsx           # 루트 레이아웃
│   │   └── globals.css          # 글로벌 스타일
│   │
│   ├── components/              # React 컴포넌트
│   │   ├── pc/                  # PC 전용 컴포넌트
│   │   │   ├── Sidebar.tsx      # 좌측 사이드바
│   │   │   ├── Header.tsx       # 상단 헤더
│   │   │   ├── HankiWidget.tsx  # 한끼 플로팅 위젯
│   │   │   ├── Dashboard.tsx    # PC 대시보드
│   │   │   ├── CalendarView.tsx # 캘린더 뷰
│   │   │   └── ReversePlanner.tsx # 3컬럼 역추산
│   │   │
│   │   ├── HankiMascot.tsx      # 한끼 마스코트
│   │   ├── ReversePlanner.tsx   # 역추산 (모바일)
│   │   ├── HomePage.tsx         # 홈 화면
│   │   ├── RecordPage.tsx       # 식단 기록
│   │   ├── LeaguePage.tsx       # 리그 시스템
│   │   ├── ProfilePage.tsx      # 프로필
│   │   ├── DailyQuests.tsx      # 일일 퀘스트
│   │   ├── ResponsiveApp.tsx    # 반응형 앱 래퍼
│   │   └── ...
│   │
│   ├── hooks/                   # React Hooks
│   │   └── useKeyboardShortcuts.ts
│   │
│   ├── store/                   # Zustand 상태 관리
│   │   └── index.ts
│   │
│   └── types/                   # TypeScript 타입
│       └── index.ts
│
├── tailwind.config.ts           # Tailwind 설정
└── README.md
```

---

## ✨ 주요 기능

### 📱 모바일 앱

| 기능 | 설명 | 상태 |
|------|------|------|
| 🍽️ 역추산 플래너 | 저녁 → 아침/점심 추천 | ✅ |
| 📸 사진 기록 | AI 영양소 분석 | ✅ |
| 📊 영양 대시보드 | 원형 프로그레스 | ✅ |
| 🍚 한끼 마스코트 | 7가지 감정, 4단계 진화 | ✅ |
| ⭐ XP & 레벨 | 10단계 레벨 시스템 | ✅ |
| 🔥 스트릭 | 프리즈, 마일스톤 | ✅ |
| 🎯 일일 퀘스트 | Easy + Challenge | ✅ |
| 🏆 주간 리그 | 브론즈~다이아몬드 | ✅ |

### 🖥️ PC 웹 전용

| 기능 | 설명 | 상태 |
|------|------|------|
| 📐 3컬럼 레이아웃 | 사이드바 + 헤더 + 콘텐츠 | ✅ |
| ⌨️ 키보드 단축키 | N, R, D, C, Q, L, P | ✅ |
| 📅 캘린더 뷰 | 월간 기록 시각화 | ✅ |
| 📈 주간 트렌드 | 칼로리 차트 | ✅ |
| 🍚 한끼 위젯 | 우측 하단 플로팅 | ✅ |
| 🔍 검색 (/) | 빠른 음식 검색 | ✅ |
| 🖱️ 드래그 앤 드롭 | 사진 업로드 | ✅ |

### 👨‍🏫 트레이너 웹

| 기능 | 설명 | 상태 |
|------|------|------|
| 📋 회원 목록 | 전체 현황 | ✅ |
| ⚠️ 위험 알림 | 3일+ 미기록 | ✅ |
| 📊 통계 대시보드 | 기록률, 스트릭 | ✅ |
| 💬 간편 피드백 | 템플릿 + 커스텀 | ✅ |

---

## ⌨️ 키보드 단축키 (PC)

| 키 | 동작 |
|----|------|
| `N` | 새 기록 추가 |
| `R` | 역추산 플래너 |
| `D` | 대시보드 |
| `H` | 홈 |
| `C` | 캘린더 |
| `Q` | 퀘스트 |
| `L` | 리그 |
| `P` | 프로필 |
| `/` | 음식 검색 |
| `?` | 단축키 도움말 |
| `↑ ↓` | 메뉴 선택 |
| `Ctrl+V` | 이미지 붙여넣기 |

---

## 🎨 디자인 시스템

### 브랜드 컬러
```css
primary: #FF9500 (오렌지)
secondary: #22C55E (그린)
```

### 반응형 Breakpoints
```css
lg: 1024px+  → PC 레이아웃 (사이드바)
md: 768px+   → 태블릿 (2컬럼)
sm: < 768px  → 모바일 (하단 탭)
```

---

## 🛠️ 기술 스택

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **State**: Zustand
- **Icons**: Lucide React

---

## 📄 관련 문서

- [PRD 문서 v1.3 (모바일)](./PRD_TodayMeal_MVP_v1.3.md)
- [PRD 문서 v2.0 (PC 웹)](./PRD_TodayMeal_MVP_v2.0_PC.md)
- [PRD JSON](./PRD_TodayMeal_MVP_v1.3.json)

---

## 📱 스크린샷

### 모바일 홈 화면
- 한끼 인사 + 영양 대시보드 + 일일 퀘스트

### PC 대시보드
- 3컬럼: 사이드바 | 대형 영양 원형 + 주간 트렌드 + 퀘스트 | 한끼 위젯

### PC 역추산 플래너
- 3컬럼: 저녁 선택 | AI 계산 | 하루 타임라인

### PC 캘린더
- 월간 그리드 + 상세 패널 + 스트릭 정보

---

## 📝 라이선스

Private - TodayMeal Team

---

Made with 🍚 by TodayMeal Team
