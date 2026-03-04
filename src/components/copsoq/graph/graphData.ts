// WWP System Graph — data layer (from JSON spec)

export interface DriverData {
  slug: string;
  label: string;
  tier: string;
  definition_short: string;
  system_role: string;
  quick_wins: string[];
  failure_modes: string[];
  next_dependencies: string[];
}

export interface MechanismData {
  label: string;
  tier: string;
  definition_short: string;
  system_role: string;
}

export interface EdgeRelation {
  relation: "enables" | "tradeoff" | "conflicts_with";
  weight: number;
  evidence_ids: string[];
  rationale_short: string;
}

export const TIERS = {
  tier_0_foundation: { label: "Fundação", color: "hsl(var(--primary))", order: 0 },
  tier_1_reduce_harm: { label: "Reduzir Dano", color: "hsl(var(--copsoq-pathos))", order: 1 },
  tier_2_cohesion_fairness: { label: "Coesão & Justiça", color: "hsl(var(--copsoq-prevencao))", order: 2 },
  tier_3_capability_culture: { label: "Capacidade & Cultura", color: "hsl(var(--cycle-evoluir))", order: 3 },
  bridge: { label: "Mecanismo", color: "hsl(var(--muted-foreground))", order: -1 },
} as const;

export type TierKey = keyof typeof TIERS;

