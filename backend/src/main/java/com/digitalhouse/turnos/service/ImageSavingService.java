package com.digitalhouse.turnos.service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
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
    private static final Logger logger = LoggerFactory.getLogger(ImageSavingService.class);

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
            logger.info("Imagen borrada exitosamente: {}", filename);
        } catch (IOException e) {

            logger.error("Error borrando imagen: {} - {}", filename, e.getMessage(), e);
        }
    }
}