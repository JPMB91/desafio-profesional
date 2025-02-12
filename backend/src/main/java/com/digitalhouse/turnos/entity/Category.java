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

    //    private String imageUrl;


        public Category() {
        }

        public Long getId() {
            return id;
        }

        public Category(String name, String categoryDescription) {
            this.name = name;
            this.categoryDescription = categoryDescription;
    //        this.imageUrl = imageUrl;
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

        //    public String getImageUrl() {
    //        return imageUrl;
    //    }
    //    public void setImageUrl(String imageUrl) {
    //        this.imageUrl = imageUrl;
    //    }
    }
