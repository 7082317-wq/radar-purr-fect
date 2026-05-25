import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/ai-agent")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="Emerging AI / AI Agent"
      description="새롭게 부상하는 AI 능력과 자율 에이전트의 프라이버시 영향 신호."
      category="emerging"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
