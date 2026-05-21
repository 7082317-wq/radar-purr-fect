import { createClient } from "@supabase/supabase-js";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAMPLE_ISSUES, useTestMode } from "@/lib/test-mode";

const PRIVACY_RADAR_SUPABASE_URL = "https://cqmbcufxuznpdvsdhwge.supabase.co";
const PRIVACY_RADAR_SUPABASE_PUBLISHABLE_KEY = "sb_publishable_eY3zYRAQdj3zdGuKry0IKA_yafqeDaW";

const privacyRadarSupabase = createClient(
  PRIVACY_RADAR_SUPABASE_URL,
  PRIVACY_RADAR_SUPABASE_PUBLISHABLE_KEY,
  { auth: { persistSession: false, autoRefreshToken: false } },
);

type RawIssue = {
  id: string | number;
  title: string;
  summary: string | null;
  source: string | null;
  source_url?: string | null;
  url?: string | null;
  category: string | null;
  novelty_score: number | null;
  relevance_score: number | null;
  capability_tags: string[] | null;
  privacy_implications: string | string[] | null;
  created_at: string;
};

export type Issue = {
  id: string;
  title: string;
  summary: string | null;
  source: string | null;
  source_url: string | null;
  category: string | null;
  novelty_score: number | null;
  relevance_score: number | null;
  capability_tags: string[] | null;
  privacy_implications: string | string[] | null;
  created_at: string;
};

export const REFRESH_INTERVAL_MS = 60_000;
export const NEW_ISSUE_EVENT = "privacy-radar:new-issues";

export const issuesQueryOptions = () =>
  queryOptions({
    queryKey: ["issues"],
    queryFn: async (): Promise<Issue[]> => {
      const { data, error } = await privacyRadarSupabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return ((data ?? []) as RawIssue[]).map(normalizeIssue);
    },
  });

export const issueQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["issues", id],
    queryFn: async (): Promise<Issue | null> => {
      const { data, error } = await privacyRadarSupabase
        .from("issues")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data ? normalizeIssue(data as RawIssue) : null;
    },
  });

function normalizeIssue(issue: RawIssue): Issue {
  return {
    id: String(issue.id),
    title: issue.title,
    summary: issue.summary,
    source: issue.source,
    source_url: issue.source_url ?? issue.url ?? null,
    category: issue.category,
    novelty_score: issue.novelty_score,
    relevance_score: issue.relevance_score,
    capability_tags: issue.capability_tags,
    privacy_implications: issue.privacy_implications,
    created_at: issue.created_at,
  };
}

/**
 * Live wrapper around `issuesQueryOptions` that auto-refetches every 60s,
 * tracks which issues are newly arrived (for entry animation), exposes
 * `lastUpdated`, and dispatches a window event when new issues appear so
 * the cat agent can notify the user.
 */
export function useLiveIssues() {
  const query = useSuspenseQuery({
    ...issuesQueryOptions(),
    refetchInterval: REFRESH_INTERVAL_MS,
    refetchIntervalInBackground: false,
  });

  // Inject sample data only when test mode is on.
  const testMode = useTestMode();

  const issues = useMemo<Issue[]>(() => {
    if (!testMode) return query.data;
    return [...query.data, ...SAMPLE_ISSUES].sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );
  }, [query.data, testMode, SAMPLE_ISSUES]);

  const seenRef = useRef<Set<string> | null>(null);
  const [newIds, setNewIds] = useState<Set<string>>(() => new Set());
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    if (!issues) return;
    setLastUpdated(new Date());
    const ids = new Set(issues.map((i) => i.id));
    if (seenRef.current === null) {
      seenRef.current = ids;
      return;
    }
    const fresh = issues.filter((i) => !seenRef.current!.has(i.id));
    if (fresh.length > 0) {
      const freshSet = new Set(fresh.map((i) => i.id));
      setNewIds(freshSet);
      if (typeof window !== "undefined") {
        window.dispatchEvent(
          new CustomEvent(NEW_ISSUE_EVENT, { detail: { issues: fresh } }),
        );
      }
      const t = setTimeout(() => setNewIds(new Set()), 8000);
      seenRef.current = ids;
      return () => clearTimeout(t);
    }
    seenRef.current = ids;
  }, [issues]);

  return {
    issues,
    newIds,
    lastUpdated,
    isFetching: query.isFetching,
    refetch: query.refetch,
    testMode,
  };
}
