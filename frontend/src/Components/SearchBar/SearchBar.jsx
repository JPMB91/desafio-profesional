import { useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { es } from "date-fns/locale/es";
import axios from "axios";
import SearchResults from "../SearchResults/SearchResults";
import { Search } from "lucide-react";

registerLocale("es", es);

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);

  const keywords = [
    "Familiar",
    // "Deportivo",
    "Terreno",
    "Lujo",
    "Compacto",
    "Sedan",
    "Kia",
    "BMW",
    "Toyota",
    "Silla para bebé",
    "Navegación GPS",
    "Pantalla táctil",
    "Sunroof",
    "Manual",
    "Automático",
    "CVT",
    // "Semi-Automático",
    "Gasoline",
    // "Eléctrico",
    "Diesel",
    // "BioDiesel"
    "Urbano"
  ];

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
    e.preventDefault();
    setResults([]);
    try {
      const response = await axios.get(
        "http://localhost:8080/api/vehicles/search",
        {
          params: {
            keyword: searchTerm,
          },
        }
      );
      setResults(response.data);
      setSearchTerm("");
    } catch (error) {
      console.log(error);
    }
    console.log("buscando", {
      term: searchTerm,
      startDate,
      endDate,
    });
  };

  const handleSuggestionClick = (suggestion) => {
    setSearchTerm(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto  mt-4">
      <div>
        <h2 className="font-bold md:text-base lg:text-2xl">Buscador</h2>

        <h3>
          Buscar vehiculos por características, (Sunroof, silla para bebé,
          navegación, etc.)
        </h3>

        <form className="shadow-md p-4 rounded-lg" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2">
            <input
              type="search"
              placeholder="Buscar vehículos..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="p-2 border border-gray-300 rounded-md relative"
              aria-label="Search"
            />
            <button
              type="submit"
              className="p-2 bg-blue-500 text-white rounded-md w-fit m-auto hover:bg-blue-600 relative z-20"
            >
              <Search />
            </button>
            {suggestions.length > 0 && (
              <ul className="bg-white border border-gray-300 rounded-md shadow-lg">
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
            <div className="flex space-x-4">
              <div className="flex flex-col">
                <h2>Buscar desde</h2>

                <DatePicker
                  locale="es"
                  dateFormat="dd/MM/yyyy"
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                  selectsStart
                  startDate={startDate}
                  endDate={endDate}
                  placeholderText="Fecha de inicio"
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>

              <div className="flex flex-col">
                <h2>Buscar Hasta</h2>

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
                  className="p-2 border border-gray-300 rounded-md"
                />
              </div>
            </div>
          </div>
        </form>
      </div>

      <SearchResults
        className="mt-4"
        results={results}
        searchTerm={searchTerm}
      />
    </div>
  );
};
