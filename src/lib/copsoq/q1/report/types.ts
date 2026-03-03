export type CopsoqRiskBand = "ALTO" | "MODERADO" | "BAIXO" | "TBD";

export type Provenance = {
  source: string;
  computedAtIso: string;
  query?: Record<string, unknown>;
  minCellSizeApplied?: number;
  notes?: string[];
};

export type KPIValue = {
  value: string;
  unit?: string;
  needsData?: boolean;
  provenance?: Provenance;
};

export type EvidenceItem = {
  id: string;
  title: string;
  category:
    | "EVIDENCE_CATALOG"
    | "DASHBOARD_SNAPSHOT"
    | "CONSULTATION_RECORD"
    | "ILI_MATRIX"
    | "OTHER";
  status: "TBD" | "OK" | "MISSING" | "IN_PROGRESS";
  owner?: string;
  timestampIso?: string;
  notes?: string;
  linkInternal?: string;
};

export type MTRFPoint = {
  segment: string;
  florescimentoX: number;
  riscoY: number;
  zone: "PATHOS" | "PREVENCAO" | "SALUS";
};

export type ILIRow = {
  rank: number;
  intervention: string;
  driver: string;
  targetRisk: string;
  ili: string;
  status: string;
  owner: string;
  justification?: string;
  provenance?: Provenance;
};

export type CopsoqEsgReportSpec = {
  reportId: string;
  tenant: {
    tenantName: string;
    tenantId: string;
    minCellSize: number;
  };
  quarterLabel: string;
  generatedAtIso: string;
  branding: {
    logoUrl: string;
    footerText: string;
    title: string;
    subtitle: string;
  };
  compliance: {
    r4Statement: string;
    nonPromiseStatement: string;
  };
  executiveSummary: {
    mtrfZonesOverview: {
      pathosPct: KPIValue;
      prevencaoPct: KPIValue;
      salusPct: KPIValue;
      provenance?: Provenance;
    };
    top3Risks: { label: string; band: CopsoqRiskBand; provenance?: Provenance }[];
    top3Levers: { label: string; provenance?: Provenance }[];
    iliTop10: ILIRow[];
  };
  nr1GroPgr: {
    hazards: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
    riskAssessment: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
    actionPlan: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
    review: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
    participation: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
    registry: { item: string; status: "TBD" | "OK"; provenance?: Provenance }[];
  };
  nr28Readiness: {
    evidenceCatalog: EvidenceItem[];
    notes?: string[];
  };
  decreeDf47412: {
    applicable: "TBD" | "YES" | "NO";
    items: { item: string; status: "TBD" | "OK" }[];
  };
  kpis: {
    responseRate: KPIValue;
    globalRiskIndex: KPIValue;
    riskBands: {
      altoPct: KPIValue;
      moderadoPct: KPIValue;
      baixoPct: KPIValue;
    };
    mtrfZonesBySegment: KPIValue;
    educarCoverage: KPIValue;
    transformarExecution: KPIValue;
  };
  nextCyclePlan: {
    recheck: {
      type: string;
      comparison: string;
      cadence: string;
      auditReady: string;
    };
    roadmap: { item: string; owner: string; when: string; status: "TBD" | "PLANEJADO" }[];
    recheckValidations: string[];
  };
  annexes: {
    evidenceCatalog: EvidenceItem[];
    dashboardSnapshots: EvidenceItem[];
    consultationRecords: EvidenceItem[];
    iliMatrix: EvidenceItem[];
  };
  visuals: {
    mtrfPoints: MTRFPoint[];
    riskDimensionBars: { name: string; score: number; band: CopsoqRiskBand }[];
  };
  provenanceIndex: Record<string, Provenance>;
};
