export const validateForm = ({images, ...formData}) => {
  let isValid = true;
  const newErrors = {};

  if (!formData.brand.trim()) {
    newErrors.brand = "Marca es requerida";
    isValid = false;
  }
  if (!formData.model.trim()) {
    newErrors.model = "Modelo es requerido";
    isValid = false;
  }
  if (!formData.manufacturingYear.trim()) {
    newErrors.manufacturingYear = "Año de fabricación es requerido";
    isValid = false;
  }
  if (!formData.description.trim()) {
    newErrors.description = "Descripción es requerida";
    isValid = false;
  }
  if (!formData.numberOfSeats) {
    newErrors.numberOfSeats = "Número de asientos es requerido";
    isValid = false;
  }
  if (!formData.categoryId) {
    newErrors.categoryId = "Categoría es requerida";
    isValid = false;
  }
  if (!formData.gearShift.trim()) {
    newErrors.gearShift = "Tipo de transmisión es requerido";
    isValid = false;
  }
  if (!formData.numberOfDoors) {
    newErrors.numberOfDoors = "Número de puertas es requerido";
    isValid = false;
  }
  if (!formData.fuelType.trim()) {
    newErrors.fuelType = "Tipo de combustible es requerido";
    isValid = false;
  }
  if (!formData.registrationPlate.trim()) {
    newErrors.registrationPlate = "Matrícula es requerida";
    isValid = false;
  }
  if (!formData.dailyCost.trim()) {
    newErrors.dailyCost = "Costo diario es requerido";
    isValid = false;
  }

  if (!images || images.length === 0) {
    newErrors.images = "Debe insertar imagenes";
    isValid = false;
  }

  return {isValid, newErrors};
};