import type {
  CopsoqEsgReportSpec,
  Provenance,
  KPIValue,
  EvidenceItem,
  MTRFPoint,
} from "./types";
import { demoDimensionBars, demoMtrfPoints, demoIliTop10 } from "./demoData";

function prov(source: string, notes: string[] = []): Provenance {
  return {
    source,
    computedAtIso: new Date().toISOString(),
    minCellSizeApplied: 8,
    notes,
  };
}

function tbd(unit?: string, reason?: string): KPIValue {
  return {
    value: "TBD",
    unit,
    needsData: true,
    provenance: prov("local:demoData", reason ? [reason] : ["needs_data"]),
  };
}

function pctFromPoints(points: { zone: string }[], zone: "PATHOS" | "PREVENCAO" | "SALUS"): number {
  const total = points.length || 1;
  const count = points.filter((p) => p.zone === zone).length;
  return Math.round((count / total) * 100);
}

function evidenceStub(title: string, category: EvidenceItem["category"], linkInternal?: string): EvidenceItem {
  return {
    id: `ev_${title.toLowerCase().replace(/[^a-z0-9]+/g, "_")}`,
    title,
    category,
    status: "TBD",
    owner: "TBD",
    timestampIso: undefined,
    notes: "TBD (needs_data): anexar evidência real gerada pelo sistema.",
    linkInternal,
  };
}

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try {
    return JSON.parse(v) as T;
  } catch {
    return null;
  }
}

type CopsoqAggregatesInputV1 = {
  dimensionBars?: { name: string; score: number; band: string }[];
  mtrfPoints?: { segment: string; florescimentoX: number; riscoY: number; zone: string }[];
  iliTop10?: { rank: number; intervention: string; driver: string; targetRisk: string; ili: string; status: string; owner: string; justification?: string }[];
  kpis?: {
    responseRate?: string;
    globalRiskIndex?: string;
    educarCoverage?: string;
    transformarExecution?: string;
    riskBands?: { altoPct?: string; moderadoPct?: string; baixoPct?: string };
  };
};

function loadAggregates(): CopsoqAggregatesInputV1 | null {
  return safeParse<CopsoqAggregatesInputV1>(localStorage.getItem("ftos_copsoq_q1_aggregates_v1"));
}

