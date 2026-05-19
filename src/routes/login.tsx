import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CatMascot } from "@/components/cat-mascot";
import { Radar, Shield } from "lucide-react";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState("agent@privacy.go.kr");
  const [pw, setPw] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      {/* left visual */}
      <div className="relative hidden md:flex flex-col justify-between p-10 overflow-hidden border-r border-glass-border">
        <div className="flex items-center gap-2.5">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-mint to-purple grid place-items-center">
            <Radar className="h-5 w-5 text-background" />
          </div>
          <div>
            <div className="font-display font-bold text-lg">Privacy Radar</div>
            <div className="terminal text-[10px] text-mint/70">INTERNAL ACCESS ONLY</div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -inset-20 rounded-full opacity-40 blur-3xl" style={{ background: "var(--gradient-aurora)" }} />
          <div className="relative glass-strong rounded-3xl p-8 max-w-md">
            <CatMascot state="coffee" size={140} />
            <h2 className="mt-4 text-2xl font-display font-bold">
              안녕하세요, <span className="text-gradient">에이전트 냥</span>이에요.
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              오늘 밤사이 들어온 신호 12건을 정리해두었어요. 로그인하면 바로 보여드릴게요. ☕
            </p>
            <div className="mt-4 terminal text-xs text-mint flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-mint animate-pulse-glow" /> sources monitored: 42
            </div>
          </div>
        </div>

        <div className="terminal text-[10px] text-muted-foreground">
          © 2026 Privacy & AI Policy Division
        </div>
      </div>

      {/* right form */}
      <div className="flex items-center justify-center p-6 md:p-10">
        <div className="w-full max-w-sm glass-strong rounded-3xl p-8">
          <div className="flex items-center gap-2 text-xs terminal text-mint">
            <Shield className="h-3.5 w-3.5" /> SECURE LOGIN
          </div>
          <h1 className="mt-2 text-2xl font-display font-bold">로그인</h1>
          <p className="text-sm text-muted-foreground mt-1">내부 사용자 전용입니다.</p>

          <form
            className="mt-6 space-y-4"
            onSubmit={(e) => {
              e.preventDefault();
              setLoading(true);
              setTimeout(() => nav({ to: "/" }), 700);
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-xs">이메일</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pw" className="text-xs">비밀번호</Label>
              <Input id="pw" type="password" value={pw} onChange={(e) => setPw(e.target.value)} required placeholder="••••••••" />
            </div>
            <Button type="submit" disabled={loading} className="w-full bg-mint text-mint-foreground hover:bg-mint/90">
              {loading ? "접속 중..." : "들어가기"}
            </Button>
            <p className="text-[11px] text-muted-foreground text-center">
              접속 기록은 감사 목적으로 보존됩니다.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
