package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.entity.Image;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.repository.CategoryRepository;
import com.digitalhouse.turnos.repository.VehiculoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Year;
import java.util.*;

@Service
public class VehicleService {

    private final VehiculoRepository vehiculoRepository;
   private final ImageSavingService imageSavingService;
   private final CategoryRepository categoryRepository;

    public VehicleService(VehiculoRepository vehiculoRepository, ImageSavingService imageSavingService, CategoryRepository categoryRepository) {
        this.vehiculoRepository = vehiculoRepository;
        this.imageSavingService = imageSavingService;
        this.categoryRepository = categoryRepository;
    }

    @Transactional
    public Vehicle createVehicle(String registrationPlate,
                                 Year manufacturingYear,
                                 String brand,
                                 String model,
                                 int numberOfSeats,
                                 String description,
                                 Long categoryId,
                                 MultipartFile[] images,
                                 com.digitalhouse.turnos.entity.GearShift gearShift,
                                 int numberOfDoors,
                                 double dailyCost,
                                 com.digitalhouse.turnos.entity.FuelType fuelType) throws IOException {

        Category categoryFind = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid category id: " + categoryId));

        Vehicle vehicle = new Vehicle();
        vehicle.setRegistrationPlate(registrationPlate);
        vehicle.setManufacturingYear(manufacturingYear);
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setNumberOfSeats(numberOfSeats);
        vehicle.setDescription(description);
        vehicle.setCategory(categoryFind);
        vehicle.setGearShift(gearShift);
        vehicle.setNumberOfDoors(numberOfDoors);
        vehicle.setDailyCost(dailyCost);
        vehicle.setFuelType(fuelType);


        vehicle = vehiculoRepository.save(vehicle);

        // Process and save images using the ImageService; imageService returns a list of Imagen entities
        List<Image> imageList = new ArrayList<>();

        for(MultipartFile image : images){
            if (!image.isEmpty()) {
                String fileName = imageSavingService.saveImage(image);
                Image img = new Image();
                img.setFilename(fileName);
                img.setVehicle(vehicle);
                imageList.add(img);
            }
        }
        vehicle.setImages(imageList);

        return vehiculoRepository.save(vehicle);
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

    // Lista de vehiculos random
    public List<Vehicle> getRandomVehicles(){
        List<Vehicle> vehicles = vehiculoRepository.findAll();
        Collections.shuffle(vehicles);
        int limitOfVehicles = (Math.min(10, vehicles.size()));
        return vehicles.subList(0, limitOfVehicles);
    }
}
