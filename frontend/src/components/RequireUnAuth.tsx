import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireUnAuth = () => {
  const { user } = usePocket();
  const location = useLocation();

  if (user) {
    return (
      <Navigate to={{ pathname: "/" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
