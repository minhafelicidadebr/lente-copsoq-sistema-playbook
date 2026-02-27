import { useState } from "react";
import { Link, useLocation, Outlet } from "react-router-dom";
import {
  ShieldCheck, Building2, Users, MessageCircle, ClipboardList,
  BarChart3, Grid3x3, GraduationCap, Wrench, FileText, Menu, ArrowLeft
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navGroups = [
  {
    label: "Visão Geral",
    items: [
      { label: "Overview", path: "/copsoq/q1/overview", icon: ShieldCheck },
    ],
  },
  {
    label: "Onboarding",
    items: [
      { label: "Empresa", path: "/copsoq/q1/onboarding/company", icon: Building2 },
      { label: "Segmentos", path: "/copsoq/q1/onboarding/workforce", icon: Users },
    ],
  },
  {
    label: "Mensurar",
    items: [
      { label: "EliAs", path: "/copsoq/q1/mensurar/elias", icon: MessageCircle },
      { label: "Pesquisa", path: "/copsoq/q1/mensurar/survey", icon: ClipboardList },
    ],
  },
  {
    label: "Resultados",
    items: [
      { label: "Dashboard", path: "/copsoq/q1/results/overview", icon: BarChart3 },
      { label: "MTR-F", path: "/copsoq/q1/results/mtrf", icon: Grid3x3 },
    ],
  },
  {
    label: "Educar",
    items: [
      { label: "Trilhas", path: "/copsoq/q1/educar/trilhas", icon: GraduationCap },
    ],
  },
  {
    label: "Transformar",
    items: [
      { label: "Backlog", path: "/copsoq/q1/transformar/backlog", icon: Wrench },
    ],
  },
  {
    label: "Evoluir",
    items: [
      { label: "Relatório ESG", path: "/copsoq/q1/evoluir/esg", icon: FileText },
    ],
  },
];

export default function CopsoqLayout() {
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const NavContent = () => (
    <nav className="flex flex-col gap-0.5 p-4">
      <Link
        to="/"
        onClick={() => setOpen(false)}
        className="flex items-center gap-2 px-3 py-2 mb-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar ao WebDeck
      </Link>
      <div className="flex items-center gap-3 px-3 py-5 mb-4 border-b border-border">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
          <ShieldCheck className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <span className="font-bold text-sm text-foreground block leading-tight">Q1 COPSOQ</span>
          <span className="text-xs text-muted-foreground">Compliance</span>
        </div>
      </div>
      {navGroups.map((group) => (
        <div key={group.label} className="mb-4">
          <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest px-3 mb-1 block">
            {group.label}
          </span>
          {group.items.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setOpen(false)}
                className={cn(
                  "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all duration-200",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                <item.icon className="h-4 w-4 flex-shrink-0" />
                {item.label}
              </Link>
            );
          })}
        </div>
      ))}
    </nav>
  );

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-64 border-r border-border bg-card flex-col flex-shrink-0 sticky top-0 h-screen overflow-y-auto">
        <NavContent />
      </aside>

      {/* Mobile header + sidebar */}
      <Sheet open={open} onOpenChange={setOpen}>
        <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-card/80 backdrop-blur-md border-b border-border px-4 py-3 flex items-center gap-3">
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <ShieldCheck className="h-5 w-5 text-primary" />
          <span className="font-bold text-sm">Q1 COPSOQ</span>
        </div>
        <SheetContent side="left" className="w-64 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <main className="flex-1 min-w-0 lg:p-8 p-4 pt-16 lg:pt-8 overflow-x-hidden">
        <div className="max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
