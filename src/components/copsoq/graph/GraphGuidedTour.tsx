import { useState } from "react";
import { ChevronRight, ChevronLeft, X, BookOpen, Layers, GitBranch, MousePointer } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TOURS = [
  {
    id: "how_to_read",
    title: "Como ler este grafo",
    steps: [
      { icon: Layers, highlight: "tiers", text: "Leia da esquerda para a direita: a plataforma sugere uma sequência por camadas (fundação → redução de risco → coesão/justiça → capacidade/cultura)." },
      { icon: BookOpen, highlight: "node_types", text: "Quadrados arredondados são drivers; pílulas são mecanismos (ex.: segurança psicológica, desenho do trabalho)." },
      { icon: GitBranch, highlight: "edge_types", text: "Arestas em teal indicam habilitação (enables). Arestas em amarelo indicam trade-off. Arestas em vermelho indicam conflito/risco." },
      { icon: MousePointer, highlight: "evidence", text: "Ao clicar em um nó você abre um pop-out com: por que, riscos, quick wins e evidências." },
    ],
  },
  {
    id: "playbook_sequence",
    title: "Sequência recomendada",
    steps: [
      { icon: Layers, highlight: "foundation", text: "Comece pela fundação: Management e Trust, pois aumentam adesão e qualidade da implementação." },
      { icon: Layers, highlight: "reduce_harm", text: "Depois reduza dano sistêmico: Stress, Support e Energy — isso libera capacidade para aprender e mudar." },
      { icon: Layers, highlight: "fairness", text: "Em seguida, coesão e justiça: Inclusion & Belonging, Compensation e Flexibility — aqui moram trade-offs importantes." },
      { icon: Layers, highlight: "capability", text: "Por fim, capacidade e cultura: Learning, Purpose, Appreciation e Achievement." },
    ],
  },
];

interface Props {
  tourId: string;
  onClose: () => void;
}

export default function GraphGuidedTour({ tourId, onClose }: Props) {
  const tour = TOURS.find((t) => t.id === tourId);
  const [step, setStep] = useState(0);
  if (!tour) return null;

  const current = tour.steps[step];
  const Icon = current.icon;
  const isLast = step === tour.steps.length - 1;

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-50 w-[90%] max-w-lg animate-fade-in">
      <div className="rounded-xl border border-primary/30 bg-card/95 backdrop-blur-md shadow-hero p-5">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary">{tour.title}</p>
              <p className="text-[10px] text-muted-foreground">Passo {step + 1} de {tour.steps.length}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-muted-foreground hover:text-foreground" aria-label="Fechar tour">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-sm text-foreground leading-relaxed mb-4">{current.text}</p>

        {/* Progress dots */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {tour.steps.map((_, i) => (
              <div key={i} className={cn("h-1.5 rounded-full transition-all", i === step ? "w-6 bg-primary" : "w-1.5 bg-muted-foreground/30")} />
            ))}
          </div>
          <div className="flex gap-2">
            {step > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setStep(step - 1)} className="h-8 text-xs">
                <ChevronLeft className="h-3.5 w-3.5 mr-1" /> Anterior
              </Button>
            )}
            <Button size="sm" onClick={isLast ? onClose : () => setStep(step + 1)} className="h-8 text-xs">
              {isLast ? "Finalizar" : "Próximo"} {!isLast && <ChevronRight className="h-3.5 w-3.5 ml-1" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
