import { Outlet } from "react-router-dom";
import { AdminPanel } from "../Components/AdminPanel/AdminPanel";

export const AdminLayout = () => {
  return (
    <div className="flex">
      <AdminPanel />
      <div className="flex-1 p-6 ml-64">
        <Outlet />
      </div>
    </div>
  );
};

