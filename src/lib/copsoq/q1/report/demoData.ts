import type { CopsoqRiskBand, MTRFPoint, ILIRow } from "./types";

export const demoDimensionBars: { name: string; score: number; band: CopsoqRiskBand }[] = [
  { name: "Demandas Quantitativas", score: 72, band: "MODERADO" },
  { name: "Ritmo de Trabalho", score: 81, band: "ALTO" },
  { name: "Demandas Emocionais", score: 58, band: "MODERADO" },
  { name: "Influência no Trabalho", score: 35, band: "BAIXO" },
  { name: "Significado", score: 28, band: "BAIXO" },
  { name: "Reconhecimento", score: 76, band: "ALTO" },
  { name: "Conflito Trab-Vida", score: 69, band: "MODERADO" },
];

export const demoMtrfPoints: MTRFPoint[] = [
  { segment: "Operacional SP", florescimentoX: 35, riscoY: 78, zone: "PATHOS" },
  { segment: "Administrativo", florescimentoX: 55, riscoY: 52, zone: "PREVENCAO" },
  { segment: "TI & Digital", florescimentoX: 72, riscoY: 38, zone: "SALUS" },
  { segment: "Comercial", florescimentoX: 40, riscoY: 65, zone: "PREVENCAO" },
  { segment: "Liderança", florescimentoX: 60, riscoY: 42, zone: "SALUS" },
  { segment: "Suporte / RH", florescimentoX: 48, riscoY: 71, zone: "PATHOS" },
];

export const demoIliTop10: ILIRow[] = [
  { rank: 1, intervention: "Redesenho de carga e alocação", driver: "STRESS", targetRisk: "Sintomas Stress/Depressão", ili: "TBD", status: "planejado", owner: "TBD", justification: "TBD (needs_data): severidade/urgência/evidência/pressão normativa ainda não calculadas com dados reais." },
  { rank: 2, intervention: "Protocolo antiassédio + canal de resposta", driver: "TRUST", targetRisk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD", justification: "TBD (needs_data): priorização final depende de hotspots e governança." },
  { rank: 3, intervention: "Rotinas de peer support", driver: "SUPPORT", targetRisk: "Demandas Conflito Trab-Vida", ili: "TBD", status: "planejado", owner: "TBD", justification: "TBD (needs_data): calibrar por segmento e adesão." },
  { rank: 4, intervention: "Reconhecimento estruturado (SAGE)", driver: "APPRECIATION", targetRisk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 5, intervention: "Rituais de alinhamento + retro segura", driver: "MANAGEMENT", targetRisk: "Influência/Autonomia", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 6, intervention: "Política de desconexão digital", driver: "FLEXIBILITY", targetRisk: "Demandas Conflito Trab-Vida", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 7, intervention: "Trilha de liderança prática supervisionada", driver: "MANAGEMENT", targetRisk: "Reconhecimento/Liderança", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 8, intervention: "Ajuste de cadência e prioridades (semana padrão)", driver: "ENERGY", targetRisk: "Ritmo de Trabalho", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 9, intervention: "Clareza de papéis e critérios de decisão", driver: "MANAGEMENT", targetRisk: "Influência no Trabalho", ili: "TBD", status: "planejado", owner: "TBD" },
  { rank: 10, intervention: "Acordos de trabalho para proteção de foco", driver: "STRESS", targetRisk: "Demandas Quantitativas", ili: "TBD", status: "planejado", owner: "TBD" },
];
