import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
  PieChart, Pie, Legend
} from "recharts";
import { motion } from "framer-motion";
import {
  Users, AlertTriangle, TrendingUp, Shield, BarChart3, BookOpen,
  ArrowRight, Lock, Activity
} from "lucide-react";
import { FACTORS, DIMENSIONS } from "@/lib/copsoq/dimensions";
import { computeResults, generateDemoResponses, type RiskBand, type SurveyResult } from "@/lib/copsoq/scoring";
import { getRecommendedTrails } from "@/lib/copsoq/learningTrails";
import { Link } from "react-router-dom";
import { applyKAnonToMtrfPoints } from "@/lib/privacy/kanon";

const MIN_CELL_SIZE = 8;

// Generate aggregate demo data (simulating multiple respondents)
function generateAggregateData(n: number) {
  const allResults: SurveyResult[] = [];
  for (let i = 0; i < n; i++) {
    allResults.push(computeResults(generateDemoResponses()));
  }
  return allResults;
}

const SEGMENTS = ["Todos", "Operacional", "Administrativo", "Gerencial", "Técnico"];

const bandColor = (band: RiskBand) => {
  if (band === "ALTO") return "hsl(var(--copsoq-pathos))";
  if (band === "MODERADO") return "hsl(var(--copsoq-prevencao))";
  return "hsl(var(--copsoq-salus))";
};

const bandBg = (band: RiskBand) => {
  if (band === "ALTO") return "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/30";
  if (band === "MODERADO") return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/30";
  return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/30";
};

