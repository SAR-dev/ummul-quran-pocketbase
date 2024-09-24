import { Navigate, useLocation } from "react-router-dom";
import { usePocket } from "../contexts/PocketContext";
import NavLayout from "../layouts/NavLayout";

const HomePage = () => {
    const { user, student, teacher } = usePocket();
    const location = useLocation();

    if (user && (!teacher && !student)) {
        return (
            <NavLayout>
                <div className="absolute top-0 left-0 h-screen w-full flex justify-center items-center">
                    <div className="w-16 h-16 border-8 border-dashed rounded-full animate-spin border-blue-600" />
                </div>
            </NavLayout>
        )
    } else if (teacher) {
        return (
            <Navigate to={{ pathname: "/teacher" }} state={{ location }} replace />
        );
    } else if (student) {
        return (
            <Navigate to={{ pathname: "/student" }} state={{ location }} replace />
        );
    } else {
        return <Navigate to={{ pathname: "/sign-in" }} state={{ location }} replace />
    }

};

export default HomePage;