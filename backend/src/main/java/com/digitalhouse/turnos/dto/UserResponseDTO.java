package com.digitalhouse.turnos.dto;


import com.digitalhouse.turnos.entity.Role;

import java.util.Set;
import java.util.UUID;


public class UserResponseDTO {

    private UUID id;
    private String firstName;
    private String lastName;
    private String email;
    private Set<Role> roles;

    public UserResponseDTO(UUID id, String firstName, String lastName, String email, Set<Role> roles) {

        this.id = id;
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.roles = roles;
    }

    public UUID getId() {
        return id;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }


    public String getEmail() {
        return email;
    }

    public Set<Role> getRoles() {
        return roles;
    }

}