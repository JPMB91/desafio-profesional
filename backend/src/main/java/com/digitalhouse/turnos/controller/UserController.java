package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.dto.UserResponseDTO;
import com.digitalhouse.turnos.repository.RoleRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import com.digitalhouse.turnos.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;


@RestController
@RequestMapping("/admin/users")
@CrossOrigin(origins = "http://localhost:5173")
public class UserController {

    @Autowired
    private UserService userService;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<UserResponseDTO> getUsers() {
        return userService.getAllUsers();
    }

    @PutMapping("/updateRole")
    @Transactional
    public ResponseEntity<?> updateRole(@RequestParam("id") UUID id, @RequestBody Long roleId) {
        UserResponseDTO updatedUser = userService.updateUserRole(id, roleId);
        return ResponseEntity.ok(updatedUser);
    }

}
