import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { useState } from "react";
import { Navigate, NavigationType, replace, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Auth.Context";

export const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    // password: "",
  });

  const [error, setError] = useState({
    email: "",
    general: "",
    // password: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "categoryId") {
      setFormData((prev) => ({
        ...prev,
        categoryId: parseInt(value, 10) || "",
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError({
      email: "",
      general: "",
      // password: "",
    });

    try {
      const response = await axios.post(
        "http://localhost:8080/auth/login",
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const token = response.data.token;
      login(token);

      const decodedToken = jwtDecode(token);
      const roles = decodedToken.roles || [];

      if (roles.includes("ROLE_ADMIN")) {   
          navigate("/administracion")
      } else if (roles.includes("ROLE_USER")) {
          navigate("/");
      }
      setFormData({
        email: "",
        password: "",
      });

      setError({
        email: "",
        password: "",
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const { message } = error.response.data;

        if (message === "Credenciales inválidas") {
          setError((prev) => ({
            ...prev,
            password: "Credenciales inválidas",
          }));
        } else {
          setError((prev) => ({
            ...prev,
            general: "Ocurrió un error desconocido.",
          }));
        }
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#0C1010] p-2 flex flex-col items-center">
          <img className="w-32" src="/logo.png" alt="Logo" />
        </div>
        <div>
          <h2 className="text-black text-2xl font-bold p-4 flex flex-col items-center">
            Login
          </h2>
        </div>
        <div className="p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-gray-700"
              >
                Correo Electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                onChange={handleInputChange}
                required
              />
              {error.email && (
                <p className="text-red-600 text-sm font-bold mt-1">
                  {error.email}
                </p>
              )}
            </div>

            <div className="grid gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
                {error.password && (
                  <p className="text-red-600 text-sm font-bold mt-1">
                    {error.password}
                  </p>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md"
              >
                Login
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
