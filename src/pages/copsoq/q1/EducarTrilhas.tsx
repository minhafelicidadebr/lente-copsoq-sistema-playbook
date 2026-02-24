import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { GraduationCap, Users, AlertTriangle, BookOpen } from "lucide-react";

const tracks = [
  {
    trackId: "TRILHA_DEMANDAS_TRAB_VIDA",
    title: "Demandas & Conflito Trabalho-Vida",
    trigger: "DEMANDAS_CONFLITO_TRAB_VIDA ∈ [ALTO, MODERADO]",
    audiences: ["Colaborador", "Gestor"],
    modules: ["Fronteiras e priorização", "Neurociência: estresse e recuperação", "Acordos de trabalho", "Liderança: capacidade vs demanda"],
    riskBand: "ALTO",
    completionPct: 0,
  },
  {
    trackId: "TRILHA_AUTONOMIA_CLAREZA",
    title: "Autonomia & Clareza de Papéis",
    trigger: "INFLUENCIA_AUTONOMIA ∈ [ALTO, MODERADO]",
    audiences: ["Gestor", "RH/SST"],
    modules: ["Delegação e critérios de decisão", "Clareza de papéis e accountability", "Job crafting básico"],
    riskBand: "MODERADO",
    completionPct: 0,
  },
  {
    trackId: "TRILHA_LIDERANCA_RECONHECIMENTO",
    title: "Liderança & Reconhecimento",
    trigger: "RECONHECIMENTO_LIDERANCA ∈ [ALTO, MODERADO]",
    audiences: ["Gestor", "RH/SST"],
    modules: ["Feedback justo", "Reconhecimento estruturado", "Segurança psicológica", "Comunicação respeitosa"],
    riskBand: "ALTO",
    completionPct: 0,
  },
];

const didactics = ["Microlearning", "Prática guiada", "Aprendizagem social", "Spaced repetition", "Evidências de transferência"];

export default function EducarTrilhas() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <GraduationCap className="h-6 w-6 text-cycle-educar" />
          Educar — Trilhas de Aprendizagem
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Trilhas nascem do diagnóstico. Cada trilha é ativada por faixas de risco detectadas no COPSOQ.
        </p>
      </div>

      {/* Didactics badges */}
      <div className="flex flex-wrap gap-2">
        {didactics.map((d) => (
          <Badge key={d} variant="secondary" className="text-xs">{d}</Badge>
        ))}
      </div>

      {/* Track cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tracks.map((track) => (
          <Card key={track.trackId} className="border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between mb-1">
                <Badge variant="outline" className={`text-xs ${
                  track.riskBand === "ALTO" ? "border-copsoq-pathos text-copsoq-pathos" :
                  "border-copsoq-prevencao text-copsoq-prevencao"
                }`}>
                  <AlertTriangle className="h-3 w-3 mr-1" /> Risco {track.riskBand}
                </Badge>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{track.audiences.join(", ")}</span>
                </div>
              </div>
              <CardTitle className="text-base">{track.title}</CardTitle>
              <p className="text-xs text-muted-foreground font-mono">Trigger: {track.trigger}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {track.modules.map((mod, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm">
                    <BookOpen className="h-3.5 w-3.5 text-primary flex-shrink-0" />
                    <span className="text-foreground">{mod}</span>
                  </div>
                ))}
              </div>
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Conclusão</span>
                  <span className="font-medium text-foreground">TBD</span>
                </div>
                <Progress value={track.completionPct} className="h-1.5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
