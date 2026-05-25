import { createFileRoute } from "@tanstack/react-router";
import { issuesQueryOptions } from "@/lib/issues";
import { CategoryPage, CategoryErrorComponent } from "@/components/category-issues";

export const Route = createFileRoute("/_shell/ai-products")({
  loader: ({ context }) => {
    context.queryClient.ensureQueryData(issuesQueryOptions());
  },
  component: () => (
    <CategoryPage
      title="해외 AI 제품/서비스"
      description="주요 AI 기업의 제품 출시, 모델 업데이트, 정책 발표를 추적합니다."
      category="products"
    />
  ),
  errorComponent: CategoryErrorComponent,
});
