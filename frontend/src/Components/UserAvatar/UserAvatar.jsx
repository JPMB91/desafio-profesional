import { jwtDecode } from "jwt-decode";

export const UserAvatar = () => {
  const token = localStorage.getItem("token");
 
  if (!token) {
    return null;
  }
 
  const decodedToken = jwtDecode(token);
  const name = decodedToken.name || "";
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .toUpperCase();
   
  return (
    <div className="rounded-full bg-blue-500 w-12 h-12 flex items-center justify-center">
      <span className="text-white font-bold text-lg">{initials}</span>
    </div>
  );
};