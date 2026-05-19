import { createFileRoute } from "@tanstack/react-router";
import { dpaUpdates } from "@/lib/mock-data";

export const Route = createFileRoute("/_shell/foreign-dpa")({
  component: () => (
    <div className="space-y-5">
      <header>
        <h1 className="text-3xl font-display font-bold">해외 DPA 업데이트</h1>
        <p className="text-sm text-muted-foreground mt-1">
          ICO · EDPB · OPC · PDPC · CNIL · FTC 등 주요 감독기관의 최신 가이던스 및 결정.
        </p>
      </header>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {dpaUpdates.map((d) => (
          <div key={d.id} className="glass rounded-2xl p-5 hover:border-purple/40 transition-all">
            <div className="flex items-center justify-between">
              <span className="terminal text-xs px-2 py-1 rounded-md bg-purple/15 text-purple border border-purple/30">
                {d.agency}
              </span>
              <span className="text-xs text-muted-foreground">{d.country} · {d.date}</span>
            </div>
            <h3 className="mt-3 font-semibold leading-snug">{d.title}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{d.excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  ),
});
