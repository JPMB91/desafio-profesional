//package com.digitalhouse.turnos.service;
//
//import com.digitalhouse.turnos.entity.Image;
//import com.digitalhouse.turnos.entity.Vehicle;
//import org.springframework.stereotype.Service;
//import org.springframework.web.multipart.MultipartFile;
//
//import java.io.IOException;
//import java.nio.file.Files;
//import java.nio.file.Path;
//import java.util.ArrayList;
//import java.util.List;
//import java.util.UUID;
//
//@Service
//public class ImageService {
//
//    public List<Image> saveImages(MultipartFile[] images, Vehicle vehicle) throws IOException {
////        String UPLOAD_DIR = "uploads/";
//        Files.createDirectories(Path.of(UPLOAD_DIR));
//        List<Image> imageList = new ArrayList<>();
//
//        for(MultipartFile image : images){
//            if(!image.isEmpty()){
//                String fileName = UUID.randomUUID() + "_" + image.getOriginalFilename();
//                Path filePath = Path.of(UPLOAD_DIR + fileName);
//                Files.write(filePath, image.getBytes());
//
//                Image img = new Image();
//                img.setFilename(fileName);
//                img.setVehicle(vehicle);
//                imageList.add(img);
//            }
//
//        }
//        return imageList;
//    }
//}
