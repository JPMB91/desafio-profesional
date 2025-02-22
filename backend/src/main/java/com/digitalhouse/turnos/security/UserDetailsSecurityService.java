package com.digitalhouse.turnos.security;

import com.digitalhouse.turnos.entity.User;
import com.digitalhouse.turnos.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserDetailsSecurityService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;


    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.getByEmail(email);

        // global exception
        if (user == null) {
            throw new UsernameNotFoundException("No se pudo encontrar al usuario");
        }

        return new UserDetailsSecurity(user);
    }

}



