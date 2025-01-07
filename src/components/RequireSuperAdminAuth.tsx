import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireSuperAdminAuth = () => {
  const { user, isSuperAdmin } = usePocket();
  const location = useLocation();

  if (!user || !isSuperAdmin) {
    return (
      <Navigate to={{ pathname: "/" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
