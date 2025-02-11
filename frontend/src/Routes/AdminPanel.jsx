import { Link } from "react-router-dom";

export const AdminPanel = () => {
  return (
    <>
        <Link to="/admin/add-vehiculo">
        <button>Add Vehiculo</button>
      </Link>
    </>
  );
};
