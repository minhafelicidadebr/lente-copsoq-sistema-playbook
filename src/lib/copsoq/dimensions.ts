/**
 * COPSOQ III — Versão Padrão Brasileira (Bounassar, 2024)
 * Metadados apenas — SEM texto de itens (R2: item bank server-side)
 * 
 * Modelo fatorial: 7 fatores validados para trabalhadores brasileiros
 * Escala Likert 5 pontos
 */

export type LikertScale = "frequency" | "intensity" | "agreement";

export interface CopsoqDimension {
  id: string;
  name: string;
  nameEn: string;
  factorId: number;
  itemCount: number;
  likertScale: LikertScale;
  /** true = higher score means BETTER outcome */
  positivePolarity: boolean;
}

export interface CopsoqFactor {
  id: number;
  name: string;
  description: string;
  /** Risk interpretation: higher raw score → riskDirection */
  riskDirection: "higher_is_risk" | "lower_is_risk";
  color: string;
  icon: string;
  dimensions: string[];
}

export const LIKERT_SCALES: Record<LikertScale, Array<{ value: number; label: string }>> = {
  frequency: [
    { value: 1, label: "Nunca / Quase nunca" },
    { value: 2, label: "Raramente" },
    { value: 3, label: "Às vezes" },
    { value: 4, label: "Frequentemente" },
    { value: 5, label: "Sempre" },
  ],
  intensity: [
    { value: 1, label: "Nada / Quase nada" },
    { value: 2, label: "Um pouco" },
    { value: 3, label: "Moderadamente" },
    { value: 4, label: "Muito" },
    { value: 5, label: "Extremamente" },
  ],
  agreement: [
    { value: 1, label: "Em muito pouca medida" },
    { value: 2, label: "Em pequena medida" },
    { value: 3, label: "Um pouco" },
    { value: 4, label: "Em grande medida" },
    { value: 5, label: "Em muito grande medida" },
  ],
};

export const FACTORS: CopsoqFactor[] = [
  {
    id: 1,
    name: "Satisfação & Autoeficácia",
    description: "Satisfação com o trabalho, saúde autoavaliada, autoeficácia, sono e burnout",
    riskDirection: "lower_is_risk",
    color: "hsl(var(--copsoq-salus))",
    icon: "smile",
    dimensions: ["JS", "GH", "SE", "SL", "BO"],
  },
  {
    id: 2,
    name: "Sintomas de Stress & Depressão",
    description: "Stress geral, somático, cognitivo e sintomas depressivos",
    riskDirection: "higher_is_risk",
    color: "hsl(var(--copsoq-pathos))",
    icon: "brain",
    dimensions: ["ST", "SO", "CS", "DS"],
  },
  {
    id: 3,
    name: "Demandas & Conflito Trabalho-Vida",
    description: "Exigências quantitativas, ocultamento de emoções e conflito trabalho-vida",
    riskDirection: "higher_is_risk",
    color: "hsl(var(--copsoq-prevencao))",
    icon: "scale",
    dimensions: ["QD", "HE", "WF"],
  },
  {
    id: 4,
    name: "Influência & Autonomia",
    description: "Grau de influência sobre as decisões e processos de trabalho",
    riskDirection: "lower_is_risk",
    color: "hsl(var(--cycle-mensurar))",
    icon: "compass",
    dimensions: ["IN"],
  },
  {
    id: 5,
    name: "Comunidade, Engajamento & Significado",
    description: "Variação, desenvolvimento, significado, compromisso, clareza, apoio social, comunidade, engajamento e liderança",
    riskDirection: "lower_is_risk",
    color: "hsl(var(--cycle-educar))",
    icon: "users",
    dimensions: ["VA", "PD", "MW", "CW", "CL", "SC", "SW", "WE", "QL"],
  },
  {
    id: 6,
    name: "Reconhecimento & Liderança",
    description: "Apoio dos supervisores, justiça organizacional, reconhecimento e confiança horizontal",
    riskDirection: "lower_is_risk",
    color: "hsl(var(--cycle-transformar))",
    icon: "award",
    dimensions: ["SS", "JU", "RE", "TE"],
  },
  {
    id: 7,
    name: "Insegurança no Trabalho",
    description: "Insegurança quanto ao emprego e ao ambiente de trabalho",
    riskDirection: "higher_is_risk",
    color: "hsl(var(--copsoq-pathos))",
    icon: "shield-alert",
    dimensions: ["JI", "IW"],
  },
];

/**
 * 26 dimensions from COPSOQ III standard version
 * itemCount from the international standard (60 items total)
 */
