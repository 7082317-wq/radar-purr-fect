export type Risk = {
  id: string;
  title: string;
  score: number;
  summary: string;
  source: string;
  date: string;
  tags: string[];
};

export const risks: Risk[] = [
  {
    id: "r1",
    title: "Meta 스마트 글래스의 상시 영상 수집 기능 확대",
    score: 87,
    summary:
      "Meta가 Ray-Ban 스마트 글래스에 상시 영상 분석 기능을 도입. 공공장소 비동의 촬영 및 얼굴 인식 기반 검색 가능성으로 프라이버시 우려가 급증.",
    source: "TechCrunch · Reuters",
    date: "2026-05-18",
    tags: ["웨어러블", "얼굴인식", "고위험"],
  },
  {
    id: "r2",
    title: "OpenAI Agent의 자율 결제·예약 기능 출시",
    score: 74,
    summary:
      "OpenAI가 Agent 모드에 자율 결제·계정 생성 권한을 부여. 위임 동의 및 책임 소재에 대한 규제 공백 지적.",
    source: "OpenAI Blog",
    date: "2026-05-17",
    tags: ["AI Agent", "위임동의", "결제"],
  },
  {
    id: "r3",
    title: "EU AI Act 고위험 시스템 시행규칙 초안 공개",
    score: 68,
    summary:
      "고위험 AI 시스템 분류 기준 및 데이터 거버넌스 요건이 구체화. 한국 기업의 EU 진출 시 적합성 평가 의무 발생.",
    source: "EDPB",
    date: "2026-05-16",
    tags: ["AI Act", "EU", "거버넌스"],
  },
  {
    id: "r4",
    title: "생성형 AI 기반 딥페이크 음성의 보이스피싱 악용 사례",
    score: 91,
    summary:
      "국내외에서 가족 목소리 복제를 통한 보이스피싱 피해 다수 보고. 음성 데이터 동의·삭제권 강화 논의 필요.",
    source: "KISA",
    date: "2026-05-15",
    tags: ["딥페이크", "음성", "위험경보"],
  },
];

export type DpaUpdate = {
  id: string;
  agency: "ICO" | "EDPB" | "OPC" | "PDPC" | "CNIL" | "FTC";
  country: string;
  title: string;
  date: string;
  excerpt: string;
};

export const dpaUpdates: DpaUpdate[] = [
  {
    id: "d1",
    agency: "ICO",
    country: "영국",
    title: "생성형 AI 학습 데이터의 합법적 처리 근거 가이던스",
    date: "2026-05-18",
    excerpt: "공개 웹 크롤링 데이터의 정당한 이익 판단 기준을 제시.",
  },
  {
    id: "d2",
    agency: "EDPB",
    country: "EU",
    title: "AI 모델의 익명성 평가 의견서 2/2026 채택",
    date: "2026-05-17",
    excerpt: "모델 가중치 자체가 개인정보에 해당할 수 있는 조건 명시.",
  },
  {
    id: "d3",
    agency: "OPC",
    country: "캐나다",
    title: "아동 대상 AI 챗봇 조사 결과 발표",
    date: "2026-05-16",
    excerpt: "최소수집 원칙 위반 및 동의 메커니즘 부재 지적.",
  },
  {
    id: "d4",
    agency: "PDPC",
    country: "싱가포르",
    title: "Model AI Governance Framework 3판 발표",
    date: "2026-05-14",
    excerpt: "에이전틱 AI 및 생체정보 처리에 대한 신규 권고 포함.",
  },
  {
    id: "d5",
    agency: "CNIL",
    country: "프랑스",
    title: "공공부문 얼굴인식 시범사업 제재 결정",
    date: "2026-05-13",
    excerpt: "비례성 원칙 위반으로 80만 유로 과징금 부과.",
  },
  {
    id: "d6",
    agency: "FTC",
    country: "미국",
    title: "AI Companion 앱 데이터 처리 실태 조사 착수",
    date: "2026-05-12",
    excerpt: "민감정보 추론 및 광고 활용에 대한 6(b) 조사.",
  },
];

export type Signal = {
  id: string;
  type: "product" | "policy" | "research";
  title: string;
  org: string;
  date: string;
  note: string;
};

export const signals: Signal[] = [
  {
    id: "s1",
    type: "product",
    title: "Meta Ray-Ban Display 글래스 정식 출시",
    org: "Meta",
    date: "2026-05-18",
    note: "내장 카메라 상시 작동, 음성 비서 통합.",
  },
  {
    id: "s2",
    type: "product",
    title: "OpenAI Operator 2.0 — 멀티 사이트 자동화",
    org: "OpenAI",
    date: "2026-05-17",
    note: "브라우저 세션 공유 기반 자동화 강화.",
  },
  {
    id: "s3",
    type: "policy",
    title: "백악관 행정명령 — 연방 기관 AI 사용 보고 의무",
    org: "White House",
    date: "2026-05-15",
    note: "연 2회 영향평가 보고서 제출 의무화.",
  },
  {
    id: "s4",
    type: "research",
    title: "Anthropic — 모델 인격성(Persona) 안전성 평가",
    org: "Anthropic",
    date: "2026-05-14",
    note: "역할극 시 안전장치 우회 사례 분석.",
  },
];

export type FeedItem = {
  id: string;
  time: string;
  level: "info" | "warn" | "alert" | "ok";
  message: string;
};

export const feedItems: FeedItem[] = [
  { id: "f1", time: "09:42:11", level: "alert", message: "신규 고위험 신호 감지 — 딥페이크 음성 피싱" },
  { id: "f2", time: "09:40:02", level: "info", message: "ICO 가이던스 페이지 스캔 완료" },
  { id: "f3", time: "09:38:47", level: "warn", message: "Meta 발표문 변경 감지 (diff: +312자)" },
  { id: "f4", time: "09:35:21", level: "ok", message: "초안 리포트 생성 완료 — Draft #128" },
  { id: "f5", time: "09:32:08", level: "info", message: "EDPB 의견서 2/2026 수집" },
  { id: "f6", time: "09:30:00", level: "info", message: "정기 모니터링 사이클 시작 (42 sources)" },
  { id: "f7", time: "09:28:14", level: "warn", message: "CNIL 제재 결정문 신규 게시 감지" },
  { id: "f8", time: "09:25:55", level: "ok", message: "야간 요약 브리핑 발송 완료" },
];
