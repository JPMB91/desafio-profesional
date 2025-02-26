package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Characteristic;
import com.digitalhouse.turnos.entity.CharacteristicImage;
import com.digitalhouse.turnos.repository.CharacteristicRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@Service
public class CharacteristicService {

    @Autowired
    CharacteristicRepository characteristicRepository;

    @Autowired
    ImageSavingService imageSavingService;


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
}
