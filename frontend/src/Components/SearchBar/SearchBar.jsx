import { useState, useRef, useEffect } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import axios from "axios";
import SearchResults from "../SearchResults/SearchResults";
import { Search, Calendar } from "lucide-react";
import { usePagination } from "../../hooks/usePagination";
import { Pagination } from "../Pagination/Pagination";
import { LoadingSpinner } from "../LoadingSpinner";
import { format } from "date-fns";

import { es } from "date-fns/locale/es";
registerLocale("es", es);

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  useEffect(() => {
    if (searchBarRef.current) {
      searchBarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [currentPage]);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);

    if (value.length > 1) {
      const filteredSuggestions = keywords.filter((keyword) =>
        keyword.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    if (!searchTerm || !startDate || !endDate) {
      setError("Debe ingresar un término de búsqueda y seleccionar fechas para encontrar coincidencias");
      return;
    }

    setResults([]);
    setLoading(true);
    setError(null);

    try {
      const formattedStartDate = startDate
        ? format(startDate, "yyyy-MM-dd")
        : "";
      const formattedEndDate = endDate ? format(endDate, "yyyy-MM-dd") : "";

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
      setResults(response.data);
      setSearchTerm("");
    } catch (error) {
      setError("Error obteniendo la información.");
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
  }, []);

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto" ref={searchBarRef}>
      <h2 className="font-bold p-4 md:text-base lg:text-2xl">Buscador</h2>

      <div className="flex flex-col gap-6 p-4">
        <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
          <h3 className="text-sm md:text-base mb-4">
            Buscar vehiculos por características, (Sunroof, silla para bebé,
            navegación, etc.)
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
                  <h2 className="text-sm font-medium text-gray-700 mb-1">
                    Buscar desde
                  </h2>
                  <div className="relative">
                    <DatePicker
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      selected={startDate}
                      onChange={(date) => setStartDate(date)}
                      selectsStart
                      startDate={startDate}
                      endDate={endDate}
                      placeholderText="Fecha de inicio"
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm"
                    />
                    <Calendar
                      size={18}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    />
                  </div>
                </div>

                <div className="flex-1">
                  <h2 className="text-sm font-medium text-gray-700 mb-1">
                    Buscar Hasta
                  </h2>
                  <div className="relative">
                    <DatePicker
                      locale="es"
                      dateFormat="dd/MM/yyyy"
                      selected={endDate}
                      onChange={(date) => setEndDate(date)}
                      selectsEnd
                      startDate={startDate}
                      endDate={endDate}
                      minDate={startDate}
                      placeholderText="Fecha de fin"
                      className="w-full border border-gray-300 rounded-lg p-3 text-sm"
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
              onClick={handleSubmit}
              className=" m-2.5 p-3 text-white font-bold bg-blue-800 rounded-xl"
            >
              Realizar Búsqueda
            </button>
          </form>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : error ? (
          <div className="p-4 text-center font-bold text-red-500">{error}</div>
        ) : (
          results.length > 0 && (
            <div className="bg-white rounded-lg shadow p-4 border border-gray-200">
              <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
                <h2 className="font-bold lg:text-lg md:text-base m-0.5">
                  Resultados
                </h2>
                <div className="text-sm text-gray-600 mt-2 sm:mt-0">
                  Mostrando{" "}
                  <span className="font-medium">{results.length}</span>{" "}
                  vehículo(s)
                </div>
              </div>

              <SearchResults
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
