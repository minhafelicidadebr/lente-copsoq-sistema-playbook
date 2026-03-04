import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import ThemeToggle from "@/components/theme-toggle";
import { useAuth } from "@/lib/auth/context";
import { can } from "@/lib/auth/permissions";
import { Home, BarChart3, GraduationCap, Wrench, RefreshCcw, LogOut, ShieldCheck, LockKeyhole } from "lucide-react";

type Nav = { to: string; label: string; icon: any; perm: Parameters<typeof can>[1] };

const NAV: Nav[] = [
  { to: "/app", label: "Home", icon: Home, perm: "VIEW_EVOLUIR" },
  { to: "/app/mensurar", label: "Mensurar", icon: BarChart3, perm: "VIEW_MENSURAR" },
  { to: "/app/educar", label: "Educar", icon: GraduationCap, perm: "VIEW_EDUCAR" },
  { to: "/app/transformar", label: "Transformar", icon: Wrench, perm: "VIEW_TRANSFORMAR" },
  { to: "/app/evoluir", label: "Evoluir", icon: RefreshCcw, perm: "VIEW_EVOLUIR" },
];

const NavItem = ({ to, label, icon: Icon, active }: { to: string; label: string; icon: any; active: boolean }) => (
  <Link
    to={to}
    className={cn(
      "flex items-center gap-2 rounded-lg px-3 py-2 text-sm transition-colors",
      active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
    )}
  >
    <Icon className="h-4 w-4" />
    {label}
  </Link>
);

export default function AppShell() {
  const { tenant, user, logout } = useAuth();
  const nav = useNavigate();
  const { pathname } = useLocation();
  const role = user?.role;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto grid max-w-7xl grid-cols-1 md:grid-cols-[260px_1fr]">
        <aside className="border-b p-4 md:min-h-screen md:border-b-0 md:border-r">
          <div className="flex items-start justify-between gap-3">
            <div>
              <div className="text-sm font-semibold">Workspace</div>
              <div className="text-xs text-muted-foreground">{tenant?.name ?? "—"}</div>
              <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                <ShieldCheck className="h-3.5 w-3.5" /> k-anon + sem ranking individual
              </div>
            </div>
            <ThemeToggle />
          </div>

          <Separator className="my-4" />

          <nav className="space-y-1">
            {NAV.map((n) => {
              const allowed = n.to === "/app" ? true : can(role, n.perm);
              if (!allowed) return null;
              return <NavItem key={n.to} to={n.to} label={n.label} icon={n.icon} active={pathname === n.to} />;
            })}
          </nav>

          <Separator className="my-4" />

          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              {user?.name} · {user?.role}
            </div>

            {role && can(role, "VIEW_COPSOQ_Q1") ? (
              <Button asChild variant="ghost" className="w-full justify-start">
                <Link to="/copsoq/q1/overview">Abrir módulo Q1 COPSOQ</Link>
              </Button>
            ) : (
              <div className="flex items-center gap-2 rounded-lg border p-3 text-xs text-muted-foreground">
                <LockKeyhole className="h-4 w-4" /> Sem permissão para Q1 COPSOQ.
              </div>
            )}

            <Button
              variant="outline"
              className="w-full gap-2"
              onClick={() => { logout(); nav("/", { replace: true }); }}
            >
              <LogOut className="h-4 w-4" /> Sair
            </Button>

            <div className="mt-2 flex items-center gap-2 text-[11px] text-muted-foreground">
              <LockKeyhole className="h-3.5 w-3.5" />
              Este sistema entrega governança; não promete conformidade automática.
            </div>
          </div>
        </aside>

        <main className="p-4 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
