import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/cases")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="판례 및 규제"
      description="AI · 프라이버시 관련 국내외 주요 판결, 행정 결정, 규제 동향."
      category="Case / Regulation"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
