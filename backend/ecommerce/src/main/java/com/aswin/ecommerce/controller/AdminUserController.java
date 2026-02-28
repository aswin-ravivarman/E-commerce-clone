package com.aswin.ecommerce.controller;

import com.aswin.ecommerce.dto.UserDTO;
import com.aswin.ecommerce.service.UserService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminUserController {

    private final UserService userService;

    public AdminUserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    @PostMapping
    public ResponseEntity<UserDTO> addUser(@RequestBody UserDTO userDTO) {
        // reuse register logic
        return new ResponseEntity<>(userService.register(userDTO), HttpStatus.CREATED);
    }

    // Delete user would need delete method in service, skipping for now as not explicitly critical but good to have
    // I'll stick to what service has or can easily add.
}
