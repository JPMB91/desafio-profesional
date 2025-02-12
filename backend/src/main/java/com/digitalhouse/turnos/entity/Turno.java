package com.digitalhouse.turnos.entity;

import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "turnos")
public class Turno {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Date fechaInicio;
    private Date fechaFin;
    @ManyToOne
    private Usuario usuario;
    @ManyToOne
    private Vehicle vehicle;
    @Enumerated(EnumType.STRING)
    private EstadoSolicitud estadoSolicitud;

    public Turno() {
    }

    public Turno(Date fechaInicio, Date fechaFin, Usuario usuario, Vehicle vehicle, EstadoSolicitud estadoSolicitud) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.usuario = usuario;
        this.vehicle = vehicle;
        this.estadoSolicitud = estadoSolicitud;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(Date fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public Date getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(Date fechaFin) {
        this.fechaFin = fechaFin;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public Vehicle getVehiculo() {
        return vehicle;
    }

    public void setVehiculo(Vehicle vehicle) {
        this.vehicle = vehicle;
    }

    public EstadoSolicitud getEstadoSolicitud() {
        return estadoSolicitud;
    }

    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) {
        this.estadoSolicitud = estadoSolicitud;
    }
}
