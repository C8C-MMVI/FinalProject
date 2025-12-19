package com.nav.agri.dto.category;

import jakarta.validation.constraints.NotBlank;

public class CategoryCreateDTO {
    @NotBlank (message = "Category name is required")
    private String categoryName;
    @NotBlank (message = "Category description is required")
    private String description;


    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
