import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2, X, Zap, Crown, Rocket, Users, TrendingDown,
  ArrowRight, ShieldCheck, Sparkles, Info, Star, ChevronDown,
  Calculator, Percent, Building2
} from "lucide-react";

/* ── FEATURE GROUPS ── */
const FEATURE_GROUPS = [
  {
    group: "Mensurar",
    color: "210 75% 60%",
    features: [
      "COPSOQ III — survey + chatbot EliAs",
      "Dashboard de riscos psicossociais",
      "MTR-F (Matriz Risco-Florescimento)",
      "Relatório agregado por segmento",
    ],
  },
  {
    group: "Educar + Transformar",
    color: "38 85% 55%",
    features: [
      "Trilhas Educar (microlearning)",
      "Backlog de intervenções (ILI)",
    ],
  },
  {
    group: "Evoluir + ESG",
    color: "174 65% 45%",
    features: [
      "Relatório ESG trimestral",
      "QBR + re-medição + governança",
      "CS dedicado + integrações",
    ],
  },
];

const ALL_FEATURES = FEATURE_GROUPS.flatMap(g => g.features);

/* ── PRICING CONFIG ── */
const PLANS = [
  {
    id: "core",
    name: "Core",
    tagline: "Diagnóstico completo",
    subtitle: "Mensurar + Resultados",
    icon: <Zap size={20} />,
    color: "hsl(210 75% 60%)",
    accentHsl: "210 75% 60%",
    basePerPerson: 12.9,
    includedCount: 4,
    tier: 1,
    idealFor: "Empresas que precisam mapear riscos e cumprir NR-1",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Mais escolhido",
    subtitle: "Core + Educar + Transformar",
    icon: <Rocket size={20} />,
    color: "hsl(38 85% 55%)",
    accentHsl: "38 85% 55%",
    basePerPerson: 24.9,
    popular: true,
    includedCount: 6,
    tier: 2,
    idealFor: "Empresas que querem medir e agir com trilhas e intervenções",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Ciclo completo",
    subtitle: "Full Stack + Evoluir + ESG + CS",
    icon: <Crown size={20} />,
    color: "hsl(174 65% 45%)",
    accentHsl: "174 65% 45%",
    basePerPerson: 39.9,
    includedCount: 9,
    tier: 3,
    idealFor: "Organizações que buscam governança ESG contínua e CS dedicado",
  },
] as const;

const DISCOUNT_TIERS = [
  { min: 0, max: 100, discount: 0, label: "Até 100" },
  { min: 101, max: 300, discount: 0.10, label: "101–300" },
  { min: 301, max: 500, discount: 0.15, label: "301–500" },
  { min: 501, max: 1000, discount: 0.22, label: "501–1k" },
  { min: 1001, max: 2000, discount: 0.30, label: "1k–2k" },
  { min: 2001, max: 5000, discount: 0.38, label: "2k–5k" },
  { min: 5001, max: 10000, discount: 0.45, label: "5k+" },
];

function getDiscount(count: number) {
  return DISCOUNT_TIERS.find(t => count >= t.min && count <= t.max)
    ?? DISCOUNT_TIERS[DISCOUNT_TIERS.length - 1];
}

function formatBRL(v: number) {
  return v.toLocaleString("pt-BR", { style: "currency", currency: "BRL", minimumFractionDigits: 2 });
}

function sliderToCount(val: number) {
  return Math.round(10 * Math.pow(10, (val / 100) * 3));
}
function countToSlider(count: number) {
  return (Math.log10(count / 10) / 3) * 100;
}

interface PricingSimulatorProps {
  onRequestProposal: () => void;
}

