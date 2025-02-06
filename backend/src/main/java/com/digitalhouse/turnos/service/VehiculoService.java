package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Vehiculo;
import com.digitalhouse.turnos.repository.VehiculoRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;

    public VehiculoService(VehiculoRepository vehiculoRepository) {
        this.vehiculoRepository = vehiculoRepository;
    }

    public List<Vehiculo> getAllVehiculos(){
        return vehiculoRepository.findAll();
    }

    public Vehiculo saveVehiculo(Vehiculo vehiculo){
        return vehiculoRepository.save(vehiculo);
    }
}
