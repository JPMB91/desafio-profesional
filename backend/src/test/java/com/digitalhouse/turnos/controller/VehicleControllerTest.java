package com.digitalhouse.turnos.controller;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.entity.FuelType;
import com.digitalhouse.turnos.entity.GearShift;
import com.digitalhouse.turnos.repository.CategoryRepository;
import com.digitalhouse.turnos.service.ImageSavingService;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.test.web.servlet.request.SecurityMockMvcRequestPostProcessors;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.UUID;

@Transactional
@ActiveProfiles("test")
@SpringBootTest
@AutoConfigureMockMvc
public class VehicleControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CategoryRepository categoryRepository;

    @MockitoBean
    private ImageSavingService imageSavingService;

    private Long testCategoryId;
    private String testVehicleId;
    private String uniquePlate;


    @BeforeEach
    public void setup() throws Exception {
        // crear una categoria para que este disponible
        Category category = new Category();
        category.setName("Test Category");
        category.setCategoryDescription("Description");
        Category savedCategory = categoryRepository.save(category);
        testCategoryId = savedCategory.getId();

        createMockVehicle();
    }

    // crear vehiculo para los test de buscar por id y borrar
    private void createMockVehicle() throws Exception {

        MockMultipartFile image = new MockMultipartFile(
                "images",
                "testimage.jpg",
                "image/jpeg",
                "test image content".getBytes(StandardCharsets.UTF_8)
        );

        uniquePlate = "TestPlate-" + UUID.randomUUID().toString().substring(0, 8);

        MvcResult result = mockMvc.perform(MockMvcRequestBuilders.multipart("/api/vehicles")
                        .file(image)
                        .param("registrationPlate", uniquePlate)
                        .param("manufacturingYear", String.valueOf(Year.now().getValue()))
                        .param("brand", "Toyota")
                        .param("model", "Corolla")
                        .param("numberOfSeats", "5")
                        .param("description", "Vehiculo de prueba")
                        .param("categoryId", String.valueOf(testCategoryId))
                        .param("gearShift", GearShift.AUTOMATIC.toString())
                        .param("numberOfDoors", "5")
                        .param("dailyCost", "130.0")
                        .param("fuelType", FuelType.HYBRID.toString())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andReturn();

        // extraigo la id para usarla en los tests de delete y getbyid
        String responseContent = result.getResponse().getContentAsString();
        testVehicleId = JsonPath.read(responseContent, "$.id");
    }

    @Test
    public void createVehiclesTest() throws Exception {
        MockMultipartFile image = new MockMultipartFile(
                "images",
                "testimage.jpg",
                "image/jpeg",
                "test image content".getBytes(StandardCharsets.UTF_8)
        );

        String uniquePlate = "TestPlate-" + UUID.randomUUID().toString().substring(0, 8);

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/vehicles")
                        .file(image)
                        .param("registrationPlate", uniquePlate)
                        .param("manufacturingYear", String.valueOf(Year.now().getValue()))
                        .param("brand", "Kia")
                        .param("model", "Rio")
                        .param("numberOfSeats", "5")
                        .param("description", "Vehiculo de prueba")
                        .param("categoryId", String.valueOf(testCategoryId))
                        .param("gearShift", GearShift.AUTOMATIC.toString())
                        .param("numberOfDoors", "5")
                        .param("dailyCost", "130.0")
                        .param("fuelType", FuelType.HYBRID.toString())
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.brand").value("Kia"));
    }

    @Test
    public void createVehiclesTest_MissingData() throws Exception {
        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/vehicles")
                        .param("registrationPlate", "")
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isBadRequest());
    }

    @Test
    public void getVehicleByIdTest() throws Exception {
        // busca vehiculo por su id
        mockMvc.perform(MockMvcRequestBuilders.get("/api/vehicles/" + testVehicleId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.registrationPlate").value(uniquePlate))
                .andExpect(MockMvcResultMatchers.jsonPath("$.brand").value("Toyota"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.model").value("Corolla"));
    }

    @Test
    public void deleteVehicleTest() throws Exception {
       // intenta borrar el vehiculo
        mockMvc.perform(MockMvcRequestBuilders.delete("/api/vehicles/" + testVehicleId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.content().string("Vehiculo borrado con exito"));

        // verificar si el vehiculo existe luego de intentar borrarlo
        mockMvc.perform(MockMvcRequestBuilders.get("/api/vehicles/" + testVehicleId)
                        .with(SecurityMockMvcRequestPostProcessors.user("admin").roles("ADMIN")))
                .andExpect(MockMvcResultMatchers.status().isOk())
                .andExpect(MockMvcResultMatchers.jsonPath("$.body").value("Vehiculo no existe"))
                .andExpect(MockMvcResultMatchers.jsonPath("$.statusCodeValue").value(404));
    }
}