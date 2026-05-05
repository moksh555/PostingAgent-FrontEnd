import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import PageHeader from "./components/layout/PageHeader";
import HomePage from "./routes/HomePage";
import HowItWorksPage from "./routes/HowItWorksPage";
import LoginPage from "./routes/LoginPage";
import RegisterPage from "./routes/RegisterPage";
import DashBoardPage from "./routes/DashBoardPage";
import OverviewPage from "./routes/OverviewPage";
import FormPage from "./routes/FormPage";
import PastRun from "./routes/PastRun";
import RequireAuth from "./routes/RequireAuth";
import { routes } from "./config/routes";

const MarketingLayout = () => (
  <>
    <PageHeader />
    <main>
      <Outlet />
    </main>
  </>
);

function App() {
  return (
    <Routes>
      <Route element={<MarketingLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path={routes.howItWorks} element={<HowItWorksPage />} />
      </Route>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/dashboard" element={<DashBoardPage />}>
          <Route index element={<OverviewPage />} />
          <Route path="form" element={<FormPage />} />
          <Route path="resume/:threadId" element={<FormPage />} />
          <Route path="pastRun" element={<PastRun />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
