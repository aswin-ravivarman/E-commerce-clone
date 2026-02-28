package com.aswin.ecommerce;

import com.aswin.ecommerce.entity.Product;
import com.aswin.ecommerce.entity.User;
import com.aswin.ecommerce.repository.ProductRepository;
import com.aswin.ecommerce.repository.UserRepository;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.io.InputStream;
import java.util.List;
import java.util.Map;

@Component
public class DataLoader implements CommandLineRunner {

    private final ProductRepository repo;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public DataLoader(ProductRepository repo, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedAdminUser();
        loadProductsIfEmpty();
    }

    private void seedAdminUser() {
        if (userRepository.findByEmail("admin@store.com").isPresent()) {
            return;
        }
        User admin = new User();
        admin.setUsername("Admin");
        admin.setEmail("admin@store.com");
        admin.setPassword(passwordEncoder.encode("admin123"));
        admin.setRole("ADMIN");
        userRepository.save(admin);
        System.out.println("Admin user created: admin@store.com / admin123");
    }

    private void loadProductsIfEmpty() throws Exception {
        if (repo.count() > 0) {
            return;
        }
        ObjectMapper mapper = new ObjectMapper();
        InputStream inputStream = getClass().getResourceAsStream("/products.json");
        if (inputStream == null) {
            throw new IllegalStateException("products.json not found on classpath");
        }
        Map<String, List<Product>> map = mapper.readValue(inputStream, new TypeReference<>() {});
        List<Product> products = map.get("data");
        repo.saveAll(products);
        System.out.println("Products loaded into database!");
    }
}
