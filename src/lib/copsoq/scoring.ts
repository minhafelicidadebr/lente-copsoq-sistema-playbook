/**
 * COPSOQ III Scoring Engine
 * Transforms raw Likert responses → dimension scores → factor scores → risk bands
 * 
 * Score normalization: raw 1–5 → 0–100
 * Risk bands: ≥75 ALTO | 50–74 MODERADO | <50 BAIXO
 * For positive polarity dimensions, the score is already "good" direction
 * For negative polarity, we invert for the "wellbeing" view
 */

import { DIMENSIONS, FACTORS, type CopsoqDimension, type CopsoqFactor } from "./dimensions";

export type RiskBand = "ALTO" | "MODERADO" | "BAIXO";

export interface DimensionScore {
  dimensionId: string;
  name: string;
  rawMean: number;
  normalizedScore: number;
  wellbeingScore: number; // inverted for negative polarity
  riskBand: RiskBand;
  factorId: number;
}

export interface FactorScore {
  factorId: number;
  name: string;
  description: string;
  score: number;
  riskBand: RiskBand;
  color: string;
  dimensions: DimensionScore[];
}

export interface SurveyResult {
  factors: FactorScore[];
  globalRiskIndex: number;
  globalRiskBand: RiskBand;
  completedAt: string;
  topStrengths: DimensionScore[];
  topRisks: DimensionScore[];
}

function normalizeScore(raw: number): number {
  return Math.round(((raw - 1) / 4) * 100);
}

function getRiskBand(score: number, higherIsRisk: boolean): RiskBand {
  const effective = higherIsRisk ? score : 100 - score;
  if (effective >= 75) return "ALTO";
  if (effective >= 50) return "MODERADO";
  return "BAIXO";
}

function getWellbeingScore(normalizedScore: number, positivePolarity: boolean): number {
  return positivePolarity ? normalizedScore : 100 - normalizedScore;
}

/**
 * Compute full results from raw responses
 * @param responses Map of dimensionId → array of Likert values (1-5)
 */
export function computeResults(responses: Record<string, number[]>): SurveyResult {
  const dimensionScores: DimensionScore[] = [];

  for (const dim of DIMENSIONS) {
    const vals = responses[dim.id];
    if (!vals || vals.length === 0) continue;

    const rawMean = vals.reduce((a, b) => a + b, 0) / vals.length;
    const normalizedScore = normalizeScore(rawMean);
    const wellbeingScore = getWellbeingScore(normalizedScore, dim.positivePolarity);
    const factor = FACTORS.find((f) => f.id === dim.factorId)!;
    const riskBand = getRiskBand(normalizedScore, factor.riskDirection === "higher_is_risk" ? !dim.positivePolarity : dim.positivePolarity);

    dimensionScores.push({
      dimensionId: dim.id,
      name: dim.name,
      rawMean,
      normalizedScore,
      wellbeingScore,
      riskBand,
      factorId: dim.factorId,
    });
  }

  const factorScores: FactorScore[] = FACTORS.map((factor) => {
    const dims = dimensionScores.filter((d) => d.factorId === factor.id);
    const score = dims.length > 0 ? Math.round(dims.reduce((s, d) => s + d.wellbeingScore, 0) / dims.length) : 0;
    const riskBand: RiskBand = score >= 75 ? "BAIXO" : score >= 50 ? "MODERADO" : "ALTO";

    return {
      factorId: factor.id,
      name: factor.name,
      description: factor.description,
      score,
      riskBand,
      color: factor.color,
      dimensions: dims,
    };
  });

  const globalRiskIndex = Math.round(factorScores.reduce((s, f) => s + f.score, 0) / factorScores.length);
  const globalRiskBand: RiskBand = globalRiskIndex >= 75 ? "BAIXO" : globalRiskIndex >= 50 ? "MODERADO" : "ALTO";

  const sorted = [...dimensionScores].sort((a, b) => b.wellbeingScore - a.wellbeingScore);
  const topStrengths = sorted.slice(0, 3);
  const topRisks = sorted.slice(-3).reverse();

  return {
    factors: factorScores,
    globalRiskIndex,
    globalRiskBand,
    completedAt: new Date().toISOString(),
    topStrengths,
    topRisks,
  };
}

/**
 * Generate demo responses for testing
 */
export function generateDemoResponses(): Record<string, number[]> {
  const responses: Record<string, number[]> = {};
  for (const dim of DIMENSIONS) {
    const vals: number[] = [];
    for (let i = 0; i < dim.itemCount; i++) {
      vals.push(Math.floor(Math.random() * 5) + 1);
    }
    responses[dim.id] = vals;
  }
  return responses;
}
