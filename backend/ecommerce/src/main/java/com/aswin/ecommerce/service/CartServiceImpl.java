package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.CartDTO;
import com.aswin.ecommerce.entity.Cart;
import com.aswin.ecommerce.entity.Product;
import com.aswin.ecommerce.entity.User;
import com.aswin.ecommerce.repository.CartRepository;
import com.aswin.ecommerce.repository.ProductRepository;
import com.aswin.ecommerce.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CartServiceImpl implements CartService {

    private final CartRepository cartRepo;
    private final UserRepository userRepo;
    private final ProductRepository productRepo;

    public CartServiceImpl(CartRepository cartRepo, UserRepository userRepo, ProductRepository productRepo) {
        this.cartRepo = cartRepo;
        this.userRepo = userRepo;
        this.productRepo = productRepo;
    }

    @Override
    public Cart addToCart(CartDTO dto) {
        User user = userRepo.findById(dto.getUserId()).orElseThrow();
        Product product = productRepo.findById(dto.getProductId()).orElseThrow();

        return cartRepo.findByUserAndProduct(user, product)
                .map(existingCart -> {
                    existingCart.setQuantity(existingCart.getQuantity() + dto.getQuantity());
                    return cartRepo.save(existingCart);
                })
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setProduct(product);
                    cart.setQuantity(dto.getQuantity());
                    return cartRepo.save(cart);
                });
    }

    @Override
    public List<Cart> getUserCart(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        return cartRepo.findByUser(user);
    }

    @Override
    @Transactional
    public void clearUserCart(Long userId) {
        User user = userRepo.findById(userId).orElseThrow();
        List<Cart> cartItems = cartRepo.findByUser(user);
        if (cartItems != null && !cartItems.isEmpty()) {
            cartRepo.deleteAll(cartItems);
            cartRepo.flush();
        }
    }

    @Override
    @Transactional
    public Cart updateQuantity(CartDTO dto) {
        User user = userRepo.findById(dto.getUserId()).orElseThrow();
        Product product = productRepo.findById(dto.getProductId()).orElseThrow();
        return cartRepo.findByUserAndProduct(user, product)
                .map(existingCart -> {
                    existingCart.setQuantity(dto.getQuantity());
                    return cartRepo.save(existingCart);
                })
                .orElseGet(() -> {
                    Cart cart = new Cart();
                    cart.setUser(user);
                    cart.setProduct(product);
                    cart.setQuantity(dto.getQuantity());
                    return cartRepo.save(cart);
                });
    }

    @Override
    @Transactional
    public void removeItem(Long userId, Long productId) {
        User user = userRepo.findById(userId).orElseThrow();
        Product product = productRepo.findById(productId).orElseThrow();
        cartRepo.findByUserAndProduct(user, product).ifPresent(cartRepo::delete);
    }
}
