import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell,
  PieChart, Pie, Legend
} from "recharts";
import { BarChart3, TrendingUp, Users, AlertTriangle } from "lucide-react";

// TBD: placeholder data per R2
const dimensionData = [
  { name: "Demandas Quantitativas", score: 72, band: "MODERADO" },
  { name: "Ritmo de Trabalho", score: 81, band: "ALTO" },
  { name: "Demandas Emocionais", score: 58, band: "MODERADO" },
  { name: "Influência no Trabalho", score: 35, band: "BAIXO" },
  { name: "Significado", score: 28, band: "BAIXO" },
  { name: "Reconhecimento", score: 76, band: "ALTO" },
  { name: "Conflito Trab-Vida", score: 69, band: "MODERADO" },
];

const riskDistribution = [
  { name: "Alto Risco", value: 28, fill: "hsl(0, 72%, 51%)" },
  { name: "Moderado", value: 45, fill: "hsl(38, 80%, 50%)" },
  { name: "Baixo Risco", value: 27, fill: "hsl(152, 69%, 31%)" },
];

const kpis = [
  { label: "Taxa de Resposta", value: "TBD", sub: "Meta: ≥ 70%", icon: Users },
  { label: "Risco Global (agregado)", value: "TBD", sub: "yRiskIndex", icon: AlertTriangle },
  { label: "Segmentos Mapeados", value: "TBD", sub: "minCellSize ≥ 8", icon: BarChart3 },
  { label: "Cobertura Educar", value: "TBD", sub: "conclusões de trilhas", icon: TrendingUp },
];

const getBandColor = (band: string) => {
  if (band === "ALTO") return "hsl(0, 72%, 51%)";
  if (band === "MODERADO") return "hsl(38, 80%, 50%)";
  return "hsl(152, 69%, 31%)";
};

export default function ResultsDashboard() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Dashboard Q1 — Resultados COPSOQ</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Dados agregados com célula mínima. Sem exposição individual. Sem ranking.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpis.map((kpi) => (
          <Card key={kpi.label} className="border border-border shadow-card">
            <CardContent className="p-5">
              <div className="flex items-center gap-2 mb-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                  <kpi.icon className="h-4 w-4 text-primary" />
                </div>
                <span className="text-xs font-medium text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
              <p className="text-xs text-muted-foreground mt-1">{kpi.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Dimension Scores */}
        <Card className="lg:col-span-2 border border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Scores por Dimensão (0–100)</CardTitle>
            <p className="text-xs text-muted-foreground">Dados placeholder (R2). Escala: ≥75 Alto | 50–74 Moderado | &lt;50 Baixo</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={dimensionData} layout="vertical" margin={{ left: 120 }}>
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 11 }} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={120} />
                <Tooltip />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {dimensionData.map((d, i) => (
                    <Cell key={i} fill={getBandColor(d.band)} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Risk Distribution */}
        <Card className="border border-border shadow-card">
          <CardHeader>
            <CardTitle className="text-base">Distribuição de Risco</CardTitle>
            <p className="text-xs text-muted-foreground">% de dimensões por banda</p>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={riskDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" label={({ name, value }) => `${value}%`}>
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

      {/* Factor Model */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Modelo Fatorial Pragmático</CardTitle>
          <p className="text-xs text-muted-foreground">7 fatores agregados — não substitui análise dimensional</p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
            {[
              { factor: "Satisfação & Autoeficácia", band: "BAIXO", score: "TBD" },
              { factor: "Sintomas Stress/Depressão", band: "ALTO", score: "TBD" },
              { factor: "Demandas & Conflito Trab-Vida", band: "MODERADO", score: "TBD" },
              { factor: "Influência & Autonomia", band: "BAIXO", score: "TBD" },
              { factor: "Comunidade & Significado", band: "BAIXO", score: "TBD" },
              { factor: "Reconhecimento & Liderança", band: "ALTO", score: "TBD" },
              { factor: "Insegurança no Trabalho", band: "MODERADO", score: "TBD" },
            ].map((f) => (
              <div key={f.factor} className="p-4 rounded-lg border border-border bg-muted/30">
                <Badge variant="outline" className={`text-xs mb-2 ${
                  f.band === "ALTO" ? "border-copsoq-pathos text-copsoq-pathos" :
                  f.band === "MODERADO" ? "border-copsoq-prevencao text-copsoq-prevencao" :
                  "border-copsoq-salus text-copsoq-salus"
                }`}>{f.band}</Badge>
                <p className="text-sm font-medium text-foreground">{f.factor}</p>
                <p className="text-lg font-bold text-foreground mt-1">{f.score}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
