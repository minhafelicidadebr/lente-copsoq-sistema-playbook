import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { BarChart3, GraduationCap, Wrench, RefreshCcw, ArrowRight, MessageCircle, LayoutDashboard, ClipboardCheck } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/lib/auth/context";
import eliasAvatar from "@/assets/elias-avatar.png";

const container = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const item = { hidden: { opacity: 0, y: 15 }, show: { opacity: 1, y: 0 } };

export default function AppHome() {
  const { user } = useAuth();
  const isManager = user?.role === "ADMIN" || user?.role === "GESTOR_BEM_ESTAR" || user?.role === "GESTOR_COMPLIANCE" || user?.role === "COORDENADOR_GERENTE";
  const hasCompletedSurvey = !!localStorage.getItem("copsoq_result");

  const cards = [
    { t: "Mensurar", d: "Iniciar campanha, coletar e agregar dados com k-anon.", to: "/app/mensurar", icon: BarChart3 },
    { t: "Educar", d: "Trilhas por driver, prática e evidências verificáveis.", to: "/app/educar", icon: GraduationCap },
    { t: "Transformar", d: "Backlog de intervenções e governança de execução.", to: "/app/transformar", icon: Wrench },
    { t: "Evoluir", d: "Relatórios auditáveis e evolução longitudinal.", to: "/app/evoluir", icon: RefreshCcw },
  ];

  return (
    <div className="space-y-6">
      {/* EliAs Diagnostic CTA — shown prominently if not completed */}
      {!hasCompletedSurvey && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card className="border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-accent/5 shadow-card-hover overflow-hidden">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <motion.img
                  src={eliasAvatar}
                  alt="EliAs"
                  className="h-14 w-14 rounded-full ring-2 ring-primary/30 flex-shrink-0"
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg font-bold text-foreground">Diagnóstico COPSOQ III</h2>
                    <Badge variant="secondary" className="text-[10px]">Sua 1ª ação</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    O EliAs vai te guiar pelo diagnóstico de riscos psicossociais. 
                    Ao final, você receberá seus resultados e trilhas de aprendizagem personalizadas 
                    pela <strong>Ciência da Felicidade</strong>.
                  </p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Badge variant="outline" className="text-[10px]">~15 min</Badge>
                    <Badge variant="outline" className="text-[10px]">Confidencial</Badge>
                    <Badge variant="outline" className="text-[10px]">Sem ranking</Badge>
                  </div>
                  <Button asChild className="mt-3 gap-2">
                    <Link to="/app/diagnostico">
                      <MessageCircle className="h-4 w-4" /> Iniciar com EliAs
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Results shortcut — if completed */}
      {hasCompletedSurvey && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <Card className="border border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-center gap-4">
              <ClipboardCheck className="h-8 w-8 text-primary flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Diagnóstico concluído!</p>
                <p className="text-xs text-muted-foreground">Veja seus resultados e trilhas recomendadas.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to="/app/meus-resultados">
                  Ver resultados <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Manager Dashboard shortcut */}
      {isManager && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border border-accent/20 bg-accent/5">
            <CardContent className="p-5 flex items-center gap-4">
              <LayoutDashboard className="h-8 w-8 text-accent flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-foreground">Dashboard Organizacional</p>
                <p className="text-xs text-muted-foreground">Visão agregada dos resultados COPSOQ III + trilhas para gestores.</p>
              </div>
              <Button asChild variant="outline" size="sm" className="gap-1">
                <Link to="/app/dashboard-organizacional">
                  Abrir <ArrowRight className="h-3 w-3" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      )}

      <div className="text-xl font-semibold text-foreground">Eixos do Ciclo</div>

      <motion.div variants={container} initial="hidden" animate="show" className="grid gap-4 md:grid-cols-2">
        {cards.map((c) => (
          <motion.div key={c.t} variants={item}>
            <Card className="border-muted/60 hover:shadow-card-hover transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-start gap-3">
                  <c.icon className="mt-0.5 h-5 w-5 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-sm font-semibold">{c.t}</div>
                    <div className="mt-1 text-sm text-muted-foreground">{c.d}</div>
                  </div>
                </div>
                <div className="mt-4">
                  <Button asChild variant="outline" className="gap-2">
                    <Link to={c.to}>Abrir <ArrowRight className="h-4 w-4" /></Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>

      <Card className="border-muted/60">
        <CardContent className="p-6">
          <div className="text-sm font-semibold">Atalho: módulo Q1 COPSOQ</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Onboarding → Mensuração (EliAs + Survey) → Resultados → Educar → Transformar → Evoluir.
          </div>
          <div className="mt-4">
            <Button asChild className="gap-2">
              <Link to="/copsoq/q1/overview">Abrir Q1 COPSOQ <ArrowRight className="h-4 w-4" /></Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
