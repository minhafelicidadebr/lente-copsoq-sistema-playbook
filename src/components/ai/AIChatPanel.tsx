import * as React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { geminiChat } from "@/lib/ai/geminiClient";
import type { Axis } from "@/lib/auth/types";
import { useAuth } from "@/lib/auth/context";

export default function AIChatPanel({ axis }: { axis: Axis }) {
  const { tenant, user } = useAuth();
  const [messages, setMessages] = React.useState<Array<{ role: "user" | "assistant"; content: string }>>([
    { role: "assistant", content: "Olá! Sou seu copiloto (demo). Diga o que você quer construir neste eixo." },
  ]);
  const [input, setInput] = React.useState("");
  const [busy, setBusy] = React.useState(false);

  async function send() {
    const text = input.trim();
    if (!text || busy) return;
    setInput("");
    setBusy(true);

    const next = [...messages, { role: "user" as const, content: text }];
    setMessages(next);

    const res = await geminiChat({
      messages: next.map((m) => ({ role: m.role, content: m.content, ts: Date.now() })),
      context: {
        tenantId: tenant?.id,
        tenantName: tenant?.name,
        userId: user?.id,
        userRole: user?.role,
        axis,
        workspace: "app",
      },
    });

    setMessages([...next, { role: "assistant", content: res.text }]);
    setBusy(false);
  }

  return (
    <Card className="border-muted/60">
      <CardContent className="p-4">
        <div className="text-sm font-semibold">IA (Gemini 3.1) — {axis}</div>
        <div className="mt-1 text-xs text-muted-foreground">
          Demo: respostas sem alucinação. No SaaS, este painel chamará seu backend Gemini.
        </div>

        <div className="mt-3 h-56">
          <ScrollArea className="h-full rounded-md border">
            <div className="space-y-3 p-3 text-sm">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <div
                    className={
                      "inline-block max-w-[90%] rounded-lg px-3 py-2 " +
                      (m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted text-foreground")
                    }
                  >
                    {m.content}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </div>

        <div className="mt-3 flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Peça: checklist, plano, prompt, roteiro, backlog…"
            onKeyDown={(e) => { if (e.key === "Enter") send(); }}
          />
          <Button onClick={send} disabled={busy}>
            Enviar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
