import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";

export default function LandingPricing() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Planos</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Estrutura de precificação: piloto de 90 dias (1 lente) ou programa anual (4 ciclos).
          Valores finais dependem de porte e escopo (TBD).
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card className="border-muted/60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">Sprint Trimestral</div>
                <div className="text-sm text-muted-foreground">1 lente · 90 dias</div>
              </div>
              <Badge variant="secondary">Piloto</Badge>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>Mensuração + leitura executiva</li>
              <li>Trilhas (Educar) + missões</li>
              <li>Backlog (Transformar) + governança</li>
              <li>Relatório ESG Trimestral (Evoluir)</li>
            </ul>
            <div className="mt-6 flex gap-3">
              <Button asChild><Link to="/signup">Solicitar proposta</Link></Button>
              <Button asChild variant="outline"><Link to="/security">Ver segurança</Link></Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-muted/60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <div className="text-lg font-semibold">Programa Anual</div>
                <div className="text-sm text-muted-foreground">4 lentes · 12 meses</div>
              </div>
              <Badge>Recomendado</Badge>
            </div>
            <ul className="mt-4 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
              <li>4 ciclos completos (Mensurar→Educar→Transformar→Evoluir)</li>
              <li>4 relatórios trimestrais + relatório anual</li>
              <li>Evolução longitudinal + benchmarking interno (sem ranking individual)</li>
              <li>Roadmap do Ano 2 com metas e priorização</li>
            </ul>
            <div className="mt-6">
              <Button asChild><Link to="/signup">Agendar roadmap anual</Link></Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
