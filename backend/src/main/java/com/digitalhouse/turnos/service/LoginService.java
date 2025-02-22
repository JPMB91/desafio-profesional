package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.dto.UserDTO;

import com.digitalhouse.turnos.security.UserDetailsSecurityService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class LoginService {
    @Autowired
    private UserDetailsSecurityService userDetailsSecurityService;
    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;


    public String login(UserDTO userDTO) {
        UserDetails existingUser = userDetailsSecurityService.loadUserByUsername(userDTO.getEmail());
        if (existingUser != null && bCryptPasswordEncoder.matches(userDTO.getPassword(), existingUser.getPassword())) {
            return "login succesful";
        } else {
            return "Invalid credentials";
        }
    }
}
