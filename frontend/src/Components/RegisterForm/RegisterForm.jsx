import { useState } from "react";
import { validateRegisterForm } from "../../utils/validateRegisterForm";
import axios from "axios";

export const RegisterForm = () => {
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
    });
  
    const validatedForm = validateRegisterForm(formData);
  
    // reemplazo la data por data limpia
    setFormData(validatedForm.cleanedFormData)

    if (!validatedForm.isValid) {
      setError(validatedForm.newErrors);
      return;
    }
  
    try {
      await axios.post("http://localhost:8080/api/register", formData,{
        headers:{
          "Content-Type": "application/json"
        }
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
      });
    } catch (error) {
      if (error.response && error.response.data) {
        const errMsg = error.response.data;
  
        // errores
        switch (errMsg) {
          case "Error: El nombre del vehiculo debe ser único.":
            setError((prev) => ({ ...prev, name: errMsg }));
            break;
  
          case "Error: La matrícula ya está registrada.":
            setError((prev) => ({ ...prev, registrationPlate: errMsg }));
            break;
  
          default:
            setError((prev) => ({
              ...prev,
              general: "Ocurrió un error desconocido.",
            }));
            break;
        }
      }
    }
  };

  return (
    <section
      className="bg-gray-100
     min-h-screen flex items-center justify-center p-6"
    >
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 space-y-6">
        <div className="flex justify-center">
          <img className="w-32" src="/logo.png" alt="Logo" />
        </div>

        <form className="space-y-4">
          <div>
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="mt-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleInputChange}
              // required
            />

            {error.name && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.name}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="mt-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleInputChange}
              // required
            />

            {error.lastName && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.lastName}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="mt-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleInputChange}
              // required
            />
            {error.email && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.email}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              minLength={6}
              className="mt-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleInputChange}
              // required
            />
            {error.password && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.password}
              </p>
            )}
          </div>

          <div>
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Repita la contraseña
            </label>
            <input
              type="password"
              id="repeatPassword"
              name="repeatPassword"
              minLength={6}
              className="mt-1 w-full p-3 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              onChange={handleInputChange}
              // required
            />
            {error.repeatPassword && (
              <p className="text-red-500 text-sm font-bold mt-1">
                {error.repeatPassword}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-3 rounded-lg transition shadow-md focus:ring-4 focus:ring-blue-300 focus:outline-none dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-blue-700"
            onClick={handleSubmit}
          >
            Registrarse
          </button>
        </form>
      </div>
    </section>
  );
};
