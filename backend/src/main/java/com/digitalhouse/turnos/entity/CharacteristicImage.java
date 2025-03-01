package com.digitalhouse.turnos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "characteristic_images")
public class CharacteristicImage extends Image {

    @OneToOne (fetch = FetchType.LAZY)
    @JoinColumn(name = "characteristic_id")
    @OnDelete(action = OnDeleteAction.CASCADE)
    @JsonIgnore
    private Characteristic characteristic;

    public Characteristic getCharacteristic() {
        return characteristic;
    }

    public void setCharacteristic(Characteristic characteristic) {
        this.characteristic = characteristic;
    }
}
