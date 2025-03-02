import { useState, useEffect } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

import { VehicleCard } from "../VehicleCard/VehicleCard";
import { LoadingSpinner } from "../LoadingSpinner";
import { Pagination } from "../Pagination/Pagination";

export const VehicleFilter = () => {
  const [categories, setCategories] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  //Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const [totalPages, setTotalPages] = useState(1);
  const [paginatedVehicles, setPaginatedVehicles] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        const vehiclesResponse = await fetch(
          "http://localhost:8080/api/vehicles"
        );
        const vehiclesData = await vehiclesResponse.json();
        setVehicles(vehiclesData);
        setFilteredVehicles(vehiclesData);

        const uniqueCategories = [
          ...new Map(
            vehiclesData.map((vehicle) => [
              vehicle.category.id,
              vehicle.category,
            ])
          ).values(),
        ];

        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError("Error obteniendo la infomacion.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleCategorySelect = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);

    if (isSelected) {
      // toggle de seleccion de categorias
      setSelectedCategories((prev) => prev.filter((id) => id !== categoryId));
    } else {
      setSelectedCategories((prev) => [...prev, categoryId]);
    }

    // reseta paginacion al cambiar filtros
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setCurrentPage(1);
  };

  useEffect(() => {
    if (selectedCategories.length === 0) {
      //Si no se selecciono filtro no muestra vehiculos
      // setFilteredVehicles(vehicles);
      setFilteredVehicles([]);
    } else {
      // si hay selecion muestra los filtrados
      const filtered = vehicles.filter((vehicle) =>
        selectedCategories.includes(vehicle.category.id)
      );
      setFilteredVehicles(filtered);
    }

    //cuando cambia el filtro se resetea la paginacion
    setCurrentPage(1);
  }, [selectedCategories, vehicles]);

  // pagination
  useEffect(() => {
    const calculatedTotalPages = Math.ceil(
      filteredVehicles.length / itemsPerPage
    );
    setTotalPages(calculatedTotalPages || 1); // Ensure at least 1 page

   // calcula el numero de los vehiculos que se muestran en cada pagina
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedVehicles(filteredVehicles.slice(startIndex, endIndex));
  }, [filteredVehicles, currentPage, itemsPerPage]);

  const toggleFilterSection = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePageReset = () => {
    setCurrentPage(1);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="p-4 text-center font-bold text-red-500">{error}</div>;

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto">
      <h2 className="font-bold p-4 md:text-base lg:text-2xl">Buscar Vehículo por Categoría</h2>
      <div className="flex flex-col md:flex-row gap-6 p-4">
        <div className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
            <div
              className="flex justify-between items-center mb-4"
              onClick={toggleFilterSection}
            >
              <div className="flex gap-2 items-center">
                <Filter size={18} />
                <h2 className="font-semibold text-lg">Filtrar por Categoría</h2>
              </div>
              <button className="md:hidden">
                {isFilterOpen ? (
                  <ChevronUp size={20} />
                ) : (
                  <ChevronDown size={20} />
                )}
              </button>
            </div>

            <div className={`${isFilterOpen ? "block" : "hidden md:block"}`}>
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm text-gray-600">
                    {selectedCategories.length > 0
                      ? `${selectedCategories.length} seleccionadas`
                      : "Todas las categorías"}
                  </span>
                  {selectedCategories.length > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-sm text-blue-600 hover:text-blue-800"
                    >
                      Limpiar filtros
                    </button>
                  )}
                </div>

                <div className="space-y-2 mt-2">
                  {categories.map((category) => (
                    <div key={category.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`category-${category.id}`}
                        checked={selectedCategories.includes(category.id)}
                        onChange={() => handleCategorySelect(category.id)}
                        className="mr-2 h-4 w-4 text-blue-600 rounded"
                      />
                      <label
                        htmlFor={`category-${category.id}`}
                        className="text-sm cursor-pointer flex-1"
                      >
                        {category.name}
                      </label>
                      <span className="text-xs text-gray-500">
                        (
                        {
                          vehicles.filter((v) => v.category.id === category.id)
                            .length
                        }
                        )
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {selectedCategories.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <h3 className="text-sm font-medium mb-2">
                    Filtros aplicados
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedCategories.map((categoryId) => {
                      const category = categories.find(
                        (c) => c.id === categoryId
                      );
                      return (
                        <div
                          key={categoryId}
                          className="bg-gray-100 text-sm py-1 px-2 rounded-full flex items-center"
                        >
                          <span>{category?.name}</span>
                          <button
                            onClick={() => handleCategorySelect(categoryId)}
                            className="ml-1 text-gray-500 hover:text-gray-700"
                            aria-label={`Quitar filtro ${category?.name}`}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 bg-white rounded-lg shadow p-4 border border-gray-200">
            <div className="flex justify-between items-center">
              <h2 className="font-semibold text-lg">Vehículos</h2>
              <div className="text-sm text-gray-600">
                Mostrando{" "}
                <span className="font-medium">{filteredVehicles.length}</span>{" "}
                de <span className="font-medium">{vehicles.length}</span>{" "}
                vehículos
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : (
              selectedCategories.length > 0 && (
                <div className="col-span-full p-8 text-center text-gray-500">
                No hay vehículos que coincidan con los filtros aplicados.
              </div>
              )
            )}
          </div>
        </div>
      </div>

      {filteredVehicles.length > 0 && (
        <div className="w-full mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            onPageReset={handlePageReset}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}
    </div>
  );
};

export default VehicleFilter;
