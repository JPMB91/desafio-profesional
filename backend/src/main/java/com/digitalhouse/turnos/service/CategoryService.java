package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.entity.CategoryImage;
import com.digitalhouse.turnos.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageSavingService imageSavingService;


    @Transactional
    public Category createCategory(String name, String categoryDescription, MultipartFile image) throws IOException {

        Category category =  new Category();
        category.setName(name);
        category.setCategoryDescription(categoryDescription);

        String filename = imageSavingService.saveImage(image);
        CategoryImage img = new CategoryImage();
        img.setFilename(filename);
        img.setCategory(category);

        category.setCategoryImage(img);
        return categoryRepository.save(category);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
