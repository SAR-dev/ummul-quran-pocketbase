import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireAdminAuth = () => {
  const { user, isAdmin } = usePocket();
  const location = useLocation();

  if (!user || !isAdmin) {
    return (
      <Navigate to={{ pathname: "/" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