export default function PricingSimulator({ onRequestProposal }: PricingSimulatorProps) {
  const [headcount, setHeadcount] = useState(250);
  const [selectedPlan, setSelectedPlan] = useState<string>("growth");
  const [isAnnual, setIsAnnual] = useState(true);
  const [showFeatures, setShowFeatures] = useState(false);

  const sliderVal = useMemo(() => countToSlider(headcount), [headcount]);

  const handleSlider = useCallback((val: number[]) => {
    const count = sliderToCount(val[0]);
    setHeadcount(Math.min(10000, Math.max(10, count)));
  }, []);

  const tier = useMemo(() => getDiscount(headcount), [headcount]);

  const prices = useMemo(() => {
    const annualMultiplier = isAnnual ? 0.85 : 1;
    return PLANS.map(plan => {
      const base = plan.basePerPerson;
      const afterVolume = base * (1 - tier.discount);
      const final = afterVolume * annualMultiplier;
      const monthly = final * headcount;
      return {
        planId: plan.id,
        perPerson: final,
        monthly,
        annual: monthly * 12,
        savings: (base * headcount) - monthly,
        discountPct: Math.round((1 - final / base) * 100),
      };
    });
  }, [headcount, tier, isAnnual]);

  const selectedPrice = prices.find(p => p.planId === selectedPlan)!;
  const selectedPlanObj = PLANS.find(p => p.id === selectedPlan)!;

  return (
    <div className="w-full space-y-6">

      {/* ═══ ROW 1: Controls — Slider + Toggle inline ═══ */}
      <div className="rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-5">
        <div className="flex flex-col md:flex-row md:items-center gap-5">
          {/* Slider */}
          <div className="flex-1 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-primary/10">
                  <Building2 size={14} className="text-primary" />
                </div>
                <span className="text-xs font-semibold text-foreground">Colaboradores</span>
              </div>
              <motion.div
                key={headcount}
                initial={{ scale: 1.08, opacity: 0.7 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center gap-2"
              >
                <span className="text-xl font-bold text-gradient-primary tabular-nums">
                  {headcount.toLocaleString("pt-BR")}
                </span>
                {tier.discount > 0 && (
                  <Badge className="bg-copsoq-salus/20 text-copsoq-salus border-copsoq-salus/30 text-[9px] gap-1 py-0.5">
                    <Percent size={9} /> -{Math.round(tier.discount * 100)}% vol.
                  </Badge>
                )}
              </motion.div>
            </div>
            <Slider
              value={[sliderVal]}
              onValueChange={handleSlider}
              min={0} max={100} step={0.5}
              className="w-full [&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-[0_0_10px_hsl(38_85%_55%/0.35)] [&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
              aria-label="Número de colaboradores"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground px-0.5">
              {[50, 100, 500, 1000, 5000, 10000].map(m => (
                <span key={m} className={headcount >= m ? "text-accent font-bold" : ""}>
                  {m >= 1000 ? `${m / 1000}k` : m}
                </span>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="hidden md:block w-px h-14 bg-border" />

          {/* Billing toggle */}
          <div className="flex flex-col items-center gap-2">
            <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Faturamento</span>
            <div className="inline-flex items-center gap-0.5 rounded-full bg-muted/80 p-0.5 border border-border">
              <button
                onClick={() => setIsAnnual(false)}
                className={`text-[11px] px-4 py-1.5 rounded-full transition-all font-medium ${
                  !isAnnual ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Mensal
              </button>
              <button
                onClick={() => setIsAnnual(true)}
                className={`text-[11px] px-4 py-1.5 rounded-full transition-all font-medium flex items-center gap-1 ${
                  isAnnual ? "bg-accent text-accent-foreground shadow-sm" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                Anual
                <span className="text-[8px] font-bold bg-copsoq-salus/25 text-copsoq-salus rounded px-1 py-0.5">-15%</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ═══ ROW 2: Plan Cards — compact, side by side ═══ */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {PLANS.map((plan, i) => {
          const price = prices[i];
          const isSelected = selectedPlan === plan.id;
          const isPopular = "popular" in plan && plan.popular;

          return (
            <motion.button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className="relative flex flex-col text-left rounded-xl overflow-hidden transition-all duration-300 cursor-pointer"
              style={{
                border: isSelected ? `2px solid ${plan.color}` : "1px solid hsl(var(--border))",
                background: isSelected
                  ? `linear-gradient(170deg, hsl(${plan.accentHsl} / 0.08) 0%, hsl(var(--card)) 40%)`
                  : "hsl(var(--card))",
                boxShadow: isSelected
                  ? `0 8px 32px hsl(${plan.accentHsl} / 0.18), 0 0 0 1px hsl(${plan.accentHsl} / 0.1)`
                  : isPopular
                    ? `0 4px 16px hsl(${plan.accentHsl} / 0.08)`
                    : "none",
              }}
              aria-pressed={isSelected}
              aria-label={`Plano ${plan.name}: ${formatBRL(price.perPerson)} por pessoa/mês`}
            >
              {/* Top accent */}
              <div className="h-1 w-full shrink-0" style={{ background: isSelected || isPopular ? plan.color : "transparent" }} />

              <div className="p-4 lg:p-5 flex flex-col flex-1">
                {/* Header */}
                <div className="flex items-center gap-2.5 mb-2">
                  <div className="p-2 rounded-lg shrink-0" style={{ background: `hsl(${plan.accentHsl} / 0.12)`, color: plan.color }}>
                    {plan.icon}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-foreground leading-tight">{plan.name}</h4>
                      {isPopular && (
                        <Badge className="bg-accent text-accent-foreground text-[8px] font-bold gap-0.5 px-1.5 py-0">
                          <Star size={8} className="fill-current" /> Popular
                        </Badge>
                      )}
                    </div>
                    <p className="text-[10px] text-muted-foreground truncate">{plan.subtitle}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-3 pb-3 border-b border-border">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${price.perPerson}-${plan.id}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <span className="text-2xl lg:text-3xl font-extrabold tabular-nums tracking-tight" style={{ color: plan.color }}>
                        {formatBRL(price.perPerson)}
                      </span>
                      <span className="text-[10px] text-muted-foreground ml-1">/ pessoa · mês</span>
                      {price.discountPct > 0 && (
                        <Badge className="bg-copsoq-salus/15 text-copsoq-salus border-copsoq-salus/25 text-[8px] gap-0.5 px-1.5 py-0 ml-2">
                          <TrendingDown size={8} /> -{price.discountPct}%
                        </Badge>
                      )}
                    </motion.div>
                  </AnimatePresence>
                  <p className="text-[10px] text-muted-foreground/60 mt-1 tabular-nums">
                    Total: {formatBRL(price.monthly)}/mês · {formatBRL(price.annual)}/ano
                  </p>
                </div>

                {/* Ideal for */}
                <p className="text-[10px] text-muted-foreground leading-relaxed mb-3 flex-1">
                  {plan.idealFor}
                </p>

                {/* CTA */}
                <div
                  className="w-full py-2 rounded-lg text-center text-xs font-semibold transition-all"
                  style={isSelected ? {
                    background: plan.color,
                    color: "hsl(var(--accent-foreground))",
                    boxShadow: `0 4px 12px hsl(${plan.accentHsl} / 0.3)`,
                  } : {
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {isSelected ? "✓ Selecionado" : "Selecionar"}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ═══ ROW 3: Selected plan summary — compact strip ═══ */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedPlan}-${headcount}-${isAnnual}`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="rounded-xl border overflow-hidden"
          style={{ borderColor: selectedPlanObj.color, background: `linear-gradient(165deg, hsl(${selectedPlanObj.accentHsl} / 0.04) 0%, hsl(var(--card)) 25%)` }}
          role="region" aria-live="polite" aria-label="Resumo da simulação"
        >
          <div className="h-0.5 w-full" style={{ background: selectedPlanObj.color }} />
          <div className="p-4 sm:p-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Left: Plan + monthly */}
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg" style={{ background: `hsl(${selectedPlanObj.accentHsl} / 0.12)`, color: selectedPlanObj.color }}>
                  {selectedPlanObj.icon}
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-foreground flex items-center gap-2">
                    Plano {selectedPlanObj.name}
                    <span className="text-[10px] font-normal text-muted-foreground">
                      · {headcount.toLocaleString("pt-BR")} pessoas · {isAnnual ? "Anual" : "Mensal"}
                    </span>
                  </p>
                  <div className="flex items-baseline gap-2 mt-0.5">
                    <span className="text-2xl sm:text-3xl font-extrabold tabular-nums" style={{ color: selectedPlanObj.color }}>
                      {formatBRL(selectedPrice.monthly)}
                    </span>
                    <span className="text-xs text-muted-foreground">/mês</span>
                  </div>
                </div>
              </div>

              {/* Right: Annual + savings */}
              <div className="sm:text-right space-y-0.5">
                <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-wider">Investimento anual</p>
                <p className="text-xl font-bold tabular-nums text-foreground">{formatBRL(selectedPrice.annual)}</p>
                {selectedPrice.savings > 0 && (
                  <p className="text-[10px] text-copsoq-salus flex items-center gap-1 font-medium sm:justify-end">
                    <TrendingDown size={10} /> Economia de {formatBRL(selectedPrice.savings)}/mês
                  </p>
                )}
              </div>
            </div>

            {/* Volume discount indicator */}
            {tier.discount > 0 && (
              <div className="mt-3 flex items-center gap-3 p-2.5 rounded-lg bg-copsoq-salus/5 border border-copsoq-salus/15">
                <Calculator size={13} className="text-copsoq-salus shrink-0" />
                <p className="text-[10px] text-copsoq-salus leading-relaxed">
                  <strong>Desconto volume ({tier.label}):</strong> -{Math.round(tier.discount * 100)}%
                  {isAnnual && " + 15% faturamento anual"}
                  {" = "}<strong>-{selectedPrice.discountPct}% total</strong> sobre preço base
                </p>
              </div>
            )}

            {/* CTA row */}
            <div className="mt-4 flex flex-col sm:flex-row gap-2">
              <Button
                onClick={onRequestProposal}
                className="flex-1 bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-10 text-sm gap-2 shadow-lg shadow-accent/20 rounded-lg"
              >
                Solicitar proposta personalizada <ArrowRight size={14} />
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFeatures(!showFeatures)}
                className="h-10 text-xs gap-1.5 rounded-lg border-border"
              >
                <ChevronDown size={13} className={`transition-transform ${showFeatures ? "rotate-180" : ""}`} />
                {showFeatures ? "Ocultar" : "Ver"} funcionalidades
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* ═══ EXPANDABLE: Feature comparison ═══ */}
      <AnimatePresence>
        {showFeatures && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="rounded-xl border border-border bg-card/50 p-4 space-y-4">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest">Funcionalidades por plano</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {PLANS.map(plan => {
                  const isSelected = selectedPlan === plan.id;
                  return (
                    <div key={plan.id} className={`space-y-3 ${isSelected ? "opacity-100" : "opacity-50"}`}>
                      <p className="text-xs font-bold" style={{ color: plan.color }}>{plan.name}</p>
                      {FEATURE_GROUPS.map(group => {
                        const groupFeatures = group.features.map(f => ({
                          label: f,
                          included: ALL_FEATURES.indexOf(f) < plan.includedCount,
                        }));
                        const anyIncluded = groupFeatures.some(f => f.included);
                        return (
                          <div key={group.group}>
                            <p className="text-[9px] font-bold uppercase tracking-widest mb-1"
                              style={{ color: anyIncluded ? `hsl(${group.color})` : "hsl(var(--muted-foreground) / 0.3)" }}>
                              {group.group}
                            </p>
                            <div className="space-y-1">
                              {groupFeatures.map(f => (
                                <div key={f.label} className="flex items-center gap-1.5 text-[11px]">
                                  {f.included ? (
                                    <CheckCircle2 size={12} className="shrink-0" style={{ color: `hsl(${group.color})` }} />
                                  ) : (
                                    <X size={12} className="shrink-0 text-muted-foreground/20" />
                                  )}
                                  <span className={f.included ? "text-foreground" : "text-muted-foreground/30 line-through"}>
                                    {f.label}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Trust + Disclaimer — single compact line ═══ */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 px-1">
        <div className="flex flex-wrap gap-1.5">
          {[
            { icon: ShieldCheck, label: "Sem exposição individual" },
            { icon: ShieldCheck, label: "LGPD by design" },
            { icon: ShieldCheck, label: "Audit-ready" },
          ].map(({ icon: Icon, label }) => (
            <Badge key={label} variant="outline" className="border-border text-foreground/60 text-[9px] gap-1 px-2 py-0.5">
              <Icon size={10} /> {label}
            </Badge>
          ))}
        </div>
        <p className="text-[9px] text-muted-foreground/60 flex items-center gap-1">
          <Info size={10} className="shrink-0" />
          Estimativa orientativa. Proposta final validada na demonstração.
        </p>
      </div>
    </div>
  );
}
