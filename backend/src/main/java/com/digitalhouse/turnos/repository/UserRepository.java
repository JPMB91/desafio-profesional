package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;


public interface UserRepository extends JpaRepository<User, UUID> {

    User getByEmail(String email);

//    List<UserDTO> findAllUsers();

}