export const DRIVERS: Record<string, DriverData> = {
  management: {
    slug: "management", label: "Management", tier: "tier_0_foundation",
    definition_short: "Gestão de suporte é fundamental para como as pessoas se sentem no trabalho e para fazer o trabalho acontecer.",
    system_role: "Driver-base: aumenta adesão, qualidade de execução e segurança psicológica indireta.",
    quick_wins: ["Ritual de 1:1 com foco em remoção de impedimentos", "Acordos de equipe (o que é 'bom trabalho')", "Feedback curto e frequente"],
    failure_modes: ["Microgestão reduz autonomia e confiança", "Metas sem feedback geram pressão improdutiva"],
    next_dependencies: ["trust", "job_design"],
  },
  trust: {
    slug: "trust", label: "Trust", tier: "tier_0_foundation",
    definition_short: "Confiança cria um ambiente seguro, valorizado e colaborativo, habilitando criatividade e inovação.",
    system_role: "Habilita voz e aprendizagem; melhora adoção de intervenções.",
    quick_wins: ["Regras explícitas contra retaliação", "Rituais de escuta (check-in/check-out)", "Transparência de decisão"],
    failure_modes: ["Inconsistência entre discurso e prática", "Justiça percebida baixa"],
    next_dependencies: ["psychological_safety", "voice"],
  },
  stress: {
    slug: "stress", label: "Stress", tier: "tier_1_reduce_harm",
    definition_short: "Estresse elevado gera riscos relevantes; é necessário identificar e mitigar causas-raiz.",
    system_role: "Redução de dano: libera capacidade para aprender e mudar.",
    quick_wins: ["Mapear demandas/recursos por função", "Remover fricções operacionais", "Ajustar prazos e WIP"],
    failure_modes: ["Culpar indivíduo em vez de desenho do trabalho", "Intervenções sem diagnóstico"],
    next_dependencies: ["recovery", "energy"],
  },
  support: {
    slug: "support", label: "Support", tier: "tier_1_reduce_harm",
    definition_short: "Suporte real reduz estresse, aumenta satisfação e melhora performance.",
    system_role: "Amortece demandas e sustenta transferência de aprendizagem.",
    quick_wins: ["Treinar suporte do supervisor", "Clarificar canais de suporte e SLA interno", "Ajustar recursos para tarefas críticas"],
    failure_modes: ["Suporte desigual (injustiça percebida)", "Prometer e não cumprir"],
    next_dependencies: ["transfer", "stress"],
  },
  energy: {
    slug: "energy", label: "Energy", tier: "tier_1_reduce_harm",
    definition_short: "Pessoas energizadas tendem a estar mais engajadas, produtivas e satisfeitas no trabalho.",
    system_role: "Pré-condição de atenção e aprendizagem; sustenta performance sem exaustão.",
    quick_wins: ["Micro-pausas e limites de reunião", "Proteção de blocos de foco", "Higiene de comunicação"],
    failure_modes: ["Cultura de urgência permanente", "Recuperação inexistente"],
    next_dependencies: ["learning"],
  },
  inclusion_belonging: {
    slug: "inclusion_belonging", label: "Inclusion & Belonging", tier: "tier_2_cohesion_fairness",
    definition_short: "Diversidade compõe a força de trabalho; inclusão e pertencimento permitem que pessoas prosperem.",
    system_role: "Coesão: melhora voz, retenção e colaboração; exige consistência.",
    quick_wins: ["Rituais de pertencimento", "Regras de fala em reuniões", "Monitorar acesso equitativo"],
    failure_modes: ["Tokenismo", "Flexibilidade com estigma"],
    next_dependencies: ["trust", "flexibility"],
  },
  compensation: {
    slug: "compensation", label: "Compensation", tier: "tier_2_cohesion_fairness",
    definition_short: "Remuneração justa e outras formas de compensação são base para bem-estar no trabalho.",
    system_role: "Justiça procedimental → confiança sistêmica.",
    quick_wins: ["Comunicar princípios", "Auditar equidade por função", "Padronizar critérios de progressão"],
    failure_modes: ["Transparência sem governança", "Percepção de favoritismo"],
    next_dependencies: ["procedural_justice", "trust"],
  },
  flexibility: {
    slug: "flexibility", label: "Flexibility", tier: "tier_2_cohesion_fairness",
    definition_short: "Mais liberdade sobre onde/quando trabalhar pode melhorar bem-estar e produtividade.",
    system_role: "Trade-offs: equidade, pertencimento, coordenação.",
    quick_wins: ["Acordos de equipe de disponibilidade", "Critérios claros de elegibilidade", "Rituais de conexão híbrida"],
    failure_modes: ["Flex stigma / penalidade de carreira", "Injustiça de acesso"],
    next_dependencies: ["inclusion_belonging"],
  },
  learning: {
    slug: "learning", label: "Learning", tier: "tier_3_capability_culture",
    definition_short: "Autonomia e acesso a aprendizagem e desenvolvimento trazem múltiplos benefícios ao bem-estar.",
    system_role: "Transforma intervenção em capacidade cumulativa.",
    quick_wins: ["Debrief/AAR pós-eventos", "Trilhas curtas com prática e feedback", "Registro de aprendizados"],
    failure_modes: ["Treinamento-teatro (sem transferência)", "Overload sem aplicação"],
    next_dependencies: ["transfer", "achievement"],
  },
  purpose: {
    slug: "purpose", label: "Purpose", tier: "tier_3_capability_culture",
    definition_short: "Propósito pode ser um motivador forte que impulsiona performance e bem-estar.",
    system_role: "Sustenta persistência; depende de desenho do trabalho e significado percebido.",
    quick_wins: ["Conectar tarefas a impacto real", "Dar autonomia com responsabilidade", "Histórias curtas de impacto"],
    failure_modes: ["Moralização sem prática", "Significado só no topo"],
    next_dependencies: ["achievement"],
  },
  appreciation: {
    slug: "appreciation", label: "Appreciation", tier: "tier_3_capability_culture",
    definition_short: "Apreciação genuína pode impactar profundamente o bem-estar.",
    system_role: "Fortalece vínculos e confiança; precisa de justiça e critério.",
    quick_wins: ["Reconhecer comportamento observável", "Apreciação frequente e distribuída", "Critérios explícitos"],
    failure_modes: ["Reconhecimento desigual", "Prêmios sem transparência"],
    next_dependencies: ["trust"],
  },
  achievement: {
    slug: "achievement", label: "Achievement", tier: "tier_3_capability_culture",
    definition_short: "Bem-estar se relaciona à realização de objetivos valorizados por meio de habilidade, esforço e dedicação.",
    system_role: "Consolida resultados; alimenta autoeficácia coletiva.",
    quick_wins: ["Metas claras + feedback curto", "Definir 'bom o suficiente'", "Celebrar progresso"],
    failure_modes: ["Pressão sem suporte", "Metas desconectadas de significado"],
    next_dependencies: ["collective_efficacy"],
  },
};

