package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;

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
    private String descripcion;
    @Enumerated(EnumType.STRING)
    private CategoriaVehiculo categoriaVehiculo;
    private String imagen;

    public Vehiculo() {
    }

    public Vehiculo(String matricula, int anio, String marca, String modelo, int numeroAsientos, String descripcion,
                    CategoriaVehiculo categoriaVehiculo, String imagen) {
        this.matricula = matricula;
        this.anio = anio;
        this.marca = marca;
        this.modelo = modelo;
        this.numeroAsientos = numeroAsientos;
        this.descripcion = descripcion;
        this.categoriaVehiculo = categoriaVehiculo;
        this.imagen = imagen;
    }

    public void setImagen(String imagen) {
        this.imagen = imagen;
    }

    public String getImagen() {
        return imagen;
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
