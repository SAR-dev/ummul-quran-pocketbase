import { Navigate, Outlet, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";

export const RequireTeacherAuth = () => {
  const { user, teacher } = usePocket();
  const location = useLocation();

  if (!user || !teacher) {
    return (
      <Navigate to={{ pathname: "/" }} state={{ location }} replace />
    );
  }

  return <Outlet />;
};
