import type { AuthState, Tenant, User, Session, Role } from "./types";

const KEY_STATE = "ftos_auth_state_v1";

function safeParse<T>(v: string | null): T | null {
  if (!v) return null;
  try { return JSON.parse(v) as T; } catch { return null; }
}

export function loadAuthState(): AuthState {
  return safeParse<AuthState>(localStorage.getItem(KEY_STATE)) ?? { tenant: null, user: null, session: null };
}

export function saveAuthState(state: AuthState) {
  localStorage.setItem(KEY_STATE, JSON.stringify(state));
}

export function clearAuthState() {
  localStorage.removeItem(KEY_STATE);
}

export function randomId(prefix: string) {
  const core = (globalThis.crypto?.randomUUID?.() ?? `r_${Math.random().toString(16).slice(2)}_${Date.now()}`).replace(/-/g, "");
  return `${prefix}_${core}`;
}

export function bootstrapTenantAndUser(params: {
  tenantName: string;
  name: string;
  email: string;
  role?: Role;
}): AuthState {
  const now = new Date().toISOString();
  const tenant: Tenant = { id: randomId("tenant"), name: params.tenantName, createdAtIso: now };
  const user: User = {
    id: randomId("usr"),
    tenantId: tenant.id,
    name: params.name,
    email: params.email.toLowerCase(),
    role: params.role ?? "ADMIN",
    createdAtIso: now,
  };
  const session: Session = {
    token: randomId("sess"),
    tenantId: tenant.id,
    userId: user.id,
    issuedAtIso: now,
    expiresAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  };
  const state: AuthState = { tenant, user, session };
  saveAuthState(state);
  return state;
}

export function signInWithEmail(email: string): AuthState | null {
  const state = loadAuthState();
  if (!state.user || state.user.email !== email.toLowerCase()) return null;
  const now = new Date().toISOString();
  const session: Session = {
    token: randomId("sess"),
    tenantId: state.user.tenantId,
    userId: state.user.id,
    issuedAtIso: now,
    expiresAtIso: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
  };
  const next: AuthState = { ...state, session };
  saveAuthState(next);
  return next;
}

export function signOut() {
  const state = loadAuthState();
  saveAuthState({ ...state, session: null });
}
