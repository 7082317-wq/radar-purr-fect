import { createServerFn } from "@tanstack/react-start";
import { supabaseAdmin } from "@/integrations/supabase/client.server";
import { REPORT_SYSTEM_PROMPT, buildReportUserPrompt } from "./report-prompt";
import type { Issue } from "./issues";

export const generateReport = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => {
    if (!input || typeof input !== "object" || !("issueId" in input)) {
      throw new Error("issueId required");
    }
    const id = (input as { issueId: unknown }).issueId;
    if (typeof id !== "string" || !id) throw new Error("invalid issueId");
    return { issueId: id };
  })
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY 가 설정되지 않았습니다.");

    const { data: issue, error } = await supabaseAdmin
      .from("issues")
      .select("*")
      .eq("id", data.issueId)
      .maybeSingle();
    if (error) throw new Error(error.message);
    if (!issue) throw new Error("이슈를 찾을 수 없습니다.");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Lovable-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: REPORT_SYSTEM_PROMPT },
          { role: "user", content: buildReportUserPrompt(issue as Issue) },
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

    return { report: content };
  });
