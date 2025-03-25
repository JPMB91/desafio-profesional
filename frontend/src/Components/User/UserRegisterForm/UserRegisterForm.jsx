import { useState } from "react";
import { validateRegisterForm } from "../../../utils/validateRegisterForm";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CircleAlert } from "lucide-react";

export const UserRegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
  });

  const [error, setError] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    repeatPassword: "",
    userExists: "",
    general: "",
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
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      repeatPassword: "",
      userExists: "",
      general: "",
    });

    const validatedForm = validateRegisterForm(formData);

    // reemplazo la data por data limpia
    setFormData(validatedForm.cleanedFormData);

    if (!validatedForm.isValid) {
      setError(validatedForm.newErrors);
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/register", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      console.log("Usuario creado");

      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
      });

      setError({
        firstName: "",
        lastName: "",
        email: "",
        password: "",
        repeatPassword: "",
        general: "",
      });
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.data) {
        const errMsg = error.response.data;
        // errores
        switch (errMsg) {
          case "Error: Usuario ya existe":
            setError((prev) => ({
              ...prev,
              userExists:
                "Este correo electrónico ya está registrado. Por favor, inicia sesión o utiliza otro.",
            }));
            break;

          default:
            setError((prev) => ({
              ...prev,
              general: "Ha ocurrido un error, intente más tarde.",
            }));
            break;
        }
      }
    }
  };

  return (
    <section className="bg-gradient-to-br from-white to-gray-100 min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-[#0C1010] p-2 flex flex-col items-center">
          <img className="w-32" src="/logo.png" alt="Logo" />
        </div>
        <div>
          <h2 className="text-black text-2xl font-bold p-4 flex flex-col items-center">
            Crear una cuenta
          </h2>
        </div>
        <div className="p-8 space-y-6">
          <form className="space-y-6" onSubmit={handleSubmit} noValidate>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Nombre
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
                {error.firstName && (
                  <div className="flex items-center align-middle mt-1">
                    <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                    <span className="text-sm text-red-500 te font-bold mt-1">
                      {error.firstName}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Apellido
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
                {error.lastName && (
                  <div className="flex items-center align-middle mt-1">
                    <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                    <span className="text-sm text-red-500 te font-bold mt-1">
                      {error.lastName}
                    </span>
                  </div>
                )}
              </div>
            </div>

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
                <div className="flex items-center align-middle mt-1">
                  <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                  <span className="text-sm text-red-500 te font-bold mt-1">
                    {error.email}
                  </span>
                </div>
              )}
              {error.userExists && (
                <div className="flex items-center align-middle mt-1">
                  <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                  <span className="text-sm text-red-500 te font-bold mt-1">
                    {error.userExists}
                  </span>
                </div>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
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
                  minLength={6}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
                {error.password && (
                  <div className="flex items-center align-middle mt-1">
                    <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                    <span className="text-sm text-red-500 te font-bold mt-1">
                      {error.password}
                    </span>
                  </div>
                )}
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="repeatPassword"
                  className="block text-sm font-semibold text-gray-700"
                >
                  Repita la contraseña
                </label>
                <input
                  type="password"
                  id="repeatPassword"
                  name="repeatPassword"
                  minLength={6}
                  className="w-full px-4 py-2 text-gray-700 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  onChange={handleInputChange}
                  required
                />
                {error.repeatPassword && (
                  <div className="flex items-center align-middle mt-1">
                    <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                    <span className="text-sm text-red-500 te font-bold mt-1">
                      {error.repeatPassword}
                    </span>
                  </div>
                )}

                {error.general && (
                  <div className="flex items-center align-middle mt-1">
                    <CircleAlert className="h-5 w-5 text-red-500 mr-2 " />
                    <span className="text-sm text-red-500 te font-bold mt-1">
                      {error.general}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full bg-blue-900 hover:bg-blue-800 text-white font-semibold py-3 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-700 focus:ring-opacity-50 shadow-md"
              >
                Registrarse
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
};
