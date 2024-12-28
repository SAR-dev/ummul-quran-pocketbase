import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireUnAuth = () => {
  const { user, teacher } = usePocket();
  const location = useLocation();

  if (user && teacher) {
    return (
      <Navigate to={{ pathname: "/teacher" }} state={{ location }} replace />
    );
  }

  if (user && !teacher) {
    return (
      <Navigate to={{ pathname: "/student" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
