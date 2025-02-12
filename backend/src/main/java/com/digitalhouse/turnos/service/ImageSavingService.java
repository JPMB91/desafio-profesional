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

        Files.createDirectories(Path.of(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + file.getOriginalFilename();
        Path filePath = Path.of(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());
        return fileName;


    }
}