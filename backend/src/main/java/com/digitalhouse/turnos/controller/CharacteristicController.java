package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.Characteristic;
import com.digitalhouse.turnos.service.CharacteristicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
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
import java.util.List;
import java.util.Optional;


@RestController
@RequestMapping("/api/characteristics")
@CrossOrigin(origins = "http://localhost:5173")
public class CharacteristicController {

    @Autowired
    CharacteristicService characteristicService;

    @PostMapping
    public ResponseEntity<?> createCharacteristic(@RequestParam("name") String name,
                                                  @RequestParam("characteristicImage") MultipartFile characteristicImage) {
        try {
            Characteristic characteristic = characteristicService.createCharacteristic(name, characteristicImage);
            return ResponseEntity.status(HttpStatus.CREATED).body(characteristic);
        } catch (DataIntegrityViolationException ex) {
            //Solo permite nombres unicos
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El nombre de la característica debe ser único.");
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error guardando la caracteristica: " + e.getMessage());
        }
    }


    @GetMapping
    public ResponseEntity<List<Characteristic>> getAllCharacteristics() {
        return ResponseEntity.ok(characteristicService.getallCharacteristics());
    }


    @GetMapping("/image/{filename}")
    public ResponseEntity<byte[]> getImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/" + filename);
            byte[] imageBytes = Files.readAllBytes(filePath);

            String fileExtension = filename.substring(filename.lastIndexOf(".") + 1).toLowerCase();
            MediaType mediaType;

            switch (fileExtension) {
                case "jpg":
                case "jpeg":
                    mediaType = MediaType.IMAGE_JPEG;
                    break;
                case "png":
                    mediaType = MediaType.IMAGE_PNG;
                    break;
                case "gif":
                    mediaType = MediaType.IMAGE_GIF;
                    break;
                case "svg":
                    mediaType = MediaType.valueOf("image/svg+xml");
                    break;
                default:
                    mediaType = MediaType.APPLICATION_OCTET_STREAM;
            }

            return ResponseEntity.ok().contentType(mediaType).body(imageBytes);
        } catch (IOException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('USER_ADMIN')")
    public ResponseEntity<?> deleteCharacteristic(@PathVariable Long id) {

        if (characteristicService.getCharacteristic(id).isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }

        characteristicService.deleteCharacteristic(id);

        return ResponseEntity.status(HttpStatus.OK).body("Característica borrada con exito");
    }

    @PreAuthorize("hasRole('USER_ADMIN')")
    @PutMapping(value = "/update/{id}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateCharacteristic(@PathVariable Long id,
                                                  @RequestParam String name,
                                                  @RequestParam(value = "characteristicImage", required
                                                          = false) MultipartFile characteristicImage) {


        try {
            Characteristic updatedCharacteristic = characteristicService.updateCharacteristic(id, characteristicImage, name);
            return ResponseEntity.ok(updatedCharacteristic);
        } catch (IOException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error updating characteristic: " + e.getMessage());
        } catch (DataIntegrityViolationException ex) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body("Error: El nombre de la característica debe ser único.");
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<Optional<Characteristic>> getCharacteristic(@PathVariable Long id){
        return ResponseEntity.ok(characteristicService.getCharacteristic(id));
    }

}
