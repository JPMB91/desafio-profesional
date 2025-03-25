export const CharacteristicsDisplay = ({ characteristics }) => {
  return (
    <div className="max-w-full mt-4 p-5 border border-amber-900 rounded h-fit">
      <h2 className="text-2xl font-bold mb-6 bg-[#2D3849] text-white text-center sm:text-left p-3">
        Características
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
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
            <p>Este vehiculo no cuenta con características adicionales por ahora</p>
          </div>
        )}
      </div>
    </div>
  );
};
