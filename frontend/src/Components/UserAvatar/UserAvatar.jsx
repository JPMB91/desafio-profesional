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
    <div className="flex flex-col items-center"> {/* Center horizontally */}
    <div className="rounded-full bg-blue-500 w-12 h-12 flex items-center justify-center"> 
        <span className="text-white font-bold text-lg">{initials}</span> 
    </div>
    <p className="mt-2 text-center text-sm">{name}</p> 
</div>
  );
};