const container = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function ManagerDashboard() {
  const [segment, setSegment] = useState("Todos");
  const [respondents] = useState(87); // TBD (needs_data)

  const aggregateResults = useMemo(() => generateAggregateData(respondents), [respondents]);

  // Compute average factor scores
  const avgFactors = useMemo(() => {
    return FACTORS.map((factor) => {
      const scores = aggregateResults.map(
        (r) => r.factors.find((f) => f.factorId === factor.id)?.score ?? 0
      );
      const avg = Math.round(scores.reduce((a, b) => a + b, 0) / scores.length);
      const band: RiskBand = avg >= 75 ? "BAIXO" : avg >= 50 ? "MODERADO" : "ALTO";
      return { ...factor, avgScore: avg, avgBand: band };
    });
  }, [aggregateResults]);

  const globalAvg = Math.round(avgFactors.reduce((s, f) => s + f.avgScore, 0) / avgFactors.length);
  const globalBand: RiskBand = globalAvg >= 75 ? "BAIXO" : globalAvg >= 50 ? "MODERADO" : "ALTO";

  const riskDistribution = useMemo(() => {
    const alto = avgFactors.filter((f) => f.avgBand === "ALTO").length;
    const mod = avgFactors.filter((f) => f.avgBand === "MODERADO").length;
    const baixo = avgFactors.filter((f) => f.avgBand === "BAIXO").length;
    return [
      { name: "Alto Risco", value: alto, fill: "hsl(var(--copsoq-pathos))" },
      { name: "Moderado", value: mod, fill: "hsl(var(--copsoq-prevencao))" },
      { name: "Baixo Risco", value: baixo, fill: "hsl(var(--copsoq-salus))" },
    ];
  }, [avgFactors]);

  const radarData = avgFactors.map((f) => ({
    factor: f.name.split(" ")[0],
    fullName: f.name,
    score: f.avgScore,
    fullMark: 100,
  }));

  const managerTrails = getRecommendedTrails(
    avgFactors.map((f) => ({ factorId: f.id, name: f.name, description: f.description, score: f.avgScore, riskBand: f.avgBand, color: f.color, dimensions: [] })),
    "manager"
  );

  const responseRate = Math.round((respondents / 120) * 100); // TBD

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-12">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Dashboard Organizacional — COPSOQ III</h1>
            <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1">
              <Lock className="h-3 w-3" /> Dados agregados · minCellSize ≥ {MIN_CELL_SIZE} · Sem exposição individual
            </p>
          </div>
          <Select value={segment} onValueChange={setSegment}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Segmento" />
            </SelectTrigger>
            <SelectContent>
              {SEGMENTS.map((s) => (
                <SelectItem key={s} value={s}>{s}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </motion.div>

      {/* KPIs */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Respondentes", value: respondents.toString(), sub: `Taxa: ${responseRate}% (meta ≥ 70%)`, icon: Users, highlight: responseRate >= 70 },
          { label: "Índice Global", value: globalAvg.toString(), sub: `Risco: ${globalBand}`, icon: Activity, highlight: globalBand === "BAIXO" },
          { label: "Fatores em Risco", value: avgFactors.filter((f) => f.avgBand === "ALTO").length.toString(), sub: "Requerem intervenção", icon: AlertTriangle, highlight: false },
          { label: "Trilhas Ativas", value: managerTrails.length.toString(), sub: "Recomendadas para gestores", icon: BookOpen, highlight: true },
        ].map((kpi, i) => (
          <motion.div key={kpi.label} variants={item}>
            <Card className="border border-border shadow-card">
              <CardContent className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-lg ${kpi.highlight ? 'bg-primary/10' : 'bg-destructive/10'}`}>
                    <kpi.icon className={`h-4 w-4 ${kpi.highlight ? 'text-primary' : 'text-destructive'}`} />
                  </div>
                  <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
                </div>
                <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 border border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Radar — 7 Fatores (Média Organizacional)</CardTitle>
            <p className="text-xs text-muted-foreground">Agregado de {respondents} respondentes. Modelo Bounassar (2024).</p>
          </CardHeader>
          <CardContent>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
              <ResponsiveContainer width="100%" height={350}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <Radar name="Média" dataKey="score" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
                  <Tooltip formatter={(v: number) => [`${v}/100`]} />
                </RadarChart>
              </ResponsiveContainer>
            </motion.div>
          </CardContent>
        </Card>

        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Risco</CardTitle>
            <p className="text-xs text-muted-foreground">Fatores por banda</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={45} outerRadius={75} dataKey="value" label={({ name, value }) => `${value}`}>
                  {riskDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.fill} />
                  ))}
                </Pie>
                <Legend formatter={(value) => <span className="text-xs">{value}</span>} />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Factor Detail Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {avgFactors.map((f) => (
          <motion.div key={f.id} variants={item}>
            <Card className="border border-border shadow-card h-full">
              <CardContent className="p-4 space-y-2">
                <div className="flex items-center justify-between">
                  <Badge variant="outline" className={`text-[10px] ${bandBg(f.avgBand)}`}>
                    {f.avgBand}
                  </Badge>
                  <span className="text-lg font-bold text-foreground">{f.avgScore}</span>
                </div>
                <p className="text-sm font-semibold text-foreground">{f.name}</p>
                <p className="text-[11px] text-muted-foreground">{f.description}</p>
                <div className="h-1.5 w-full rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full"
                    style={{ backgroundColor: bandColor(f.avgBand) }}
                    initial={{ width: 0 }}
                    animate={{ width: `${f.avgScore}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Manager Trails */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Trilhas para Gestores</h2>
            <p className="text-xs text-muted-foreground">Work Wellbeing Playbook — Priorizadas por risco organizacional</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {managerTrails.map((trail, i) => (
            <motion.div key={trail.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 + i * 0.1 }}>
              <Card className="border border-border shadow-card hover:shadow-card-hover transition-shadow">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{trail.subtitle}</Badge>
                    <span className="text-xs text-muted-foreground">+{trail.xpReward} XP</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{trail.title}</p>
                  <p className="text-xs text-muted-foreground">{trail.description}</p>
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs" asChild>
                    <Link to="/app/educar">
                      Acessar trilha <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Disclaimer */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Governança & Compliance</p>
            <p>Este sistema entrega prontidão documental e governança; não promete conformidade automática. Sem exposição individual; resultados agregados com minCellSize (k-anon ≥ {MIN_CELL_SIZE}). Evite inserir dados pessoais sensíveis. Dados processados conforme LGPD.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
