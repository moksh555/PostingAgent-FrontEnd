import { Outlet, Route, Routes } from "react-router-dom";
import "./App.css";
import PageHeader from "./components/layout/PageHeader";
import HomePage from "./routes/HomePage";
import DashBoardPage from "./routes/DashBoardPage";
import FormPage from "./routes/FormPage";
import OutputPage from "./routes/OutputPage";
import PastRun from "./routes/PastRun";

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
      </Route>
      <Route path="/dashboard" element={<DashBoardPage />}>
        <Route index element={<FormPage />} />
        <Route path="form" element={<FormPage />} />
        <Route path="output" element={<OutputPage />} />
        <Route path="pastRun" element={<PastRun />} />
      </Route>
    </Routes>
  );
}

export default App;
