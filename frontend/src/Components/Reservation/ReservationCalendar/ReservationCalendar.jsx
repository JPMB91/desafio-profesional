import axios from "axios";
import { CircleAlert, CircleX, MessageCircleWarning } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { es } from "date-fns/locale/es";
import { useAuth } from "../../../context/Auth.Context";
import { useLocation, useNavigate } from "react-router-dom";
import { addDays, parseISO, startOfDay } from "date-fns";

registerLocale("es", es);

export const ReservationCalendar = ({ id, vehicleData }) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [reservedPeriods, setReservedPeriods] = useState([]);

  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const reservationRef = useRef(null);

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

        // actualizo el estado sobre los periodos reservados por reservas ya hechas anteriormente
        const periods = response.data.reservedPeriods.map((period) => {
          const startDate = startOfDay(parseISO(period.startDate));
          const endDate = startOfDay(parseISO(period.endDate));
          return { startDate, endDate };
        });
        
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
    const dateTime = startOfDay(new Date(date));

    return reservedPeriods.some(
      (period) => dateTime >= period.startDate && dateTime <= period.endDate
    );
  };
 
  function getDatesBetween(startDate, endDate) {
    const dates = [];
    let currentDate = startOfDay(new Date(startDate));
    const lastDate = startOfDay(new Date(endDate));

    while (currentDate <= lastDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    return dates;
  }

  const handleStartDateChange = (date) => {
    
    setStartDate(startOfDay(date));
    setEndDate(null);
    setError((prev) => ({ ...prev, datePeriodNotValid: "" }));
  };

  const handleEndDateChange = (date) => {
    if (!startDate) {
      setEndDate(startOfDay(date));
      return;
    }

    const selectedDateRange = getDatesBetween(startDate, date);

    // verifica si la fecha cae entre un periodo reservado
    const isWithinDisabledDates = selectedDateRange.some((d) =>
      isDateDisabled(d)
    );

    if (isWithinDisabledDates) {
      setEndDate(null);
      setError((prev) => ({
        ...prev,
        datePeriodNotValid:
          "No es posible seleccionar ese rango de fechas ya que se encuentra entre un periodo reservado",
      }));
      setStartDate(null);
    } else {
      setEndDate(date);

      setError((prev) => ({ ...prev, datePeriodNotValid: "" }));
    }
  };
  //redirecciona a login con informacion del componente fuente
  const handleLoginRedirect = () => {
    navigate("/login", {
      state: {
        from: `/vehicle/${id}`,
        source: "reservation",
        dates: {
          startDate: startDate ? startDate.toISOString() : null,
          endDate: endDate ? endDate.toISOString() : null,
        },
      },
    });
  };
  
  // si hay fechas seleccionadas previas al login las vuelve a cargar en el date picker
  useEffect(() => {
    if (location.state?.dates && location.state?.source === "reservation") {
      const { startDate: selectedStartDate, endDate: selectedEndDate } =
        location.state.dates;

      if (selectedStartDate) {
        setStartDate(new Date(selectedStartDate));
      }

      if (selectedEndDate) {
        setEndDate(new Date(selectedEndDate));
      }

      // redirecciona al componente fuente
      setTimeout(() => {
        if (reservationRef.current) {
          reservationRef.current.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      }, 100);
    }
  }, [location.state]);

  const handleReservationNavigate = () => {
    const formattedStartDate = startOfDay(startDate);
    const formattedEndDate = startOfDay(endDate);
    navigate("/crear-reserva", {
      state: {
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        user: user,
        vehicleId: id,
        vehicleDailyCost: vehicleData?.dailyCost,
        vehicleImage: vehicleData?.images?.[0]?.filename,
        vehicleBrand: vehicleData?.brand,
        vehicleModel: vehicleData?.model,
      },
    });
  };

  return (
    <div className="w-full mx-auto sm:px-6 lg:px-8 py-4" ref={reservationRef}>
      <div className="flex flex-col space-y-6">
        <div className="border-b pb-4">
          <h2 className="text-2xl font-bold text-gray-800">
            Calendario de Reservas
          </h2>
          <p className="text-gray-600 mt-2">
            Seleccione el período que desea reservar
          </p>
        </div>
        {error.informationNotAvailable ? (
          <div className="bg-red-100 border-2 border-red-400 text-red-700 p-6 rounded-lg shadow-md">
            <div className="flex items-center">
              <CircleAlert className="h-6 w-6 mr-3 text-red-500" />
              <p className="text-lg font-medium">
                {error.informationNotAvailable}
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="flex flex-col lg:flex-row items-center justify-center gap-8 md:gap-4 mb-5">
              <div className="w-full flex flex-col items-center lg:items-start">
                <h3 className="text-lg font-bold text-gray-700 mb-1 self-center lg:self-start">
                  Fecha de inicio
                </h3>
                <div className=" bg-white shadow-md overflow-hidden w-full py-2 flex justify-center">
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
                    filterDate={(date) => !isDateDisabled(date)}
                    inline
                    calendarClassName="custom-datepicker"
                    highlightDates={reservedPeriods.map((period) => ({
                      "react-datepicker__day--highlighted-custom-1": {
                        dates: getDatesBetween(
                          period.startDate,
                          period.endDate
                        ),
                      },
                    }))}
                  />
                </div>
              </div>

              <div className="w-full flex flex-col items-center lg:items-start mt-6 lg:mt-0 ">
                <h3 className="text-lg font-bold text-gray-700 mb-1 self-center lg:self-start">
                  Fecha de fin
                </h3>
                <div className="bg-white shadow-md overflow-hidden py-2 w-full flex justify-center ">
                  <DatePicker
                    locale="es"
                    dateFormat="dd/MM/yyyy"
                    selected={endDate}
                    onChange={handleEndDateChange}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={new Date()}
                    placeholderText="Fecha de fin"
                    filterDate={(date) => !isDateDisabled(date)}
                    inline
                    calendarClassName="custom-datepicker"
                    highlightDates={reservedPeriods.map((period) => ({
                      "react-datepicker__day--highlighted-custom-1": {
                        dates: getDatesBetween(
                          period.startDate,
                          period.endDate
                        ),
                      },
                    }))}
                  />
                </div>
              </div>
            </div>

            {error.datePeriodNotValid && (
              <div className="bg-red-100 border-l-4 border-red-500 p-4 rounded-md shadow-sm mt-0.5 items-center">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <CircleX className="h-5 w-5 text-red-500" />
                  </div>
                  <div className="ml-3">
                    <p className="text-red-700 font-medium">
                      {error.datePeriodNotValid}
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-0.5 bg-blue-50 p-3 font-semibold rounded-md border border-blue-100">
              <div className="flex items-center">
                <MessageCircleWarning className="h-5 w-5 text-blue-500 mr-2" />
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Nota:</span> Las fechas en gris
                  ya están reservadas y no pueden ser seleccionadas.
                </p>
              </div>
            </div>

            <div className="flex justify-center sm:justify-start md:justify-center">
              {!isAuthenticated ? (
                <div className="bg-white shadow rounded-lg p-6 border border-gray-200">
                  <div className="text-center">
                    <p className="mb-4 text-gray-600 font-bold">
                      Inicie sesión para hacer una reserva
                    </p>
                    <button
                      className="w-full p-2 bg-[var(--color-accent-primary)] font-bold text-white rounded transition-colors hover:cursor-pointer hover:bg-[var(--color-accent-primary-hover)]"
                      onClick={handleLoginRedirect}
                    >
                      Iniciar Sesión
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  type="button"
                  disabled={!startDate || !endDate || endDate < startDate}
                  className={`px-6 py-3 rounded-lg font-bold text-white transition-colors  ${
                    startDate && endDate
                      ? " bg-[var(--color-accent-primary)] font-bold hover:cursor-pointer hover:bg-[var(--color-accent-primary-hover)]focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 "
                      : "bg-gray-400 cursor-not-allowed"
                  } w-full sm:w-auto`}
                  onClick={handleReservationNavigate}
                >
                  {startDate && endDate
                    ? "Reservar ahora"
                    : "Seleccione fechas"}
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
