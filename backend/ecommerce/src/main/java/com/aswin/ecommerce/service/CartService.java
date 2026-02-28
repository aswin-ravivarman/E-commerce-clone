package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.CartDTO;
import com.aswin.ecommerce.entity.Cart;

import java.util.List;

public interface CartService {
    Cart addToCart(CartDTO dto);
    List<Cart> getUserCart(Long userId);
    void clearUserCart(Long userId);
    Cart updateQuantity(CartDTO dto);
    void removeItem(Long userId, Long productId);
}
    