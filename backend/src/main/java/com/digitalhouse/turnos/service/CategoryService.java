package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Service
public class CategoryService {

    @Autowired
    private CategoryRepository categoryRepository;
    @Autowired
    private ImageSavingService imageSavingService;


    public Category createCategory(String name, String description) throws IOException {

//        String imageUrl = imageSavingService.saveImage(image);
        Category category = new Category(name, description);
        return categoryRepository.save(category);
    }

    public Optional<Category> getCategoryById(Long id) {
        return categoryRepository.findById(id);
    }

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }
}
