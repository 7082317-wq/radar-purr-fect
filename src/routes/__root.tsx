import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-8">
        <h1 className="text-6xl font-bold text-gradient">404</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          요청하신 페이지를 찾을 수 없어요.
        </p>
        <Link
          to="/"
          className="mt-5 inline-flex items-center justify-center rounded-xl bg-mint px-4 py-2 text-sm font-medium text-mint-foreground hover:opacity-90"
        >
          대시보드로
        </Link>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="max-w-md text-center glass rounded-2xl p-8">
        <h1 className="text-lg font-semibold">문제가 발생했어요</h1>
        <p className="mt-2 text-xs text-muted-foreground">{error.message}</p>
        <button
          onClick={() => {
            router.invalidate();
            reset();
          }}
          className="mt-4 rounded-xl bg-mint px-4 py-2 text-sm text-mint-foreground"
        >
          다시 시도
        </button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Privacy Radar — AI 프라이버시 모니터링" },
      { name: "description", content: "정부 AI·프라이버시 정책팀을 위한 내부 모니터링 시스템" },
      { property: "og:title", content: "Privacy Radar — AI 프라이버시 모니터링" },
      { name: "twitter:title", content: "Privacy Radar — AI 프라이버시 모니터링" },
      { property: "og:description", content: "정부 AI·프라이버시 정책팀을 위한 내부 모니터링 시스템" },
      { name: "twitter:description", content: "정부 AI·프라이버시 정책팀을 위한 내부 모니터링 시스템" },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a586dc6d-5afd-4f86-b896-72c3d7368901/id-preview-6b1a352f--f0f0e59d-47f7-47b1-8bbb-f8583f2b1dca.lovable.app-1779339965146.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/a586dc6d-5afd-4f86-b896-72c3d7368901/id-preview-6b1a352f--f0f0e59d-47f7-47b1-8bbb-f8583f2b1dca.lovable.app-1779339965146.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Inter:wght@300;400;500;600;700&display=swap",
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  return (
    <QueryClientProvider client={queryClient}>
      <Outlet />
    </QueryClientProvider>
  );
}
