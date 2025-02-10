package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;
import org.hibernate.annotations.Formula;

import java.util.List;

@Entity
@Table(name = "vehiculos")
public class Vehiculo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String matricula;
    private int anio;
    private String marca;
    private String modelo;
    private int numeroAsientos;
    @Column(length = 1000)
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private CategoriaVehiculo categoriaVehiculo;

    @OneToMany(mappedBy = "vehiculo", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Imagen> imagenes;

    @Column(unique = true)
    private String nombre;



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

    public Long getId() {
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
