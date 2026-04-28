import { NavLink, Outlet } from "react-router-dom";

const DashBoardPage = () => {
  return (
    <div>
      <NavLink to="/dashboard/form">Form</NavLink>
      <NavLink to="/dashboard/output">Output</NavLink>
      <NavLink to="/dashboard/pastRun">Past Run</NavLink>
      <Outlet />
    </div>
  );
};

export default DashBoardPage;
