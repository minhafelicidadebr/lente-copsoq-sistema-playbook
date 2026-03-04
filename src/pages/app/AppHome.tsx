import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { BarChart3, GraduationCap, Wrench, RefreshCcw, ArrowRight } from "lucide-react";

export default function AppHome() {
  const cards = [
    { t: "Mensurar", d: "Iniciar campanha, coletar e agregar dados com k-anon.", to: "/app/mensurar", icon: BarChart3 },
    { t: "Educar", d: "Trilhas por driver, prática e evidências verificáveis.", to: "/app/educar", icon: GraduationCap },
    { t: "Transformar", d: "Backlog de intervenções e governança de execução.", to: "/app/transformar", icon: Wrench },
    { t: "Evoluir", d: "Relatórios auditáveis e evolução longitudinal.", to: "/app/evoluir", icon: RefreshCcw },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="text-2xl font-semibold">FT Wellbeing OS</div>
        <div className="mt-1 text-sm text-muted-foreground">
          Centro de comando por ciclos. Use o módulo Q1 COPSOQ como primeira lente.
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <Card key={c.t} className="border-muted/60">
            <CardContent className="p-6">
              <div className="flex items-start gap-3">
                <c.icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                <div className="flex-1">
                  <div className="text-sm font-semibold">{c.t}</div>
                  <div className="mt-1 text-sm text-muted-foreground">{c.d}</div>
                </div>
              </div>
              <div className="mt-4">
                <Button asChild variant="outline" className="gap-2">
                  <Link to={c.to}>
                    Abrir <ArrowRight className="h-4 w-4" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="border-muted/60">
        <CardContent className="p-6">
          <div className="text-sm font-semibold">Atalho: módulo Q1 COPSOQ</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Onboarding → Mensuração (EliAs + Survey) → Resultados (Dash + MTR-F) → Educar → Transformar → Evoluir (Relatório ESG).
          </div>
          <div className="mt-4">
            <Button asChild className="gap-2">
              <Link to="/copsoq/q1/overview">
                Abrir Q1 COPSOQ <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
