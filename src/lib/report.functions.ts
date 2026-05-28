import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { createClient } from "@supabase/supabase-js";
import { REPORT_SYSTEM_PROMPT, buildReportUserPrompt } from "./report-prompt";
import type { Issue } from "./issues";

const IssueInput = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  summary: z.string().nullable().optional(),
  source: z.string().nullable().optional(),
  source_url: z.string().nullable().optional(),
  category: z.string().nullable().optional(),
  capability_tags: z.array(z.string()).nullable().optional(),
  privacy_implications: z.union([z.string(), z.array(z.string())]).nullable().optional(),
});

export const generateReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ issue: IssueInput }).parse(input))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY 가 설정되지 않았습니다.");

    const issue = data.issue as unknown as Issue;

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: REPORT_SYSTEM_PROMPT },
          { role: "user", content: buildReportUserPrompt(issue) },
        ],
      }),
    });

    if (!res.ok) {
      const txt = await res.text();
      if (res.status === 429) throw new Error("AI 호출 한도를 초과했습니다. 잠시 후 다시 시도해 주세요.");
      if (res.status === 402) throw new Error("AI 크레딧이 부족합니다. 워크스페이스 설정에서 크레딧을 추가해 주세요.");
      throw new Error(`AI 호출 실패 (${res.status}): ${txt.slice(0, 200)}`);
    }

    const json = (await res.json()) as {
      choices?: Array<{ message?: { content?: string } }>;
    };
    const content = json.choices?.[0]?.message?.content?.trim();
    if (!content) throw new Error("AI 응답이 비어있습니다.");

    // 우리 프로젝트의 supabase 에 drafts 저장 (issues 테이블은 외부에 있음)
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (SUPABASE_URL && SERVICE_KEY) {
      try {
        const admin = createClient(SUPABASE_URL, SERVICE_KEY, {
          auth: { persistSession: false, autoRefreshToken: false },
        });
        await admin.from("drafts").upsert(
          {
            issue_id: issue.id,
            issue_title: issue.title,
            issue_summary: issue.summary ?? null,
            content,
          },
          { onConflict: "issue_id" },
        );
      } catch (e) {
        console.error("[drafts] save failed:", e);
      }
    }

    return { report: content };
  });
