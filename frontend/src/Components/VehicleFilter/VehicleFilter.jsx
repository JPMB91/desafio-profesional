import { useState, useEffect, useRef } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";

import { VehicleCard } from "../VehicleCard/VehicleCard";
import { LoadingSpinner } from "../LoadingSpinner";
import { Pagination } from "../Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { usePagination } from "../../hooks/usePagination";

export const VehicleFilter = () => {
  const [categories, setCategories] = useState([]);
  const [vehicles, setVehicles] = useState([]);

  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const vehicleFilterRef = useRef(null);

  //searchParams
  const [searchParams, setSearchParams] = useSearchParams();

  //Pagination
  const {
    currentPage,
    totalPages,
    startIndex,
    endIndex,
    handlePrevPage,
    handleNextPage,
    handlePageClick,
    handlePageReset,
  } = usePagination({
    totalItems: filteredVehicles.length,
    itemsPerPage: 6, // numero maximo de vehiculos por pagina
  });

  // vehiculos que se van a mostrar en cada pagina
  const paginatedVehicles = filteredVehicles.slice(startIndex, endIndex);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get("http://localhost:8080/api/vehicles");
        const vehiclesData = response.data;
        setVehicles(vehiclesData);

        const uniqueCategories = [];
        const categoryMap = new Map();

        vehiclesData.forEach((vehicle) => {
          if (vehicle && vehicle.category && vehicle.category.id) {
            if (!categoryMap.has(vehicle.category.id)) {
              categoryMap.set(vehicle.category.id, vehicle.category);
              uniqueCategories.push(vehicle.category);
            }
          }
        });

        setCategories(uniqueCategories);
        setFilteredVehicles([]);
        setLoading(false);
      } catch (err) {
        setError("Error obteniendo la infomacion.");
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const categoriesParam = searchParams.get("categories");
    if (categoriesParam) {
      setSelectedCategories(categoriesParam.split(",").map(Number));
    }
  }, []);

  const handleCategorySelect = (categoryId) => {
    const isSelected = selectedCategories.includes(categoryId);
    let newSelectedCategories;

    if (isSelected) {
      newSelectedCategories = selectedCategories.filter(
        (id) => id !== categoryId
      );
    } else {
      newSelectedCategories = [...selectedCategories, categoryId];
    }

    setSelectedCategories(newSelectedCategories);

    if (newSelectedCategories.length > 0) {
      setSearchParams({ categories: newSelectedCategories.join(",") });
    } else {
      setSearchParams({});
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setSearchParams({});
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
  }, [selectedCategories, vehicles]);

  const toggleFilterSection = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  useEffect(() => {
    if (vehicleFilterRef.current) {
      vehicleFilterRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="p-4 text-center font-bold text-red-500">{error}</div>
    );

  return (
    <div
      className="flex flex-col w-full max-w-6xl mx-auto"
      ref={vehicleFilterRef}
    >
      <h2 className="font-bold p-4 md:text-base lg:text-2xl">
        Filtrar Vehículos por Categoría
      </h2>
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

                {categories && categories.length > 0 ? (
                  <div className="space-y-3 mt-3">
                    {categories.map((category) => (
                      <div
                        key={category.id}
                        className={`flex items-center p-2 rounded-lg cursor-pointer transition-colors ${
                          selectedCategories.includes(category.id)
                            ? "bg-blue-50"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3 border border-gray-200">
                            {category.categoryImage ? (
                              <img
                                src={`http://localhost:8080/api/categories/uploads/${category.categoryImage.filename}`}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="text-lg text-gray-400">
                                {category.name.charAt(0)}
                              </div>
                            )}
                          </div>

                          <div className="flex-1">
                            <label
                              htmlFor={`category-${category.id}`}
                              className="text-sm cursor-pointer flex-1 font-medium"
                            >
                              {category.name}
                            </label>
                            <span className="text-xs text-gray-500 block">
                              {
                                vehicles.filter(
                                  (v) => v.category.id === category.id
                                ).length
                              }{" "}
                              vehículo(s)
                            </span>
                          </div>
                        </div>

                        <input
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          className="h-4 w-4 text-blue-600 rounded"
                          onClick={(e) => e.stopPropagation()}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="bg-gray-50 rounded-lg p-8 text-center border border-gray-200">
                    <div className="text-gray-500 mb-2">
                      No hay categorías disponibles
                    </div>
                    <div className="text-sm text-gray-400">
                      Se necesitan categorías para filtrar vehículos
                    </div>
                  </div>
                )}
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
                          className="bg-blue-100 text-blue-800 text-sm py-1 px-2 rounded-full flex items-center cursor-pointer hover:bg-blue-200"
                          onClick={() => handleCategorySelect(categoryId)}
                          aria-label={`Quitar filtro ${category?.name}`}
                          role="button"
                        >
                          <span>{category?.name}</span>
                          <span className="ml-1 text-blue-600">
                            <X size={14} />
                          </span>
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
          <div className="mb-4 bg-white rounded-lg shadow p-4 border border-gray-200 ">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:justify-evenly">
              <h2 className="font-bold lg:text-lg md:text-base m-0.5">
                Resultados
              </h2>
              <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                Mostrando{" "}
                <span className="font-medium">{filteredVehicles.length}</span>{" "}
                de <span className="font-medium">{vehicles.length}</span>{" "}
                vehículo(s) en existencia
              </div>
            </div>
          </div>

          <div
            role="grid"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {paginatedVehicles.length > 0
              ? paginatedVehicles.map((vehicle) => (
                  <VehicleCard key={vehicle.id} vehicle={vehicle} />
                ))
              : selectedCategories.length > 0 && (
                  <div className="col-span-full p-8 text-center text-gray-500">
                    No hay vehículos que coincidan con los filtros aplicados.
                  </div>
                )}
          </div>
        </div>
      </div>

      {filteredVehicles.length > 0 && (
        <div className="w-full mt-8">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageClick}
            onPageReset={handlePageReset}
            onPrevPage={handlePrevPage}
            onNextPage={handleNextPage}
          />
        </div>
      )}
    </div>
  );
};
