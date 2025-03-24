import { Link } from "react-router-dom";

export const WhatsAppButton = () => {
  const number = "56933691660";
  const preloadMessage = "Hola, solicito asistencia.";
  return (
    <div className="w-14 h-14 rounded-full overflow-hidden flex justify-center items-center fixed bottom-6 right-6 z-50 bg-white shadow-lg hover:cursor-pointer">
      <Link
        to={`https://wa.me/${number}?text=${preloadMessage}`}
        target="_blank"
      >
        <img
          src="/whatsappicon.png"
          alt="Enlace a WhatsApp"
          className="w-full h-full object-cover"
        />
      </Link>
    </div>
  );
};
