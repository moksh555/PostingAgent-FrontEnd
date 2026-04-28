import { Route, Routes } from "react-router-dom";
import "./App.css";
import PageHeader from "./components/layout/PageHeader";
import HomePage from "./routes/HomePage";
import DashBoardPage from "./routes/DashBoardPage";
import FormPage from "./routes/FormPage";
import OutputPage from "./routes/OutputPage";
import PastRun from "./routes/PastRun";

function App() {
  return (
    <div>
      <PageHeader />
      <main>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/dashboard" element={<DashBoardPage />}>
            <Route path="form" element={<FormPage />} />
            <Route path="output" element={<OutputPage />} />
            <Route path="pastRun" element={<PastRun />} />
          </Route>
        </Routes>
      </main>
    </div>
  );
}

export default App;
