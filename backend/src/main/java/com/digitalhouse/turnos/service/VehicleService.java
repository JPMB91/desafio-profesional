package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.ReviewResponseDTO;
import com.digitalhouse.turnos.entity.*;
import com.digitalhouse.turnos.entity.enums.FuelType;
import com.digitalhouse.turnos.entity.enums.GearShift;
import com.digitalhouse.turnos.repository.*;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;

@Service
public class VehicleService {

    @Autowired
    private VehicleRepository vehicleRepository;
    @Autowired
    private ImageSavingService imageSavingService;
    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private VehicleImageRepository vehicleImageRepository;

    @Autowired
    private CharacteristicRepository characteristicRepository;

    @Autowired
    private ReviewRepository reviewRepository;

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
                                 FuelType fuelType,
                                 Set<Long> characteristics
    ) throws IOException {

        Category categoryFind = categoryRepository.findById(categoryId)
                .orElseThrow(() -> new IllegalArgumentException("Id de categoria inválida: " + categoryId));


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

        Set<Characteristic> characteristicsSet = new HashSet<>();
        if (characteristics != null) {
            for (Long characteristicId : characteristics) {
                Characteristic characteristicFind = characteristicRepository.findById(characteristicId)
                        .orElseThrow(() -> new IllegalArgumentException("Id de caracteristica inválida: " + characteristicId));
                characteristicsSet.add(characteristicFind);
            }
            vehicle.setCharacteristics(characteristicsSet);
        }


        vehicle = vehicleRepository.save(vehicle);

        List<VehicleImage> imageList = new ArrayList<>();

        for (MultipartFile image : images) {
            if (!image.isEmpty()) {
                String fileName = imageSavingService.saveImage(image);
                VehicleImage img = new VehicleImage();
                img.setFilename(fileName);
                img.setVehicle(vehicle);
                imageList.add(img);
            }
        }
        vehicle.setImages(imageList);

        return vehicleRepository.save(vehicle);
    }


    public Vehicle saveVehiculo(Vehicle vehicle) {
        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getAllVehicles() {
        return vehicleRepository.findAll();
    }

    public Optional<Vehicle> getVehicle(UUID id) {
        return vehicleRepository.findById(id);
    }


    public void deleteVehicle(UUID id) {
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("No se encontró el vehiculo con id: " + id));

        if (vehicle.getImages() != null) {
            for (VehicleImage image : vehicle.getImages()) {
                imageSavingService.deleteImageFile(image.getFilename());
            }
        }
        List<Review> reviews = reviewRepository.findByVehicleId(id);
        if (!reviews.isEmpty()) {
            reviewRepository.deleteAll(reviews);
        }

        vehicleRepository.deleteById(id);
    }

    // Lista de vehiculos random
    public List<Vehicle> getRandomVehicles() {
        List<Vehicle> randomVehicles = vehicleRepository.findAll();
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
                                 String[] fileImagesToDelete,
                                 Set<Long> characteristics) throws IOException {

        // busco el vehiculo antes de actualizar
        Vehicle vehicle = vehicleRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Vehiculo no encontrado"));

        // actualizo características
        Set<Characteristic> characteristicsSet = new HashSet<>();

        if (characteristics != null) {
            for (Long characteristicId : characteristics) {
                Characteristic characteristicFind = characteristicRepository.findById(characteristicId)
                        .orElseThrow(() -> new IllegalArgumentException("Id de caracteristica inválida: " + characteristicId));
                characteristicsSet.add(characteristicFind);
            }
            vehicle.setCharacteristics(null);
            vehicle.setCharacteristics(characteristicsSet);

        }

        if (characteristics == null) {
            vehicle.setCharacteristics(null);
        }

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
                vehicleImageRepository.deleteByFilename(filename);
                imageSavingService.deleteImageFile(filename);
            }
        }

        // si vienen nuevas imagenes las guardo y agrego al vehiculo
        if (newImages != null) {
            List<VehicleImage> newImagesList = new ArrayList<>();
            for (MultipartFile image : newImages) {
                if (!image.isEmpty()) {
                    String fileName = imageSavingService.saveImage(image);
                    VehicleImage img = new VehicleImage();
                    img.setFilename(fileName);
                    img.setVehicle(vehicle);
                    newImagesList.add(img);
                }
            }
            vehicle.getImages().addAll(newImagesList);
        }


        return vehicleRepository.save(vehicle);
    }

    public List<Vehicle> getVehiclesByCategoryName(String name) {
        return vehicleRepository.findByCategoryName(name);
    }

//    public List<Vehicle> getVehiclesByKeyword(String keyword) {
//        return vehicleRepository.findByKeyword(keyword);
//    }

    public List<Vehicle> getReservedDataByKeyword(String keyword, LocalDate startDate, LocalDate endDate) {
        List<Vehicle> availableVehicles = vehicleRepository.findByKeywordAvailableDate(keyword, startDate, endDate);
        return availableVehicles;
    }
}
