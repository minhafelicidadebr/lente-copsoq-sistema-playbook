/**
 * Learning Trail Recommendations
 * Maps COPSOQ factor results → recommended learning content
 * 
 * Collaborators: Laurie Santos (Science of Well-Being) + TED
 * Managers/Admins: Work Wellbeing Playbook gamified trails (12 drivers)
 */

import type { FactorScore, RiskBand } from "./scoring";

export interface TrailVideo {
  id: string;
  platform: "youtube" | "ted";
  title: string;
  titlePt: string;
  summary: string;
  tags: string[];
  url: string;
  embedUrl: string;
  durationMin?: number;
}

export interface LearningTrail {
  id: string;
  name: string;
  description: string;
  targetFactors: number[];
  level: "collaborator" | "manager" | "admin";
  module: string;
  videos: TrailVideo[];
  xpReward: number;
}

// Laurie Santos — Science of Well-Being (for Collaborators)
const LAURIE_SANTOS_VIDEOS: TrailVideo[] = [
  { id: "LS-01", platform: "youtube", title: "Become Happier by Learning & Applying Psychological Science", titlePt: "Ficar mais feliz usando a ciência", summary: "Introdução à ideia de que felicidade é habilidade treinável.", tags: ["introdução", "ciência da felicidade"], url: "https://www.youtube.com/watch?v=s-00jpvglb8", embedUrl: "https://www.youtube.com/embed/s-00jpvglb8" },
  { id: "LS-02", platform: "youtube", title: "Why This Course Exists", titlePt: "Por que este curso existe?", summary: "Explica o motivo da criação do curso sobre felicidade.", tags: ["introdução", "propósito"], url: "https://www.youtube.com/watch?v=y5s3uunbnSQ", embedUrl: "https://www.youtube.com/embed/y5s3uunbnSQ" },
  { id: "LS-03", platform: "youtube", title: "What is the G.I. Joe Fallacy?", titlePt: "O que é a falácia do G.I. Joe?", summary: "Por que só saber não é suficiente para mudar comportamento.", tags: ["comportamento", "mudança de hábito"], url: "https://www.youtube.com/watch?v=YslKo9KkNi4", embedUrl: "https://www.youtube.com/embed/YslKo9KkNi4" },
  { id: "LS-07", platform: "youtube", title: "Annoying Features of The Mind", titlePt: "Características irritantes da nossa mente", summary: "Apresenta bugs do cérebro que atrapalham nossa felicidade.", tags: ["cérebro", "viés cognitivo"], url: "https://www.youtube.com/watch?v=example7", embedUrl: "https://www.youtube.com/embed/example7" },
  { id: "LS-09", platform: "youtube", title: "Miswanting: The Bias That's Sabotaging Your Happiness", titlePt: "Miswanting: o viés que sabota a felicidade", summary: "Por que desejamos coisas que não nos fazem felizes.", tags: ["miswanting", "viés cognitivo"], url: "https://www.youtube.com/watch?v=example9", embedUrl: "https://www.youtube.com/embed/example9" },
  { id: "LS-16", platform: "youtube", title: "Want to Be Happier? Thwart Hedonic Adaptation", titlePt: "Enfrente a adaptação hedônica", summary: "Estratégias para evitar que a mente se acostume com coisas boas.", tags: ["adaptação hedônica", "estratégias"], url: "https://www.youtube.com/watch?v=example16", embedUrl: "https://www.youtube.com/embed/example16" },
  { id: "LS-17", platform: "youtube", title: "Reset Your Reference Points", titlePt: "Redefina seus pontos de referência", summary: "Mudando a forma de comparar para melhorar percepção de felicidade.", tags: ["comparação", "mindset"], url: "https://www.youtube.com/watch?v=example17", embedUrl: "https://www.youtube.com/embed/example17" },
  { id: "LS-19", platform: "youtube", title: "Use Your Signature Strengths", titlePt: "Use suas forças de caráter", summary: "Como forças pessoais aumentam o bem-estar.", tags: ["forças pessoais", "VIA", "propósito"], url: "https://www.youtube.com/watch?v=example19", embedUrl: "https://www.youtube.com/embed/example19" },
  { id: "LS-21", platform: "youtube", title: "Want to Be Happier? Do Kind Things", titlePt: "Quer ser mais feliz? Pratique gentileza", summary: "Ações de gentileza aumentam a felicidade de quem faz e recebe.", tags: ["gentileza", "prosocialidade"], url: "https://www.youtube.com/watch?v=example21", embedUrl: "https://www.youtube.com/embed/example21" },
  { id: "LS-26", platform: "youtube", title: "Want to Be Happier? Prioritize Exercise and Sleep", titlePt: "Priorize exercício e sono", summary: "Exercício físico e sono de qualidade impactam humor e energia.", tags: ["sono", "exercício", "bem-estar"], url: "https://www.youtube.com/watch?v=example26", embedUrl: "https://www.youtube.com/embed/example26" },
];

