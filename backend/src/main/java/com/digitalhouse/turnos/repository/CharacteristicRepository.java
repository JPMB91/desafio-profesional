package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Characteristic;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacteristicRepository extends JpaRepository<Characteristic, Long> {
}
