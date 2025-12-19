package com.nav.agri.controllers.api;

import com.nav.agri.dto.product.ProductCreateDTO;
import com.nav.agri.dto.product.ProductDTO;
import com.nav.agri.service.product.ProductService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    /* ===================== READ ===================== */
    @GetMapping
    public List<ProductDTO> getAllProducts() {
        return productService.getAllProducts();
    }

    @GetMapping("/{id}")
    public ProductDTO getProduct(@PathVariable int id) {
        return productService.getProduct(id);
    }

    /* ===================== CREATE ===================== */
    @PostMapping
    public ProductDTO createProduct(@RequestBody @Valid ProductCreateDTO dto) {
        return productService.createProduct(dto);
    }

    /* ===================== UPDATE ===================== */
    @PutMapping("/{id}")
    public ProductDTO updateProduct(@PathVariable int id, @RequestBody @Valid ProductCreateDTO dto) {
        return productService.updateProduct(id, dto);
    }

    /* ===================== DELETE ===================== */
    @DeleteMapping("/{id}")
    public void deleteProduct(@PathVariable int id) {
        productService.deleteProduct(id);
    }
}
