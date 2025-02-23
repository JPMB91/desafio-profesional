import { Link } from "react-router-dom";
import AlertIcon from "../../assets/alert.svg?react";

export const Unauthorized = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <AlertIcon width="50" height="50" />
      <span className="flex justify-center font-bold text-red-500 uppercase mt-4">
        No cuenta con los privilegios necesarios para ver este contenido.
      </span>
      <span className="flex justify-center font-bold text-red-500 uppercase mt-2">
        Inicie sesión o ir al
      </span>
      <Link to={"/"} className="mt-4">
        <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700">
          Home
        </button>
      </Link>
    </div>
  );
};
