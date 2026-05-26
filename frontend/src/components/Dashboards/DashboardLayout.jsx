import { Outlet } from "react-router-dom";
import DashboardSidebar from "./DashboardSidebar";

const DashboardLayout = ({ role }) => {
  return (
    <div className="flex h-full">
      <DashboardSidebar role={role} />

      <section className="flex-1 overflow-y-auto p-8">
        <Outlet />
      </section>
    </div>
  );
};

export default DashboardLayout;
