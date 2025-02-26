package com.digitalhouse.turnos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "characteristics")
public class Characteristic {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true)
    private String name;

    @OneToOne(mappedBy = "characteristic", cascade = CascadeType.ALL, orphanRemoval = true)
    private CharacteristicImage characteristicImage;

    public Characteristic() {
    }

    public Characteristic(CharacteristicImage characteristicImage, String name) {
        this.characteristicImage = characteristicImage;
        this.name = name;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public CharacteristicImage getCharacteristicImage() {
        return characteristicImage;
    }

    public void setCharacteristicImage(CharacteristicImage characteristicImage) {
        this.characteristicImage = characteristicImage;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
