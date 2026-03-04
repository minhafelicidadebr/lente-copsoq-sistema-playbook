import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, BarChart3, GraduationCap, Wrench, RefreshCcw, ShieldCheck } from "lucide-react";

const Pill = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center rounded-full border bg-background px-3 py-1 text-xs text-muted-foreground">
    {children}
  </span>
);

export default function LandingHome() {
  return (
    <div>
      <section className="mx-auto max-w-6xl px-4 py-14 md:py-20">
        <div className="grid gap-10 md:grid-cols-2 md:items-center">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Pill>LGPD-by-design</Pill>
              <Pill>Sem ranking individual</Pill>
              <Pill>k-anon (minCellSize)</Pill>
              <Pill>Auditabilidade</Pill>
            </div>

            <h1 className="text-4xl font-semibold tracking-tight md:text-5xl">
              Gestão do bem-estar e inovação organizacional,
              <span className="text-gradient-primary">
                {" "}executável em ciclos.
              </span>
            </h1>

            <p className="text-base text-muted-foreground md:text-lg">
              FT Wellbeing OS transforma diagnóstico psicossocial + ciência do bem-estar + governança contínua
              em rotinas de gestão: Mensurar → Educar → Transformar → Evoluir.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="gap-2">
                <Link to="/signup">
                  Começar agora <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/metodologia/mtrf">Ver metodologia</Link>
              </Button>
            </div>

            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
              <ShieldCheck className="h-4 w-4" />
              Este sistema entrega prontidão documental e governança; não promete conformidade automática.
            </div>
          </div>

          <div className="grid gap-4">
            <Card className="border-muted/60">
              <CardContent className="p-6">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold">Ciclo 90 dias</div>
                    <div className="text-xs text-muted-foreground">Piloto com 1 lente (Q1 COPSOQ)</div>
                  </div>
                  <Badge variant="secondary">Start</Badge>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
                  <div className="flex items-center gap-2"><BarChart3 className="h-4 w-4" /> Mensurar</div>
                  <div className="flex items-center gap-2"><GraduationCap className="h-4 w-4" /> Educar</div>
                  <div className="flex items-center gap-2"><Wrench className="h-4 w-4" /> Transformar</div>
                  <div className="flex items-center gap-2"><RefreshCcw className="h-4 w-4" /> Evoluir</div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-muted/60">
              <CardContent className="p-6">
                <div className="text-sm font-semibold">O que você ganha</div>
                <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-muted-foreground">
                  <li>Dashboards executivos por perfil (sem exposição individual)</li>
                  <li>Trilhas e missões com evidências verificáveis</li>
                  <li>Backlog de intervenções com governança</li>
                  <li>Relatório ESG trimestral (auditável)</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/20">
        <div className="mx-auto grid max-w-6xl gap-4 px-4 py-12 md:grid-cols-4">
          {[
            { t: "Mensurar", d: "Diagnóstico psicossocial + leitura executiva e MTR-F." },
            { t: "Educar", d: "Trilhas por driver, prática guiada e evidências." },
            { t: "Transformar", d: "Backlog e co-design de intervenções com governança." },
            { t: "Evoluir", d: "Recheck, relatório ESG e evidências para auditoria." },
          ].map((x) => (
            <Card key={x.t} className="border-muted/60">
              <CardContent className="p-5">
                <div className="text-sm font-semibold">{x.t}</div>
                <div className="mt-1 text-sm text-muted-foreground">{x.d}</div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  );
}
