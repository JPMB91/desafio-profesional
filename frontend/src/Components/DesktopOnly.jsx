import AlertIcon from "../assets/alert.svg?react";

const DesktopOnly = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <AlertIcon width="50" height="50" />
      <span className="flex justify-center font-bold text-red-500 text-transform: uppercase">
        contenido solo disponible en dispositivos de escritorio
      </span>
    </div>
  );
};

export default DesktopOnly;
