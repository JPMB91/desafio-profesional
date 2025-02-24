package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.dto.UserDTO;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;


public interface UserRepository extends JpaRepository<User, UUID> {

    User getByEmail(String email);

}
