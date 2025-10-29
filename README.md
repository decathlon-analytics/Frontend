# 데카트론 제품 분석 대시보드

데카트론 제품 리뷰 데이터를 실시간으로 분석하고 시각화하는 종합 대시보드입니다. Next.js 14와 FastAPI 백엔드를 활용하여 사용자 친화적인 인터페이스로 제품 성과와 고객 리뷰 트렌드를 제공합니다.

## ✨ 주요 기능

### 📊 메인 대시보드 (전체 카테고리)
- **이달의 TOP 1 제품**: 최근 30일간 가장 많은 리뷰를 받은 제품
- **긍정 리뷰 TOP 5**: 고객 만족도가 높은 상위 5개 제품
- **누적 리뷰 수 TOP 5**: 판매량 지표로 활용되는 총 리뷰 수 랭킹
- **월별 리뷰 트렌드 차트**: 시간별 리뷰 동향 분석
- **가격대별 분포 차트**: 가격 구간별 제품 분포 현황

### 🏃 러닝 카테고리 전용 페이지
- **평점 TOP 5**: 러닝 제품 중 최고 평점 제품 순위
- **누적 리뷰 수 TOP 5**: 러닝 카테고리 인기 제품 랭킹
- **서브카테고리별 분석**: 러닝화, 러닝 의류 등 세분화된 분석

### 🥾 하이킹 카테고리 전용 페이지
- **평점 TOP 5**: 등산/하이킹 제품 중 최고 평점 제품 순위
- **누적 리뷰 수 TOP 5**: 하이킹 카테고리 인기 제품 랭킹
- **서브카테고리별 분석**: 등산화, 등산복 등 세분화된 분석

### 🤖 AI 챗봇
- **실시간 상담**: 데카트론 제품에 대한 AI 기반 질의응답
- **제품 추천**: 사용자 요구사항에 맞는 개인화된 제품 추천
- **데이터 분석**: 실시간 제품 데이터를 기반으로 한 인사이트 제공
- **자연어 처리**: 편리한 대화형 인터페이스

### 📈 분석 대시보드
- **리뷰 워드클라우드**: 고객 리뷰 키워드 시각화 (ZingChart 활용)
- **종합 통계 분석**: 제품별, 카테고리별 상세 메트릭
- **실시간 알림**: 주요 지표 변화 모니터링
- **맞춤형 리포트**: 기간별, 카테고리별 상세 분석 보고서

## 🛠️ 기술 스택

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Charts**: Recharts, ZingChart (워드클라우드)
- **State Management**: TanStack Query (React Query)
- **Theme**: next-themes (다크/라이트 모드)

### Development Tools
- **Package Manager**: pnpm
- **Linting**: ESLint
- **Type Checking**: TypeScript
- **Deployment**: Vercel (권장)

## 📋 사전 요구사항

- **Node.js** v18 이상
- **pnpm** (권장) 또는 npm
- **인터넷 연결** (API 서버 접근용)

## 📁 프로젝트 구조

```
financial-dashboard/
├── app/                          # Next.js App Router
│   ├── layout.tsx               # 전역 레이아웃
│   ├── page.tsx                 # 메인 페이지 (전체 분석)
│   ├── globals.css              # 전역 스타일
│   ├── analytics/               # 분석 대시보드
│   │   └── page.tsx
│   ├── chatbot/                 # AI 챗봇 페이지
│   │   └── page.tsx
│   ├── running/                 # 러닝 카테고리 페이지
│   │   └── page.tsx
│   ├── hiking/                  # 하이킹 카테고리 페이지
│   │   └── page.tsx
│   └── settings/                # 설정 페이지
├── components/                   # React 컴포넌트
│   ├── ui/                      # shadcn/ui 기본 컴포넌트
│   ├── charts/                  # 차트 컴포넌트
│   │   ├── monthly-reviews-chart.tsx
│   │   ├── price-bins-chart.tsx
│   │   └── wordcloud-chart.tsx
│   ├── analytics/               # 분석 관련 컴포넌트
│   ├── running/                 # 러닝 페이지 컴포넌트
│   ├── hiking/                  # 하이킹 페이지 컴포넌트
│   └── layout components        # 네비게이션, 사이드바 등
├── lib/                         # 유틸리티 및 설정
│   ├── api/                     # API 클라이언트
│   │   ├── base.ts             # 기본 API 클라이언트
│   │   ├── types.ts            # TypeScript 타입 정의
│   │   └── endpoints/          # API 엔드포인트별 클라이언트
│   ├── query/                   # TanStack Query 설정
│   └── utils.ts                 # 공통 유틸리티
├── contexts/                    # React Context
│   └── settings-context.tsx
├── hooks/                       # 커스텀 React Hooks
├── public/                      # 정적 파일
└── styles/                      # 추가 스타일시트
```

