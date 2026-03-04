import { Outlet, Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import { cn } from "@/lib/utils";
import { ShieldCheck, Sparkles } from "lucide-react";

const NavItem = ({ to, label }: { to: string; label: string }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={cn(
        "text-sm font-medium transition-colors hover:text-foreground",
        active ? "text-foreground" : "text-muted-foreground"
      )}
    >
      {label}
    </Link>
  );
};

export default function LandingLayout() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-40 border-b bg-background/70 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <Sparkles className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <div className="text-sm font-semibold">FT Wellbeing OS</div>
              <div className="text-xs text-muted-foreground">SaaS · Mensurar → Educar → Transformar → Evoluir</div>
            </div>
          </Link>

          <nav className="hidden items-center gap-5 md:flex">
            <NavItem to="/pricing" label="Planos" />
            <NavItem to="/security" label="Segurança" />
            <NavItem to="/case-studies" label="Casos" />
            <NavItem to="/metodologia/mtrf" label="Metodologia (MTR-F)" />
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button asChild variant="ghost" className="hidden md:inline-flex">
              <Link to="/login">Entrar</Link>
            </Button>
            <Button asChild className="gap-2">
              <Link to="/signup">
                <ShieldCheck className="h-4 w-4" />
                Começar
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t">
        <div className="mx-auto max-w-6xl px-4 py-8 text-sm text-muted-foreground">
          <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
            <div>© {new Date().getFullYear()} Instituto Felicidade para Todos · FT Wellbeing OS</div>
            <div className="flex items-center gap-4">
              <Link to="/security" className="hover:text-foreground">Privacidade & Segurança</Link>
              <Link to="/pricing" className="hover:text-foreground">Planos</Link>
              <Link to="/login" className="hover:text-foreground">Entrar</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
