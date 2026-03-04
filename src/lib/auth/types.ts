export type Role =
  | "COLABORADOR"
  | "COORDENADOR_GERENTE"
  | "GESTOR_BEM_ESTAR"
  | "GESTOR_COMPLIANCE"
  | "ADMIN";

export type Axis = "MENSURAR" | "EDUCAR" | "TRANSFORMAR" | "EVOLUIR";

export interface Tenant {
  id: string;
  name: string;
  createdAtIso: string;
}

export interface User {
  id: string;
  tenantId: string;
  name: string;
  email: string;
  role: Role;
  createdAtIso: string;
}

export interface Session {
  token: string;
  tenantId: string;
  userId: string;
  issuedAtIso: string;
  expiresAtIso: string;
}

export interface AuthState {
  tenant: Tenant | null;
  user: User | null;
  session: Session | null;
}
