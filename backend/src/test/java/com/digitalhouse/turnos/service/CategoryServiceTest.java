package com.digitalhouse.turnos.service;

import com.digitalhouse.turnos.entity.Category;
import com.digitalhouse.turnos.entity.CategoryImage;
import com.digitalhouse.turnos.repository.CategoryRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
public class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @Mock
    private ImageSavingService imageSavingService;

    @InjectMocks
    private CategoryService categoryService;

    private MultipartFile mockImage;
    private Category mockCategory;
    private String testFilename;

    @BeforeEach
    void setUp() {
        testFilename = "test-uuid_image.jpg";
        mockImage = new MockMultipartFile(
                "image",
                "original-image.jpg",
                "image/jpeg",
                "test image content".getBytes()
        );

        mockCategory = new Category();
        mockCategory.setId(1L);
        mockCategory.setName("Category");
        mockCategory.setCategoryDescription("Description");

        CategoryImage categoryImage = new CategoryImage();
        categoryImage.setFilename(testFilename);
        categoryImage.setCategory(mockCategory);

        mockCategory.setCategoryImage(categoryImage);
    }

    @Test
    void createCategoryWithImage() throws IOException {
        // Arrange
        when(imageSavingService.saveImage(any(MultipartFile.class))).thenReturn(testFilename);
        when(categoryRepository.save(any(Category.class))).thenAnswer(invocation -> {
            Category savedCategory = invocation.getArgument(0);
            savedCategory.setId(1L);
            return savedCategory;
        });

        // Act
        Category result = categoryService.createCategory(
                "Category",
                "Description",
                mockImage
        );

        // Assert
        assertNotNull(result);
        assertEquals(mockCategory.getName(), result.getName());
        assertEquals(mockCategory.getCategoryDescription(), result.getCategoryDescription());
        assertNotNull(result.getCategoryImage());
        assertEquals(testFilename, result.getCategoryImage().getFilename());

        verify(imageSavingService).saveImage(mockImage);
        verify(categoryRepository).save(any(Category.class));
    }

    @Test
    void getCategoryById() {
        // Arrange
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(mockCategory));

        // Act
        Optional<Category> result = categoryService.getCategoryById(1L);

        // Assert
        assertTrue(result.isPresent());
        assertEquals(mockCategory, result.get());
        verify(categoryRepository).findById(1L);
    }


    @Test
    void getAllCategories() {
        // Arrange
        Category category1 = new Category();
        category1.setId(1L);
        category1.setName("Category 1");

        Category category2 = new Category();
        category2.setId(2L);
        category2.setName("Category 2");

        List<Category> expectedCategories = Arrays.asList(category1, category2);

        when(categoryRepository.findAll()).thenReturn(expectedCategories);

        // Act
        List<Category> result = categoryService.getAllCategories();

        // Assert
        assertEquals(2, result.size());
        assertEquals(expectedCategories, result);
        verify(categoryRepository).findAll();
    }
}