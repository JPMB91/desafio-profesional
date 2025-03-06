import axios from "axios";
import { useEffect, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
// import { es } from "date-fns/locale/es";

// registerLocale("es", es);

export const ReservationCalendar = ({ id }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedPeriods, setReservedPeriods] = useState([]);
  const [error, setError] = useState({
    datePeriodNotValid: "",
    informationNotAvailable: "",
  });

  useEffect(() => {
    const getReservationData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:8080/api/vehicles/${id}/calendar`
        );

        const periods = response.data.reservedPeriods.map((period) => ({
          startDate: new Date(period.startDate),
          endDate: new Date(period.endDate),
        }));
        setReservedPeriods(periods);
      } catch (error) {
        setError((prev) => ({
          ...prev,
          informationNotAvailable:
            "Información no disponible por el momento, intente mas tarde",
        }));
        return;
      }
    };
    getReservationData();
  }, []);

  const isDateDisabled = (date) => {
    const dateTime = new Date(date);

    // si la fecha cae o no en algun periodo reservado
    return reservedPeriods.some(
      (period) => dateTime >= period.startDate && dateTime <= period.endDate
    );
  };

  // Helper function to get all dates between start and end
  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = new Date(startDate);

    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  const handleStartDateChange = (date) => {
    setStartDate(date);
    setEndDate(null);
    setError("");
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      setEndDate(date);
      return;
    }
    // rango de fechas seleccionado por el usuario
    const selectedDateRange = getDatesBetween(startDate, date);

    // verifica si el rango de fechas que se seleccionó incluye algun rango de fechas ya reservadas en la DDBB
    const isWithinDisabledDates = selectedDateRange.some((date) =>
      isDateDisabled(date)
    );

    if (isWithinDisabledDates) {
      setEndDate(null);
      setError((prev) => ({
        ...prev,
        datePeriodNotValid: "No es posible seleccionar ese rango de fechas",
      }));
      setStartDate(null);
    } else {
      setEndDate(date);
      setError("");
    }
  };

  return (
    <div>
      {error.informationNotAvailable ? (
        <p className="text-red-500 text-sm font-bold mt-1">
          {error.informationNotAvailable}
        </p>
      ) : (
        <div className="flex flex-col space-y-4">
          {error.datePeriodNotValid && (
            <p className="text-red-500 text-sm font-bold mt-1">
              {error.datePeriodNotValid}
            </p>
          )}

          <div className="lg:w-full m-7 ">
            <h2 className="block w-full font-bold">Calendario de Reservas</h2>
          </div>

          <div className="flex  gap-6">
            <div className="flex-col">
              <h3>Buscar desde</h3>

              <DatePicker
                locale="es"
                dateFormat="dd/MM/yyyy"
                selected={startDate}
                onChange={handleStartDateChange}
                selectsStart
                startDate={startDate}
                minDate={new Date()}
                endDate={endDate}
                placeholderText="Fecha de inicio"
                className="p-2 border border-gray-300 rounded-md"
                filterDate={(date) => !isDateDisabled(date)}
                inline
                highlightDates={reservedPeriods.map((period) => ({
                  "react-datepicker__day--highlighted-custom-1": {
                    dates: getDatesBetween(period.startDate, period.endDate),
                  },
                }))}
              />
            </div>

            <div className="flex flex-col">
              <h2>Buscar Hasta</h2>

              <DatePicker
                locale="es"
                dateFormat="dd/MM/yyyy"
                selected={endDate}
                onChange={handleEndDateChange}
                selectsEnd
                startDate={startDate}
                endDate={endDate}
                minDate={startDate}
                placeholderText="Fecha de fin"
                className="p-2 border border-gray-300 rounded-md"
                filterDate={(date) => !isDateDisabled(date)}
                inline
                highlightDates={reservedPeriods.map((period) => ({
                  "react-datepicker__day--highlighted-custom-1": {
                    dates: getDatesBetween(period.startDate, period.endDate),
                  },
                }))}
              />
            </div>
          </div>
          <button
            type="button"
            className="p-3 bg-blue-600 w-64 text-white font-extrabold"
          >
            Reservar
          </button>
        </div>
      )}
    </div>
  );
};
