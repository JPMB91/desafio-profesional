import React from 'react';

const VehicleReservationPolicy = () => {
  return (
    <div className="mx-auto p-6">
      <h1 className="underline text-center text-2xl md:text-3xl lg:text-4xl font-bold">POLÍTICAS DE USO</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">Recogida</h2>
          <p>
            Encuentre nuestro mesón de atención de nuestro Rent-A-Car ubicado en
            el hall público del Aeropuerto Internacional Arturo Merino Benítez ubicado en Armando Cortinez Ote. 1704, Pudahuel, Región Metropolitana, Chile.
          </p>
        </div>
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">Devolución</h2>
          <p>
            La devolución de su vehículo debe hacerse directamente en el
            estacionamiento Rent-A-Car Aurora Motors.
          </p>
        </div>
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">CANCELACION SIN PREVIO AVISO</h2>
          <p>
            A los clientes que no se hayan presentado en la fecha y hora acordada
            en su reserva, se les cobrará un día de arriendo a la tarifa diaria de
            la categoría del vehículo reservado. Como cortesía, se guardará el
            vehículo por 1 hora pasada la hora de recogida de la reserva, siempre
            y cuando no exista una lista de espera por el vehículo reservado.
          </p>
        </div>
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">EXTENSIONES DE ARRIENDO</h2>
          <p>
            Cualquier cambio de fecha u hora de devolución debe ser comunicado con
            al menos 24 horas de anticipación. Extensiones de arriendo deben ser
            autorizadas con un mínimo de 72 horas de anticipación. Durante épocas
            de demanda alta, las solicitudes de extensión de arriendo podrían ser
            denegadas.
          </p>
        </div>
        <div className="border rounded shadow p-4">
          <h2 className="text-xl font-bold mb-4">DEVOLUCION TARDIA</h2>
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