// TED talks mapped to factors
const TED_VIDEOS: TrailVideo[] = [
  { id: "TED-001", platform: "ted", title: "The new era of positive psychology", titlePt: "A nova era da psicologia positiva — Martin Seligman", summary: "Fundador da Psicologia Positiva propõe três caminhos para a felicidade.", tags: ["psicologia positiva", "PERMA", "significado"], url: "https://www.ted.com/talks/martin_seligman_the_new_era_of_positive_psychology", embedUrl: "https://embed.ted.com/talks/martin_seligman_the_new_era_of_positive_psychology?language=pt-br" },
  { id: "TED-002", platform: "ted", title: "Flow, the secret to happiness", titlePt: "Flow, o segredo da felicidade — Csikszentmihalyi", summary: "Estado de concentração absoluta como forma de bem-estar.", tags: ["flow", "engajamento", "criatividade"], url: "https://www.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness", embedUrl: "https://embed.ted.com/talks/mihaly_csikszentmihalyi_flow_the_secret_to_happiness?language=pt-br" },
  { id: "TED-003", platform: "ted", title: "What makes a good life?", titlePt: "Do que é feita uma vida boa? — Robert Waldinger", summary: "Bons relacionamentos são o fator mais consistente para saúde e felicidade.", tags: ["relacionamentos", "Harvard", "saúde mental"], url: "https://www.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness", embedUrl: "https://embed.ted.com/talks/robert_waldinger_what_makes_a_good_life_lessons_from_the_longest_study_on_happiness?language=pt-br" },
  { id: "TED-004", platform: "ted", title: "The surprising science of happiness", titlePt: "A surpreendente ciência da felicidade — Dan Gilbert", summary: "O cérebro fabrica felicidade real mesmo quando as coisas não saem como planejado.", tags: ["felicidade sintética", "resiliência"], url: "https://www.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness", embedUrl: "https://embed.ted.com/talks/dan_gilbert_the_surprising_science_of_happiness?language=pt-br" },
  { id: "TED-005", platform: "ted", title: "The power of vulnerability", titlePt: "O poder da vulnerabilidade — Brené Brown", summary: "A coragem de ser vulnerável como base do pertencimento.", tags: ["vulnerabilidade", "coragem", "pertencimento"], url: "https://www.ted.com/talks/brene_brown_the_power_of_vulnerability", embedUrl: "https://embed.ted.com/talks/brene_brown_the_power_of_vulnerability?language=pt-br" },
];