export function buildCopsoqEsgReportSpec(params?: {
  tenantId?: string;
  tenantName?: string;
  quarterLabel?: string;
  minCellSize?: number;
}): CopsoqEsgReportSpec {
  const reportId = crypto?.randomUUID?.() || `rep_${Math.random().toString(16).slice(2)}`;
  const generatedAtIso = new Date().toISOString();
  const tenantId = params?.tenantId ?? "tenant_TBD";
  const tenantName = params?.tenantName ?? "Organização (TBD)";
  const quarterLabel = params?.quarterLabel ?? "Q1 2026";
  const minCellSize = params?.minCellSize ?? 8;

  const aggregates = loadAggregates();
  const usingAggregates = !!aggregates;

  const zoneOverviewProv = usingAggregates
    ? prov("local:state:ftos_copsoq_q1_aggregates_v1", ["aggregated_input"])
    : prov("local:demoData", ["R2_placeholder_data"]);

  const dimensionBars = aggregates?.dimensionBars?.length
    ? aggregates.dimensionBars.map((d) => ({
        name: d.name,
        score: Number.isFinite(d.score) ? d.score : 0,
        band: (d.band as any) ?? "TBD",
      }))
    : demoDimensionBars;

  const mtrfPoints: MTRFPoint[] = aggregates?.mtrfPoints?.length
    ? aggregates.mtrfPoints.map((p) => ({
        segment: p.segment,
        florescimentoX: Number.isFinite(p.florescimentoX) ? p.florescimentoX : 0,
        riscoY: Number.isFinite(p.riscoY) ? p.riscoY : 0,
        zone: (p.zone as any) ?? "PREVENCAO",
      }))
    : demoMtrfPoints;

  const iliTop10 = aggregates?.iliTop10?.length
    ? aggregates.iliTop10.map((r) => ({
        ...r,
        provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1"),
      }))
    : demoIliTop10.map((r) => ({
        ...r,
        provenance: prov("local:demoData", ["R2_placeholder_data"]),
      }));

  const kpiAgg = aggregates?.kpis;

  const nr1Sections = (items: string[]) =>
    items.map((item) => ({ item, status: "TBD" as const, provenance: prov("local:evidence", ["needs_data"]) }));

  return {
    reportId,
    tenant: { tenantName, tenantId, minCellSize },
    quarterLabel,
    generatedAtIso,
    branding: {
      logoUrl: "/placeholder.svg",
      footerText: `Instituto Felicidade para Todos\nImpact HUB Brasília — SGAN 601, Lote H, Ed. Íon, Ala Amarela\nAsa Norte, Brasília/DF — (61) 3550-8779\n© 2025 — www.felicidadeparatodos.com.br — @felicidadeparatodosbr`,
      title: "Relatório ESG Trimestral — Q1",
      subtitle: "COPSOQ (Compliance) · Blindagem & Consolidação · Com trilha de auditoria",
    },
    compliance: {
      r4Statement: 'Este relatório garante "prontidão documental e governança" — não promete "conformidade automática". Todas as evidências são rastreáveis via audit log.',
      nonPromiseStatement: "Este relatório é um instrumento de governança. A efetividade depende da execução do plano e do recheck (baseline vs pós).",
    },
    executiveSummary: {
      mtrfZonesOverview: {
        pathosPct: { value: `${pctFromPoints(mtrfPoints, "PATHOS")}`, unit: "%", provenance: zoneOverviewProv },
        prevencaoPct: { value: `${pctFromPoints(mtrfPoints, "PREVENCAO")}`, unit: "%", provenance: zoneOverviewProv },
        salusPct: { value: `${pctFromPoints(mtrfPoints, "SALUS")}`, unit: "%", provenance: zoneOverviewProv },
        provenance: zoneOverviewProv,
      },
      top3Risks: [
        { label: "TBD — Risco 1", band: "TBD" as const, provenance: prov("local:demoData", ["R2_placeholder_data"]) },
        { label: "TBD — Risco 2", band: "TBD" as const, provenance: prov("local:demoData", ["R2_placeholder_data"]) },
        { label: "TBD — Risco 3", band: "TBD" as const, provenance: prov("local:demoData", ["R2_placeholder_data"]) },
      ],
      top3Levers: [
        { label: "Redesenho de carga e cadência (Workload → Stress/Energy)" },
        { label: "Suporte do gestor e pares (Support/Trust)" },
        { label: "Acordos de trabalho e proteção de foco (Flexibility/Management)" },
      ],
      iliTop10,
    },
    nr1GroPgr: {
      hazards: nr1Sections(["Mapeamento de perigos psicossociais (COPSOQ)", "Classificação por fator/dimensão"]),
      riskAssessment: nr1Sections(["Avaliação de gravidade/frequência", "Classificação por banda (ALTO/MODERADO/BAIXO)"]),
      actionPlan: nr1Sections(["Plano de ação por driver", "Responsáveis e prazos definidos"]),
      review: nr1Sections(["Acompanhamento trimestral (QBR)", "Recheck baseline vs pós"]),
      participation: nr1Sections(["Canal de consulta de trabalhadores", "Registro de participação"]),
      registry: nr1Sections(["Inventário de riscos (export)", "Plano consolidado (PGR)"]),
    },
    nr28Readiness: {
      evidenceCatalog: [
        evidenceStub("Catálogo de evidências", "EVIDENCE_CATALOG"),
        evidenceStub("Prints de dashboards agregados", "DASHBOARD_SNAPSHOT", "/copsoq/q1/results/overview"),
        evidenceStub("Registro de consultas e comunicações", "CONSULTATION_RECORD"),
        evidenceStub("Matriz ILI com justificativas", "ILI_MATRIX", "/copsoq/q1/results/mtrf"),
      ],
      notes: ["TBD (needs_data): vincular cada evidência a responsável, timestamp e status.", "Recomendação: armazenar evidências como anexos (PDF/prints) em storage e referenciar via link interno com RBAC."],
    },
    decreeDf47412: {
      applicable: "TBD",
      items: [
        { item: "Promoção da Saúde", status: "TBD" },
        { item: "Prevenção do Adoecimento", status: "TBD" },
        { item: "Capacitação", status: "TBD" },
        { item: "Cuidado", status: "TBD" },
      ],
    },
    kpis: {
      responseRate: kpiAgg?.responseRate
        ? { value: kpiAgg.responseRate, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
        : tbd("%", "Taxa de resposta COPSOQ ainda não calculada no demo"),
      globalRiskIndex: kpiAgg?.globalRiskIndex
        ? { value: kpiAgg.globalRiskIndex, unit: "0–100", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
        : tbd("0–100", "Índice de risco global agregado ainda não calculado"),
      riskBands: {
        altoPct: kpiAgg?.riskBands?.altoPct
          ? { value: kpiAgg.riskBands.altoPct, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
          : tbd("%"),
        moderadoPct: kpiAgg?.riskBands?.moderadoPct
          ? { value: kpiAgg.riskBands.moderadoPct, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
          : tbd("%"),
        baixoPct: kpiAgg?.riskBands?.baixoPct
          ? { value: kpiAgg.riskBands.baixoPct, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
          : tbd("%"),
      },
      mtrfZonesBySegment: tbd(undefined, "Zonas MTR-F por segmento — requer dados reais"),
      educarCoverage: kpiAgg?.educarCoverage
        ? { value: kpiAgg.educarCoverage, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
        : tbd("%", "Cobertura Educar ainda não calculada"),
      transformarExecution: kpiAgg?.transformarExecution
        ? { value: kpiAgg.transformarExecution, unit: "%", provenance: prov("local:state:ftos_copsoq_q1_aggregates_v1") }
        : tbd("%", "Execução Transformar ainda não calculada"),
    },
    nextCyclePlan: {
      recheck: {
        type: "Campanha de re-medição (recheck)",
        comparison: "Baseline vs. pós-intervenção",
        cadence: "QBR (Quarterly Business Review)",
        auditReady: "Sim — catálogo de evidências",
      },
      roadmap: [
        { item: "Planejar campanha de recheck", owner: "RH/SST", when: "TBD", status: "TBD" },
        { item: "Executar Top 10 intervenções (ILI)", owner: "Gestores + RH/SST", when: "TBD", status: "TBD" },
        { item: "Consolidar evidências e preparar QBR", owner: "Consultor FT", when: "TBD", status: "TBD" },
      ],
      recheckValidations: ["Reduziu risco", "Aumentou recursos", "Melhorou funcionamento", "Sustentabilidade"],
    },
    annexes: {
      evidenceCatalog: [
        evidenceStub("Catálogo de evidências", "EVIDENCE_CATALOG"),
      ],
      dashboardSnapshots: [
        evidenceStub("Snapshot: Dashboard Q1 (Resultados)", "DASHBOARD_SNAPSHOT", "/copsoq/q1/results/overview"),
        evidenceStub("Snapshot: MTR-F", "DASHBOARD_SNAPSHOT", "/copsoq/q1/results/mtrf"),
        evidenceStub("Snapshot: Trilhas (Educar)", "DASHBOARD_SNAPSHOT", "/copsoq/q1/educar/trilhas"),
        evidenceStub("Snapshot: Backlog (Transformar)", "DASHBOARD_SNAPSHOT", "/copsoq/q1/transformar/backlog"),
      ],
      consultationRecords: [
        evidenceStub("Ata/registro de consulta de trabalhadores", "CONSULTATION_RECORD"),
        evidenceStub("Comunicado de lançamento da campanha", "CONSULTATION_RECORD"),
      ],
      iliMatrix: [
        evidenceStub("Matriz ILI (planilha/export)", "ILI_MATRIX"),
        evidenceStub("Justificativas ILI por intervenção", "ILI_MATRIX"),
      ],
    },
    visuals: {
      mtrfPoints,
      riskDimensionBars: dimensionBars,
    },
    provenanceIndex: {
      "exec.mtrf.zone_pct": zoneOverviewProv,
      "exec.top_risks": prov("local:demoData", ["R2_placeholder_data"]),
      "exec.ili_top10": prov("local:demoData", ["R2_placeholder_data"]),
      "kpis.*": prov("local:demoData", ["needs_data"]),
    },
  };
}
