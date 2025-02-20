package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.*;
import com.digitalhouse.turnos.repository.CategoryRepository;
import com.digitalhouse.turnos.repository.ImageRepository;
import com.digitalhouse.turnos.repository.VehiculoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.Year;
import java.util.*;

@Service
public class VehicleService {

    @Autowired
    private VehiculoRepository vehiculoRepository;
    @Autowired
    private ImageSavingService imageSavingService;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageRepository imageRepository;

    @Transactional
    public Vehicle createVehicle(String registrationPlate,
                                 Year manufacturingYear,
                                 String brand,
                                 String model,
                                 int numberOfSeats,
                                 String description,
                                 Long categoryId,
                                 MultipartFile[] images,
                                 GearShift gearShift,
                                 int numberOfDoors,
                                 double dailyCost,
                                 FuelType fuelType) throws IOException {

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

        List<Image> imageList = new ArrayList<>();

        for (MultipartFile image : images) {
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


    public Vehicle saveVehiculo(Vehicle vehicle) {
        return vehiculoRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehiculos() {
        return vehiculoRepository.findAll();
    }

    public Optional<Vehicle> getVehiculo(UUID id) {
        return vehiculoRepository.findById(id);
    }

    @Transactional
    public void deleteVehiculo(UUID id) {
        vehiculoRepository.deleteById(id);
    }

    // Lista de vehiculos random
    public List<Vehicle> getRandomVehicles() {
        List<Vehicle> randomVehicles = vehiculoRepository.findAll();
        Collections.shuffle(randomVehicles);
//        int limitOfVehicles = (Math.min(10, vehicles.size()));
//        return vehicles.subList(0, limitOfVehicles);
        return randomVehicles;
    }


    @Transactional
    public Vehicle updateVehicle(UUID id,
                                 String registrationPlate,
                                 Year manufacturingYear,
                                 String brand,
                                 String model,
                                 int numberOfSeats,
                                 String description,
                                 Long categoryId,
                                 MultipartFile[] newImages,
                                 GearShift gearShift,
                                 int numberOfDoors,
                                 double dailyCost,
                                 FuelType fuelType,
                                 String[] fileImagesToDelete) throws IOException {

        // busco el vehiculo antes de actualizar
        Vehicle vehicle = vehiculoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehiculo no encontrado"));

        // actualizo los campos segun lo recibido desde front
        vehicle.setRegistrationPlate(registrationPlate);
        vehicle.setManufacturingYear(manufacturingYear);
        vehicle.setBrand(brand);
        vehicle.setModel(model);
        vehicle.setNumberOfSeats(numberOfSeats);
        vehicle.setDescription(description);

        //actualizo la categoria

        Category category = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new EntityNotFoundException("Categoria no existe"));

        vehicle.setCategory(category);
        vehicle.setGearShift(gearShift);
        vehicle.setNumberOfDoors(numberOfDoors);
        vehicle.setDailyCost(dailyCost);
        vehicle.setFuelType(fuelType);

        // si se enviaron archivos para borrar los elimino
        if (fileImagesToDelete != null) {
            for (String filename : fileImagesToDelete) {
                imageRepository.deleteByFilename(filename);
                imageSavingService.deleteImageFile(filename);
            }
        }

        // si vienen nuevas imagenes las guardo y agrego al vehiculo
        if (newImages != null) {
            List<Image> newImagesList = new ArrayList<>();
            for (MultipartFile image : newImages) {
                if (!image.isEmpty()) {
                    String fileName = imageSavingService.saveImage(image);
                    Image img = new Image();
                    img.setFilename(fileName);
                    img.setVehicle(vehicle);
                    newImagesList.add(img);
                }
            }
            vehicle.getImages().addAll(newImagesList);
        }

        return vehiculoRepository.save(vehicle);
    }
}
