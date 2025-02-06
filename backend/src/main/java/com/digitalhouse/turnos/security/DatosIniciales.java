package com.digitalhouse.turnos.security;

import com.digitalhouse.turnos.entity.CategoriaVehiculo;
import com.digitalhouse.turnos.entity.Vehiculo;
import com.digitalhouse.turnos.repository.VehiculoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements ApplicationRunner {
    private final VehiculoRepository vehiculoRepository;

    @Autowired
    public DatosIniciales(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {
        Vehiculo vehiculo1 = new Vehiculo("ABC123", 2023, "Toyota", "Hilux", 5, "Pickup confiable para todo terreno", CategoriaVehiculo.VEHICULO_CAMIONETA_PICKUP);
        Vehiculo vehiculo2 = new Vehiculo("XYZ789", 2022, "Ford", "Ranger", 5, "Camioneta pickup resistente", CategoriaVehiculo.VEHICULO_CAMIONETA_PICKUP);
        Vehiculo vehiculo3 = new Vehiculo("DEF456", 2021, "Mercedes-Benz", "Sprinter", 3, "Furgón de carga amplio", CategoriaVehiculo.VEHICULO_FURGON);
        Vehiculo vehiculo4 = new Vehiculo("GHI789", 2020, "Renault", "Kangoo", 2, "Furgón compacto ideal para reparto", CategoriaVehiculo.VEHICULO_FURGON);
        Vehiculo vehiculo5 = new Vehiculo("JKL321", 2019, "Jeep", "Grand Cherokee", 5, "SUV de lujo con tracción en las cuatro ruedas", CategoriaVehiculo.VEHICULO_SUV);
        Vehiculo vehiculo6 = new Vehiculo("MNO654", 2018, "Toyota", "RAV4", 5, "SUV versátil y espaciosa", CategoriaVehiculo.VEHICULO_SUV);
        Vehiculo vehiculo7 = new Vehiculo("PQR987", 2017, "Honda", "CR-V", 5, "SUV confiable para la familia", CategoriaVehiculo.VEHICULO_SUV);
        Vehiculo vehiculo8 = new Vehiculo("STU246", 2016, "Nissan", "Sentra", 5, "Sedán eficiente y cómodo", CategoriaVehiculo.VEHICULO_SEDAN);
        Vehiculo vehiculo9 = new Vehiculo("VWX135", 2015, "Hyundai", "Elantra", 5, "Sedán con diseño aerodinámico", CategoriaVehiculo.VEHICULO_SEDAN);
        Vehiculo vehiculo10 = new Vehiculo("YZA579", 2014, "Volkswagen", "Jetta", 5, "Sedán clásico con excelente rendimiento", CategoriaVehiculo.VEHICULO_SEDAN);

        vehiculoRepository.save(vehiculo1);
        vehiculoRepository.save(vehiculo2);
        vehiculoRepository.save(vehiculo3);
        vehiculoRepository.save(vehiculo4);
        vehiculoRepository.save(vehiculo5);
        vehiculoRepository.save(vehiculo6);
        vehiculoRepository.save(vehiculo7);
        vehiculoRepository.save(vehiculo8);
        vehiculoRepository.save(vehiculo9);
        vehiculoRepository.save(vehiculo10);


    }
}
