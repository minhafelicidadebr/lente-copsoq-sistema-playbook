import * as React from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/lib/auth/context";

export default function Login() {
  const { toast } = useToast();
  const { login } = useAuth();
  const [email, setEmail] = React.useState("");
  const nav = useNavigate();
  const loc = useLocation() as any;
  const from = loc?.state?.from ?? "/app";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-6">
      <Card className="w-full max-w-md border-muted/60">
        <CardContent className="p-6">
          <div className="text-lg font-semibold">Entrar</div>
          <div className="mt-1 text-sm text-muted-foreground">
            Demo-mode: use o e-mail cadastrado no ambiente local.
          </div>

          <div className="mt-5 space-y-3">
            <Input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />
            <Button
              className="w-full"
              onClick={() => {
                const ok = login(email.trim());
                if (!ok) {
                  toast({ title: "Não encontrado", description: "Faça o cadastro (demo) para criar seu tenant." });
                  return;
                }
                nav(from, { replace: true });
              }}
            >
              Entrar
            </Button>
          </div>

          <div className="mt-4 text-sm text-muted-foreground">
            Não tem conta? <Link to="/signup" className="text-foreground underline">Criar agora</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
