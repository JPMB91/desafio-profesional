package com.digitalhouse.turnos.security;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.entity.Role;
import com.digitalhouse.turnos.repository.CategoryRepository;
import com.digitalhouse.turnos.repository.RoleRepository;
import com.digitalhouse.turnos.service.CategoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class DatosIniciales implements ApplicationRunner {

    @Autowired
    private CategoryRepository categoryRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(ApplicationArguments args) throws Exception {

        Category category = new Category("SUV", "Vehiculo de utilidad deportiva");
        Category category2 = new Category("CAMIONETA_PICK_UP", "Camioneta Pick up");
        Category category3 = new Category("Sedan", "Sedan");
        Category category4 = new Category("Van", "Van");

//        categoryRepository.save(category);
//        categoryRepository.save(category2);
//        categoryRepository.save(category3);
//        categoryRepository.save(category4);

//        Role role =  new Role("ROLE_USER", "Usuario registrado normalmente");
//        Role role1 =  new Role("ROLE_ADMIN", "Usuario registrado con permisos administrativos");
//        Role role2 = new Role("ROLE_VISITOR", "Usuario que no ha iniciado sesión o no se ha registrado");
//
//        roleRepository.save(role);
//        roleRepository.save(role1);
//        roleRepository.save(role2);



    }
}
