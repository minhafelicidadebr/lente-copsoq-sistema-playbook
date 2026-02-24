import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Wrench, ArrowUpDown, Info } from "lucide-react";

// TBD placeholder (R2)
const backlogItems = [
  { id: 1, intervention: "Redesenho de carga e alocação", driver: "STRESS", risk: "Sintomas Stress/Depressão", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 2, intervention: "Protocolo antiassédio + canal de resposta", driver: "TRUST", risk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 3, intervention: "Rotinas de peer support", driver: "SUPPORT", risk: "Demandas Conflito Trab-Vida", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 4, intervention: "Reconhecimento estruturado (SAGE)", driver: "APPRECIATION", risk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 5, intervention: "Rituais de alinhamento + retro segura", driver: "MANAGEMENT", risk: "Influência/Autonomia", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 6, intervention: "Política de desconexão digital", driver: "FLEXIBILITY", risk: "Demandas Conflito Trab-Vida", ili: "TBD", status: "planejado", owner: "TBD" },
  { id: 7, intervention: "Trilha de liderança prática supervisionada", driver: "MANAGEMENT", risk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD" },
];

const drivers = ["ACHIEVEMENT", "APPRECIATION", "COMPENSATION", "ENERGY", "FLEXIBILITY", "INCLUSION_BELONGING", "LEARNING", "MANAGEMENT", "PURPOSE", "STRESS", "SUPPORT", "TRUST"];

const statusColors: Record<string, string> = {
  planejado: "border-muted-foreground text-muted-foreground",
  em_andamento: "border-cycle-transformar text-cycle-transformar",
  concluido: "border-copsoq-salus text-copsoq-salus",
};

const executionFields = ["Hipótese", "KPI Processo", "KPI Resultado", "Responsável", "Prazo", "Evidência", "Critério de Revisão"];

export default function TransformarBacklog() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Wrench className="h-6 w-6 text-cycle-transformar" />
          Transformar — Backlog de Intervenções
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Unidade de mudança: sistema de trabalho. Priorizado pelo ILI. 12 drivers do Playbook.
        </p>
      </div>

      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <Info className="h-5 w-5 text-primary flex-shrink-0" />
        <p className="text-sm text-foreground">
          Cada intervenção requer: {executionFields.join(", ")}. O ILI será calculado com dados reais da campanha.
        </p>
      </div>

      {/* Drivers */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-2">12 Drivers do Playbook</h3>
        <div className="flex flex-wrap gap-2">
          {drivers.map((d) => (
            <Badge key={d} variant="outline" className="text-xs">{d.replace(/_/g, " ")}</Badge>
          ))}
        </div>
      </div>

      {/* Backlog Table */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <ArrowUpDown className="h-4 w-4 text-primary" />
            Portfólio de Intervenções (ILI-ranked)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-xs">Intervenção</TableHead>
                  <TableHead className="text-xs">Driver</TableHead>
                  <TableHead className="text-xs">Risco Alvo</TableHead>
                  <TableHead className="text-xs">ILI</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs">Responsável</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {backlogItems.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm font-medium text-foreground">{item.intervention}</TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-xs">{item.driver}</Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.risk}</TableCell>
                    <TableCell className="text-sm font-mono font-bold text-foreground">{item.ili}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={`text-xs ${statusColors[item.status] || ""}`}>
                        {item.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm text-muted-foreground">{item.owner}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
