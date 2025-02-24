package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.UserResponseDTO;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.repository.RoleRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;


@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    public List<UserResponseDTO> getAllUsers() {
        List<User> users = userRepository.findAll();
        return users.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponseDTO updateUserRole(UUID id, Long roleId) {
        User user = userRepository.findById(id).orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado"));
        Role role = roleRepository.findById(roleId).orElseThrow(() -> new EntityNotFoundException("Rol no encontrado"));

        // Reemplazo el rol
        Set<Role> newRoles = new HashSet<>();
        newRoles.add(role);

        // lo guardo en el usuario
        user.setRoles(newRoles);
        userRepository.save(user);

        return convertToDto(user);
    }

    // mapeo hacia DTO
    private UserResponseDTO convertToDto(User user) {
        return new UserResponseDTO(
                user.getId(),
                user.getFirstName(),
                user.getLastname(),
                user.getEmail(),
                user.getRoles()
        );
    }
}
