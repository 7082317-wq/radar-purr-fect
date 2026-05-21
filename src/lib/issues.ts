import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { queryOptions, useSuspenseQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { SAMPLE_ISSUES, useTestMode } from "@/lib/test-mode";

export type Issue = Tables<"issues">;

export const REFRESH_INTERVAL_MS = 60_000;
export const NEW_ISSUE_EVENT = "privacy-radar:new-issues";

export const issuesQueryOptions = () =>
  queryOptions({
    queryKey: ["issues"],
    queryFn: async (): Promise<Issue[]> => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

export const issueQueryOptions = (id: string) =>
  queryOptions({
    queryKey: ["issues", id],
    queryFn: async (): Promise<Issue | null> => {
      const { data, error } = await supabase
        .from("issues")
        .select("*")
        .eq("id", id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });

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
  const [lastUpdated, setLastUpdated] = useState<Date>(() => new Date());

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
