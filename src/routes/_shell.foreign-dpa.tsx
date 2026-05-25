import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/foreign-dpa")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="해외 DPA"
      description="ICO · EDPB · OPC · PDPC · CNIL · FTC 등 주요 감독기관 가이던스 동향."
      category="dpa"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
