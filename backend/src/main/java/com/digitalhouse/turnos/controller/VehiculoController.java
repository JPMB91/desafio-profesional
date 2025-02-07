package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.CategoriaVehiculo;
import com.digitalhouse.turnos.entity.Vehiculo;
import com.digitalhouse.turnos.service.VehiculoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/vehiculos")
@CrossOrigin(origins = "http://localhost:5173")
public class VehiculoController {

    @Autowired
    private final VehiculoService vehiculoService;

    public VehiculoController(VehiculoService vehiculoService) {
        this.vehiculoService = vehiculoService;
    }

    @GetMapping
    public List<Vehiculo> getAllVehiculo() {
        return vehiculoService.getAllVehiculos();
    }

    @PostMapping
    ResponseEntity<?> createVehiculo(@RequestParam("matricula") String matricula,
                                     @RequestParam("anio") Integer anio,
                                     @RequestParam("marca") String marca,
                                     @RequestParam("modelo") String modelo,
                                     @RequestParam("numeroAsientos") int numeroAsientos,
                                     @RequestParam("descripcion") String descripcion,
                                     @RequestParam("categoriaVehiculo") CategoriaVehiculo categoriaVehiculo,
                                     @RequestParam("imagen") MultipartFile imagen) {

        try {

            // guardar imagen
            String fileName = UUID.randomUUID() + "_" + imagen.getOriginalFilename();

            String UPLOAD_DIR = "uploads/";
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            Files.createDirectories(filePath.getParent());
            Files.write(filePath, imagen.getBytes());

            //guardar vehiculo
            Vehiculo vehiculo = new Vehiculo(matricula, anio, marca, modelo, numeroAsientos, descripcion,
                    categoriaVehiculo, fileName);
            vehiculoService.saveVehiculo(vehiculo);

            return ResponseEntity.status(HttpStatus.CREATED).body(vehiculo);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error al guardar imagen " + e.getMessage());
        }

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
}
