import { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import VehicleSearchResults from "../VehicleSearchResults/VehicleSearchResults";
import { Search, Calendar, CircleAlert, Info, BadgeInfo } from "lucide-react";

import { LoadingSpinner } from "../../UI/LoadingSpinner";
import { format } from "date-fns";

import { es } from "date-fns/locale/es";
import { usePagination } from "../../../hooks/usePagination";
import { Pagination } from "../../UI/Pagination/Pagination";
registerLocale("es", es);

export const VehicleSearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    noDataInputError: "",
    noResultsError: "",
    fetchError: "",
  });

  const searchBarRef = useRef(null);

  const keywords = [
    "Familiar",
    "Terreno",
    "Lujo",
    "Compacto",
    "Sedán",
    "Kia",
    "BMW",
    "Toyota",
    "Nissan",
    "Silla para bebé",
    "Navegación GPS",
    "Pantalla táctil",
    "Sunroof",
    "Manual",
    "Automático",
    "CVT",
    "Gasoline",
    "Diesel",
    "Urbano",
  ];

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
    totalItems: results.length,
    itemsPerPage: 6,
  });

  const currentVehicles = results.slice(startIndex, endIndex);

  // useEffect(() => {
  //   if (searchBarRef.current) {
  //     searchBarRef.current.scrollIntoView({
  //       behavior: "smooth",
  //       block: "start",
  //     });
  //   }
  // }, [currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    // limpiar errores en onChange
    setError((prev) => ({
      ...prev,
      noDataInputError: "",
    }));

    if (value.length > 1) {
      const filteredSuggestions = keywords.filter((keyword) =>
        keyword.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const clearErrors = () => {
    setError({
      noDataInputError: "",
      noResultsError: "",
      fetchError: "",
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    clearErrors();

    if (!searchTerm) {
      setError((prev) => ({
        ...prev,
        noDataInputError: "Debe ingresar un término de búsqueda",
      }));
      return;
    }

    if (!startDate || !endDate) {
      setError((prev) => ({
        ...prev,
        noDataInputError: "Debe seleccionar fechas de inicio y fin",
      }));
      return;
    }

    setResults([]);
    setLoading(true);

    try {
      const formattedStartDate = format(startDate, "yyyy-MM-dd");
      const formattedEndDate = format(endDate, "yyyy-MM-dd");

      const response = await axios.get(
        "http://localhost:8080/api/vehicles/search",
        {
          params: {
            keyword: searchTerm,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
          },
        }
      );

      if (response.data && response.data.length > 0) {
        setResults(response.data);
        setSearchTerm("");
      } else {
        setError((prev) => ({
          ...prev,
          noResultsError:
            "No se encontraron vehículos que coincidan con su búsqueda.",
        }));
      }
    } catch (err) {
      setError((prev) => ({
        ...prev,
        fetchError:
          "Error obteniendo la información. Por favor, intente de nuevo.",
      }));
      console.error("Search error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const keyDownHandler = (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        handleSubmit();
      }
    };

    document.addEventListener("keydown", keyDownHandler);
    return () => {
      document.removeEventListener("keydown", keyDownHandler);
    };
  }, [searchTerm, startDate, endDate]);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
    clearErrors();
  };

  const handleDateChange = (date, isStartDate) => {
    if (isStartDate) {
      setStartDate(date);
    } else {
      setEndDate(date);
    }

    if (error.noDataInputError.includes("fechas")) {
      clearErrors();
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto" ref={searchBarRef}>
      <h2 className="font-bold p-4 md:text-base lg:text-2xl">Buscador</h2>

      <div className="flex flex-col gap-6 p-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="text-sm md:text-base mb-4 flex items-center font-body">
            <Info className="text-blue-600 mr-2" />
            Buscar vehiculos por tipo, ej. Familiar, deportivo, etc. Por
            características, (Sunroof, silla para bebé, navegación, entre otros)
          </h3>

          <form onSubmit={handleSubmit}>
            <div className="flex flex-col space-y-4">
              <div className="relative w-full">
                <input
                  type="search"
                  placeholder="Buscar vehículos..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  className="border border-gray-300 rounded-lg py-3 px-4 text-base w-full"
                  aria-label="Search"
                />
                <button
                  type="submit"
                  className="absolute inset-y-0 right-2 flex items-center px-2 text-blue-500 hover:cursor-pointer border-l"
                >
                  <Search />
                </button>
              </div>

              {suggestions.length > 0 && (
                <ul className="bg-white border hover:bg-blue-900 border-gray-300 rounded-md shadow-lg w-full">
                  {suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      onClick={() => handleSuggestionClick(suggestion)}
                      className="p-2 cursor-pointer hover:bg-gray-200"
                    >
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}

              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1">
                  <h2 className="text-sm  text-gray-700 mb-1 font-bold">
                    Buscar desde
                  </h2>
                  <div className="relative">
                    <DatePicker
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      selected={startDate}
                      onChange={(date) => handleDateChange(date, true)}
                      selectsStart
                      startDate={startDate}
                      minDate={new Date()}
                      endDate={endDate}
                      placeholderText="Fecha de inicio"
                      className="w-72 border border-gray-300 rounded-lg p-3 text-sm"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-sm  text-gray-700 mb-1 font-bold">
                    Buscar Hasta
                  </h2>
                  <div className="relative">
                    <DatePicker
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      selected={endDate}
                      onChange={(date) => handleDateChange(date, false)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={new Date()}
                      placeholderText="Fecha de fin"
                      className="w-72 border border-gray-300 rounded-lg p-3 text-sm"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="mt-4 p-3 text-white font-bold bg-[var(--color-accent-primary)] rounded-xl hover:cursor-pointer hover:bg-[var(--color-accent-primary-hover)]"
            >
              Realizar Búsqueda
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error.noDataInputError ? (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
              <p className="text-lg font-medium">{error.noDataInputError}</p>
            </div>
          </div>
        ) : error.noResultsError ? (
          <div className="bg-blue-100 border-2 border-blue-400 text-blue-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <Info className="h-6 w-6 mr-3 text-blue-500" />
              <p className="text-lg font-medium">{error.noResultsError}</p>
            </div>
          </div>
        ) : error.fetchError ? (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
              <p className="text-lg font-medium">{error.fetchError}</p>
            </div>
          </div>
        ) : (
          results.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <VehicleSearchResults
                results={results}
                currentVehicles={currentVehicles}
                searchTerm={searchTerm}
              />
            </div>
          )
        )}
      </div>

      {results.length > 0 && (
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
