package com.aswin.ecommerce.repository;

import com.aswin.ecommerce.entity.Cart;
import com.aswin.ecommerce.entity.Product;
import com.aswin.ecommerce.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CartRepository extends JpaRepository<Cart, Long> {
    List<Cart> findByUser(User user);
    Optional<Cart> findByUserAndProduct(User user, Product product);
}
