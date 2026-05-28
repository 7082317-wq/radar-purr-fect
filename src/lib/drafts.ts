import { queryOptions } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type Draft = {
  id: string;
  issue_id: string;
  issue_title: string;
  issue_summary: string | null;
  content: string;
  created_at: string;
};

export const draftsQueryOptions = () =>
  queryOptions({
    queryKey: ["drafts"],
    queryFn: async (): Promise<Draft[]> => {
      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []) as Draft[];
    },
  });

export const draftByIssueQueryOptions = (issueId: string) =>
  queryOptions({
    queryKey: ["drafts", "issue", issueId],
    queryFn: async (): Promise<Draft | null> => {
      const { data, error } = await supabase
        .from("drafts")
        .select("*")
        .eq("issue_id", issueId)
        .maybeSingle();
      if (error) throw error;
      return (data as Draft) ?? null;
    },
  });
