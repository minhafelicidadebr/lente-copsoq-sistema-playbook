import * as React from "react";
import { useNavigate, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useAuth } from "@/lib/auth/context";
import type { Role } from "@/lib/auth/types";

export default function Signup() {
  const { bootstrap } = useAuth();
  const nav = useNavigate();

  const [tenantName, setTenantName] = React.useState("");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [role, setRole] = React.useState<Role>("ADMIN");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-muted/60">
        <CardContent className="p-6">
          <div className="text-lg font-semibold">Criar conta</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Demo-mode: cria um tenant e um usuário local. Depois você migra para backend real.
          </div>

          <div className="mt-5 space-y-3">
            <Input placeholder="Nome da organização (tenant)" value={tenantName} onChange={(e) => setTenantName(e.target.value)} />
            <Input placeholder="Seu nome" value={name} onChange={(e) => setName(e.target.value)} />
            <Input type="email" placeholder="seu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} />

            <Select value={role} onValueChange={(v) => setRole(v as Role)}>
              <SelectTrigger>
                <SelectValue placeholder="Perfil" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ADMIN">Administrador</SelectItem>
                <SelectItem value="GESTOR_COMPLIANCE">Gestor de Compliance</SelectItem>
                <SelectItem value="GESTOR_BEM_ESTAR">Gestor de Bem-Estar</SelectItem>
                <SelectItem value="COORDENADOR_GERENTE">Coordenador/Gerente</SelectItem>
                <SelectItem value="COLABORADOR">Colaborador</SelectItem>
              </SelectContent>
            </Select>

            <Button
              className="w-full"
              onClick={() => {
                bootstrap({
                  tenantName: tenantName.trim() || "Tenant Demo",
                  name: name.trim() || "Usuário Demo",
                  email: email.trim() || "demo@exemplo.com",
                  role,
                });
                nav("/app", { replace: true });
              }}
            >
              Criar e entrar
            </Button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Já tem conta? <Link to="/login" className="text-foreground underline">Entrar</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
