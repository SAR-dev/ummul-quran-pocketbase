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
import AdminStudentInvoiceGenerator from "./pages/AdminStudentInvoiceGenerator";
import AdminTeacherInvoiceGenerator from "./pages/AdminTeacherInvoiceGenerator";
import AdminStudentInvoiceViewer from "./pages/AdminStudentInvoiceViewer";
import AdminTeacherInvoiceViewer from "./pages/AdminTeacherInvoiceViewer";
import TeacherSelfInvoiceDetails from "./pages/TeacherSelfInvoiceDetails";
import StudentSelfInvoiceDetails from "./pages/StudentSelfInvoiceDetails";
import StudentInvoiceDetails from "./pages/StudentInvoiceDetails";
import TeacherInvoiceDetails from "./pages/TeacherInvoiceDetails";

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
              <Route path="/teacher/invoices/:id" element={<TeacherSelfInvoiceDetails />} />
              </Route>
            <Route element={<RequireStudentAuth />}>
              <Route path="/student" element={<StudentSelf />} />
              <Route path="/student/invoices/:id" element={<StudentSelfInvoiceDetails />} />
            </Route>
            <Route element={<RequireAdminAuth />}>
              <Route path="/admin/generate-student-invoices" element={<AdminStudentInvoiceGenerator />} />
              <Route path="/admin/generate-teacher-invoices" element={<AdminTeacherInvoiceGenerator />} />
              <Route path="/admin/manage-student-invoices" element={<AdminStudentInvoiceViewer />} />
              <Route path="/admin/manage-teacher-invoices" element={<AdminTeacherInvoiceViewer />} />
              <Route path="/admin/student-invoices/:id" element={<StudentInvoiceDetails />} />
              <Route path="/admin/teacher-invoices/:id" element={<TeacherInvoiceDetails />} />
              </Route>
          </Routes>
        </BrowserRouter>
      </NotificationProvider>
    </PocketProvider>
  );
};

export default App;
