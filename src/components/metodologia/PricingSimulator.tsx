import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  CheckCircle2, X, Zap, Crown, Rocket, Users, TrendingDown,
  ArrowRight, ShieldCheck, Sparkles, BarChart3, Info
} from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip as ReTooltip,
  ResponsiveContainer, Cell, CartesianGrid
} from "recharts";

/* ── CONFIG-DRIVEN PRICING ── */
const PLANS = [
  {
    id: "core",
    name: "Core",
    tagline: "Mensurar + Resultados",
    icon: <Zap size={20} />,
    color: "hsl(210 75% 60%)",
    accentHsl: "210 75% 60%",
    basePerPerson: 12.9,
    features: [
      { label: "COPSOQ III — survey + chatbot EliAs", included: true },
      { label: "Dashboard de riscos psicossociais", included: true },
      { label: "MTR-F (Matriz Risco-Florescimento)", included: true },
      { label: "Relatório agregado por segmento", included: true },
      { label: "Trilhas Educar (microlearning)", included: false },
      { label: "Backlog de intervenções (ILI)", included: false },
      { label: "Relatório ESG trimestral", included: false },
      { label: "QBR + re-medição + governança", included: false },
      { label: "CS dedicado + integrações", included: false },
    ],
    cta: "Começar com Core",
  },
  {
    id: "growth",
    name: "Growth",
    tagline: "Core + Educar + Transformar",
    icon: <Rocket size={20} />,
    color: "hsl(38 85% 55%)",
    accentHsl: "38 85% 55%",
    basePerPerson: 24.9,
    popular: true,
    features: [
      { label: "COPSOQ III — survey + chatbot EliAs", included: true },
      { label: "Dashboard de riscos psicossociais", included: true },
      { label: "MTR-F (Matriz Risco-Florescimento)", included: true },
      { label: "Relatório agregado por segmento", included: true },
      { label: "Trilhas Educar (microlearning)", included: true },
      { label: "Backlog de intervenções (ILI)", included: true },
      { label: "Relatório ESG trimestral", included: false },
      { label: "QBR + re-medição + governança", included: false },
      { label: "CS dedicado + integrações", included: false },
    ],
    cta: "Escolher Growth",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    tagline: "Full Stack + Evoluir + ESG + CS",
    icon: <Crown size={20} />,
    color: "hsl(174 65% 45%)",
    accentHsl: "174 65% 45%",
    basePerPerson: 39.9,
    features: [
      { label: "COPSOQ III — survey + chatbot EliAs", included: true },
      { label: "Dashboard de riscos psicossociais", included: true },
      { label: "MTR-F (Matriz Risco-Florescimento)", included: true },
      { label: "Relatório agregado por segmento", included: true },
      { label: "Trilhas Educar (microlearning)", included: true },
      { label: "Backlog de intervenções (ILI)", included: true },
      { label: "Relatório ESG trimestral", included: true },
      { label: "QBR + re-medição + governança", included: true },
      { label: "CS dedicado + integrações", included: true },
    ],
    cta: "Falar com Especialista",
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
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
        {PLANS.map((plan, i) => {
          const price = prices[i];
          const isSelected = selectedPlan === plan.id;
          return (
            <motion.button
              key={plan.id}
              onClick={() => setSelectedPlan(plan.id)}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.98 }}
              className="relative flex flex-col text-left rounded-2xl border-2 transition-all duration-300 cursor-pointer overflow-hidden"
              style={{
                borderColor: isSelected ? plan.color : "hsl(var(--border))",
                background: isSelected
                  ? `linear-gradient(165deg, hsl(${plan.accentHsl} / 0.08) 0%, hsl(var(--card)) 40%)`
                  : "hsl(var(--card))",
                boxShadow: isSelected
                  ? `0 0 40px hsl(${plan.accentHsl} / 0.12), 0 8px 32px hsl(${plan.accentHsl} / 0.08)`
                  : "var(--shadow-card)",
              }}
              aria-pressed={isSelected}
              aria-label={`Plano ${plan.name}: ${formatBRL(price.perPerson)} por pessoa/mês`}
            >
              {"popular" in plan && plan.popular && (
                <div className="absolute -top-px left-0 right-0 h-1 bg-accent" />
              )}

              <div className="p-6 sm:p-7 flex flex-col flex-1">
                {/* Popular badge */}
                {"popular" in plan && plan.popular && (
                  <div className="mb-4">
                    <Badge className="bg-accent text-accent-foreground text-[10px] font-bold shadow-sm gap-1 px-3">
                      <Sparkles size={10} /> Mais popular
                    </Badge>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center gap-3 mb-5">
                  <div
                    className="p-2.5 rounded-xl"
                    style={{
                      background: `hsl(${plan.accentHsl} / 0.12)`,
                      color: plan.color,
                    }}
                  >
                    {plan.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-base text-foreground leading-tight">{plan.name}</h4>
                    <p className="text-xs text-muted-foreground leading-snug mt-0.5">{plan.tagline}</p>
                  </div>
                </div>

                {/* Price */}
                <div className="mb-6 pb-5 border-b border-border">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`${price.perPerson}-${plan.id}`}
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-3xl font-extrabold tabular-nums"
                          style={{ color: plan.color }}
                        >
                          {formatBRL(price.perPerson)}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground mt-1 block">/pessoa/mês</span>
                    </motion.div>
                  </AnimatePresence>
                  {price.discountPct > 0 && (
                    <p className="text-xs text-copsoq-salus mt-3 flex items-center gap-1 font-medium">
                      <TrendingDown size={12} /> {price.discountPct}% de economia aplicada
                    </p>
                  )}
                </div>

                {/* Features */}
                <div className="space-y-3 flex-1 mb-6">
                  {plan.features.map(f => (
                    <div
                      key={f.label}
                      className="flex items-start gap-2.5 text-[13px] leading-relaxed"
                    >
                      {f.included ? (
                        <CheckCircle2
                          size={15}
                          className="shrink-0 mt-0.5"
                          style={{ color: plan.color }}
                        />
                      ) : (
                        <X size={15} className="shrink-0 mt-0.5 text-muted-foreground/30" />
                      )}
                      <span className={f.included ? "text-foreground" : "text-muted-foreground/40 line-through"}>
                        {f.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div
                  className="w-full py-3 rounded-xl text-center text-sm font-semibold transition-all mt-auto"
                  style={isSelected ? {
                    background: `hsl(${plan.accentHsl} / 0.15)`,
                    color: plan.color,
                    border: `1px solid hsl(${plan.accentHsl} / 0.25)`,
                  } : {
                    background: "hsl(var(--muted))",
                    color: "hsl(var(--muted-foreground))",
                    border: "1px solid transparent",
                  }}
                >
                  {isSelected ? "✓ Selecionado" : "Selecionar"}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* ── RESULT PANEL ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${selectedPlan}-${headcount}-${isAnnual}`}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3 }}
          className="rounded-2xl border-2 overflow-hidden"
          style={{
            borderColor: selectedPlanObj.color,
            background: `linear-gradient(165deg, hsl(${selectedPlanObj.accentHsl} / 0.06) 0%, hsl(var(--card)) 30%)`,
          }}
          role="region"
          aria-live="polite"
          aria-label="Resumo da simulação"
        >
          <div className="p-6 sm:p-8 space-y-6">
            {/* Summary header */}
            <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground font-medium tracking-wide uppercase">
                  Plano {selectedPlanObj.name} · {headcount.toLocaleString("pt-BR")} pessoas · {isAnnual ? "Anual" : "Mensal"}
                </p>
                <div className="flex items-baseline gap-2">
                  <span
                    className="text-4xl font-extrabold tabular-nums"
                    style={{ color: selectedPlanObj.color }}
                  >
                    {formatBRL(selectedPrice.monthly)}
                  </span>
                  <span className="text-sm text-muted-foreground font-medium">/mês</span>
                </div>
                {selectedPrice.savings > 0 && (
                  <p className="text-xs text-copsoq-salus flex items-center gap-1 font-medium">
                    <TrendingDown size={12} /> Economia de {formatBRL(selectedPrice.savings)}/mês vs. preço base
                  </p>
                )}
              </div>
              <div className="sm:text-right space-y-1">
                <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">Investimento anual</p>
                <p className="text-2xl font-bold tabular-nums text-foreground">{formatBRL(selectedPrice.annual)}</p>
              </div>
            </div>

            {/* Charts grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Monthly comparison chart */}
              <div className="rounded-xl bg-background border border-border p-5">
                <p className="text-xs text-foreground mb-4 flex items-center gap-1.5 font-semibold">
                  <BarChart3 size={12} className="text-muted-foreground" /> Comparativo mensal
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={chartData} barSize={36}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                    <XAxis
                      dataKey="name"
                      tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }}
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
                        padding: "8px 12px",
                      }}
                      formatter={(v: number) => formatBRL(v)}
                      labelStyle={{ marginBottom: 4, fontWeight: 600 }}
                    />
                    <Bar dataKey="investimento" radius={[6, 6, 0, 0]}>
                      {chartData.map((entry, idx) => (
                        <Cell
                          key={idx}
                          fill={entry.color}
                          opacity={PLANS[idx].id === selectedPlan ? 1 : 0.25}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Volume discount chart */}
              <div className="rounded-xl bg-background border border-border p-5">
                <p className="text-xs text-foreground mb-4 flex items-center gap-1.5 font-semibold">
                  <TrendingDown size={12} className="text-muted-foreground" /> Escala de descontos por volume
                </p>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={savingsChartData} barSize={24}>
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
                        padding: "8px 12px",
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
                  <Icon size={11} /> {label}
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
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12 text-sm gap-2 shadow-lg shadow-accent/20 rounded-xl"
            >
              Solicitar proposta personalizada <ArrowRight size={16} />
            </Button>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
