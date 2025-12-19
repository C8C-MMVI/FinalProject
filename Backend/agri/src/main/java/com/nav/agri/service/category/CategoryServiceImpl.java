package com.nav.agri.service.category;

import com.nav.agri.dto.category.CategoryDTO;
import com.nav.agri.dto.category.CategoryCreateDTO;
import com.nav.agri.models.Category;
import com.nav.agri.repositories.CategoryRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class CategoryServiceImpl implements CategoryService {

    private final CategoryRepository repo;

    public CategoryServiceImpl(CategoryRepository repo) {
        this.repo = repo;
    }

    @Override
    public CategoryDTO createCategory(CategoryCreateDTO dto) {
        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        return toDTO(repo.save(category));
    }

    @Override
    public CategoryDTO getCategory(int id) {
        return toDTO(repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found")));
    }

    @Override
    public List<CategoryDTO> getAllCategories() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    @Override
    public CategoryDTO updateCategory(int id, CategoryCreateDTO dto) {
        Category category = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        return toDTO(repo.save(category));
    }

    @Override
    public void deleteCategory(int id) {
        repo.deleteById(id);
    }

    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription());
    }
}
