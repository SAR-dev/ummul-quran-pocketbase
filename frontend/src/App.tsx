import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { RequireTeacherAuth } from "./components/RequireTeacherAuth";
import { SignIn } from "./pages/SignIn";
import { RequireUnAuth } from "./components/RequireUnAuth";
import { ClassPlanner } from "./pages/ClassPlanner";
import { ClassDetails } from "./pages/ClassDetails";
import { NotificationProvider } from "./contexts/NotificationContext";
import TeacherSelf from "./pages/TeacherSelf";
import StudentSelf from "./pages/StudentSelf";
import { RequireStudentAuth } from "./components/RequireStudentAuth";
import HomePage from "./pages/HomePage";
import StudentInvoice from "./pages/StudentInvoice";
import TeacherSelfInvoices from "./pages/TeacherSelfInvoices";
import TeacherInvoice from "./pages/TeacherInvoice";
import { RequireAdminAuth } from "./components/RequireAdminAuth";
import AdminSelf from "./pages/AdminSelf";

const App = () => {
  return (
    <PocketProvider>
      <NotificationProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route element={<RequireUnAuth />}>
              <Route path="/sign-in" element={<SignIn />} />
            </Route>
            <Route element={<RequireTeacherAuth />}>
              <Route path="/teacher" element={<TeacherSelf />} />
              <Route path="/teacher/class-planner" element={<ClassPlanner />} />
              <Route path="/teacher/class-details/:id" element={<ClassDetails />} />
              <Route path="/teacher/invoices" element={<TeacherSelfInvoices />} />
              <Route path="/teacher/invoices/:id" element={<TeacherInvoice />} />
            </Route>
            <Route element={<RequireStudentAuth />}>
              <Route path="/student" element={<StudentSelf />} />
              <Route path="/student/invoices/:id" element={<StudentInvoice />} />
            </Route>
            <Route element={<RequireAdminAuth />}>
              <Route path="/admin" element={<AdminSelf />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </PocketProvider>
  );
};

export default App;