export const DIMENSIONS: CopsoqDimension[] = [
  { id: "QD", name: "Demandas Quantitativas", nameEn: "Quantitative Demands", factorId: 3, itemCount: 3, likertScale: "frequency", positivePolarity: false },
  { id: "WP", name: "Ritmo de Trabalho", nameEn: "Work Pace", factorId: 3, itemCount: 1, likertScale: "frequency", positivePolarity: false },
  { id: "ED", name: "Demandas Emocionais", nameEn: "Emotional Demands", factorId: 3, itemCount: 1, likertScale: "frequency", positivePolarity: false },
  { id: "HE", name: "Demandas de Ocultamento de Emoções", nameEn: "Demands for Hiding Emotions", factorId: 3, itemCount: 2, likertScale: "frequency", positivePolarity: false },
  { id: "IN", name: "Influência no Trabalho", nameEn: "Influence at Work", factorId: 4, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "PD", name: "Possibilidades de Desenvolvimento", nameEn: "Possibilities for Development", factorId: 5, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "VA", name: "Variação de Trabalho", nameEn: "Variation of Work", factorId: 5, itemCount: 1, likertScale: "agreement", positivePolarity: true },
  { id: "MW", name: "Significado do Trabalho", nameEn: "Meaning of Work", factorId: 5, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "CW", name: "Compromisso com o Local de Trabalho", nameEn: "Commitment to the Workplace", factorId: 5, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "PR", name: "Previsibilidade", nameEn: "Predictability", factorId: 5, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "CL", name: "Clareza da Função", nameEn: "Role Clarity", factorId: 5, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "CO", name: "Conflitos na Função", nameEn: "Role Conflicts", factorId: 3, itemCount: 2, likertScale: "frequency", positivePolarity: false },
  { id: "QL", name: "Qualidade da Liderança", nameEn: "Quality of Leadership", factorId: 6, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "SS", name: "Apoio Social dos Supervisores", nameEn: "Social Support from Supervisors", factorId: 6, itemCount: 2, likertScale: "frequency", positivePolarity: true },
  { id: "SC", name: "Apoio Social dos Colegas", nameEn: "Social Support from Colleagues", factorId: 5, itemCount: 2, likertScale: "frequency", positivePolarity: true },
  { id: "SW", name: "Senso de Comunidade no Trabalho", nameEn: "Sense of Community at Work", factorId: 5, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "JU", name: "Justiça Organizacional", nameEn: "Organizational Justice", factorId: 6, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "RE", name: "Reconhecimento", nameEn: "Recognition", factorId: 6, itemCount: 2, likertScale: "agreement", positivePolarity: true },
  { id: "TE", name: "Confiança Horizontal", nameEn: "Horizontal Trust", factorId: 6, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "WF", name: "Conflito Trabalho-Vida Pessoal", nameEn: "Work-Life Conflict", factorId: 3, itemCount: 3, likertScale: "frequency", positivePolarity: false },
  { id: "JS", name: "Satisfação com o Trabalho", nameEn: "Job Satisfaction", factorId: 1, itemCount: 5, likertScale: "intensity", positivePolarity: true },
  { id: "GH", name: "Saúde Autoavaliada", nameEn: "Self-rated Health", factorId: 1, itemCount: 1, likertScale: "intensity", positivePolarity: true },
  { id: "SE", name: "Autoeficácia", nameEn: "Self-efficacy", factorId: 1, itemCount: 3, likertScale: "agreement", positivePolarity: true },
  { id: "BO", name: "Burnout", nameEn: "Burnout", factorId: 1, itemCount: 2, likertScale: "frequency", positivePolarity: false },
  { id: "SL", name: "Problemas do Sono", nameEn: "Sleeping Problems", factorId: 1, itemCount: 2, likertScale: "frequency", positivePolarity: false },
  { id: "JI", name: "Insegurança em relação ao Emprego", nameEn: "Job Insecurity", factorId: 7, itemCount: 2, likertScale: "agreement", positivePolarity: false },
  { id: "IW", name: "Insegurança em relação ao Ambiente", nameEn: "Insecurity over Working Conditions", factorId: 7, itemCount: 2, likertScale: "agreement", positivePolarity: false },
];

/** Total items in COPSOQ III standard version */
export const TOTAL_ITEMS = DIMENSIONS.reduce((sum, d) => sum + d.itemCount, 0);

export function getDimensionsByFactor(factorId: number): CopsoqDimension[] {
  return DIMENSIONS.filter((d) => d.factorId === factorId);
}

export function getFactorById(factorId: number): CopsoqFactor | undefined {
  return FACTORS.find((f) => f.id === factorId);
}
