import { useState, useEffect, useRef } from "react";
import { X, Filter, ChevronDown, ChevronUp } from "lucide-react";
import { VehicleCard } from "../VehicleCard/VehicleCard";
import { LoadingSpinner } from "../../UI/LoadingSpinner";
import { Pagination } from "../../UI/Pagination/Pagination";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import { usePagination } from "../../../hooks/usePagination";

export const VehicleFilter = () => {
  const [categories, setCategories] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [filteredVehicles, setFilteredVehicles] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const vehicleFilterRef = useRef(null);

  const [searchParams, setSearchParams] = useSearchParams();

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
    itemsPerPage: 6,
  });

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
          if (vehicle?.category?.id && !categoryMap.has(vehicle.category.id)) {
            categoryMap.set(vehicle.category.id, vehicle.category);
            uniqueCategories.push(vehicle.category);
          }
        });
        setCategories(uniqueCategories);
        setLoading(false);
      } catch (err) {
        setError("Error obteniendo la información.");
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
  }, [searchParams]);

  const handleCategorySelect = (categoryId) => {
    let newSelected;
    if (selectedCategories.includes(categoryId)) {
      newSelected = selectedCategories.filter((id) => id !== categoryId);
    } else {
      newSelected = [...selectedCategories, categoryId];
    }
    setSelectedCategories(newSelected);
    if (newSelected.length > 0) {
      setSearchParams({ categories: newSelected.join(",") });
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
      setFilteredVehicles([]);
    } else {
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
    if (
      vehicleFilterRef.current &&
      typeof vehicleFilterRef.current.scrollIntoView === "function"
    ) {
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
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 ${
                          selectedCategories.includes(category.id)
                            ? "bg-indigo-50 border-l-4 border-indigo-500 shadow-sm"
                            : "hover:bg-gray-50"
                        }`}
                        onClick={() => handleCategorySelect(category.id)}
                      >
                        <div className="flex items-center flex-1">
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center overflow-hidden mr-3 border-2 border-gray-200 shadow-sm">
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
                            <span className="inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
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
                          onChange={() => handleCategorySelect(category.id)}
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
            </div>
          </div>
        </div>

        <div className="flex-1">
          <div className="mb-4 bg-white rounded-lg shadow p-4 border border-gray-200">
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
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
            role="grid"
          >
            {paginatedVehicles.length > 0 ? (
              paginatedVehicles.map((vehicle) => (
                <VehicleCard key={vehicle.id} vehicle={vehicle} />
              ))
            ) : selectedCategories.length > 0 ? (
              <div className="col-span-full p-8 text-center text-gray-500">
                No hay vehículos que coincidan con los filtros aplicados.
              </div>
            ) : null}
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
