import { useState } from "react";
import { X, Eye, Wrench, Scale, BookOpen, Zap, AlertTriangle, ExternalLink } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { type DriverData, type MechanismData, TIERS, type TierKey } from "./graphData";

interface Props {
  open: boolean;
  onClose: () => void;
  nodeId: string;
  data: DriverData | MechanismData;
}

export default function GraphNodePopout({ open, onClose, nodeId, data }: Props) {
  const [tab, setTab] = useState("overview");
  const driver = "quick_wins" in data ? (data as DriverData) : null;
  const tierInfo = TIERS[(data.tier || "bridge") as TierKey];

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto p-0 gap-0">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center gap-2 mb-1">
            <Badge
              className="text-[10px] uppercase tracking-widest"
              style={{ backgroundColor: tierInfo?.color, color: "hsl(var(--primary-foreground))" }}
            >
              {driver ? "Driver" : "Mecanismo"}
            </Badge>
            {tierInfo && (
              <Badge variant="outline" className="text-[10px]">{tierInfo.label}</Badge>
            )}
          </div>
          <DialogTitle className="text-lg font-bold text-foreground">
            {(data as any).label || (data as any).slug} — orientação de implementação
          </DialogTitle>
          <p className="text-sm text-muted-foreground">{data.definition_short}</p>
        </DialogHeader>

        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="w-full justify-start rounded-none border-b border-border bg-transparent px-6 h-auto py-0">
            {[
              { id: "overview", label: "Visão", icon: Eye },
              ...(driver ? [
                { id: "how", label: "Como implementar", icon: Wrench },
                { id: "tradeoffs", label: "Trade-offs", icon: Scale },
              ] : []),
              { id: "evidence", label: "Evidências", icon: BookOpen },
            ].map((t) => (
              <TabsTrigger
                key={t.id}
                value={t.id}
                className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent px-4 py-3 text-xs font-semibold"
              >
                <t.icon className="h-3.5 w-3.5 mr-1.5" />
                {t.label}
              </TabsTrigger>
            ))}
          </TabsList>

          <div className="p-6">
            <TabsContent value="overview" className="mt-0 space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">Papel no Sistema</h4>
                <p className="text-sm text-foreground">{data.system_role}</p>
              </div>
              {driver && (
                <>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                      <Zap className="h-3.5 w-3.5 text-accent" /> Quick Wins
                    </h4>
                    <ul className="space-y-1.5">
                      {driver.quick_wins.map((qw, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                          <span className="mt-1 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                          {qw}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2">Próximas Dependências</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {driver.next_dependencies.map((dep) => (
                        <Badge key={dep} variant="secondary" className="text-xs capitalize">{dep.replace(/_/g, " ")}</Badge>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </TabsContent>

            {driver && (
              <TabsContent value="how" className="mt-0 space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { period: "0–90 dias", desc: "Quick wins e diagnóstico", color: "bg-primary/10 text-primary" },
                    { period: "3–12 meses", desc: "Consolidação e métricas", color: "bg-accent/10 text-accent" },
                    { period: "12–24 meses", desc: "Cultura e sustentabilidade", color: "bg-cycle-evoluir/10 text-cycle-evoluir" },
                  ].map((step) => (
                    <div key={step.period} className="rounded-lg border border-border p-3">
                      <Badge className={`text-[10px] ${step.color} border-0 mb-2`}>{step.period}</Badge>
                      <p className="text-xs text-foreground">{step.desc}</p>
                    </div>
                  ))}
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5 text-copsoq-pathos" /> Failure Modes Comuns
                  </h4>
                  <ul className="space-y-1.5">
                    {driver.failure_modes.map((fm, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-foreground">
                        <span className="mt-1 h-1.5 w-1.5 rounded-full bg-copsoq-pathos flex-shrink-0" />
                        {fm}
                      </li>
                    ))}
                  </ul>
                </div>
              </TabsContent>
            )}

            {driver && (
              <TabsContent value="tradeoffs" className="mt-0 space-y-3">
                <p className="text-sm text-muted-foreground">
                  Trade-offs são relações onde uma melhoria em um driver pode gerar tensões em outro.
                  A governança e contextualização são essenciais.
                </p>
                <div className="rounded-lg border border-copsoq-prevencao/30 bg-copsoq-prevencao/5 p-4">
                  <p className="text-xs font-semibold text-copsoq-prevencao mb-1">⚠ Atenção</p>
                  <p className="text-sm text-foreground">
                    Verifique as arestas de trade-off (amarelas pontilhadas) no grafo conectadas a este driver para identificar tensões específicas.
                  </p>
                </div>
              </TabsContent>
            )}

            <TabsContent value="evidence" className="mt-0 space-y-3">
              <p className="text-sm text-muted-foreground">
                Referências do Work Wellbeing Playbook e literatura de suporte.
              </p>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => window.open("https://worldwellbeingmovement.org/wp-content/uploads/2024/11/Work-Wellbeing-Playbook.pdf", "_blank")}
              >
                <ExternalLink className="h-3.5 w-3.5" />
                Abrir Playbook Oficial (PDF)
              </Button>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
