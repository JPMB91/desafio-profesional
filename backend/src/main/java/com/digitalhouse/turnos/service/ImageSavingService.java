package com.digitalhouse.turnos.service;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Service
public class ImageSavingService {

    private static final String UPLOAD_DIR = "uploads/";

    public String saveImage(MultipartFile file) throws IOException {
        String originalName = file.getOriginalFilename();
        String sanitizedName = originalName != null
                ? originalName.replaceAll("[^a-zA-Z0-9.\\-_]", "-")
                : null;

        Files.createDirectories(Paths.get(UPLOAD_DIR));
        String fileName = UUID.randomUUID() + "_" + sanitizedName;
        Path filePath = Paths.get(UPLOAD_DIR + fileName);
        Files.write(filePath, file.getBytes());
        return fileName;
    }

    public void deleteImageFile(String filename) {
        try {
            Path filePath = Paths.get(UPLOAD_DIR + filename);
            Files.deleteIfExists(filePath);
        } catch (IOException e) {

            // agregar logger
            System.err.println("Error deleting image file: " + filename + " - " + e.getMessage());
        }
    }
}