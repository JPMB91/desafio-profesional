export const CharacteristicsDisplay = ({
  characteristics,
  doors,
  seats,
  fueltype,
  transmision,
}) => {
  return (
    <div className="max-w-full mt-4 p-5 border border-amber-900 rounded h-fit">
      <h2 className="text-2xl font-bold mb-6 bg-[#2D3849] text-white text-center sm:text-left p-3">
        Características
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
        {doors && (
          <div className="flex flex-col items-center justify-start text-center p-2 h-full">
            
              <img
                src="/src/assets/images/doors.png"
                alt="Puertas"
                className="h-10 w-10 object-contain"
              />
              <h3 className="text-lg font-medium">
                Número de puertas: {doors}
              </h3>
            </div>

        )}
        {seats && (
          <div className="flex flex-col items-center justify-start text-center p-2 h-full">
            <img
              src="/src/assets/images/seats.png"
              alt="Asientos"
              className="h-10 w-10 object-contain"
            />
            <h3 className="text-lg font-medium">Número de asientos: {seats}</h3>
          </div>
        )}
        {fueltype && (
          <div className="flex flex-col items-center justify-start text-center p-2 h-full">
            <img
              src="/src/assets/images/fueltype.png"
              alt="Combustible"
              className="h-10 w-10 object-contain"
            />
            <h3 className="text-lg font-medium">Combustible</h3>
            <p>{fueltype}</p>
          </div>
        )}

        {transmision && (
          <div className="flex flex-col items-center justify-start text-center p-2 h-full">
            <img
              src="/src/assets/images/transmision.png"
              alt="Transmisión"
              className="h-10 w-10 object-contain"
            />
            <h3 className="text-lg font-medium">Transmisión</h3>
            <p>{transmision}</p>
          </div>
        )}

        {characteristics && characteristics.length > 0 ? (
          characteristics.map((char) => (
            <div
              key={char.id}
              className="flex flex-col items-center justify-center text-center p-2"
            >
              <img
                src={`http://localhost:8080/api/characteristics/image/${char.characteristicImage.filename}`}
                alt={char.name}
                className="h-10 mb-2"
              />
              <h3 className="text-lg font-medium">{char.name}</h3>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-4">
            <p>
              Este vehiculo no cuenta con características adicionales por ahora
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
