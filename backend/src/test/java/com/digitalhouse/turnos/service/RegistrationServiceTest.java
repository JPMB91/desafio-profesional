package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.UserDTO;
import com.digitalhouse.turnos.dto.UserResponseDTO;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.repository.RoleRepository;
import com.digitalhouse.turnos.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.HashSet;
import java.util.Set;


import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RegistrationServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Mock
    private RoleRepository roleRepository;

    @InjectMocks
    private RegistrationService registrationService;

    private UserDTO userDTO;
    private User user;
    private Role roleUser;
    private Role roleAdmin;

    //creo usuarios y roles
    @BeforeEach
    void setUp() {
        userDTO = new UserDTO();
        userDTO.setEmail("test@test.com");
        userDTO.setFirstName("Test");
        userDTO.setLastName("User");
        userDTO.setPassword("password");

        user = new User();
        user.setEmail("test@test.com");
        user.setFirstName("Test");
        user.setLastname("User");
        user.setPassword("encodedPassword");
        user.setEnabled(true);

        roleUser = new Role();
        roleUser.setId(1);
        roleUser.setName("ROLE_USER");

        roleAdmin = new Role();
        roleAdmin.setId(2);
        roleAdmin.setName("ROLE_ADMIN");

    }

    @Test
    void registerUserDefaultRole() {
        when(userRepository.getByEmail(userDTO.getEmail())).thenReturn(null);
        when(roleRepository.findByName("ROLE_USER")).thenReturn(roleUser);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn("bcryptPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setRoles(Set.of(roleUser));
            return savedUser;
        });

        UserResponseDTO registeredUserDTO = registrationService.registerUser(userDTO);

        verify(userRepository, times(1)).save(any(User.class));

        assertNotNull(registeredUserDTO);
        assertNotNull(registeredUserDTO.getRoles());
        assertEquals(1, registeredUserDTO.getRoles().size());
        assertTrue(registeredUserDTO.getRoles().contains(roleUser));
    }

    @Test
    void registerUserAsAdmin() {
        Set<String> roles = new HashSet<>();
        roles.add("ROLE_ADMIN");
        userDTO.setRoles(roles);

        when(userRepository.getByEmail(userDTO.getEmail())).thenReturn(null);
        when(roleRepository.findByName("ROLE_ADMIN")).thenReturn(roleAdmin);
        when(bCryptPasswordEncoder.encode(anyString())).thenReturn("bcryptPassword");
        when(userRepository.save(any(User.class))).thenAnswer(invocation -> {
            User savedUser = invocation.getArgument(0);
            savedUser.setRoles(Set.of(roleAdmin));
            return savedUser;
        });

        UserResponseDTO registeredUserDTO = registrationService.registerUser(userDTO);

        verify(userRepository, times(1)).save(any(User.class));

        assertNotNull(registeredUserDTO);
        assertNotNull(registeredUserDTO.getRoles());
        assertEquals(1, registeredUserDTO.getRoles().size());
        assertTrue(registeredUserDTO.getRoles().contains(roleAdmin));
    }

    @Test
    void UserAlreadyExists_throwsDataIntegrityViolationException() {
        when(userRepository.getByEmail(userDTO.getEmail())).thenReturn(user);
        assertThrows(DataIntegrityViolationException.class, () -> registrationService.registerUser(userDTO));
        verify(userRepository, never()).save(any(User.class));
    }
}