export const MECHANISMS: Record<string, MechanismData> = {
  mech_psych_safety: {
    label: "Psychological Safety", tier: "bridge",
    definition_short: "Segurança psicológica habilita voz, aprendizagem e cooperação.",
    system_role: "Aumenta voz e aprendizagem; reduz silêncio defensivo.",
  },
  mech_job_design: {
    label: "Job Design", tier: "bridge",
    definition_short: "Desenho do trabalho (autonomia/feedback/significância) é alavanca de bem-estar e desempenho.",
    system_role: "Alavanca central para Purpose e Achievement.",
  },
  mech_recovery: {
    label: "Recovery & Detachment", tier: "bridge",
    definition_short: "Recuperação e desligamento do trabalho sustentam energia ao longo do tempo.",
    system_role: "Pré-condição de energia sustentável.",
  },
  mech_procedural_justice: {
    label: "Procedural Justice", tier: "bridge",
    definition_short: "Justiça procedimental sustenta confiança e legitimidade de políticas.",
    system_role: "Constrói confiança no sistema decisório.",
  },
  mech_voice: {
    label: "Employee Voice", tier: "bridge",
    definition_short: "Voz do colaborador aumenta qualidade de diagnóstico, adesão e melhoria contínua.",
    system_role: "Aumenta qualidade de diagnóstico e adesão.",
  },
  mech_transfer: {
    label: "Transfer of Learning", tier: "bridge",
    definition_short: "Transferência transforma treino em prática sustentada no trabalho real.",
    system_role: "Evita treinamento-teatro; torna aprendizagem capacidade.",
  },
  mech_collective_efficacy: {
    label: "Collective Efficacy", tier: "bridge",
    definition_short: "Autoeficácia coletiva aumenta persistência e execução de objetivos.",
    system_role: "Sustenta persistência e performance coletiva.",
  },
};

