package com.nav.agri.service.category;

import com.nav.agri.dto.category.CategoryDTO;
import com.nav.agri.dto.category.CategoryCreateDTO;
import java.util.List;

public interface CategoryService {
    CategoryDTO createCategory(CategoryCreateDTO dto);
    CategoryDTO getCategory(int id);
    List<CategoryDTO> getAllCategories();
    CategoryDTO updateCategory(int id, CategoryCreateDTO dto);
    void deleteCategory(int id);
}
