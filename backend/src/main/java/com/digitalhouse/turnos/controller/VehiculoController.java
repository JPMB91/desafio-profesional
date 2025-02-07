package com.digitalhouse.turnos.controller;

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
    public List<Vehiculo> getAllVehiculo(){
        return vehiculoService.getAllVehiculos();
    }

    @PostMapping ResponseEntity<Vehiculo> createVehiculo(@RequestBody Vehiculo vehiculo){
        Vehiculo vehiculoGuardado = vehiculoService.saveVehiculo(vehiculo);
        return ResponseEntity.status(HttpStatus.CREATED).body(vehiculoGuardado);
    }

    // guardado de imagen
    // Modificar esto para que no maneje lógica
    @GetMapping("/upload")
    public ResponseEntity<String> uploadImage(@RequestParam("imagen")MultipartFile file){
        try{
            if(file.isEmpty()){
                return ResponseEntity.badRequest().body("Seleccione una imagen para guardar");
            }

            // Se le asigna un nombre y se guarda en el directorio uploads
            String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();

            String UPLOAD_DIR = "uploads/";
            Path filePath = Paths.get(UPLOAD_DIR + fileName);

            Files.createDirectories(filePath.getParent());

            Files.write(filePath, file.getBytes());

            // cambiar a que entregue un mensaje exito en string
            return ResponseEntity.ok(fileName);

        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("La carga de imagen ha fallado");
        }
    }

    @GetMapping("/uploads/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename){
        try{
            Path filePath = Paths.get("uploads/"+filename);
            byte[] imageBytes = Files.readAllBytes(filePath);
            return ResponseEntity.ok().contentType(MediaType.IMAGE_JPEG).body(imageBytes);
        }catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }
}
