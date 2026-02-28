package com.aswin.ecommerce.controller;

import com.aswin.ecommerce.dto.CartDTO;
import com.aswin.ecommerce.entity.Cart;
import com.aswin.ecommerce.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "http://localhost:3000")
public class CartController {

    private final CartService cartService;
    public CartController(CartService cartService) { this.cartService = cartService; }

    @PostMapping("/add")
    public Cart addToCart(@RequestBody CartDTO dto) { return cartService.addToCart(dto); }

    @PutMapping("/update")
    public Cart updateQuantity(@RequestBody CartDTO dto) { return cartService.updateQuantity(dto); }

    @GetMapping("/{userId}")
    public List<Cart> getCart(@PathVariable Long userId) { return cartService.getUserCart(userId); }

    @DeleteMapping("/clear/{userId}")
    public ResponseEntity<String> clearCart(@PathVariable Long userId) {
        cartService.clearUserCart(userId);
        return ResponseEntity.ok("Cart cleared successfully");
    }

    @DeleteMapping("/remove/{userId}/{productId}")
    public ResponseEntity<String> removeItem(@PathVariable Long userId, @PathVariable Long productId) {
        cartService.removeItem(userId, productId);
        return ResponseEntity.ok("Item removed");
    }
}
