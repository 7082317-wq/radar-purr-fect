import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/ai-agent")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="AI Agent"
      description="자율 AI 에이전트의 능력 변화, 도구 사용, 프라이버시 영향 신호."
      category="AI Agent"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
