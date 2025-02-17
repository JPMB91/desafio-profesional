package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.FuelType;
import com.digitalhouse.turnos.entity.GearShift;
import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.Year;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

//    public VehicleController(VehicleService vehicleService) {
//        this.vehicleService = vehicleService;
//    }

    @GetMapping
    public List<Vehicle> getAllVehiculo() {
        return vehicleService.getAllVehiculos();
    }

    @PostMapping
    ResponseEntity<?> createVehiculo(@RequestParam("registrationPlate") String registrationPlate,
                                     @RequestParam("manufacturingYear") Year manufacturingYear,
                                     @RequestParam("brand") String brand,
                                     @RequestParam("model") String model,
                                     @RequestParam("numberOfSeats") int numberOfSeats,
                                     @RequestParam("description") String description,
                                     @RequestParam("categoryId") Long categoryId,
                                     @RequestParam("images") MultipartFile[] images,
                                     @RequestParam("gearShift") GearShift gearShift,
                                     @RequestParam("numberOfDoors") int numberOfDoors,
                                     @RequestParam("dailyCost") double dailyCost,
                                     @RequestParam("fuelType") FuelType fuelType) {
        try {

            // Create Vehiculo
            Vehicle vehicle = vehicleService.createVehicle(registrationPlate,
                    manufacturingYear,
                    brand,
                    model,
                    numberOfSeats,
                    description,
                    categoryId,
                    images,
                    gearShift,
                    numberOfDoors,
                    dailyCost,
                    fuelType);

            return ResponseEntity.status(HttpStatus.CREATED).body(vehicle);
        } catch (DataIntegrityViolationException ex) {

            //Solo permite nombres unicos
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El nombre del vehiculo debe ser único.");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error saving images: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public Optional<?> getVehiculo(@PathVariable UUID id) {

        if (vehicleService.getVehiculo(id).isEmpty()) {
            return Optional.of(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehiculo no existe"));
        }

        return vehicleService.getVehiculo(id);
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/" + filename);
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteVehiculo(@PathVariable UUID id) {

        if (vehicleService.getVehiculo(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        vehicleService.deleteVehiculo(id);

        return ResponseEntity.status(HttpStatus.OK).body("Vehiculo borrado con exito");
    }

    @GetMapping("/random")
    public ResponseEntity<List<Vehicle>> getRandomVehicles() {
        List<Vehicle> randomVehicles = vehicleService.getRandomVehicles();
        return ResponseEntity.status(HttpStatus.OK).body(randomVehicles);
    }
}
