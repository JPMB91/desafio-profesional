export const validateRegisterForm = (formData ) => {

  const cleanedFormData = {
    firstName: formData.firstName.trim(),
    lastName: formData.lastName.trim(),
    email: formData.email.trim(),
    password: formData.password.trim(),
    repeatPassword: formData.repeatPassword.trim()
  };
  
  let isValid = true;
  const newErrors = {};

  if (!cleanedFormData.firstName) {
    newErrors.firstName = "Debe ingresar un nombre";
    isValid = false;
  }
  if (!cleanedFormData.lastName) {
    newErrors.lastName = "Debe ingresar un apellido";
    isValid = false;
  }
  const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
  if (!cleanedFormData.email || !emailRegex.test(cleanedFormData.email)) {
    newErrors.email = "Debe ingresar un correo electrónico válido";
    isValid = false;
  }

  if (cleanedFormData.password !== cleanedFormData.repeatPassword) {
    newErrors.password = "Las contraseñas no coinciden";
    isValid = false;
  }

  if (!cleanedFormData.password) {
    newErrors.password = "Ingrese una contraseña";
    isValid = false;
  }

  if (!cleanedFormData.repeatPassword) {
    newErrors.repeatPassword = "Ingrese nuevamente una contraseña";
    isValid = false;
  }

  
  return { isValid, newErrors, cleanedFormData };
};
