import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireStudentAuth = () => {
  const { user, student } = usePocket();
  const location = useLocation();

  if (!user || !student) {
    return (
      <Navigate to={{ pathname: "/" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
