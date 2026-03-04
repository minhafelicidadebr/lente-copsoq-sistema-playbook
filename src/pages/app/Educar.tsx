import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AIChatPanel from "@/components/ai/AIChatPanel";

export default function Educar() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Educar</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Trilhas por driver, prática guiada, quizzes, missões e evidências verificáveis (gate PENDING/VERIFIED).
        </div>
      </div>

      <Card className="border-muted/60">
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="text-sm font-semibold">Trilhas (Q1 COPSOQ)</div>
            <Badge variant="secondary">Módulo</Badge>
          </div>
          <div className="mt-2 text-sm text-muted-foreground">
            Entrar nas trilhas e registrar aplicação prática (action log).
          </div>
          <div className="mt-4">
            <Button asChild><Link to="/copsoq/q1/educar/trilhas">Abrir trilhas</Link></Button>
          </div>
        </CardContent>
      </Card>

      <AIChatPanel axis="EDUCAR" />
    </div>
  );
}
