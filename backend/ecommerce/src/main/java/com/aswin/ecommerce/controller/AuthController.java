package com.aswin.ecommerce.controller;

import com.aswin.ecommerce.dto.AuthResponse;
import com.aswin.ecommerce.dto.UserDTO;
import com.aswin.ecommerce.service.UserService;
import com.aswin.ecommerce.service.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private final UserService userService;
    private final JwtService jwtService;

    public AuthController(UserService userService, JwtService jwtService) {
        this.userService = userService;
        this.jwtService = jwtService;
    }

    @PostMapping("/signup")
    public ResponseEntity<AuthResponse> signup(@RequestBody UserDTO dto) {
        UserDTO user = userService.register(dto);
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getUsername(), user.getRole());
        return new ResponseEntity<>(new AuthResponse(token, user), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody UserDTO dto) {
        UserDTO user = userService.login(dto.getEmail(), dto.getPassword());
        String token = jwtService.generateToken(user.getEmail(), user.getId(), user.getUsername(), user.getRole());
        return ResponseEntity.ok(new AuthResponse(token, user));
    }

    @GetMapping("/me")
    public ResponseEntity<UserDTO> getCurrentUser(Authentication authentication) {
        if (authentication == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        // email is the subject in our JWT
        String email = authentication.getName();
        // Since we don't have a getByEmail in UserService, we can add it or just return a dummy for now.
        // Let's add findByEmail to UserService.
        return ResponseEntity.ok(userService.findByEmail(email));
    }
}
