package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.repository.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class VehiculoService {

    private final VehiculoRepository vehiculoRepository;
    private final ImageService imageService;

    public VehiculoService(VehiculoRepository vehiculoRepository, ImageService imageService) {
        this.vehiculoRepository = vehiculoRepository;
        this.imageService = imageService;
    }


    public Vehicle saveVehiculo(Vehicle vehicle){
        return vehiculoRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehiculos(){
        return vehiculoRepository.findAll();
    }

    public Optional<Vehicle> getVehiculo(UUID id){
        return vehiculoRepository.findById(id);
    }

    @Transactional
    public void deleteVehiculo(UUID id){
        vehiculoRepository.deleteById(id);
    }
}
