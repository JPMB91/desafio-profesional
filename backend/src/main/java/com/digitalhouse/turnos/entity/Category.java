    package com.digitalhouse.turnos.entity;

    import jakarta.persistence.*;

    @Entity
    @Table(name = "categories")
    public class Category {
        @Id
        @GeneratedValue(strategy = GenerationType.IDENTITY)
        private Long id;

        @Column(unique = true, nullable = false)
        private String name;

        private String categoryDescription;

        @OneToOne(mappedBy = "category", cascade = CascadeType.ALL, orphanRemoval = true)
        private CategoryImage categoryImage;


        public Category() {
        }

        public Long getId() {
            return id;
        }

        public void setId(Long id) {
            this.id = id;
        }

        public Category(String name, String categoryDescription) {
            this.name = name;
            this.categoryDescription = categoryDescription;
        }

        public String getName() {
            return name;
        }

        public void setName(String name) {
            this.name = name;
        }

        public String getCategoryDescription() {
            return categoryDescription;
        }

        public void setCategoryDescription(String categoryDescription) {
            this.categoryDescription = categoryDescription;
        }

        public CategoryImage getCategoryImage() {
            return categoryImage;
        }

        public void setCategoryImage(CategoryImage categoryImage) {
            this.categoryImage = categoryImage;
        }
    }
