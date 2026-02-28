package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.ProductDTO;
import com.aswin.ecommerce.entity.Product;

import java.util.List;

public interface ProductService {
    List<ProductDTO> getAllProducts();

    ProductDTO getProductById(Long id);

    Product add(Product product);

    ProductDTO update(Long id, Product product);

    void deleteById(Long id);
}
