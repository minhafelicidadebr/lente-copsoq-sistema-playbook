import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ShieldCheck, ArrowRight, Search, GraduationCap, Wrench, TrendingUp,
  Lock, Users, EyeOff, FileCheck, CheckCircle2
} from "lucide-react";
import heroImage from "@/assets/copsoq-hero.jpg";

const cycles = [
  { label: "Mensurar", icon: Search, desc: "Diagnóstico COPSOQ + baseline psicossocial", colorClass: "bg-cycle-mensurar" },
  { label: "Educar", icon: GraduationCap, desc: "Trilhas de aprendizagem guiadas por dados", colorClass: "bg-cycle-educar" },
  { label: "Transformar", icon: Wrench, desc: "Intervenções priorizadas pelo ILI", colorClass: "bg-cycle-transformar" },
  { label: "Evoluir", icon: TrendingUp, desc: "Re-medição + relatório ESG trimestral", colorClass: "bg-cycle-evoluir" },
];

const complianceItems = [
  { title: "NR-1 / GRO / PGR", desc: "Riscos psicossociais com processo contínuo e evidências" },
  { title: "NR-28", desc: "Prontidão documental e rastreabilidade para fiscalização" },
  { title: "Decreto DF 47.412/2025", desc: "Eixos: Promoção, Prevenção, Capacitação e Cuidado" },
  { title: "LGPD + Sigilo", desc: "Dados agregados, consentimento e segregação PII" },
];

const trustItems = [
  { icon: EyeOff, label: "Sem exposição individual" },
  { icon: Users, label: "Sem ranking" },
  { icon: Lock, label: "Células mínimas (≥8)" },
  { icon: FileCheck, label: "Audit log completo" },
];

export default function Overview() {
  return (
    <div className="space-y-10 animate-fade-in">
      {/* Hero */}
      <div className="relative rounded-2xl overflow-hidden shadow-hero">
        <img src={heroImage} alt="FT Wellbeing OS" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0 gradient-hero opacity-90" />
        <div className="relative z-10 px-8 py-16 md:px-16 md:py-20">
          <Badge className="mb-4 bg-accent text-accent-foreground border-0 text-xs font-semibold px-3 py-1">
            Blindagem & Consolidação — 90 dias
          </Badge>
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-primary-foreground leading-tight max-w-3xl mb-4">
            Q1 COPSOQ (Compliance)
          </h1>
          <p className="text-primary-foreground/80 text-base md:text-lg max-w-2xl mb-8 leading-relaxed">
            Diagnóstico psicossocial → decisões guiadas por MTR-F → intervenções priorizadas por evidência → relatório ESG trimestral com trilha de auditoria.
          </p>
          <div className="flex flex-wrap gap-3">
            <Button asChild size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg">
              <Link to="/copsoq/q1/onboarding/company">
                Iniciar Onboarding <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
              <Link to="/copsoq/q1/results/mtrf">Ver Metodologia (MTR-F)</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Timeline Stepper */}
      <section>
        <h2 className="text-xl font-bold mb-2">Ciclo Contínuo</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Evidência → aprendizagem → intervenção → governança → re-evidência.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {cycles.map((c, i) => (
            <Card key={c.label} className="group relative overflow-hidden border border-border hover:shadow-card-hover transition-all duration-300" style={{ animationDelay: `${i * 100}ms` }}>
              <CardContent className="p-5">
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${c.colorClass} mb-3`}>
                  <c.icon className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-muted-foreground">ETAPA {i + 1}</span>
                </div>
                <h3 className="font-semibold text-foreground mb-1">{c.label}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{c.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Compliance Cards */}
      <section>
        <h2 className="text-xl font-bold mb-2">Conformidade & Governança</h2>
        <p className="text-sm text-muted-foreground mb-6">
          Prontidão documental para NR-1, NR-28 e LGPD — sem prometer "conformidade automática".
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {complianceItems.map((item) => (
            <Card key={item.title} className="border border-border hover:shadow-card-hover transition-all duration-300">
              <CardContent className="p-5 flex gap-4 items-start">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10 flex-shrink-0 mt-0.5">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Trust Bar */}
      <section className="bg-card rounded-xl border border-border p-6">
        <h3 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
          <Lock className="h-4 w-4 text-primary" />
          Garantias de Privacidade
        </h3>
        <div className="flex flex-wrap gap-3">
          {trustItems.map((item) => (
            <div key={item.label} className="flex items-center gap-2 bg-muted rounded-lg px-4 py-2.5">
              <CheckCircle2 className="h-4 w-4 text-copsoq-salus flex-shrink-0" />
              <span className="text-sm font-medium text-foreground">{item.label}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
