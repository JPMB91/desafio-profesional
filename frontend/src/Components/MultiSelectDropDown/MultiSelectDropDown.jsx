import { useEffect, useRef, useState } from "react";

export const MultiSelectDropDown = ({ 
  options, 
  selectedOptions, 
  setSelectedOptions 
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  
  const handleSelect = (id) => {
    const newSelection = selectedOptions.includes(id)
      ? selectedOptions.filter(item => item !== id)
      : [...selectedOptions, id];
    
    setSelectedOptions(newSelection);
  };

  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setIsOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="border border-gray-400 p-2 rounded-lg focus:outline-none focus:border-blue-400">
      <div className="relative" ref={dropdownRef}>
        <div onClick={() => setIsOpen(!isOpen)} className="cursor-pointer">
          {selectedOptions.length > 0 
            ? `${selectedOptions.length} características seleccionadas` 
            : "Seleccione Características"}
        </div>
        <div
          className={`absolute z-10 w-full bg-white border border-gray-200 transition-opacity ${
            isOpen
              ? "opacity-100 pointer-events-auto"
              : "opacity-0 pointer-events-none"
          }`}
        >
          <ul>
            {options.map((option) => (
              <li key={option.id}>
                <label className="flex whitespace-nowrap cursor-pointer px-2 py-1 transition-colors hover:bg-blue-100 [&:has(input:checked)]:bg-blue-200">
                  <input
                    type="checkbox"
                    value={option.id}
                    className="cursor-pointer"
                    checked={selectedOptions.includes(option.id)}
                    onChange={() => handleSelect(option.id)}
                  />
                  <span className="ml-1">{option.name}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};