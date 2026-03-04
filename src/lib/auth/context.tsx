import * as React from "react";
import type { AuthState, Role } from "./types";
import { bootstrapTenantAndUser, loadAuthState, signInWithEmail, signOut } from "./storage";
import { track } from "@/lib/telemetry/track";
import { appendAudit } from "@/lib/audit/log";

type AuthContextValue = AuthState & {
  isAuthenticated: boolean;
  bootstrap: (p: { tenantName: string; name: string; email: string; role?: Role }) => void;
  login: (email: string) => boolean;
  logout: () => void;
};

const AuthContext = React.createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = React.useState<AuthState>(() => loadAuthState());

  const value: AuthContextValue = React.useMemo(() => {
    const isAuthenticated = Boolean(state.session && state.user && state.tenant);

    return {
      ...state,
      isAuthenticated,
      bootstrap: (p) => {
        const next = bootstrapTenantAndUser(p);
        setState(next);
        track("auth.bootstrap", { role: next.user?.role, tenant: next.tenant?.name });
        void appendAudit({ id: `aud_${Date.now()}`, ts: Date.now(), actor: { userId: next.user?.id, role: next.user?.role, tenantId: next.tenant?.id }, action: "auth.bootstrap" });
      },
      login: (email) => {
        const next = signInWithEmail(email);
        if (!next) return false;
        setState(next);
        track("auth.login", { role: next.user?.role });
        void appendAudit({ id: `aud_${Date.now()}`, ts: Date.now(), actor: { userId: next.user?.id, role: next.user?.role, tenantId: next.tenant?.id }, action: "auth.login" });
        return true;
      },
      logout: () => {
        signOut();
        track("auth.logout");
        void appendAudit({ id: `aud_${Date.now()}`, ts: Date.now(), actor: { userId: state.user?.id, role: state.user?.role, tenantId: state.tenant?.id }, action: "auth.logout" });
        setState(loadAuthState());
      },
    };
  }, [state]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = React.useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
