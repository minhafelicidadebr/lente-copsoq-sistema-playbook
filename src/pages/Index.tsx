import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ArrowRight } from "lucide-react";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <div className="text-center max-w-lg">
        <div className="flex justify-center mb-6">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl gradient-hero shadow-hero">
            <ShieldCheck className="h-8 w-8 text-primary-foreground" />
          </div>
        </div>
        <h1 className="mb-3 text-3xl font-bold text-foreground">FT Wellbeing OS</h1>
        <p className="text-muted-foreground mb-8 leading-relaxed">
          Plataforma integrada de bem-estar organizacional e conformidade.
          Mensurar → Educar → Transformar → Evoluir.
        </p>
        <Card className="border border-border shadow-card hover:shadow-card-hover transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary">
                <ShieldCheck className="h-5 w-5 text-primary-foreground" />
              </div>
              <div className="text-left">
                <h2 className="font-bold text-foreground">Q1 COPSOQ (Compliance)</h2>
                <p className="text-xs text-muted-foreground">Blindagem & Consolidação — 90 dias</p>
              </div>
            </div>
            <Button asChild className="w-full mt-2">
              <Link to="/copsoq/q1/overview">
                Acessar Módulo <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
