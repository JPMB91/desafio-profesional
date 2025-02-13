package com.digitalhouse.turnos.service;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.UUID;

@Service
public class ImageSavingService {

    public String saveImage(MultipartFile file) throws IOException {
        String UPLOAD_DIR = "uploads/";
        String originalName = file.getOriginalFilename();
        String sanitizedName = originalName != null
                ? originalName.replaceAll("[^a-zA-Z0-9.\\-_]", "-")
                : null;

        // ver como crear una carpeta de images para cada vehiculo
//        Files.createDirectories(Path.of(UPLOAD_DIR + ))
        Files.createDirectories(Path.of(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + sanitizedName;
        Path filePath = Path.of(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());
        return fileName;


    }
}