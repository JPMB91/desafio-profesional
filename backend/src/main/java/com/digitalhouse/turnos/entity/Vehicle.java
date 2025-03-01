package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;
import java.time.Year;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "vehicles")
public class Vehicle {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
    private String registrationPlate;
    private Year manufacturingYear;
    private String brand;
    private String model;
    private int numberOfSeats;

    @ManyToOne
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(length = 1000)
    private String description;

    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<VehicleImage> images;

    @Column(unique = true)
    private String name;

    private double dailyCost;

    private int numberOfDoors;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private GearShift gearShift;


    @ManyToMany(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST, CascadeType.MERGE})
    @JoinTable(name = "vehicles_characteristics", joinColumns = @JoinColumn(name = "vehicle_id"), inverseJoinColumns
            = @JoinColumn(name = "characteristic_id"))
    private Set<Characteristic> characteristics = new HashSet<>();


    public Vehicle() {
    }


    public Vehicle(String registrationPlate, Year manufacturingYear, String brand, String model, int numberOfSeats,
                   Category category, String description, List<VehicleImage> images, String name, double dailyCost,
                   int numberOfDoors, FuelType fuelType, GearShift gearShift,  Set<Characteristic> characteristics)

    {
        this.registrationPlate = registrationPlate;
        this.manufacturingYear = manufacturingYear;
        this.brand = brand;
        this.model = model;
        this.numberOfSeats = numberOfSeats;
        this.category = category;
        this.description = description;
        this.images = images;
        this.name = name;
        this.dailyCost = dailyCost;
        this.numberOfDoors = numberOfDoors;
        this.fuelType = fuelType;
        this.gearShift = gearShift;
        this.characteristics = characteristics;
    }

    @PrePersist
    @PreUpdate
    private void setName() {
        this.name = brand + " " + model;
    }

    public List<VehicleImage> getImages() {
        return images;
    }

    public void setImages(List<VehicleImage> images) {
        this.images = images;
    }

    public String getName() {
        return name;
    }

    public UUID getId() {
        return id;
    }

    public void setId(UUID id) {
        this.id = id;
    }

    public String getRegistrationPlate() {
        return registrationPlate;
    }

    public Year getManufacturingYear() {
        return manufacturingYear;
    }

    public String getBrand() {
        return brand;
    }

    public String getModel() {
        return model;
    }

    public int getNumberOfSeats() {
        return numberOfSeats;
    }

    public String getDescription() {
        return description;
    }

    public Category getCategory() {
        return category;
    }

    public void setRegistrationPlate(String registrationPlate) {
        this.registrationPlate = registrationPlate;
    }

    public void setManufacturingYear(Year manufacturingYear) {
        this.manufacturingYear = manufacturingYear;
    }

    public void setBrand(String brand) {
        this.brand = brand;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public void setNumberOfSeats(int numberOfSeats) {
        this.numberOfSeats = numberOfSeats;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public void setGearShift(GearShift gearShift) {
        this.gearShift = gearShift;
    }

    public void setFuelType(FuelType fuelType) {
        this.fuelType = fuelType;
    }

    public void setNumberOfDoors(int numberOfDoors) {
        this.numberOfDoors = numberOfDoors;
    }

    public void setDailyCost(double dailyCost) {
        this.dailyCost = dailyCost;
    }

    public double getDailyCost() {
        return dailyCost;
    }

    public int getNumberOfDoors() {
        return numberOfDoors;
    }

    public FuelType getFuelType() {
        return fuelType;
    }

    public GearShift getGearShift() {
        return gearShift;
    }


    public Set<Characteristic> getCharacteristics() {
        return characteristics;
    }

    public void setCharacteristics(Set<Characteristic> characteristics) {
        this.characteristics = characteristics;
    }
}
