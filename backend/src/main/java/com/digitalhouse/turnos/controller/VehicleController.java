package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.Vehicle;
import com.digitalhouse.turnos.entity.enums.FuelType;
import com.digitalhouse.turnos.entity.enums.GearShift;
import com.digitalhouse.turnos.service.ReservationService;
import com.digitalhouse.turnos.service.VehicleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.Year;
import java.util.*;

@RestController
@RequestMapping("/api/vehicles")
@CrossOrigin(origins = "http://localhost:5173")
public class VehicleController {

    @Autowired
    private VehicleService vehicleService;

    @Autowired
    private ReservationService reservationService;

    @GetMapping
    public List<Vehicle> getAllVehiculo() {
        return vehicleService.getAllVehicles();
    }

    @PreAuthorize("hasRole('USER_ADMIN')")
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
                                     @RequestParam("fuelType") FuelType fuelType,
                                     @RequestParam(value = "characteristics", required = false) Set<Long> characteristics
    ) {
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
                    fuelType,
                    characteristics
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(vehicle);
        } catch (DataIntegrityViolationException ex) {

            //Solo permite nombres unicos
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El nombre del vehiculo debe ser único.");

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error guardando la imagen del vehiculo: " + e.getMessage());
        }
    }


    @GetMapping("/{id}")
    public Optional<?> getVehiculo(@PathVariable UUID id) {

        if (vehicleService.getVehicle(id).isEmpty()) {
            return Optional.of(ResponseEntity.status(HttpStatus.NOT_FOUND).body("Vehiculo no existe"));
        }

        return vehicleService.getVehicle(id);
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
    @PreAuthorize("hasRole('USER_ADMIN')")
    public ResponseEntity<?> deleteVehiculo(@PathVariable UUID id) {

        if (vehicleService.getVehicle(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        vehicleService.deleteVehicle(id);

        return ResponseEntity.status(HttpStatus.OK).body("Vehiculo borrado con exito");
    }

    @GetMapping("/random")
    public ResponseEntity<List<Vehicle>> getRandomVehicles() {
        List<Vehicle> randomVehicles = vehicleService.getRandomVehicles();
        return ResponseEntity.status(HttpStatus.OK).body(randomVehicles);

    }

    @PreAuthorize("hasRole('USER_ADMIN')")
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Vehicle> updateVehicle(
            @PathVariable UUID id,
            @RequestParam("registrationPlate") String registrationPlate,
            @RequestParam("manufacturingYear") Year manufacturingYear,
            @RequestParam("brand") String brand,
            @RequestParam("model") String model,
            @RequestParam("numberOfSeats") int numberOfSeats,
            @RequestParam("description") String description,
            @RequestParam("categoryId") Long categoryId,
            @RequestParam(value = "newImages", required = false) MultipartFile[] newImages,
            @RequestParam("gearShift") GearShift gearShift,
            @RequestParam("numberOfDoors") int numberOfDoors,
            @RequestParam("dailyCost") double dailyCost,
            @RequestParam("fuelType") FuelType fuelType,
            @RequestParam(value = "fileImagesToDelete", required = false) String[] fileImagesToDelete,
            @RequestParam(value = "characteristics", required = false) Set<Long> characteristics) {

        try {
            Vehicle updatedVehicle = vehicleService.updateVehicle(
                    id,
                    registrationPlate,
                    manufacturingYear,
                    brand,
                    model,
                    numberOfSeats,
                    description,
                    categoryId,
                    newImages,
                    gearShift,
                    numberOfDoors,
                    dailyCost,
                    fuelType,
                    fileImagesToDelete,
                    characteristics);
            return ResponseEntity.ok(updatedVehicle);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(null);
        }
    }

    @GetMapping("/category/{name}")
    public List<Vehicle> getByCategory(@PathVariable("name") String name) {
        return vehicleService.getVehiclesByCategoryName(name);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Vehicle>> searchAvailableVehiclesByKeyword(
            @RequestParam String keyword,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate) {

        List<Vehicle> vehicles = vehicleService.getReservedDataByKeyword(keyword, startDate, endDate);
        return ResponseEntity.ok(vehicles);
    }

    @GetMapping("/{id}/calendar")
    public ResponseEntity<?> getVehicleCalendar(@PathVariable UUID id) {
        Optional<Vehicle> vehicle = vehicleService.getVehicle(id);

        if (vehicle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Map<String, Object> calendarData = reservationService.getVehicleReservedDates(id);
        return ResponseEntity.ok(calendarData);
    }


}

