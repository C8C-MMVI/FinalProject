package com.nav.agri.service.product;

import com.nav.agri.dto.product.ProductCreateDTO;
import com.nav.agri.dto.product.ProductDTO;
import java.util.List;

public interface ProductService {
    ProductDTO createProduct(ProductCreateDTO dto);
    ProductDTO getProduct(int id);
    List<ProductDTO> getAllProducts();
    ProductDTO updateProduct(int id, ProductCreateDTO dto);
    void deleteProduct(int id);
}