export const GRAPH_EDGES: Array<{
  id: string;
  source: string;
  target: string;
  data: EdgeRelation;
}> = [
  { id: "e1", source: "drv_management", target: "drv_trust", data: { relation: "enables", weight: 0.92, evidence_ids: ["MGT-01","TRU-01","COM-01"], rationale_short: "Gestão consistente e justa aumenta confiança e previsibilidade." }},
  { id: "e2", source: "drv_trust", target: "mech_psych_safety", data: { relation: "enables", weight: 0.9, evidence_ids: ["TRU-09","TRU-06"], rationale_short: "Confiança reduz medo de retaliação e abre espaço para aprender." }},
  { id: "e3", source: "mech_psych_safety", target: "drv_inclusion_belonging", data: { relation: "enables", weight: 0.85, evidence_ids: ["INC-01","TRU-09"], rationale_short: "Com segurança, pessoas participam e são valorizadas em sua unicidade." }},
  { id: "e4", source: "drv_support", target: "drv_stress", data: { relation: "enables", weight: 0.78, evidence_ids: ["SUP-01","STR-05"], rationale_short: "Suporte funciona como amortecedor de demandas e reduz exaustão." }},
  { id: "e5", source: "drv_flexibility", target: "drv_inclusion_belonging", data: { relation: "tradeoff", weight: 0.35, evidence_ids: ["FLX-03","INC-02"], rationale_short: "Flexibilidade sem governança pode reduzir pertencimento." }},
  { id: "e6", source: "drv_stress", target: "drv_energy", data: { relation: "enables", weight: 0.7, evidence_ids: ["STR-01","ENE-02"], rationale_short: "Menos estresse libera recuperação e melhora energia sustentada." }},
  { id: "e7", source: "drv_energy", target: "drv_learning", data: { relation: "enables", weight: 0.62, evidence_ids: ["ENE-01","LRN-03"], rationale_short: "Energia favorece atenção e prática — base para aprender." }},
  { id: "e8", source: "drv_learning", target: "drv_achievement", data: { relation: "enables", weight: 0.7, evidence_ids: ["LRN-04","ACH-01"], rationale_short: "Aprender e transferir competência aumenta realização de objetivos." }},
  { id: "e9", source: "drv_compensation", target: "mech_procedural_justice", data: { relation: "enables", weight: 0.6, evidence_ids: ["COM-01","COM-08"], rationale_short: "Transparência e justiça procedimental sustentam legitimidade." }},
  { id: "e10", source: "mech_procedural_justice", target: "drv_trust", data: { relation: "enables", weight: 0.55, evidence_ids: ["COM-01","TRU-01"], rationale_short: "Percepção de justiça aumenta confiança no sistema." }},
  { id: "e11", source: "drv_trust", target: "mech_voice", data: { relation: "enables", weight: 0.75, evidence_ids: ["TRU-09","LRN-08"], rationale_short: "Quando há confiança, a voz circula e informação melhora decisões." }},
  { id: "e12", source: "mech_voice", target: "drv_learning", data: { relation: "enables", weight: 0.6, evidence_ids: ["LRN-08"], rationale_short: "Compartilhamento de informação acelera aprendizagem coletiva." }},
  { id: "e13", source: "drv_support", target: "mech_transfer", data: { relation: "enables", weight: 0.7, evidence_ids: ["LRN-04","SUP-05"], rationale_short: "Suporte do gestor sustenta transferência de aprendizagem." }},
  { id: "e14", source: "mech_transfer", target: "drv_learning", data: { relation: "enables", weight: 0.65, evidence_ids: ["LRN-04"], rationale_short: "Transferência transforma treino em prática no trabalho." }},
  { id: "e15", source: "drv_purpose", target: "drv_achievement", data: { relation: "enables", weight: 0.55, evidence_ids: ["PUR-01","ACH-08"], rationale_short: "Sentido aumenta persistência e engajamento." }},
  { id: "e16", source: "drv_appreciation", target: "drv_trust", data: { relation: "enables", weight: 0.45, evidence_ids: ["APP-03","COM-01"], rationale_short: "Apreciação justa fortalece vínculos e percepção de valor." }},
  { id: "e17", source: "drv_management", target: "mech_job_design", data: { relation: "enables", weight: 0.8, evidence_ids: ["ACH-07","PUR-05"], rationale_short: "Gestores moldam autonomia, feedback e significância." }},
  { id: "e18", source: "mech_job_design", target: "drv_purpose", data: { relation: "enables", weight: 0.7, evidence_ids: ["PUR-05","PUR-06"], rationale_short: "Significância da tarefa aumenta sentido percebido." }},
  { id: "e19", source: "drv_stress", target: "mech_recovery", data: { relation: "enables", weight: 0.6, evidence_ids: ["STR-01","ENE-02"], rationale_short: "Reduzir demandas aumenta espaço para recuperar." }},
  { id: "e20", source: "mech_recovery", target: "drv_energy", data: { relation: "enables", weight: 0.75, evidence_ids: ["ENE-01","ENE-07"], rationale_short: "Recuperação e micro-pausas sustentam energia." }},
  { id: "e21", source: "drv_achievement", target: "mech_collective_efficacy", data: { relation: "enables", weight: 0.5, evidence_ids: ["ACH-05","ACH-01"], rationale_short: "Vitórias e feedback constroem crença coletiva de capacidade." }},
];

// Map node IDs to their data source
export const getNodeData = (nodeId: string): DriverData | MechanismData | null => {
  if (nodeId.startsWith("drv_")) {
    const slug = nodeId.replace("drv_", "");
    return DRIVERS[slug] || null;
  }
  return MECHANISMS[nodeId] || null;
};

export const isDriver = (nodeId: string): boolean => nodeId.startsWith("drv_");
