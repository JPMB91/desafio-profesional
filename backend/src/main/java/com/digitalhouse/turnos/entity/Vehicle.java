package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;

import java.time.Year;
import java.util.List;
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
    private List<Image> images;

    @Column(unique = true)
    private String name;

    private double dailyCost;

    private int numberOfDoors;

    @Enumerated(EnumType.STRING)
    private FuelType fuelType;

    @Enumerated(EnumType.STRING)
    private GearShift gearShift;

    public Vehicle() {
    }

    public Vehicle(String brand , String model, Year manufacturingYear, String description, Category category, int numberOfSeats, GearShift gearShift, FuelType fuelType,
                   int numberOfDoors, double dailyCost, String registrationPlate) {

        this.gearShift = gearShift;
        this.fuelType = fuelType;
        this.numberOfDoors = numberOfDoors;
        this.dailyCost = dailyCost;
        this.description = description;
        this.category = category;
        this.numberOfSeats = numberOfSeats;
        this.model = model;
        this.brand = brand;
        this.manufacturingYear = manufacturingYear;
        this.registrationPlate = registrationPlate;
    }

    @PrePersist
    @PreUpdate
    private void setName() {
        this.name = brand + " " + model;
    }

    public void setImages(List<Image> images) {
        this.images = images;
    }

    public List<Image> getImages() {
        return images;
    }

    public String getName() {
        return name;
    }

    public UUID getId() {
        return id;
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
}
