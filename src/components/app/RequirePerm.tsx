import { Navigate } from "react-router-dom";
import { useAuth } from "@/lib/auth/context";
import { can, type Permission } from "@/lib/auth/permissions";

export default function RequirePerm({ perm, children }: { perm: Permission; children: JSX.Element }) {
  const { user } = useAuth();
  if (!can(user?.role, perm)) return <Navigate to="/app" replace />;
  return children;
}
