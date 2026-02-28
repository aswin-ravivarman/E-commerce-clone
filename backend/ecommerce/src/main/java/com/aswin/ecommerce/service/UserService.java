package com.aswin.ecommerce.service;

import com.aswin.ecommerce.dto.UserDTO;

public interface UserService {

    UserDTO register(UserDTO userDTO);
    UserDTO login(String email, String password);
    UserDTO findByEmail(String email);
    java.util.List<UserDTO> getAllUsers();
}
