import { Outlet } from "react-router-dom";
import { AdminPanel } from "../Components/AdminPanel/AdminPanel";
import { useDesktop } from "../context/Desktop.context";

export const AdminLayout = () => {
  const {isDesktop} = useDesktop()
  return (
    <div className="flex min-h-full">
      {isDesktop && <AdminPanel />}
      <div className={`flex-1 p-6 ${isDesktop ? 'ml-64' : ''}`}>
        <Outlet />
      </div>
    </div>
  );
};

