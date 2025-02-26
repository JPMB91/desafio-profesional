package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.Characteristic;
import com.digitalhouse.turnos.service.CharacteristicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

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


}
