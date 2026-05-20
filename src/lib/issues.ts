import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { queryOptions } from "@tanstack/react-query";

export type Issue = Tables<"issues">;

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
