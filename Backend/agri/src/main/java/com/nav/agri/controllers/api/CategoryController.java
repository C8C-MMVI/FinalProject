package com.nav.agri.controllers.api;

import com.nav.agri.dto.category.CategoryDTO;
import com.nav.agri.models.Category;
import com.nav.agri.repositories.CategoryRepository;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    /* =====================
       READ
       ===================== */
    @GetMapping
    public List<CategoryDTO> getAllCategories() {
        return repo.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    @GetMapping("/{id}")
    public CategoryDTO getCategory(@PathVariable int id) {
        return repo.findById(id)
                .map(this::toDTO)
                .orElse(null);
    }

    /* =====================
       CREATE
       ===================== */
    @PostMapping
    public CategoryDTO createCategory(@RequestBody CategoryDTO dto) {
        Category category = toEntity(dto);
        return toDTO(repo.save(category));
    }

    /* =====================
       UPDATE
       ===================== */
    @PutMapping("/{id}")
    public CategoryDTO updateCategory(@PathVariable int id, @RequestBody CategoryDTO dto) {
        Category category = toEntity(dto);
        category.setCategoryId(id);
        return toDTO(repo.save(category));
    }

    /* =====================
       DELETE
       ===================== */
    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable int id) {
        repo.deleteById(id);
    }

    /* =====================
       MAPPERS
       ===================== */
    private CategoryDTO toDTO(Category category) {
        return new CategoryDTO(
                category.getCategoryId(),
                category.getCategoryName(),
                category.getDescription()
        );
    }

    private Category toEntity(CategoryDTO dto) {
        Category category = new Category();
        category.setCategoryName(dto.getCategoryName());
        category.setDescription(dto.getDescription());
        return category;
    }
}
