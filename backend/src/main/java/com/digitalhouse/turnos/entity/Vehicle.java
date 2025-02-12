package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.GenericGenerator;

import java.time.Year;
import java.util.List;
import java.util.UUID;

@Entity
@Table(name = "vehiculos")
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;
//    private String registrationPlate;
    private String matricula;
//    private Year manufacturingYear;
    private int anio;
//    private String brand;
    private String marca;
//    private String model;
    private String modelo;
//    private int numberOfSeats;
    private int numeroAsientos;
    //    @Column(length = 1000)
//    private String description;
    @Enumerated(EnumType.STRING)
    private CategoriaVehiculo categoriaVehiculo;
    @Column(length = 1000)
    private String descripcion;

//    @OneToMany(mappedBy = "vehicle", cascade = CascadeType.ALL, orphanRemoval = true)
//    private List<Image> images;
    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Imagen> imagenes;

//    @Column(unique = true)
//    private String name;
    @Column(unique = true)
    private String nombre;

//    private double dailyCost;

//    @Enumerated(EnumType.STRING)
//    private Enum fuelType

//    private String o enum gearShift
    //manual, automática, semiautomática y CVT

//    private int numberOfDoors


    public Vehiculo() {
    }

    public Vehiculo(String matricula, int anio, String marca, String modelo, int numeroAsientos, String descripcion,
                    CategoriaVehiculo categoriaVehiculo) {
        this.matricula = matricula;
        this.anio = anio;
        this.marca = marca;
        this.modelo = modelo;
        this.numeroAsientos = numeroAsientos;
        this.descripcion = descripcion;
        this.categoriaVehiculo = categoriaVehiculo;
    }

    @PrePersist
    @PreUpdate
    private void setNombre() {
        this.nombre = marca + " " + modelo;
    }

    public void setImagenes(List<Imagen> imagenes) {
        this.imagenes = imagenes;
    }

    public List<Imagen> getImagenes() {
        return imagenes;
    }

    public String getNombre() {
        return nombre;
    }

    public UUID getId() {
        return id;
    }

    public String getMatricula() {
        return matricula;
    }

    public int getAnio() {
        return anio;
    }

    public String getMarca() {
        return marca;
    }

    public String getModelo() {
        return modelo;
    }

    public int getNumeroAsientos() {
        return numeroAsientos;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public CategoriaVehiculo getCategoriaVehiculo() {
        return categoriaVehiculo;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public void setAnio(int anio) {
        this.anio = anio;
    }

    public void setMarca(String marca) {
        this.marca = marca;
    }

    public void setModelo(String modelo) {
        this.modelo = modelo;
    }

    public void setNumeroAsientos(int numeroAsientos) {
        this.numeroAsientos = numeroAsientos;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public void setCategoriaVehiculo(CategoriaVehiculo categoriaVehiculo) {
        this.categoriaVehiculo = categoriaVehiculo;
    }
}
