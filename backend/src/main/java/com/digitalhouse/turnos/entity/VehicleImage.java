package com.digitalhouse.turnos.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;

@Entity
@Table(name = "vehicle_images")
public class VehicleImage  extends Image{

        @ManyToOne(fetch = FetchType.LAZY)
        @JoinColumn(name = "vehicle_id")
        @OnDelete(action = OnDeleteAction.CASCADE)
        @JsonIgnore
        private Vehicle vehicle;

        public Vehicle getVehicle() {
            return vehicle;
        }

        public void setVehicle(Vehicle vehicle) {
            this.vehicle = vehicle;
        }
}
