import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2, X, Zap, Crown, Rocket, Users, TrendingDown,
  ArrowRight, ShieldCheck, Sparkles, BarChart3, Info, Star
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, Cell, CartesianGrid
} from "recharts";

/* ── FEATURE GROUPS for scanning ── */
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

/* ── CONFIG-DRIVEN PRICING ── */
const PLANS = [
  {
    id: "core",
    name: "Core",
    tagline: "Diagnóstico completo",
    subtitle: "Mensurar + Resultados",
    icon: <Zap size={22} />,
    color: "hsl(210 75% 60%)",
    accentHsl: "210 75% 60%",
    basePerPerson: 12.9,
    includedCount: 4,
    tier: 1,
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Mais escolhido",
    subtitle: "Core + Educar + Transformar",
    icon: <Rocket size={22} />,
    color: "hsl(38 85% 55%)",
    accentHsl: "38 85% 55%",
    basePerPerson: 24.9,
    popular: true,
    includedCount: 6,
    tier: 2,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Ciclo completo",
    subtitle: "Full Stack + Evoluir + ESG + CS",
    icon: <Crown size={22} />,
    color: "hsl(174 65% 45%)",
    accentHsl: "174 65% 45%",
    basePerPerson: 39.9,
    includedCount: 9,
    tier: 3,
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

const SLIDER_MARKS = [50, 100, 300, 500, 1000, 2000, 5000, 10000];
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
      const savings = (base * headcount) - monthly;
      return {
        planId: plan.id,
        perPerson: final,
        monthly,
        annual: monthly * 12,
        savings,
        discountPct: Math.round((1 - final / base) * 100),
      };
    });
  }, [headcount, tier, isAnnual]);

  const chartData = useMemo(() => {
    return PLANS.map((plan, i) => ({
      name: plan.name,
      investimento: Math.round(prices[i].monthly),
      color: plan.color,
    }));
  }, [prices]);

  const savingsChartData = useMemo(() => {
    return DISCOUNT_TIERS.map(t => ({
      name: t.label,
      desconto: Math.round(t.discount * 100),
      active: headcount >= t.min && headcount <= t.max,
    }));
  }, [headcount]);

  const selectedPrice = prices.find(p => p.planId === selectedPlan)!;
  const selectedPlanObj = PLANS.find(p => p.id === selectedPlan)!;

  return (
    <div className="w-full max-w-6xl mx-auto space-y-10 px-4 sm:px-6">
      {/* ── HEADLINE ── */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2"
        >
          <Sparkles className="text-accent" size={16} />
          <span className="text-xs font-semibold tracking-[0.2em] uppercase text-accent">
            Investimento por pessoa · transparente
          </span>
        </motion.div>
        <h3 className="text-2xl md:text-3xl font-bold leading-tight text-foreground">
          Quanto custa cuidar de{" "}
          <span className="text-gradient-primary">{headcount.toLocaleString("pt-BR")}</span>{" "}
          pessoas?
        </h3>
        <p className="text-sm text-muted-foreground max-w-lg mx-auto leading-relaxed">
          Deslize para ajustar o número de colaboradores. Descontos progressivos aplicados automaticamente.
        </p>
      </div>

      {/* ── SLIDER SECTION ── */}
      <div className="space-y-3 max-w-2xl mx-auto">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={16} className="text-primary" />
            <span className="text-sm font-medium text-foreground">Colaboradores</span>
          </div>
          <motion.div
            key={headcount}
            initial={{ scale: 1.1, opacity: 0.7 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex items-center gap-2"
          >
            <span className="text-2xl font-bold text-gradient-primary tabular-nums">
              {headcount.toLocaleString("pt-BR")}
            </span>
            {tier.discount > 0 && (
              <Badge className="bg-copsoq-salus/20 text-copsoq-salus border-copsoq-salus/30 text-[10px] gap-1">
                <TrendingDown size={10} /> -{Math.round(tier.discount * 100)}% vol.
              </Badge>
            )}
          </motion.div>
        </div>
        <Slider
          value={[sliderVal]}
          onValueChange={handleSlider}
          min={0}
          max={100}
          step={0.5}
          className="w-full [&_[role=slider]]:bg-accent [&_[role=slider]]:border-accent [&_[role=slider]]:shadow-[0_0_12px_hsl(38_85%_55%/0.4)] [&_[role=slider]]:h-5 [&_[role=slider]]:w-5"
          aria-label="Número de colaboradores"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground px-1">
          {SLIDER_MARKS.map(m => (
            <span key={m} className={headcount >= m ? "text-accent font-semibold" : ""}>
              {m >= 1000 ? `${m / 1000}k` : m}
            </span>
          ))}
        </div>
      </div>

      {/* ── BILLING TOGGLE ── */}
      <div className="flex items-center justify-center">
        <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1 border border-border">
          <button
            onClick={() => setIsAnnual(false)}
            className={`text-xs px-5 py-2 rounded-full transition-all font-medium ${
              !isAnnual
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setIsAnnual(true)}
            className={`text-xs px-5 py-2 rounded-full transition-all font-medium flex items-center gap-1.5 ${
              isAnnual
                ? "bg-accent text-accent-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Anual
            <Badge className="bg-copsoq-salus/20 text-copsoq-salus border-copsoq-salus/30 text-[9px]">
              -15%
            </Badge>
          </button>
        </div>
      </div>

      {/* ── PLAN CARDS ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-0 items-stretch">
        {PLANS.map((plan, i) => {
          const price = prices[i];
          const isSelected = selectedPlan === plan.id;
          const isEnterprise = plan.id === "enterprise";
          const isPopular = "popular" in plan && plan.popular;

          return (
            <motion.button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ y: -6, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                relative flex flex-col text-left transition-all duration-300 cursor-pointer overflow-hidden
                ${i === 0 ? "rounded-l-2xl md:rounded-r-none rounded-2xl md:rounded-bl-2xl" : ""}
                ${i === 1 ? "rounded-none md:-mx-px z-10 rounded-2xl md:rounded-none" : ""}
                ${i === 2 ? "rounded-r-2xl md:rounded-l-none rounded-2xl md:rounded-br-2xl" : ""}
              `}
              style={{
                border: isSelected ? `2px solid ${plan.color}` : "1px solid hsl(var(--border))",
                background: isEnterprise
                  ? `linear-gradient(170deg, hsl(${plan.accentHsl} / 0.04) 0%, hsl(var(--card)) 25%, hsl(var(--card)) 85%, hsl(${plan.accentHsl} / 0.06) 100%)`
                  : isSelected
                    ? `linear-gradient(170deg, hsl(${plan.accentHsl} / 0.06) 0%, hsl(var(--card)) 35%)`
                    : "hsl(var(--card))",
                boxShadow: isSelected
                  ? `0 8px 40px hsl(${plan.accentHsl} / 0.15), 0 0 0 1px hsl(${plan.accentHsl} / 0.1)`
                  : isPopular
                    ? `0 4px 20px hsl(${plan.accentHsl} / 0.08)`
                    : "none",
              }}
              aria-pressed={isSelected}
              aria-label={`Plano ${plan.name}: ${formatBRL(price.perPerson)} por pessoa/mês`}
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full shrink-0"
                style={{ background: isSelected || isPopular ? plan.color : "transparent" }}
              />

              <div className="p-6 lg:p-7 flex flex-col flex-1">
                {/* Plan header — always visible */}
                <div className="flex items-start justify-between mb-1">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-2.5 rounded-xl shrink-0"
                      style={{
                        background: `hsl(${plan.accentHsl} / 0.12)`,
                        color: plan.color,
                      }}
                    >
                      {plan.icon}
                    </div>
                    <div>
                      <h4 className="font-bold text-lg text-foreground leading-tight tracking-tight">
                        {plan.name}
                      </h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{plan.subtitle}</p>
                    </div>
                  </div>
                </div>

                {/* Badges */}
                <div className="flex items-center gap-2 mt-3 mb-5 min-h-[24px]">
                  {isPopular && (
                    <Badge className="bg-accent text-accent-foreground text-[10px] font-bold shadow-sm gap-1 px-2.5 py-0.5">
                      <Star size={10} className="fill-current" /> Mais popular
                    </Badge>
                  )}
                  {isEnterprise && (
                    <Badge
                      variant="outline"
                      className="text-[10px] font-bold gap-1 px-2.5 py-0.5"
                      style={{ borderColor: plan.color, color: plan.color }}
                    >
                      <Crown size={10} /> Full Stack
                    </Badge>
                  )}
                  {price.discountPct > 0 && (
                    <Badge className="bg-copsoq-salus/15 text-copsoq-salus border-copsoq-salus/25 text-[10px] gap-1 px-2 py-0.5">
                      <TrendingDown size={10} /> -{price.discountPct}%
                    </Badge>
                  )}
                </div>

                {/* Price block — prominent */}
                <div className="mb-6 pb-5 border-b border-border">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${price.perPerson}-${plan.id}`}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.25 }}
                    >
                      <div className="flex items-baseline gap-1">
                        <span
                          className="text-4xl font-extrabold tabular-nums tracking-tight"
                          style={{ color: plan.color }}
                        >
                          {formatBRL(price.perPerson)}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1.5 font-medium">
                        por pessoa / mês
                      </p>
                    </motion.div>
                  </AnimatePresence>
                  <motion.p
                    key={price.monthly}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-[11px] text-muted-foreground/70 mt-2 tabular-nums"
                  >
                    Total: {formatBRL(price.monthly)}/mês · {formatBRL(price.annual)}/ano
                  </motion.p>
                </div>

                {/* Features — grouped for scanning */}
                <div className="space-y-4 flex-1 mb-6">
                  {FEATURE_GROUPS.map((group) => {
                    const groupFeatures = group.features.map(f => {
                      const idx = ALL_FEATURES.indexOf(f);
                      return { label: f, included: idx < plan.includedCount };
                    });
                    const anyIncluded = groupFeatures.some(f => f.included);

                    return (
                      <div key={group.group}>
                        <p
                          className="text-[10px] font-bold uppercase tracking-widest mb-2"
                          style={{ color: anyIncluded ? `hsl(${group.color})` : "hsl(var(--muted-foreground) / 0.4)" }}
                        >
                          {group.group}
                        </p>
                        <div className="space-y-2">
                          {groupFeatures.map(f => (
                            <div
                              key={f.label}
                              className="flex items-start gap-2.5 text-[13px] leading-relaxed"
                            >
                              {f.included ? (
                                <CheckCircle2
                                  size={15}
                                  className="shrink-0 mt-0.5"
                                  style={{ color: `hsl(${group.color})` }}
                                />
                              ) : (
                                <X size={15} className="shrink-0 mt-0.5 text-muted-foreground/25" />
                              )}
                              <span className={f.included ? "text-foreground" : "text-muted-foreground/35 line-through"}>
                                {f.label}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* CTA */}
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold transition-all mt-auto"
                  style={isSelected ? {
                    background: plan.color,
                    color: plan.id === "enterprise" ? "hsl(var(--primary-foreground))" : "hsl(var(--accent-foreground))",
                    boxShadow: `0 4px 14px hsl(${plan.accentHsl} / 0.3)`,
                  } : {
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--muted-foreground))",
                  }}
                >
                  {isSelected ? "✓ Selecionado" : "Selecionar"}
                </motion.div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── RESULT PANEL ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedPlan}-${headcount}-${isAnnual}`}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
          className="rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: selectedPlanObj.color,
            background: `linear-gradient(165deg, hsl(${selectedPlanObj.accentHsl} / 0.05) 0%, hsl(var(--card)) 25%)`,
          }}
          role="region"
          aria-live="polite"
          aria-label="Resumo da simulação"
        >
          {/* Accent top bar */}
          <div className="h-1 w-full" style={{ background: selectedPlanObj.color }} />

          <div className="p-6 sm:p-8 space-y-6">
            {/* Summary header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
              <div className="space-y-2">
                <div className="flex items-center gap-3 mb-1">
                  <div
                    className="p-2 rounded-lg"
                    style={{
                      background: `hsl(${selectedPlanObj.accentHsl} / 0.12)`,
                      color: selectedPlanObj.color,
                    }}
                  >
                    {selectedPlanObj.icon}
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-foreground">
                      Plano {selectedPlanObj.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {headcount.toLocaleString("pt-BR")} pessoas · {isAnnual ? "Faturamento anual" : "Faturamento mensal"}
                    </p>
                  </div>
                </div>
                <div className="flex items-baseline gap-2 mt-2">
                  <span
                    className="text-4xl sm:text-5xl font-extrabold tabular-nums tracking-tight"
                    style={{ color: selectedPlanObj.color }}
                  >
                    {formatBRL(selectedPrice.monthly)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">/mês</span>
                </div>
                {selectedPrice.savings > 0 && (
                  <p className="text-xs text-copsoq-salus flex items-center gap-1 font-medium mt-1">
                    <TrendingDown size={12} /> Economia de {formatBRL(selectedPrice.savings)}/mês vs. preço base
                  </p>
                )}
              </div>
              <div className="sm:text-right space-y-1 sm:min-w-[200px]">
                <p className="text-xs text-muted-foreground font-bold uppercase tracking-widest">Investimento anual</p>
                <p className="text-3xl font-bold tabular-nums text-foreground">{formatBRL(selectedPrice.annual)}</p>
                <p className="text-xs text-muted-foreground tabular-nums">
                  {formatBRL(selectedPrice.perPerson)}/pessoa/mês
                </p>
              </div>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Monthly comparison chart */}
              <div className="rounded-xl bg-background border border-border p-5">
                <p className="text-xs text-foreground mb-4 flex items-center gap-1.5 font-semibold">
                  <BarChart3 size={13} className="text-muted-foreground" /> Comparativo mensal por plano
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={chartData} barSize={40}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 12, fill: "hsl(var(--foreground))", fontWeight: 500 }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <ReTooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 10,
                        fontSize: 12,
                        color: "hsl(var(--foreground))",
                        padding: "10px 14px",
                      }}
                      formatter={(v: number) => formatBRL(v)}
                      labelStyle={{ marginBottom: 4, fontWeight: 600 }}
                    />
                    <Bar dataKey="investimento" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.color}
                          opacity={PLANS[idx].id === selectedPlan ? 1 : 0.2}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Volume discount chart */}
              <div className="rounded-xl bg-background border border-border p-5">
                <p className="text-xs text-foreground mb-4 flex items-center gap-1.5 font-semibold">
                  <TrendingDown size={13} className="text-muted-foreground" /> Escala de descontos por volume
                </p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={savingsChartData} barSize={28}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }}
                      axisLine={false}
                      tickLine={false}
                    />
                    <YAxis hide />
                    <ReTooltip
                      contentStyle={{
                        background: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 10,
                        fontSize: 12,
                        color: "hsl(var(--foreground))",
                        padding: "10px 14px",
                      }}
                      formatter={(v: number) => `${v}%`}
                      labelStyle={{ marginBottom: 4, fontWeight: 600 }}
                    />
                    <Bar dataKey="desconto" radius={[4, 4, 0, 0]}>
                      {savingsChartData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.active ? "hsl(152 60% 42%)" : "hsl(var(--muted))"}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2.5 pt-1">
              {[
                { icon: ShieldCheck, label: "Sem exposição individual" },
                { icon: ShieldCheck, label: "LGPD by design" },
                { icon: ShieldCheck, label: "Audit-ready" },
              ].map(({ icon: Icon, label }) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="border-border text-foreground/70 text-[11px] gap-1.5 px-3 py-1.5"
                >
                  <Icon size={12} /> {label}
                </Badge>
              ))}
            </div>

            {/* Disclaimer */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-muted/50 border border-border">
              <Info size={14} className="text-muted-foreground shrink-0 mt-0.5" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                Estimativa orientativa. Valores por pessoa/mês sujeitos a ajuste conforme escopo, integrações, governança e negociação. A proposta final é validada na demonstração.
              </p>
            </div>

            {/* CTA */}
            <Button
              onClick={onRequestProposal}
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-13 text-base gap-2 shadow-lg shadow-accent/20 rounded-xl"
            >
              Solicitar proposta personalizada <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
