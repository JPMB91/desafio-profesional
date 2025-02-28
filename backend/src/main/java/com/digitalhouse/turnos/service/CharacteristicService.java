package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.*;
import com.digitalhouse.turnos.repository.CharacteristicImageRepository;
import com.digitalhouse.turnos.repository.CharacteristicRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CharacteristicService {

    @Autowired
    CharacteristicRepository characteristicRepository;

    @Autowired
    ImageSavingService imageSavingService;

    @Autowired
    CharacteristicImageRepository characteristicImageRepository;


    @Transactional
    public Characteristic createCharacteristic(String name, MultipartFile image) throws IOException {

            Characteristic characteristic = new Characteristic();

            characteristic.setName(name);
            String fileName = imageSavingService.saveImage(image);
            CharacteristicImage img = new CharacteristicImage();
            img.setFilename(fileName);
            img.setCharacteristic(characteristic);

            characteristic.setCharacteristicImage(img);

            return characteristicRepository.save(characteristic);


    }

    public List<Characteristic> getallCharacteristics(){
        return characteristicRepository.findAll();
    }

    public Optional<Characteristic> getCharacteristic(Long id) {
        return characteristicRepository.findById(id);
    }

    @Transactional
    public void deleteCharacteristic(Long id) {
        characteristicRepository.deleteById(id);
    }

    @Transactional
    public Characteristic updateCharacteristic(Long id,
                                               MultipartFile characteristicImage,
                                               String name) throws IOException {

        // busco la caracteristica antes de actualizar
        Characteristic characteristic = characteristicRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Característica no encontrada"));

        // actualizo los campos segun lo recibido desde front
        characteristic.setName(name);

        // si vienen nuevas imagenes las guardo y agrego a la característica
        if (characteristicImage != null && !characteristicImage.isEmpty()) {
            // borro la imagen anterios
            if (characteristic.getCharacteristicImage() != null) {
                CharacteristicImage oldImage = characteristic.getCharacteristicImage();
                imageSavingService.deleteImageFile(oldImage.getFilename());

                // Actualizo la imagen
                String newFilename = imageSavingService.saveImage(characteristicImage);
                oldImage.setFilename(newFilename);
                characteristicImageRepository.save(oldImage);
            } else {
                //creo una nueva
                String filename = imageSavingService.saveImage(characteristicImage);
                CharacteristicImage newImage = new CharacteristicImage();
                newImage.setFilename(filename);
                newImage.setCharacteristic(characteristic);
                characteristic.setCharacteristicImage(newImage);
            }
        }

        return characteristicRepository.save(characteristic);
    }
}
