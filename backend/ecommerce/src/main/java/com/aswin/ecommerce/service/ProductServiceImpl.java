package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.ProductDTO;
import com.aswin.ecommerce.entity.Product;
import com.aswin.ecommerce.repository.ProductRepository;
import com.aswin.ecommerce.service.ProductService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;

    public ProductServiceImpl(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @Override
    public List<ProductDTO> getAllProducts() {
        return productRepository.findAll()
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public ProductDTO getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        return mapToDTO(product);
    }

    private ProductDTO mapToDTO(Product product) {
    ProductDTO dto = new ProductDTO();
    dto.setId(product.getId());
    dto.setTitle(product.getTitle());
    dto.setPrice(product.getPrice());
    dto.setOldPrice(product.getOldPrice());
    dto.setDiscountedPrice(product.getDiscountedPrice());
    dto.setDescription(product.getDescription());
    dto.setImageUrl(product.getImageUrl()); // ✅ FIX
    dto.setCategory(product.getCategory());
    dto.setType(product.getType());
    dto.setStock(product.getStock());
    dto.setRating(product.getRating());
    dto.setBrand(product.getBrand());
    dto.setIsNew(product.getIsNew());
    return dto;
}

    @Override
    public Product add(Product product) {
        return productRepository.save(product);
    }

    @Override
    public ProductDTO update(Long id, Product product) {
        Product existing = productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
        existing.setTitle(product.getTitle());
        existing.setPrice(product.getPrice());
        existing.setOldPrice(product.getOldPrice());
        existing.setDiscountedPrice(product.getDiscountedPrice());
        existing.setDescription(product.getDescription());
        existing.setImageUrl(product.getImageUrl());
        existing.setCategory(product.getCategory());
        existing.setType(product.getType());
        existing.setStock(product.getStock());
        existing.setRating(product.getRating());
        existing.setBrand(product.getBrand());
        existing.setIsNew(product.getIsNew());
        existing.setSize(product.getSize());
        productRepository.save(existing);
        return mapToDTO(existing);
    }

    @Override
    public void deleteById(Long id) {
        if (!productRepository.existsById(id)) {
            throw new RuntimeException("Product not found");
        }
        productRepository.deleteById(id);
    }
}
