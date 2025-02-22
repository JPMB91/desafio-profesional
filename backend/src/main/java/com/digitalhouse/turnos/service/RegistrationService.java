package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.UserDTO;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.repository.RoleRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.Set;

@Service
public class RegistrationService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private RoleRepository roleRepository;


    public void registerUser(UserDTO userDTO) {

        // revisar si ya existe
        if (userRepository.getByEmail(userDTO.getEmail()) != null) {
            throw new DataIntegrityViolationException("Error: Usuario ya existe");
        }

        // crear al usuario
        User user = new User();
        user.setFirstName(userDTO.getFirstName());
        user.setLastname(userDTO.getLastName());
        user.setEmail(userDTO.getEmail());
        user.setPassword(bCryptPasswordEncoder.encode(userDTO.getPassword()));
        user.setEnabled(true);

        // agregar roles

        Set<Role> roles = new HashSet<>();

        if (userDTO.getRoles() != null && !userDTO.getRoles().isEmpty()) {
            for (String roleName : userDTO.getRoles()) {
                Role role = roleRepository.findByName(roleName);

                if (role != null) {
                    roles.add(role);
                } else {

                    // Agregar a global exception
                    throw new RuntimeException("Rol no existe");
                }
            }
        } else {
            // si no se especifica es user comun
            Role defaultRole = roleRepository.findByName("ROLE_USER");
            roles.add(defaultRole);
        }

        user.setRoles(roles);

        userRepository.save(user);
    }

}
