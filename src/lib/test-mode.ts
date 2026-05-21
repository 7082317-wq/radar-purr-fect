import { useEffect, useState } from "react";
import type { Issue } from "@/lib/issues";

export const TEST_MODE_KEY = "privacy-radar:test-mode";
export const TEST_MODE_EVENT = "privacy-radar:test-mode-changed";

export function isTestModeEnabled(): boolean {
  if (typeof window === "undefined") return false;
  return window.localStorage.getItem(TEST_MODE_KEY) === "1";
}

export function setTestMode(enabled: boolean) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TEST_MODE_KEY, enabled ? "1" : "0");
  window.dispatchEvent(new CustomEvent(TEST_MODE_EVENT, { detail: enabled }));
}

export function useTestMode() {
  const [enabled, setEnabled] = useState<boolean>(() => isTestModeEnabled());
  useEffect(() => {
    const onChange = () => setEnabled(isTestModeEnabled());
    window.addEventListener(TEST_MODE_EVENT, onChange);
    window.addEventListener("storage", onChange);
    return () => {
      window.removeEventListener(TEST_MODE_EVENT, onChange);
      window.removeEventListener("storage", onChange);
    };
  }, []);
  return enabled;
}

const now = Date.now();
const iso = (offsetMin: number) => new Date(now - offsetMin * 60_000).toISOString();

export const SAMPLE_ISSUES: Issue[] = [
  {
    id: "sample-1",
    title: "[샘플] EDPB, 생성형 AI 학습 데이터 가이드라인 초안 공개",
    summary: "유럽 데이터보호이사회(EDPB)가 생성형 AI 모델 학습 시 공개 웹 데이터의 합법적 처리 근거에 대한 가이드라인 초안을 공개했습니다.",
    source: "EDPB",
    source_url: "https://edpb.europa.eu/",
    category: "Foreign DPA",
    novelty_score: 88,
    relevance_score: 92,
    capability_tags: ["generative-ai", "training-data", "gdpr"],
    privacy_implications: "공개 웹 스크래핑 기반 학습의 적법성 판단 기준이 정립되면, 국내 LLM 사업자의 데이터 수집 관행 전반에 영향을 미칠 수 있습니다.",
    created_at: iso(8),
  },
  {
    id: "sample-2",
    title: "[샘플] OpenAI, 멀티모달 메모리 기능 출시",
    summary: "OpenAI가 사용자 이미지·음성을 장기 메모리로 저장하는 신규 기능을 발표했습니다.",
    source: "OpenAI",
    source_url: "https://openai.com/",
    category: "AI Product",
    novelty_score: 76,
    relevance_score: 81,
    capability_tags: ["multimodal", "memory", "personal-data"],
    privacy_implications: "장기 메모리에 생체정보·이미지가 축적되면 민감정보 저장 동의 범위와 삭제권 보장 방식에 대한 재검토가 필요합니다.",
    created_at: iso(42),
  },
  {
    id: "sample-3",
    title: "[샘플] CJEU, 자동화된 의사결정 관련 신규 판결",
    summary: "유럽사법재판소(CJEU)가 신용평가 알고리즘의 프로파일링이 GDPR 22조에 해당한다고 판단했습니다.",
    source: "CJEU",
    source_url: "https://curia.europa.eu/",
    category: "Court Case",
    novelty_score: 71,
    relevance_score: 84,
    capability_tags: ["profiling", "adm", "gdpr-art-22"],
    privacy_implications: "자동화된 의사결정의 범위를 폭넓게 해석한 판결로, 국내 AI 신용평가·채용 솔루션의 설명가능성 의무 강화 압박이 예상됩니다.",
    created_at: iso(120),
  },
  {
    id: "sample-4",
    title: "[샘플] Anthropic, 정부 전용 Claude 모델 발표",
    summary: "Anthropic이 주권 AI 수요에 대응해 정부 전용 격리 배포 옵션을 제공한다고 발표했습니다.",
    source: "Anthropic",
    source_url: "https://www.anthropic.com/",
    category: "AI Product",
    novelty_score: 64,
    relevance_score: 70,
    capability_tags: ["sovereign-ai", "government", "deployment"],
    privacy_implications: "공공부문 AI 도입 시 데이터 국외이전·격리 요건과의 정합성 검토가 필요합니다.",
    created_at: iso(260),
  },
];
