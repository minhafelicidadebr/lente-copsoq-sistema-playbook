import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell,
} from "recharts";
import { motion } from "framer-motion";
import { Sparkles, TrendingUp, AlertTriangle, BookOpen, ArrowRight, Play, Shield } from "lucide-react";
import { FACTORS } from "@/lib/copsoq/dimensions";
import { computeResults, generateDemoResponses, type SurveyResult, type RiskBand } from "@/lib/copsoq/scoring";
import { getRecommendedTrails, type LearningModule } from "@/lib/copsoq/learningTrails";

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

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0 } };

export default function CopsoqMyResults() {
  const navigate = useNavigate();
  const [result, setResult] = useState<SurveyResult | null>(null);
  const [trails, setTrails] = useState<LearningModule[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("copsoq_result");
    let res: SurveyResult;
    if (stored) {
      res = JSON.parse(stored);
    } else {
      // Generate demo data for preview
      res = computeResults(generateDemoResponses());
    }
    setResult(res);
    setTrails(getRecommendedTrails(res.factors, "collaborator"));
  }, []);

  if (!result) return null;

  const radarData = result.factors.map((f) => ({
    factor: f.name.split(" ")[0],
    fullName: f.name,
    score: f.score,
    fullMark: 100,
  }));

  const dimensionBarData = result.factors.flatMap((f) =>
    f.dimensions.map((d) => ({
      name: d.name.length > 25 ? d.name.slice(0, 22) + "…" : d.name,
      fullName: d.name,
      score: d.wellbeingScore,
      band: d.riskBand,
    }))
  );

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium">
          <Sparkles className="h-4 w-4" /> Seus Resultados COPSOQ III
        </div>
        <h1 className="text-3xl font-bold text-foreground">Panorama de Bem-Estar Psicossocial</h1>
        <p className="text-sm text-muted-foreground max-w-xl mx-auto">
          Resultado individual para autoconhecimento. O relatório organizacional usa apenas dados agregados (minCellSize ≥ 8). Sem ranking.
        </p>
      </motion.div>

      {/* Global Score */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div variants={item}>
          <Card className="border border-border shadow-card text-center p-6">
            <motion.div
              className="text-5xl font-bold"
              style={{ color: bandColor(result.globalRiskBand) }}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", delay: 0.3 }}
            >
              {result.globalRiskIndex}
            </motion.div>
            <p className="text-sm text-muted-foreground mt-1">Índice Global de Bem-Estar</p>
            <Badge variant="outline" className={`mt-2 ${bandBg(result.globalRiskBand)}`}>
              Risco {result.globalRiskBand}
            </Badge>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border border-border shadow-card p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <TrendingUp className="h-4 w-4 text-emerald-500" /> Pontos Fortes
            </div>
            <div className="space-y-2">
              {result.topStrengths.map((d) => (
                <div key={d.dimensionId} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{d.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${bandBg(d.riskBand)}`}>
                    {d.wellbeingScore}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>

        <motion.div variants={item}>
          <Card className="border border-border shadow-card p-6">
            <div className="flex items-center gap-2 text-sm font-semibold mb-3">
              <AlertTriangle className="h-4 w-4 text-red-500" /> Atenção
            </div>
            <div className="space-y-2">
              {result.topRisks.map((d) => (
                <div key={d.dimensionId} className="flex items-center justify-between">
                  <span className="text-xs text-foreground">{d.name}</span>
                  <Badge variant="outline" className={`text-[10px] ${bandBg(d.riskBand)}`}>
                    {d.wellbeingScore}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      </motion.div>

      {/* Charts */}
      <Tabs defaultValue="radar" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="radar">Radar — 7 Fatores</TabsTrigger>
          <TabsTrigger value="bars">Barras — Dimensões</TabsTrigger>
        </TabsList>

        <TabsContent value="radar">
          <Card className="border border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Perfil dos 7 Fatores (Bounassar, 2024)</CardTitle>
              <p className="text-xs text-muted-foreground">Modelo fatorial validado para trabalhadores brasileiros. Escala 0–100 (maior = melhor bem-estar).</p>
            </CardHeader>
            <CardContent>
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis dataKey="factor" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                    <Radar
                      name="Bem-Estar"
                      dataKey="score"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.2}
                      strokeWidth={2}
                    />
                    <Tooltip
                      formatter={(value: number, name: string, props: any) => [
                        `${value}/100`,
                        props.payload.fullName,
                      ]}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </motion.div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bars">
          <Card className="border border-border shadow-card">
            <CardHeader>
              <CardTitle className="text-base">Scores por Dimensão (0–100)</CardTitle>
              <p className="text-xs text-muted-foreground">≥75 = Baixo Risco (verde) | 50–74 = Moderado (amarelo) | &lt;50 = Alto Risco (vermelho)</p>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={Math.max(400, dimensionBarData.length * 28)}>
                <BarChart data={dimensionBarData} layout="vertical" margin={{ left: 140 }}>
                  <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10 }} />
                  <YAxis type="category" dataKey="name" tick={{ fontSize: 10 }} width={140} />
                  <Tooltip
                    formatter={(value: number, name: string, props: any) => [
                      `${value}/100 — ${props.payload.band}`,
                      props.payload.fullName,
                    ]}
                  />
                  <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={16}>
                    {dimensionBarData.map((d, i) => (
                      <Cell key={i} fill={bandColor(d.band)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Factor Cards */}
      <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {result.factors.map((f) => (
          <motion.div key={f.factorId} variants={item}>
            <Card className="border border-border shadow-card h-full">
              <CardContent className="p-4 space-y-3">
                <Badge variant="outline" className={`text-[10px] ${bandBg(f.riskBand)}`}>
                  {f.riskBand}
                </Badge>
                <p className="text-sm font-semibold text-foreground">{f.name}</p>
                <div className="flex items-center gap-2">
                  <Progress value={f.score} className="h-2 flex-1" />
                  <span className="text-sm font-bold text-foreground">{f.score}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-relaxed">{f.description}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      {/* Learning Trails Section */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8 }}>
        <div className="flex items-center gap-3 mb-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
            <BookOpen className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-foreground">Trilhas Recomendadas</h2>
            <p className="text-xs text-muted-foreground">Educação para Felicidade — Baseada nos seus resultados</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trails.map((trail, i) => (
            <motion.div
              key={trail.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 + i * 0.1 }}
            >
              <Card className="border border-border shadow-card hover:shadow-card-hover transition-shadow h-full">
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="secondary" className="text-[10px]">{trail.module}</Badge>
                    <span className="text-xs text-muted-foreground">+{trail.xpReward} XP</span>
                  </div>
                  <p className="text-sm font-semibold text-foreground">{trail.name}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{trail.description}</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Play className="h-3 w-3" />
                    <span>{trail.videos.length} vídeos</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {trail.targetFactors.map((fId) => {
                      const factor = FACTORS.find((f) => f.id === fId);
                      return factor ? (
                        <Badge key={fId} variant="outline" className="text-[9px]">
                          {factor.name.split(" ")[0]}
                        </Badge>
                      ) : null;
                    })}
                  </div>
                  <Button variant="outline" size="sm" className="w-full gap-1 text-xs" asChild>
                    <Link to="/app/educar">
                      Iniciar trilha <ArrowRight className="h-3 w-3" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Disclaimer */}
      <Card className="border border-border bg-muted/30">
        <CardContent className="p-4 flex items-start gap-3">
          <Shield className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
          <div className="text-xs text-muted-foreground leading-relaxed">
            <p className="font-medium text-foreground mb-1">Nota de Governança</p>
            <p>Este sistema entrega prontidão documental e governança; não promete conformidade automática. Sem exposição individual; resultados organizacionais são agregados e sujeitos a minCellSize (k-anon ≥ 8). Dados processados conforme LGPD.</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
