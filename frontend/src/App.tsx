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
import TeacherSelfInvoices from "./pages/TeacherSelfInvoices";
import { RequireAdminAuth } from "./components/RequireAdminAuth";
import AdminInvoiceGenerator from "./pages/AdminInvoiceGenerator";
import AdminInvoiceViewer from "./pages/AdminInvoiceViewer";

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
            </Route>
            <Route element={<RequireStudentAuth />}>
              <Route path="/student" element={<StudentSelf />} />
            </Route>
            <Route element={<RequireAdminAuth />}>
              <Route path="/admin" element={<AdminInvoiceGenerator />} />
              <Route path="/admin/invoices/generate" element={<AdminInvoiceGenerator />} />
              <Route path="/admin/invoices/manage" element={<AdminInvoiceViewer />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </PocketProvider>
  );
};

export default App;
