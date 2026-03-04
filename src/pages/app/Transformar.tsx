import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AIChatPanel from "@/components/ai/AIChatPanel";

export default function Transformar() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Transformar</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Backlog de intervenções orientadas por drivers + governança (owners, prazos, evidências, trade-offs).
        </div>
      </div>

      <Card className="border-muted/60">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold">Backlog (Q1 COPSOQ)</div>
            <Badge variant="secondary">Módulo</Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Registrar intervenções, responsáveis, status e justificativas auditáveis.
          </div>
          <div className="mt-4">
            <Button asChild><Link to="/copsoq/q1/transformar/backlog">Abrir backlog</Link></Button>
          </div>
        </CardContent>
      </Card>

      <AIChatPanel axis="TRANSFORMAR" />
    </div>
  );
}
