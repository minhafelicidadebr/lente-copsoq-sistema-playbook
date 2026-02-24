import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, ResponsiveContainer, Cell, ReferenceLine, ReferenceArea } from "recharts";
import { Grid3x3, Info } from "lucide-react";

// TBD placeholder data (R2)
const mtrfData = [
  { segment: "Operacional SP", x: 35, y: 78, zone: "PATHOS" },
  { segment: "Administrativo", x: 55, y: 52, zone: "PREVENCAO" },
  { segment: "TI & Digital", x: 72, y: 38, zone: "SALUS" },
  { segment: "Comercial", x: 40, y: 65, zone: "PREVENCAO" },
  { segment: "Liderança", x: 60, y: 42, zone: "SALUS" },
  { segment: "Suporte / RH", x: 48, y: 71, zone: "PATHOS" },
];

const zoneColors: Record<string, string> = {
  PATHOS: "hsl(0, 72%, 51%)",
  PREVENCAO: "hsl(38, 80%, 50%)",
  SALUS: "hsl(152, 69%, 31%)",
};

const zoneDescriptions = [
  { zone: "PATHOS (Alto Risco)", color: "bg-copsoq-pathos", desc: "yRiskIndex ≥ 70 — Intervenção urgente. Riscos psicossociais graves com baixa capacidade de florescimento." },
  { zone: "PREVENÇÃO (Moderado)", color: "bg-copsoq-prevencao", desc: "yRiskIndex 45–69 — Atenção e desenvolvimento. Riscos presentes com capacidade parcial de resposta." },
  { zone: "SALUS (Baixo Risco)", color: "bg-copsoq-salus", desc: "yRiskIndex < 45 — Manutenção e evolução. Bons indicadores com capacidade de florescimento." },
];

const CustomTooltip = ({ active, payload }: any) => {
  if (!active || !payload?.[0]) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-lg p-3 shadow-lg text-sm">
      <p className="font-bold text-foreground">{d.segment}</p>
      <p className="text-muted-foreground">Florescimento (x): {d.x}</p>
      <p className="text-muted-foreground">Risco (y): {d.y}</p>
      <Badge variant="outline" className="mt-1 text-xs">{d.zone}</Badge>
    </div>
  );
};

export default function ResultsMTRF() {
  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
          <Grid3x3 className="h-6 w-6 text-primary" />
          MTR-F — Matriz de Transição Risco-Florescimento
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Eixo X: capacidade de florescimento (Playbook + PERMA+V) · Eixo Y: gravidade psicossocial (COPSOQ)
        </p>
      </div>

      <div className="flex items-center gap-2 bg-primary/5 border border-primary/20 rounded-lg p-4">
        <Info className="h-5 w-5 text-primary flex-shrink-0" />
        <p className="text-sm text-foreground">
          <strong>Inferência (R1):</strong> Os valores de florescimento são proxies iniciais baseados na presença de drivers do Playbook e indicadores PERMA+V. Evoluirão com dados de trilhas e engajamento.
        </p>
      </div>

      {/* Matrix Chart */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Mapa por Segmento (minCellSize ≥ 8)</CardTitle>
          <p className="text-xs text-muted-foreground">Dados placeholder (R2). Cada ponto = um segmento agregado.</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={400}>
            <ScatterChart margin={{ top: 20, right: 20, bottom: 40, left: 40 }}>
              {/* Zone backgrounds */}
              <ReferenceArea y1={70} y2={100} x1={0} x2={100} fill="hsl(0, 72%, 51%)" fillOpacity={0.08} />
              <ReferenceArea y1={45} y2={70} x1={0} x2={100} fill="hsl(38, 80%, 50%)" fillOpacity={0.08} />
              <ReferenceArea y1={0} y2={45} x1={0} x2={100} fill="hsl(152, 69%, 31%)" fillOpacity={0.08} />

              <ReferenceLine y={70} stroke="hsl(0, 72%, 51%)" strokeDasharray="4 4" strokeOpacity={0.5} />
              <ReferenceLine y={45} stroke="hsl(38, 80%, 50%)" strokeDasharray="4 4" strokeOpacity={0.5} />

              <XAxis type="number" dataKey="x" domain={[0, 100]} name="Florescimento"
                label={{ value: "Capacidade de Florescimento →", position: "bottom", offset: 15, style: { fontSize: 12, fill: "hsl(210, 10%, 45%)" } }}
                tick={{ fontSize: 11 }} />
              <YAxis type="number" dataKey="y" domain={[0, 100]} name="Risco"
                label={{ value: "← Gravidade Psicossocial", angle: -90, position: "left", offset: 10, style: { fontSize: 12, fill: "hsl(210, 10%, 45%)" } }}
                tick={{ fontSize: 11 }} />
              <ZAxis range={[200, 200]} />
              <Tooltip content={<CustomTooltip />} />
              <Scatter data={mtrfData}>
                {mtrfData.map((d, i) => (
                  <Cell key={i} fill={zoneColors[d.zone]} stroke={zoneColors[d.zone]} strokeWidth={2} fillOpacity={0.7} />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Zone Legend */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {zoneDescriptions.map((z) => (
          <Card key={z.zone} className="border border-border">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`h-3 w-3 rounded-full ${z.color}`} />
                <span className="text-sm font-semibold text-foreground">{z.zone}</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">{z.desc}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ILI Formula */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="text-base">Índice Lógico de Intervenções (ILI)</CardTitle>
          <p className="text-xs text-muted-foreground">Priorização técnico-científica — não substitui governança</p>
        </CardHeader>
        <CardContent>
          <div className="bg-muted rounded-lg p-4 font-mono text-sm text-foreground text-center mb-4">
            ILI = (S × U × E × N × A) / (C × T × F)
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { key: "S", label: "Severidade" },
              { key: "U", label: "Urgência" },
              { key: "E", label: "Evidência" },
              { key: "N", label: "Pressão Normativa" },
              { key: "A", label: "Aderência" },
              { key: "C", label: "Custo" },
              { key: "T", label: "Tempo" },
              { key: "F", label: "Fricção" },
            ].map((s) => (
              <div key={s.key} className="text-center p-2 rounded border border-border">
                <span className="text-lg font-bold text-primary">{s.key}</span>
                <p className="text-xs text-muted-foreground">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
