package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.CharacteristicImage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CharacteristicImageRepository extends JpaRepository<CharacteristicImage, Long> {
    void deleteByFilename(String filename);
}
