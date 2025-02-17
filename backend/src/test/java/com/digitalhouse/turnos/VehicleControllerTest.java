package com.digitalhouse.turnos;

import com.digitalhouse.turnos.entity.FuelType;
import com.digitalhouse.turnos.entity.GearShift;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders;
import org.springframework.test.web.servlet.result.MockMvcResultMatchers;
import org.springframework.transaction.annotation.Transactional;


import java.nio.charset.StandardCharsets;
import java.time.Year;
import java.util.ArrayList;
import java.util.List;

@Transactional
@ActiveProfiles("test")
@SpringBootTest
//@WebMvcTest(VehicleController.class)
@AutoConfigureMockMvc
public class VehicleControllerTest {

//    @Autowired
//    private VehicleController vehicleController;
    @Autowired
    private MockMvc mockMvc;


    @Test
    public void createVehiclesTest() throws Exception {

        MockMultipartFile image = new MockMultipartFile("images", "testimage.jpg", "image/jpeg", "test image content".getBytes(StandardCharsets.UTF_8));

        mockMvc.perform(MockMvcRequestBuilders.multipart("/api/vehicles")
                        .file(image)
                        .param("registrationPlate", "TestPlate")
                        .param("manufacturingYear", String.valueOf(Year.now().getValue()))
                        .param("brand", "Toyota")
                        .param("model", "Corolla")
                        .param("numberOfSeats", "5")
                        .param("description", "Vehiculo de prueba")
                        .param("categoryId", "2")
                        .param("gearShift", GearShift.AUTOMATIC.toString())
                        .param("numberOfDoors", "5")
                        .param("dailyCost", "130.0")
                        .param("fuelType", FuelType.HYBRID.toString()))
                .andExpect(MockMvcResultMatchers.status().isCreated())
                .andExpect(MockMvcResultMatchers.jsonPath("$.brand").value("Toyota"));
    }


    @Test
    public void testRandomVehicleOrder() throws Exception {

        int iterations = 3;
        List<List<String>> responses = new ArrayList<>();

        // se realizaran 3 llamados a la api
        for (int i = 0; i < iterations; i++) {
            MvcResult result = mockMvc.perform(MockMvcRequestBuilders.get("/api/vehicles/random"))
                    .andExpect(MockMvcResultMatchers.status().isOk())
                    .andExpect(MockMvcResultMatchers.content().contentType(MediaType.APPLICATION_JSON))
                    .andReturn();

            String jsonResponse = result.getResponse().getContentAsString();

            // los resultados se agregar a una lista de listas que contienen Id's
            List<String> vehicleIds = JsonPath.read(jsonResponse, "$[*].id");
            responses.add(vehicleIds);
        }

        System.out.println(responses);

            // se verifica que las listas no contengan Id's ordenadas de la misma forma
        boolean isRandom = false;

        List<String> firstResponse = responses.getFirst();
        for (int i = 1; i < responses.size(); i++) {
            if (!firstResponse.equals(responses.get(i))) {
                isRandom = true;
                break;
            }
        }
        Assertions.assertTrue(isRandom);
    }
}