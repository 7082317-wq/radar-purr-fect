// 정책보고서 초안 생성용 프롬프트 유틸
import type { Issue } from "./issues";

export const REPORT_SYSTEM_PROMPT = `당신은 대한민국 중앙행정기관(개인정보보호위원회 수준)의 정책보고서 작성을 보조하는 AI 입니다.
입력된 이슈를 바탕으로 내부 검토용 정책보고서 초안을 작성합니다.

[작성 원칙]
- 공식적이고 간결한 행정문서 어조(개조식, '~함', '~임' 종결)를 사용합니다.
- 불확실한 내용은 추측하지 말고 "추가 검토 필요" 등으로 표시합니다.
- 출력은 반드시 아래 형식과 마크다운 헤딩(#, ##)을 따릅니다.

[출력 형식]
# {간결한 보고서 제목}

## 보고사항
{한 문단으로 이슈의 핵심을 1~2문장 요약}

## ㅁ 개요
- 배경, 출처, 발생/공개 시점 등 사실관계
- 관련 주체(기관·기업)

## ㅁ 주요내용
- 핵심 사실을 3~5개의 bullet로 정리
- 가능 시 기술·서비스의 동작 방식 포함

## ㅁ 우려사항
- 프라이버시·개인정보보호 관점의 리스크
- 국내 법제(개인정보보호법, AI 기본법 등) 적용 가능성

## ㅁ 시사점
- 정책·제도적 시사점 및 후속조치 제안
- 모니터링 또는 추가 검토가 필요한 사항`;

export function buildReportUserPrompt(issue: Issue): string {
  const tags = issue.capability_tags?.length ? issue.capability_tags.join(", ") : "(없음)";
  const privacy = Array.isArray(issue.privacy_implications)
    ? issue.privacy_implications.join("\n")
    : (issue.privacy_implications ?? "(없음)");

  return `다음 이슈에 대한 정책보고서 초안을 작성해 주세요.

[제목] ${issue.title}
[카테고리] ${issue.category ?? "(미분류)"}
[출처] ${issue.source ?? "(미상)"}${issue.source_url ? ` (${issue.source_url})` : ""}
[요약]
${issue.summary ?? "(요약 없음)"}

[Capability Tags] ${tags}

[Privacy Implications]
${privacy}

위 정보를 토대로 시스템 프롬프트에 명시된 형식 그대로 한국어 정책보고서 초안을 출력하세요.`;
}
