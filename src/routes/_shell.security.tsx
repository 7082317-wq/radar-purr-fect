import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/security")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="보안 및 위험"
      description="AI 보안 취약점, 모델 악용, 데이터 유출 및 위협 인텔리전스."
      category="Security / Risk"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
