import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/governance")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="AI Governance / Standards"
      description="AI 거버넌스 프레임워크, 국제 표준, 정책 가이드라인 동향."
      category="governance"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
