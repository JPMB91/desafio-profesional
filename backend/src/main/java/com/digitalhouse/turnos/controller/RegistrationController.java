package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.UserDTO;
import com.digitalhouse.turnos.service.RegistrationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/register")
@CrossOrigin(origins = "http://localhost:5173")

public class RegistrationController {

    @Autowired
    RegistrationService registrationService;

    @PostMapping
    public ResponseEntity<String> registerUser(@RequestBody UserDTO userDTO){
        registrationService.registerUser(userDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuario creado con exito");
    }
}
