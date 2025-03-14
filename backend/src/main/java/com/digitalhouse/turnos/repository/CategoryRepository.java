package com.digitalhouse.turnos.repository;

import com.digitalhouse.turnos.entity.Category;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface CategoryRepository extends JpaRepository<Category, Long> {

    @Modifying
    @Query(value = "UPDATE vehicles SET category_id = NULL WHERE category_id = :categoryId", nativeQuery = true)
    void setVehicleCategoryNull(@Param("categoryId") Long categoryId);
}
