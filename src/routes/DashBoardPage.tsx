import { Outlet } from "react-router-dom";
import DashboardSidebar from "../components/layout/DashboardSidebar";

const DashBoardPage = () => (
  <div className="flex min-h-screen w-full">
    <DashboardSidebar />
    <div className="min-w-0 flex-1">
      <Outlet />
    </div>
  </div>
);

export default DashBoardPage;