// Factor → Trail mapping for collaborators
const COLLABORATOR_TRAILS: LearningTrail[] = [
  {
    id: "TRAIL-COL-M1",
    name: "Módulo 1 — As Grandes Mentiras Sobre Ser Feliz",
    description: "Desafiar intuições erradas sobre o que traz felicidade. Diagnóstico do 'bug mental'.",
    targetFactors: [1, 2], // Satisfaction, Stress
    level: "collaborator",
    module: "M1",
    videos: [LAURIE_SANTOS_VIDEOS[0], LAURIE_SANTOS_VIDEOS[1], LAURIE_SANTOS_VIDEOS[3], TED_VIDEOS[0]],
    xpReward: 50,
  },
  {
    id: "TRAIL-COL-M2",
    name: "Módulo 2 — O Bug das Expectativas",
    description: "Entender miswanting, adaptação hedônica e pontos de referência distorcidos.",
    targetFactors: [3, 7], // Demands, Insecurity
    level: "collaborator",
    module: "M2",
    videos: [LAURIE_SANTOS_VIDEOS[4], LAURIE_SANTOS_VIDEOS[5], LAURIE_SANTOS_VIDEOS[6], TED_VIDEOS[3]],
    xpReward: 50,
  },
  {
    id: "TRAIL-COL-M3",
    name: "Módulo 3 — O Que Realmente Funciona de Verdade",
    description: "Forças de caráter, gentileza, conexão social e flow como estratégias comprovadas.",
    targetFactors: [5, 6], // Community, Recognition
    level: "collaborator",
    module: "M3",
    videos: [LAURIE_SANTOS_VIDEOS[7], LAURIE_SANTOS_VIDEOS[8], TED_VIDEOS[1], TED_VIDEOS[2]],
    xpReward: 60,
  },
  {
    id: "TRAIL-COL-M4",
    name: "Módulo 4 — Hackeando o Cérebro para Sentir-se Melhor",
    description: "Exercício, sono, mindfulness e técnicas de rewirement cerebral.",
    targetFactors: [1, 2], // Satisfaction, Stress
    level: "collaborator",
    module: "M4",
    videos: [LAURIE_SANTOS_VIDEOS[9], TED_VIDEOS[4]],
    xpReward: 60,
  },
  {
    id: "TRAIL-COL-M5",
    name: "Módulo 5 — Virando o Jogo da Vida Real",
    description: "Transformar ciência em hábitos duradouros com implementação Se-Então.",
    targetFactors: [4, 5], // Influence, Community
    level: "collaborator",
    module: "M5",
    videos: [LAURIE_SANTOS_VIDEOS[2], TED_VIDEOS[0], TED_VIDEOS[1]],
    xpReward: 80,
  },
];

// Playbook-based trails for managers
const MANAGER_TRAILS: LearningTrail[] = [
  {
    id: "TRAIL-MGR-FOUND",
    name: "Fundação — Gestão & Confiança",
    description: "Liderança transformacional, confiança organizacional e gestão que sustenta pessoas.",
    targetFactors: [5, 6],
    level: "manager",
    module: "Fundação",
    videos: [TED_VIDEOS[0], TED_VIDEOS[2], TED_VIDEOS[4]],
    xpReward: 80,
  },
  {
    id: "TRAIL-MGR-RISK",
    name: "Redução de Dano — Stress, Suporte & Energia",
    description: "Identificar fontes de stress, criar suporte real e infraestrutura de recuperação.",
    targetFactors: [2, 3],
    level: "manager",
    module: "Redução de Dano",
    videos: [TED_VIDEOS[1], TED_VIDEOS[3]],
    xpReward: 80,
  },
  {
    id: "TRAIL-MGR-JUST",
    name: "Coesão & Justiça — Inclusão, Compensação & Flexibilidade",
    description: "Pertencimento, justiça na remuneração e controle de tempo/lugar.",
    targetFactors: [6, 7],
    level: "manager",
    module: "Coesão & Justiça",
    videos: [TED_VIDEOS[4], TED_VIDEOS[2]],
    xpReward: 80,
  },
  {
    id: "TRAIL-MGR-CULT",
    name: "Capacidade & Cultura — Aprendizagem, Propósito & Realização",
    description: "Aprendizagem contínua, trabalho com significado e reconhecimento justo.",
    targetFactors: [1, 4, 5],
    level: "manager",
    module: "Capacidade & Cultura",
    videos: [TED_VIDEOS[0], TED_VIDEOS[1]],
    xpReward: 100,
  },
];

/**
 * Get recommended trails based on role and factor scores
 */
export function getRecommendedTrails(
  factorScores: FactorScore[],
  role: "collaborator" | "manager" | "admin"
): LearningTrail[] {
  const trails = role === "collaborator" ? COLLABORATOR_TRAILS : MANAGER_TRAILS;
  
  // Sort by urgency: trails targeting highest-risk factors first
  const riskFactorIds = factorScores
    .filter((f) => f.riskBand === "ALTO" || f.riskBand === "MODERADO")
    .sort((a, b) => a.score - b.score)
    .map((f) => f.factorId);

  return trails.sort((a, b) => {
    const aRelevance = a.targetFactors.filter((id) => riskFactorIds.includes(id)).length;
    const bRelevance = b.targetFactors.filter((id) => riskFactorIds.includes(id)).length;
    return bRelevance - aRelevance;
  });
}

export { COLLABORATOR_TRAILS, MANAGER_TRAILS, LAURIE_SANTOS_VIDEOS, TED_VIDEOS };
