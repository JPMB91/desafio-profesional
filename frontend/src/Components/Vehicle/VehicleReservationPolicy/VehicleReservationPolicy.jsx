const VehicleReservationPolicy = () => {
  return (
    <div className="mx-auto p-6">
      <h1 className="underline text-center lg:text-4xl text-bold">POLÍTICAS DE USO</h1>
       <div className="flex flex-col md:flex-row justify-around p-4">
      
      <div className="flex-1 m-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-10">Recogida</h2>
        <p>
          Encuentre nuestro mesón de atención de nuestro Rent-A-Car ubicado en
          el hall público del terminal aéreo.
        </p>
      </div>
      <div className="flex-1 m-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-10">Devolución</h2>
        <p>
          La devolución de su vehículo debe hacerse directamente en el
          estacionamiento Rent-A-Car Aurora Motors.
        </p>
      </div>
      <div className="flex-1 m-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">
          CANCELACION SIN PREVIO AVISO
        </h2>
        <p>
          A los clientes que no se hayan presentado en la fecha y hora acordada
          en su reserva, se les cobrará un día de arriendo a la tarifa diaria de
          la categoría del vehículo reservado. Como cortesía, se guardará el
          vehículo por 1 hora pasada la hora de recogida de la reserva, siempre
          y cuando no exista una lista de espera por el vehículo reservado.
        </p>
      </div>
      <div className="flex-1 m-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-2">EXTENSIONES DE ARRIENDO</h2>
        <p>
          Cualquier cambio de fecha u hora de devolución debe ser comunicado con
          al menos 24 horas de anticipación. Extensiones de arriendo deben ser
          autorizadas con un mínimo de 72 horas de anticipación. Durante épocas
          de demanda alta, las solicitudes de extensión de arriendo podrían ser
          denegadas.
        </p>
      </div>
      <div className="flex-1 m-2 p-4 border rounded shadow">
        <h2 className="text-xl font-bold mb-9">DEVOLUCION TARDIA</h2>
        <p>
          Se cobrarán multas por el retraso en la devolución acordada en el
          contrato de arriendo. Cada hora de retraso será cobrada a un valor de
          0.25 veces la tarifa diaria convenida. Cada día de retraso sobre la
          fecha de devolución pactada en el contrato tendrá un recargo del 20%
          sobre la tarifa diaria convenida.
        </p>
      </div>
    </div>
    </div>
   
  );
};

export default VehicleReservationPolicy;