### 주요 디렉토리 설명

- **`app/`**: Next.js 14 App Router 기반 페이지 구조
- **`components/`**: 재사용 가능한 React 컴포넌트들
- **`lib/api/`**: 백엔드 API와의 통신을 담당하는 클라이언트
- **`lib/query/`**: TanStack Query를 활용한 데이터 fetching 로직
- **`components/charts/`**: 데이터 시각화를 위한 차트 컴포넌트들

## 🔍 주요 기능 및 컴포넌트

### 데이터 관리
- **TanStack Query**: 서버 상태 관리 및 캐싱
- **TypeScript**: 엄격한 타입 체킹으로 안정성 확보
- **API Client**: RESTful API 통신 추상화

### 차트 및 시각화
- **Recharts**: 반응형 차트 라이브러리
- **ZingChart**: 고성능 워드클라우드 생성
- **다크/라이트 테마**: 사용자 선호에 따른 테마 전환

### UI/UX
- **shadcn/ui**: 현대적이고 접근성이 좋은 컴포넌트
- **Tailwind CSS**: 유틸리티 우선 스타일링
- **반응형 디자인**: 모든 디바이스에서 최적화된 경험


## 📱 반응형 디자인

프로젝트는 모든 디바이스에서 최적의 사용자 경험을 제공하는 반응형 디자인으로 구현되었습니다.

### 브레이크포인트
- **Mobile**: `< 640px` (sm)
- **Tablet**: `640px - 1024px` (md)
- **Desktop**: `> 1024px` (lg, xl)

### 주요 반응형 기능
- 그리드 레이아웃 자동 조정
- 차트 크기 동적 변경
- 네비게이션 메뉴 모바일 최적화
- 터치 인터페이스 지원

## 🎨 스타일링 시스템

### 디자인 토큰
- **Colors**: Tailwind CSS 컬러 팔레트 + 커스텀 브랜드 색상
- **Typography**: 시스템 폰트 스택 (`ui-sans-serif`, `system-ui`)
- **Spacing**: Tailwind CSS 스페이싱 시스템
- **Shadows**: 레이어별 그림자 시스템

### 테마 시스템
- **라이트 모드**: 밝은 배경, 어두운 텍스트
- **다크 모드**: 어두운 배경, 밝은 텍스트
- **시스템 테마**: OS 설정에 따라 자동 전환

### UI 라이브러리
- **shadcn/ui**: 기본 컴포넌트 시스템
- **Radix UI**: 접근성이 보장된 프리미티브
- **Lucide React**: 일관된 아이콘 시스템

## 📈 성능 최적화

### Next.js 14 최적화
- **App Router**: 향상된 라우팅 성능
- **서버 컴포넌트**: 초기 로드 성능 개선
- **이미지 최적화**: `next/image`를 통한 자동 최적화

### 데이터 Fetching 최적화
- **TanStack Query**: 
  - 자동 캐싱 및 백그라운드 업데이트
  - 중복 요청 제거
  - 오류 재시도 로직
- **병렬 API 호출**: `Promise.all()`을 통한 동시 데이터 로딩

### 번들 최적화
- **Code Splitting**: 페이지별 자동 코드 분할
- **Tree Shaking**: 사용하지 않는 코드 제거
- **동적 임포트**: 필요시점 라이브러리 로딩

```typescript
// ZingChart 동적 로딩 예시
const loadZingChart = async () => {
  if (!window.zingchart) {
    await import('zingchart')
  }
}
```