import { useState, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  FileText, Download, CheckCircle2, AlertTriangle,
  BarChart3, Shield, FileCheck, Printer, Loader2,
} from "lucide-react";
import { buildCopsoqEsgReportSpec } from "@/lib/copsoq/q1/report/buildReport";
import { renderReportHtml } from "@/lib/copsoq/q1/report/renderHtml";
import type { CopsoqEsgReportSpec } from "@/lib/copsoq/q1/report/types";
import ReportPreviewDialog from "@/components/copsoq/report/ReportPreviewDialog";

const sections = [
  {
    id: "EXEC_SUMMARY",
    icon: BarChart3,
    title: "Sumário Executivo",
    items: ["Visão geral das zonas MTR-F", "Top 3 riscos identificados", "Top 3 alavancas de florescimento", "ILI — Top 10 intervenções priorizadas"],
  },
  {
    id: "COMPLIANCE_NR1",
    icon: Shield,
    title: "NR-1 / GRO / PGR — Riscos Psicossociais",
    items: ["Identificação de perigos", "Avaliação e classificação de risco", "Plano de ação", "Acompanhamento e revisão", "Participação/consulta de trabalhadores", "Registro (inventário/plano)"],
  },
  {
    id: "NR28_READINESS",
    icon: FileCheck,
    title: "NR-28 — Prontidão Documental",
    items: ["Catálogo de evidências", "Timestamps e rastreabilidade", "Responsáveis por ação", "Status por item de ação"],
  },
  {
    id: "DF_DECREE",
    icon: Shield,
    title: "Decreto DF 47.412/2025 (quando aplicável)",
    items: ["Promoção da Saúde", "Prevenção do Adoecimento", "Capacitação", "Cuidado"],
  },
  {
    id: "KPIS",
    icon: BarChart3,
    title: "KPIs do Trimestre",
    items: [
      "Taxa de resposta COPSOQ → TBD",
      "Índice de risco global (agregado) → TBD",
      "Distribuição por bandas (alto/moderado/baixo) → TBD",
      "MTR-F: zonas por segmento → TBD",
      "Cobertura Educar (conclusões) → TBD",
      "Execução Transformar (intervenções) → TBD",
    ],
  },
  {
    id: "ACTIONS_NEXT_Q",
    icon: AlertTriangle,
    title: "Plano do Próximo Ciclo",
    items: ["Plano de re-medição (recheck)", "Roadmap do próximo trimestre"],
  },
];

const annexes = [
  "Catálogo de evidências",
  "Prints de dashboards agregados",
  "Registro de consultas e comunicações",
  "Matriz ILI com justificativas",
];

type ReportState =
  | { status: "idle" }
  | { status: "generating" }
  | { status: "ready"; reportId: string; title: string; subtitle: string; html: string; spec: CopsoqEsgReportSpec };

export default function EvoluirESG() {
  const [state, setState] = useState<ReportState>({ status: "idle" });
  const [open, setOpen] = useState(false);
  const [lastReport, setLastReport] = useState<{ reportId: string } | null>(null);

  const isBusy = state.status === "generating";

  const handleExportPdf = useCallback(() => {
    setState({ status: "generating" });
    // Use setTimeout to let the UI update before heavy work
    setTimeout(() => {
      try {
        const spec = buildCopsoqEsgReportSpec();
        const html = renderReportHtml(spec);
        setState({
          status: "ready",
          reportId: spec.reportId,
          title: spec.branding.title,
          subtitle: spec.branding.subtitle,
          html,
          spec,
        });
        setLastReport({ reportId: spec.reportId });
        setOpen(true);
      } catch (e) {
        console.error("Erro ao gerar relatório:", e);
        setState({ status: "idle" });
      }
    }, 80);
  }, []);

  const onPrint = useCallback(() => {
    if (state.status !== "ready") return;
    const win = window.open("", "_blank");
    if (!win) return;
    win.document.write(state.html);
    win.document.close();
    win.onload = () => {
      win.print();
    };
  }, [state]);

  const onDownloadHtml = useCallback(() => {
    if (state.status !== "ready") return;
    const blob = new Blob([state.html], { type: "text/html;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `relatorio_esg_${state.reportId.slice(0, 8)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  }, [state]);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header with CTAs */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <FileText className="h-6 w-6 text-cycle-evoluir" />
            Relatório ESG Trimestral — Q1
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            COPSOQ (Compliance) · Blindagem & Consolidação · Com trilha de auditoria
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button className="gap-2" onClick={handleExportPdf} disabled={isBusy}>
            {isBusy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Download className="h-4 w-4" />
            )}
            {isBusy ? "Gerando…" : "Exportar PDF"}
          </Button>
          {lastReport?.reportId && (
            <span className="text-[10px] text-muted-foreground font-mono">
              Último gerado: {lastReport.reportId.slice(0, 8)}
            </span>
          )}
        </div>
      </div>

      {/* Compliance callout */}
      <div className="flex items-center gap-2 bg-copsoq-salus/10 border border-copsoq-salus/30 rounded-lg p-4">
        <Shield className="h-5 w-5 text-copsoq-salus flex-shrink-0" />
        <p className="text-sm text-foreground">
          <strong>R4 (Compliance):</strong> Este relatório garante "prontidão documental e governança" — não promete "conformidade automática". Todas as evidências são rastreáveis via audit log.
        </p>
      </div>

      {/* Report sections */}
      <div className="space-y-4">
        {sections.map((section, i) => (
          <Card key={section.id} className="border border-border shadow-card">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <section.icon className="h-5 w-5 text-primary" />
                <span className="text-muted-foreground text-xs font-normal mr-1">Seção {i + 1}</span>
                {section.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {section.items.map((item, j) => (
                  <div key={j} className="flex items-center gap-2 text-sm">
                    <CheckCircle2 className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                    <span className="text-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* Annexes */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Anexos de Evidência</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {annexes.map((annex) => (
              <div key={annex} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50 border border-border">
                <FileText className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-sm text-foreground">{annex}</span>
                <Badge variant="secondary" className="ml-auto text-xs">TBD</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Governance */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Evoluir — Re-medição & Governança</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { label: "Tipo", value: "Campanha de re-medição (recheck)" },
              { label: "Comparação", value: "Baseline vs. pós-intervenção" },
              { label: "Cadência", value: "QBR (Quarterly Business Review)" },
              { label: "Audit Ready", value: "Sim — catálogo de evidências" },
            ].map((item) => (
              <div key={item.label} className="p-3 rounded-lg bg-muted/50 border border-border">
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className="text-sm font-medium text-foreground">{item.value}</p>
              </div>
            ))}
          </div>
          <div>
            <p className="text-xs text-muted-foreground mb-2">Verificações do recheck:</p>
            <div className="flex flex-wrap gap-2">
              {["Reduziu risco", "Aumentou recursos", "Melhorou funcionamento", "Sustentabilidade"].map((c) => (
                <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview Dialog */}
      {state.status === "ready" && (
        <ReportPreviewDialog
          open={open}
          onOpenChange={setOpen}
          reportId={state.reportId}
          reportTitle={state.title}
          reportSubtitle={state.subtitle}
          html={state.html}
          onPrint={onPrint}
          onDownloadHtml={onDownloadHtml}
          statusBadges={["Audit-ready", "sem dados individuais", "TBD onde faltar dado"]}
        />
      )}
    </div>
  );
}
