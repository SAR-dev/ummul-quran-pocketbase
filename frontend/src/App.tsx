import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { RequireAuth } from "./components/RequireAuth";
import { SignIn } from "./pages/SignIn";
import { HomePage } from "./pages/HomePage";
import { RequireUnAuth } from "./components/RequireUnAuth";
import { ClassPlanner } from "./pages/ClassPlanner";
import { ClassDetails } from "./pages/ClassDetails";

const App = () => {
  return (
    <PocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RequireUnAuth />}>
            <Route path="/sign-in" element={<SignIn />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/class-planner" element={<ClassPlanner />} />
            <Route path="/class-details/:id" element={<ClassDetails />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PocketProvider>
  );
};

export default App;
