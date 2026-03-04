import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import AIChatPanel from "@/components/ai/AIChatPanel";

export default function Mensurar() {
  return (
    <div className="space-y-6">
      <div>
        <div className="text-xl font-semibold">Mensurar</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Iniciar campanha, coletar respostas (engine licenciado no backend) e gerar agregados com k-anon (minCellSize).
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div className="text-sm font-semibold">Q1 COPSOQ — Onboarding</div>
              <Badge variant="secondary">Módulo</Badge>
            </div>
            <div className="mt-2 text-sm text-muted-foreground">
              Configure empresa, força de trabalho e segmentos (sem rótulos sensíveis).
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild><Link to="/copsoq/q1/onboarding/company">Empresa</Link></Button>
              <Button asChild variant="outline"><Link to="/copsoq/q1/onboarding/workforce">Força de trabalho</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/60">
          <CardContent className="p-6">
            <div className="text-sm font-semibold">Executar mensuração</div>
            <div className="mt-2 text-sm text-muted-foreground">
              EliAs orienta a campanha; Survey captura respostas via item IDs (sem itens no client).
            </div>
            <div className="mt-4 flex gap-2">
              <Button asChild><Link to="/copsoq/q1/mensurar/elias">Abrir EliAs</Link></Button>
              <Button asChild variant="outline"><Link to="/copsoq/q1/mensurar/survey">Survey</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <AIChatPanel axis="MENSURAR" />
    </div>
  );
}
