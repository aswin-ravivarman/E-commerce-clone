package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.UserDTO;
import com.aswin.ecommerce.entity.User;
import com.aswin.ecommerce.repository.UserRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository repo;
    private final PasswordEncoder passwordEncoder;

    @Value("${app.admin.registration-key:admin-secret-key}")
    private String adminRegistrationKey;

    public UserServiceImpl(UserRepository repo, PasswordEncoder passwordEncoder) {
        this.repo = repo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public UserDTO register(UserDTO dto) {

        if (!dto.getPassword().equals(dto.getConfirmPassword())) {
            throw new RuntimeException("Passwords do not match");
        }

        repo.findByEmail(dto.getEmail()).ifPresent(u -> {
            throw new RuntimeException("Email already registered");
        });

        String role = (dto.getRole() != null && dto.getRole().equalsIgnoreCase("ADMIN")) ? "ADMIN" : "CUSTOMER";
        if ("ADMIN".equals(role)) {
            if (dto.getAdminKey() == null || !dto.getAdminKey().equals(adminRegistrationKey)) {
                throw new RuntimeException("Invalid admin key. Only store owners can register as admin.");
            }
        }

        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());
        user.setPassword(passwordEncoder.encode(dto.getPassword()));
        user.setAddress(dto.getAddress());
        user.setPostalCode(dto.getPostalCode());
        user.setRole(role);

        User savedUser = repo.save(user);

        return mapToDTO(savedUser);
    }

    @Override
    public UserDTO login(String email, String password) {

        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Invalid email"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        return mapToDTO(user);
    }

    @Override
    public UserDTO findByEmail(String email) {
        User user = repo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToDTO(user);
    }

    private UserDTO mapToDTO(User user) {
        UserDTO dto = new UserDTO();
        dto.setId(user.getId());
        dto.setUsername(user.getUsername());
        dto.setEmail(user.getEmail());
        dto.setAddress(user.getAddress());
        dto.setPostalCode(user.getPostalCode());
        dto.setRole(user.getRole() != null ? user.getRole() : "CUSTOMER");
        return dto;
    }

    @Override
    public java.util.List<UserDTO> getAllUsers() {
        return repo.findAll().stream().map(this::mapToDTO).collect(java.util.stream.Collectors.toList());
    }
}
