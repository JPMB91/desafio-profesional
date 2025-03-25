import { jwtDecode } from "jwt-decode";

export function getUserName() {
  try {
    const token = localStorage.getItem("token");
    if (!token) return "";
    const decodedToken = jwtDecode(token);
    return decodedToken.name || "";
  } catch (error) {
    return "";
  }
}