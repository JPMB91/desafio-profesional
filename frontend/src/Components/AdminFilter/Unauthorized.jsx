import AlertIcon from "../../assets/alert.svg?react";

export const Unauthorized = () => {
  return (
     <div className="flex flex-col items-center justify-center h-screen text-center">
          <AlertIcon width="50" height="50" />
          <span className="flex justify-center font-bold text-red-500 text-transform: uppercase">
           no cuenta con los privilegios necesarios para ver este contenido
          </span>
        </div>
  )
}
