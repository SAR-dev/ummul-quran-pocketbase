import { BrowserRouter, Route, Routes } from "react-router-dom";
import { PocketProvider } from "./contexts/PocketContext";
import { RequireAuth } from "./components/RequireAuth";
import { SignIn } from "./pages/SignIn";
import { Protected } from "./pages/Protected";
import { RequireUnAuth } from "./components/RequireUnAuth";

const App = () => {
  return (
    <PocketProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<RequireUnAuth />}>
            <Route path="/sign-in" element={<SignIn />} />
          </Route>
          <Route element={<RequireAuth />}>
            <Route path="/" element={<Protected />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </PocketProvider>
  );
};

export default App;
