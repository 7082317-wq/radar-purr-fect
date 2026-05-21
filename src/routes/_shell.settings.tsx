import { createFileRoute } from "@tanstack/react-router";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { setTestMode, useTestMode } from "@/lib/test-mode";
import { FlaskConical } from "lucide-react";

export const Route = createFileRoute("/_shell/settings")({
  component: SettingsPage,
});

function SettingsPage() {
  const testMode = useTestMode();
  return (
    <div className="space-y-5 max-w-2xl">
      <header>
        <h1 className="text-3xl font-display font-bold">설정</h1>
        <p className="text-sm text-muted-foreground mt-1">모니터링 및 알림 환경설정.</p>
      </header>

      <div className="glass rounded-2xl p-5 space-y-4 border-purple/30">
        <div className="flex items-center gap-2">
          <FlaskConical className="h-4 w-4 text-purple" />
          <h2 className="font-semibold">테스트 모드</h2>
        </div>
        <div className="flex items-center justify-between py-2">
          <div>
            <Label className="text-sm">샘플 데이터 표시</Label>
            <p className="text-xs text-muted-foreground">
              켜면 데모용 가상 이슈(`[샘플]` 접두사)가 대시보드/위험 목록에 표시됩니다.
              실제 Supabase 데이터는 변경되지 않습니다.
            </p>
          </div>
          <Switch
            checked={testMode}
            onCheckedChange={(v) => setTestMode(Boolean(v))}
          />
        </div>
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold">스케줄</h2>
        {[
          ["오전 브리핑", "매일 09:00 KST", true],
          ["야간 요약", "매일 22:00 KST", true],
          ["주간 리포트", "월요일 08:00", false],
        ].map(([k, v, on]) => (
          <div key={k as string} className="flex items-center justify-between py-2 border-t border-glass-border first:border-t-0">
            <div>
              <Label className="text-sm">{k}</Label>
              <p className="text-xs text-muted-foreground">{v as string}</p>
            </div>
            <Switch defaultChecked={on as boolean} />
          </div>
        ))}
      </div>

      <div className="glass rounded-2xl p-5 space-y-4">
        <h2 className="font-semibold">알림</h2>
        {[
          ["고위험 신호 즉시 알림", "위험 점수 80 이상", true],
          ["해외 DPA 신규 가이던스", "ICO · EDPB · CNIL …", true],
          ["고양이 에이전트 음성", "도움이 필요할 때 야옹", false],
        ].map(([k, v, on]) => (
          <div key={k as string} className="flex items-center justify-between py-2 border-t border-glass-border first:border-t-0">
            <div>
              <Label className="text-sm">{k}</Label>
              <p className="text-xs text-muted-foreground">{v as string}</p>
            </div>
            <Switch defaultChecked={on as boolean} />
          </div>
        ))}
      </div>
    </div>
  );
}
