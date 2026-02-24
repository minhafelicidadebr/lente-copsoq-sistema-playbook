import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, ArrowRight, ArrowLeft, Building2 } from "lucide-react";

const steps = [
  { id: "ORG_ID", title: "Identificação", desc: "Dados básicos da organização" },
  { id: "WORK_CONTEXT", title: "Contexto de Trabalho", desc: "Regimes, turnos e políticas" },
  { id: "COMPLIANCE_CONTEXT", title: "Conformidade", desc: "Programas existentes e maturidade" },
  { id: "BRANDING", title: "Marca", desc: "Identidade visual do tenant" },
];

export default function OnboardCompany() {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();

  const next = () => {
    if (currentStep < steps.length - 1) setCurrentStep((s) => s + 1);
    else navigate("/copsoq/q1/onboarding/workforce");
  };
  const prev = () => setCurrentStep((s) => Math.max(0, s - 1));

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Cadastro da Organização</h1>
        <p className="text-sm text-muted-foreground mt-1">Baseline do sistema — Onboarding Q1</p>
      </div>

      {/* Step indicators */}
      <div className="flex gap-2 items-center">
        {steps.map((s, i) => (
          <div key={s.id} className="flex items-center gap-2">
            <div className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              i < currentStep ? "bg-copsoq-salus text-primary-foreground" :
              i === currentStep ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}>
              {i < currentStep ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
            </div>
            <span className="text-xs font-medium text-muted-foreground hidden sm:block">{s.title}</span>
            {i < steps.length - 1 && <div className="w-6 h-px bg-border hidden sm:block" />}
          </div>
        ))}
      </div>

      {/* Form Card */}
      <Card className="border border-border shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            {steps[currentStep].title}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{steps[currentStep].desc}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {currentStep === 0 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Razão Social</Label>
                  <Input placeholder="Empresa S.A." />
                </div>
                <div className="space-y-2">
                  <Label>Nome Fantasia</Label>
                  <Input placeholder="Empresa" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="tech">Tecnologia</SelectItem>
                      <SelectItem value="health">Saúde</SelectItem>
                      <SelectItem value="finance">Financeiro</SelectItem>
                      <SelectItem value="industry">Indústria</SelectItem>
                      <SelectItem value="public">Setor Público</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Porte</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="micro">Micro (até 19)</SelectItem>
                      <SelectItem value="small">Pequena (20-99)</SelectItem>
                      <SelectItem value="medium">Média (100-499)</SelectItem>
                      <SelectItem value="large">Grande (500+)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Região</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="se">Sudeste</SelectItem>
                      <SelectItem value="s">Sul</SelectItem>
                      <SelectItem value="ne">Nordeste</SelectItem>
                      <SelectItem value="n">Norte</SelectItem>
                      <SelectItem value="co">Centro-Oeste</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </>
          )}
          {currentStep === 1 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Regime(s) de Trabalho</Label>
                  <div className="flex flex-wrap gap-2">
                    {["CLT", "PJ", "Estatutário", "Misto"].map(r => (
                      <Badge key={r} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1">{r}</Badge>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Trabalho em Turnos</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">Não</SelectItem>
                      <SelectItem value="yes">Sim</SelectItem>
                      <SelectItem value="partial">Parcial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Política de Trabalho Remoto</Label>
                  <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="presencial">100% Presencial</SelectItem>
                      <SelectItem value="hybrid">Híbrido</SelectItem>
                      <SelectItem value="remote">100% Remoto</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Número de Unidades/Sites</Label>
                  <Input type="number" placeholder="Ex: 3" />
                </div>
              </div>
            </>
          )}
          {currentStep === 2 && (
            <>
              <div className="space-y-2">
                <Label>Programas Existentes</Label>
                <div className="flex flex-wrap gap-2">
                  {["PCMSO", "PGR/PPRA", "CIPA", "SIPAT", "PAE (Assistência)", "Outro"].map(p => (
                    <Badge key={p} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors px-3 py-1">{p}</Badge>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>Sinais de Incidentes Recentes</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Nenhum registrado</SelectItem>
                    <SelectItem value="low">Baixa frequência</SelectItem>
                    <SelectItem value="moderate">Moderada</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Auto-avaliação de Maturidade NR-1</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initial">Inicial — sem processo estruturado</SelectItem>
                    <SelectItem value="developing">Em desenvolvimento</SelectItem>
                    <SelectItem value="structured">Estruturado</SelectItem>
                    <SelectItem value="advanced">Avançado / Certificado</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {currentStep === 3 && (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>URL do Logo</Label>
                  <Input placeholder="https://..." />
                </div>
                <div className="space-y-2">
                  <Label>Família Tipográfica</Label>
                  <Input placeholder="Ex: Inter, Roboto" />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cor Primária</Label>
                  <Input type="color" className="h-10 w-20" />
                </div>
                <div className="space-y-2">
                  <Label>Cor Secundária</Label>
                  <Input type="color" className="h-10 w-20" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Tom de Voz</Label>
                <Select><SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="formal">Formal</SelectItem>
                    <SelectItem value="friendly">Amigável</SelectItem>
                    <SelectItem value="scientific">Científico</SelectItem>
                    <SelectItem value="neutral">Neutro</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={prev} disabled={currentStep === 0}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Voltar
        </Button>
        <Button onClick={next}>
          {currentStep < steps.length - 1 ? "Próximo" : "Avançar para Mapa da Força de Trabalho"}
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
